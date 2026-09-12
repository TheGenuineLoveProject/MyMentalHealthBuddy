import path from 'node:path';
import {isBuiltin} from 'node:module';
import crypto from 'node:crypto';

// This module reads no files and executes no application or dependency code.
const KINDS = new Set(['entry-point', 'import-statement', 'require-call', 'dynamic-import',
  'require-resolve', 'import-rule', 'composes-from', 'url-token']);
const plain = value => value !== null && typeof value === 'object' && !Array.isArray(value)
  && [Object.prototype, null].includes(Object.getPrototypeOf(value));
const check = (ok, code, details) => { if (!ok) throw Object.assign(new Error(code), {code, ...(details === undefined ? {} : {details})}); };
const integer = n => Number.isSafeInteger(n) && n >= 0;
const text = s => typeof s === 'string' && s.length > 0 && s.length <= 4096 && s.isWellFormed()
  && !/[\x00-\x1f\x7f\\]/.test(s);
const secretPart = part => ['.git', '.ssh', '.npmrc', '.netrc', 'private'].includes(part.toLowerCase())
  || /^\.env(?:\.|$)/i.test(part) || /\.(?:pem|key|p12|pfx)$/i.test(part);
const relative = s => text(s) && !path.posix.isAbsolute(s)
  && !s.split('/').some(part => !part || part === '.' || part === '..');
const compare = (a, b) => a < b ? -1 : a > b ? 1 : 0;
const packageName = file => {
  const pieces = file.split('/');
  const i = pieces.lastIndexOf('node_modules');
  if (i < 0 || i + 1 >= pieces.length) return null;
  return pieces[i + 1].startsWith('@') ? pieces.slice(i + 1, i + 3).join('/') : pieces[i + 1];
};
const digest = value => crypto.createHash('sha256').update(value).digest('hex');
const publicPackage = value => text(value)
  && /^(?:@[a-zA-Z0-9][a-zA-Z0-9._-]*\/)?[a-zA-Z0-9][a-zA-Z0-9._-]*(?:\/[a-zA-Z0-9_@][a-zA-Z0-9._@+-]*)*$/.test(value)
  && !value.split('/').some(part => part === '.' || part === '..' || secretPart(part));
const publishableExternal = value => text(value) && (isBuiltin(value) || publicPackage(value));
const specifierMetadata = value => {
  if (typeof value !== 'string') return {specifierType: value === null ? 'null' : typeof value};
  const specifierClass = !text(value) ? 'MALFORMED_STRING'
    : value.startsWith('/') ? 'ABSOLUTE_PATH'
    : /^\.{1,2}(?:\/|$)/.test(value) ? 'RELATIVE_PATH'
    : /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(value) ? 'SCHEME_REFERENCE'
    : publicPackage(value) ? 'PACKAGE_LIKE' : 'OPAQUE';
  return {specifierSha256: digest(value), specifierBytes: Buffer.byteLength(value), specifierClass};
};
// Invalid package-name diagnostics must not reveal the offending path segment.
const safeOwner = owner => /^[a-zA-Z0-9_@./+-]+$/.test(owner)
  ? {owner} : {ownerSha256: digest(owner), ownerBytes: Buffer.byteLength(owner)};
