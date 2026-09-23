import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const MANDATORY_ROOTS = ["client/src", "server", "shared"];
const SOURCE_EXTENSIONS = new Set([".js", ".jsx", ".mjs", ".ts", ".tsx"]);
const ROUTE_EXTENSIONS = new Set([".js", ".mjs", ".ts"]);

function slash(filePath) {
  return filePath.split(path.sep).join("/");
}

function assertReadable(stat, displayPath) {
  if ((stat.mode & 0o444) === 0) {
    throw new Error(`Unreadable input: ${displayPath}`);
  }
}

function isWithin(parent, candidate) {
  const relative = path.relative(parent, candidate);
  return relative === "" || (!relative.startsWith(`..${path.sep}`) && relative !== ".." && !path.isAbsolute(relative));
}

function collectFiles(repositoryRoot) {
  const repositoryRealPath = fs.realpathSync(repositoryRoot);
  const files = [];

  function walk(absoluteDirectory) {
    const directoryDisplayPath = slash(path.relative(repositoryRealPath, absoluteDirectory));
    const directoryStat = fs.lstatSync(absoluteDirectory);
    if (directoryStat.isSymbolicLink() || !directoryStat.isDirectory()) {
      throw new Error(`Unsafe input directory: ${directoryDisplayPath || "."}`);
    }
    assertReadable(directoryStat, directoryDisplayPath || ".");
    fs.accessSync(absoluteDirectory, fs.constants.R_OK);

    const directoryRealPath = fs.realpathSync(absoluteDirectory);
    if (!isWithin(repositoryRealPath, directoryRealPath)) {
      throw new Error(`Input escapes repository: ${directoryDisplayPath}`);
    }

    const entries = fs.readdirSync(absoluteDirectory, { withFileTypes: true })
      .sort((left, right) => left.name.localeCompare(right.name, "en"));

    for (const entry of entries) {
      const absolutePath = path.join(absoluteDirectory, entry.name);
      const displayPath = slash(path.relative(repositoryRealPath, absolutePath));
      const stat = fs.lstatSync(absolutePath);

      if (stat.isSymbolicLink()) {
        throw new Error(`Symbolic link refused: ${displayPath}`);
      }
      if (stat.isDirectory()) {
        walk(absolutePath);
      } else if (stat.isFile()) {
        assertReadable(stat, displayPath);
        fs.accessSync(absolutePath, fs.constants.R_OK);
        const realPath = fs.realpathSync(absolutePath);
        if (!isWithin(repositoryRealPath, realPath)) {
          throw new Error(`Input escapes repository: ${displayPath}`);
        }
        files.push({ absolutePath, displayPath });
      } else {
        throw new Error(`Unsupported input type: ${displayPath}`);
      }
    }
  }

  for (const relativeRoot of MANDATORY_ROOTS) {
    const absoluteRoot = path.join(repositoryRealPath, relativeRoot);
    let rootStat;
    try {
      rootStat = fs.lstatSync(absoluteRoot);
    } catch (error) {
      if (error?.code === "ENOENT") {
        throw new Error(`Missing mandatory root: ${relativeRoot}`);
      }
      throw error;
    }
    if (rootStat.isSymbolicLink() || !rootStat.isDirectory()) {
      throw new Error(`Unsafe mandatory root: ${relativeRoot}`);
    }
    walk(absoluteRoot);
  }

  return files.sort((left, right) => left.displayPath.localeCompare(right.displayPath, "en"));
}

function findDuplicateBasenames(sourceFiles) {
  const pathsByBasename = new Map();
  for (const file of sourceFiles) {
    const basename = path.basename(file.displayPath);
    const paths = pathsByBasename.get(basename) ?? [];
    paths.push(file.displayPath);
    pathsByBasename.set(basename, paths);
  }

  return [...pathsByBasename]
    .filter(([, paths]) => paths.length > 1)
    .sort(([left], [right]) => left.localeCompare(right, "en"))
    .map(([basename, paths]) => ({ basename, count: paths.length, paths }));
}

function findDuplicateRouteSignatures(files) {
  const findings = [];
  const routePattern = /\brouter\s*\.\s*(get|post|put|patch|delete)\s*\(\s*(["'])(.*?)\2/g;

  for (const file of files) {
    if (!file.displayPath.startsWith("server/routes/") || !ROUTE_EXTENSIONS.has(path.extname(file.displayPath))) {
      continue;
    }

    const source = fs.readFileSync(file.absolutePath, "utf8");
    const signatureCounts = new Map();
    let match;
    while ((match = routePattern.exec(source)) !== null) {
      const signature = `${match[1]}\u0000${match[3]}`;
      signatureCounts.set(signature, (signatureCounts.get(signature) ?? 0) + 1);
    }

    const duplicates = [...signatureCounts]
      .filter(([, occurrences]) => occurrences > 1)
      .map(([signature, occurrences]) => ({
        method: signature.slice(0, signature.indexOf("\u0000")).toUpperCase(),
        occurrences,
      }))
      .sort((left, right) =>
        left.method.localeCompare(right.method, "en") || left.occurrences - right.occurrences);

    if (duplicates.length > 0) {
      findings.push({ path: file.displayPath, signatures: duplicates });
    }
  }
  return findings;
}

export function generateRefactorReport(repositoryRoot = process.cwd()) {
  const files = collectFiles(repositoryRoot);
  const sourceFiles = files.filter((file) => SOURCE_EXTENSIONS.has(path.extname(file.displayPath)));
  const runtimeBackups = files
    .filter((file) => file.displayPath.startsWith("server/") && /\.bak[^/]*$/.test(path.basename(file.displayPath)))
    .map((file) => file.displayPath);
  const serverTypeScriptFiles = files
    .filter((file) => file.displayPath.startsWith("server/") && path.extname(file.displayPath) === ".ts")
    .map((file) => file.displayPath);
  const duplicateBasenames = findDuplicateBasenames(sourceFiles);
  const duplicateRouteSignatures = findDuplicateRouteSignatures(files);

  return {
    schemaVersion: 1,
    report: "auto-refactor",
    scope: {
      roots: MANDATORY_ROOTS,
      sourceExtensions: [...SOURCE_EXTENSIONS].sort(),
    },
    summary: {
      scannedFiles: files.length,
      scannedSourceFiles: sourceFiles.length,
      duplicateBasenameGroups: duplicateBasenames.length,
      runtimeBackupFiles: runtimeBackups.length,
      serverTypeScriptFiles: serverTypeScriptFiles.length,
      duplicateRouteSignatureFiles: duplicateRouteSignatures.length,
      duplicateRouteSignatureGroups: duplicateRouteSignatures.reduce(
        (total, file) => total + file.signatures.length,
        0,
      ),
    },
    duplicateBasenames,
    runtimeBackups,
    serverTypeScriptFiles,
    duplicateRouteSignatures: {
      classification: "advisory heuristic; findings are not proof of duplicate route registration",
      findings: duplicateRouteSignatures,
    },
  };
}

function run() {
  try {
    process.stdout.write(`${JSON.stringify(generateRefactorReport(), null, 2)}\n`);
  } catch (error) {
    process.stderr.write(`auto-refactor-report: ${error.message}\n`);
    process.exitCode = 1;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  run();
}