function checkedPackageName(file, context = {}) {
  const own = packageName(file);
  if (own !== null) check(publicPackage(own)
    && /^(?:@[a-zA-Z0-9][a-zA-Z0-9._-]*\/)?[a-zA-Z0-9][a-zA-Z0-9._-]*$/.test(own),
    'RUNTIME_PACKAGE_NAME', {...context, graphSide: 'PACKAGE', ownerSha256: digest(file),
      ownerBytes: Buffer.byteLength(file), ...specifierMetadata(own)});
  return own;
}
function externalSpecifier(specifier, context, review) {
  const details = {...context, ...specifierMetadata(specifier)};
  check(text(specifier), 'RUNTIME_EXTERNAL_SPECIFIER', details);
  if (publishableExternal(specifier)) return {path: specifier};
  // Input graphs include source dependencies that can be removed or rewritten
  // before emission. Retain their identity without treating them as npm names.
  // Their presence always requires review, regardless of owner output bytes.
  if (context.graphSide === 'INPUT') {
    const opaqueSpecifier = specifierMetadata(specifier);
    review.push({...context, ...opaqueSpecifier});
    return {opaqueSpecifier};
  }
  check(false, 'RUNTIME_EXTERNAL_SPECIFIER', details);
}
function fields(record, allowed, code) {
  check(plain(record) && Object.keys(record).every(key => allowed.includes(key)), code);
}
function attributes(value) {
  check(plain(value) && Object.entries(value).every(([k, v]) => text(k) && typeof v === 'string'
    && v.length <= 4096 && !/[\x00-\x1f\x7f\\]/.test(v)), 'RUNTIME_IMPORT_ATTRIBUTES');
  return crypto.createHash('sha256').update(JSON.stringify(Object.entries(value).sort(([a], [b]) => compare(a, b)))).digest('hex');
}

export function analyzeRuntimeGraph(meta1, meta2, {compilerWorkingDirectory, reportDirectory, inputRows} = {}) {
  check(typeof compilerWorkingDirectory === 'string'
    && /^\/tmp\/mmhb-build-r17b-[A-Za-z0-9]{6}$/.test(compilerWorkingDirectory), 'RUNTIME_COMPILER_ROOT');
  check(typeof reportDirectory === 'string'
    && /^\/home\/runner\/workspace\/\.mmhb-release-evidence\/r17b-[A-Za-z0-9]{6}$/.test(reportDirectory), 'RUNTIME_REPORT_ROOT');
  const outputPath = `${reportDirectory}/server-build/server.mjs`;
  const normalizeInput = (raw, context = {}) => {
    const details = {...context, ...specifierMetadata(raw)};
    check(text(raw) && !raw.split('/').some(part => part === '..'), 'RUNTIME_INPUT_PATH', details);
    const absolute = path.posix.resolve(compilerWorkingDirectory, raw);
    check(absolute.startsWith(`${compilerWorkingDirectory}/`), 'RUNTIME_INPUT_BOUNDARY', details);
    const file = path.posix.relative(compilerWorkingDirectory, absolute);
    check(relative(file) && !file.split('/').some(secretPart), 'RUNTIME_INPUT_PRIVATE_OR_INVALID', details);
    return file;
  };
  check(Array.isArray(inputRows) && inputRows.length > 0 && inputRows.length <= 100000, 'RUNTIME_INVENTORY');
  const inventory = new Map();
  for (const row of inputRows) {
    check(plain(row) && relative(row.file) && !inventory.has(row.file), 'RUNTIME_INVENTORY_ROW');
    check((row.type === 'symlink') || ((row.type === undefined || row.type === 'file') && integer(row.bytes)), 'RUNTIME_INVENTORY_IDENTITY');
    inventory.set(row.file, row);
  }
  const readImport = (record, context, review, output = false) => {
    fields(record, output ? ['path', 'kind', 'external'] : ['path', 'kind', 'external', 'original', 'with'], 'RUNTIME_IMPORT_RECORD');
    check(KINDS.has(record.kind) || (output && record.kind === 'file-loader'), 'RUNTIME_IMPORT_KIND');
    check(record.external === undefined || typeof record.external === 'boolean', 'RUNTIME_IMPORT_EXTERNAL');
    if (record.original !== undefined) check(text(record.original), 'RUNTIME_IMPORT_ORIGINAL',
      {...context, ...specifierMetadata(record.original)});
    const attributesSha256 = record.with === undefined ? undefined : attributes(record.with);
    const external = record.external === true;
    check(!output || external, 'RUNTIME_OUTPUT_INTERNAL_IMPORT');
    return {...(external ? externalSpecifier(record.path, {...context, kind: record.kind}, review)
      : {path: normalizeInput(record.path, context)}), kind: record.kind, external,
      ...(attributesSha256 === undefined ? {} : {attributesSha256})};
  };
  const sortImports = imports => imports.sort((a, b) => compare(JSON.stringify(a), JSON.stringify(b)));
  const inspect = (meta, metadataIndex) => {
    const externalInputReview = [];
    fields(meta, ['inputs', 'outputs'], 'RUNTIME_META_RECORD');
    check(plain(meta.inputs) && plain(meta.outputs), 'RUNTIME_META_MAPS');
    const entries = Object.entries(meta.inputs);
    check(entries.length > 0 && entries.length <= 100000, 'RUNTIME_INPUT_COUNT');
    const inputs = new Map();
    for (const [raw, record] of entries) {
      const file = normalizeInput(raw, {metadataIndex, graphSide: 'INPUT'});
      check(!inputs.has(file), 'RUNTIME_INPUT_ALIAS_DUPLICATE');
      fields(record, ['bytes', 'imports', 'format', 'with'], 'RUNTIME_INPUT_RECORD');
      check(integer(record.bytes) && Array.isArray(record.imports) && record.imports.length <= 100000, 'RUNTIME_INPUT_SHAPE');
      check(record.format === undefined || ['cjs', 'esm'].includes(record.format), 'RUNTIME_INPUT_FORMAT');
      const observed = inventory.get(file);
      check(observed && observed.type !== 'symlink', 'RUNTIME_INPUT_NOT_RECORDED_FILE');
      check(record.bytes === observed.bytes, 'RUNTIME_INPUT_BYTE_MISMATCH');
      checkedPackageName(file, {metadataIndex});
      inputs.set(file, {file, bytes: record.bytes, imports: sortImports(record.imports.map((row, importIndex) => readImport(row,
        {metadataIndex, graphSide: 'INPUT', ...safeOwner(file), importIndex}, externalInputReview))),
        bytesInOutput: 0, ...(record.format === undefined ? {} : {format: record.format}),
        ...(record.with === undefined ? {} : {attributesSha256: attributes(record.with)})});
    }
    for (const row of inputs.values()) for (const edge of row.imports) {
      check(edge.external || inputs.has(edge.path), 'RUNTIME_INTERNAL_IMPORT_NOT_IN_GRAPH');
    }
    const outputs = Object.entries(meta.outputs);
    check(outputs.length === 1, 'RUNTIME_OUTPUT_COUNT');
    const [rawOutput, output] = outputs[0];
    // esbuild may emit an output path relative to its historical temporary cwd.
    check(text(rawOutput) && path.posix.resolve(compilerWorkingDirectory, rawOutput) === outputPath, 'RUNTIME_OUTPUT_PATH',
      {metadataIndex, graphSide: 'OUTPUT', ...specifierMetadata(rawOutput)});
    fields(output, ['bytes', 'imports', 'exports', 'entryPoint', 'inputs', 'cssBundle'], 'RUNTIME_OUTPUT_RECORD');
    check(output.cssBundle === undefined, 'RUNTIME_UNEXPECTED_CSS_OUTPUT');
    check(integer(output.bytes) && output.bytes > 0 && Array.isArray(output.imports) && output.imports.length <= 100000
      && Array.isArray(output.exports) && output.exports.length <= 100000 && plain(output.inputs), 'RUNTIME_OUTPUT_SHAPE');
    check(output.exports.every(x => typeof x === 'string' && x.length <= 4096 && !/[\x00-\x1f\x7f]/.test(x))
      && new Set(output.exports).size === output.exports.length, 'RUNTIME_OUTPUT_EXPORTS');
    const entryPoint = normalizeInput(output.entryPoint, {metadataIndex, graphSide: 'OUTPUT', owner: 'server-build/server.mjs'});
    check(entryPoint === 'server/app.mjs' && inputs.has(entryPoint), 'RUNTIME_ENTRY_POINT');
    const contributions = new Set();
    let contributedBytes = 0;
    for (const [raw, record] of Object.entries(output.inputs)) {
      const file = normalizeInput(raw, {metadataIndex, graphSide: 'OUTPUT', owner: 'server-build/server.mjs'});
      check(!contributions.has(file), 'RUNTIME_OUTPUT_INPUT_ALIAS_DUPLICATE');
      contributions.add(file);
      fields(record, ['bytesInOutput'], 'RUNTIME_OUTPUT_INPUT_RECORD');
      check(integer(record.bytesInOutput) && record.bytesInOutput <= output.bytes && inputs.has(file), 'RUNTIME_OUTPUT_INPUT_SHAPE');
      contributedBytes += record.bytesInOutput;
      check(Number.isSafeInteger(contributedBytes) && contributedBytes <= output.bytes, 'RUNTIME_OUTPUT_CONTRIBUTIONS');
      inputs.get(file).bytesInOutput = record.bytesInOutput;
    }
    return {externalInputReview, graph: {entryPoint, outputBytes: output.bytes,
      inputs: [...inputs.values()].sort((a, b) => compare(a.file, b.file)),
      outputImports: sortImports(output.imports.map((row, importIndex) => readImport(row,
        {metadataIndex, graphSide: 'OUTPUT', owner: 'server-build/server.mjs', importIndex}, externalInputReview, true))),
      exports: [...output.exports].sort(compare)}};
  };
  const inspectedFirst = inspect(meta1, 1), inspectedSecond = inspect(meta2, 2);
  const first = inspectedFirst.graph, second = inspectedSecond.graph;
  check(JSON.stringify(first) === JSON.stringify(second), 'RUNTIME_REPEAT_GRAPH_MISMATCH');
  const externalImports = [...new Set(first.outputImports.map(row => row.path))].sort(compare);
  const externalOwners = first.inputs.flatMap(row => row.imports.filter(edge => edge.external && !edge.opaqueSpecifier).map(edge => ({
    specifier: edge.path, owner: row.file, kind: edge.kind, ownerPackage: checkedPackageName(row.file),
    isEmittedSpecifier: externalImports.includes(edge.path)
  }))).sort((a, b) => compare(JSON.stringify(a), JSON.stringify(b)));
  const packages = new Map();
  for (const row of first.inputs) {
    const own = packageName(row.file);
    if (own) {
      checkedPackageName(row.file);
      if (!packages.has(own)) packages.set(own, {name: own, inputCount: 0, importedBy: new Set()});
      packages.get(own).inputCount++;
    }
  }
  for (const row of first.inputs) for (const edge of row.imports) {
    if (edge.external) continue;
    const target = packageName(edge.path);
    if (target && target !== packageName(row.file)) packages.get(target).importedBy.add(row.file);
  }
  const reviewOwners = new Map(first.inputs.flatMap(row => [[row.file, row], [digest(row.file), row]]));
  const externalInputReview = inspectedFirst.externalInputReview.map(({metadataIndex, ...review}) => {
    const row = reviewOwners.get(review.owner ?? review.ownerSha256);
    return {...review, ownerPackage: checkedPackageName(row.file), ownerBytesInOutput: row.bytesInOutput};
  });
  return {status: 'REPEATED_RECORDED_SERVER_GRAPH_MATCH',
    scope: 'STATIC_REPORTED_INPUTS_AND_IMPORT_EDGES_NOT_RUNTIME_REACHABILITY_OR_COMPLETE_DYNAMIC_GRAPH',
    compilerWorkingDirectory, entryPoint: first.entryPoint, inputCount: first.inputs.length,
    outputBytes: first.outputBytes, inputs: first.inputs, externalImports, externalOwners,
    requiresReview: externalInputReview.length > 0, externalInputReview,
    packages: [...packages.values()].map(row => ({...row, importedBy: [...row.importedBy].sort(compare)})).sort((a, b) => compare(a.name, b.name))};
}
