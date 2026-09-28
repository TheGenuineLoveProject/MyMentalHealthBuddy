from pathlib import Path
import hashlib,json,re,zipfile

ROOT=Path(__file__).resolve().parent.parent
HERE=ROOT/'source_review'
sha=lambda b:hashlib.sha256(b).hexdigest()
command=ROOT/'MMHB-RUNTIME-CONTRACT-R18F.txt'
digest=sha(command.read_bytes())
tests=json.loads((HERE/'r18f-driver-fixture-results.json').read_text())
assert tests['fixtureCount']==10 and all(r['status']=='PASS' for r in tests['fixtures'])
assert tests['driverSha256']==sha((HERE/'runtime-contract-driver-r18f.mjs').read_bytes())
old=(HERE/'runtime-contract-driver-r18c.mjs').read_text()
new=(HERE/'runtime-contract-driver-r18f.mjs').read_text()
def declaration(text,key):
    m=re.search(r'const '+key+r'\s*=\s*',text)
    return json.JSONDecoder().raw_decode(text[m.end():])[0]
unchanged={k:declaration(old,k)==declaration(new,k) for k in
    ['PINS','ASSET_PINS','HELPERS','REVIEWED_ADDITIONS','SOURCE_REVIEWS','ASSET_SETS','RUNTIME_PACKAGES']}
assert all(unchanged.values())
prefix=(HERE/'fresh-candidate-prefix-r17.mjs').read_text()
assert old.startswith(prefix) and new.startswith(prefix)
(HERE/'r18f-scope-comparison.json').write_text(json.dumps({'unchangedConstants':unchanged,
    'originalPrefixUnchanged':True,'pinCount':len({**declaration(new,'PINS'),**declaration(new,'ASSET_PINS')}),
    'r18cCommandUnchanged':sha((ROOT/'MMHB-RUNTIME-CONTRACT-R18C.txt').read_bytes())=='645d7f9d1c39f31308714090d6f728b6208166ad20ec10058eb42116036c6128'},indent=2)+'\n')

observations={
 'project':'MyMentalHealthBuddy','source':'USER_SUPPLIED_R18D_AND_R18E_SCREENSHOTS',
 'r18d':{'branch':'integration','expectedHead':'ba56d50f2f86bc9e47f829e9596f0d0b31699ab0',
    'currentAndSavedHead':'15afbd26287e028bb1a1146cad06f08fa77208ce','mismatch':['head'],
    'savedAndCurrentIdentitiesStable':True},
 'r18e':{'status':'COMMIT_COMPARISON_COMPLETE_REVIEW_REQUIRED','oldOnlyCommits':0,'newOnlyCommits':1,
    'parentMatchesOriginalHead':True,'changedPaths':508,'displayLimit':80,
    'oldTree':'dc6eb22da900cd130f754c7be3108c6a91d8889c','newTree':'0f5b762adcf81c9b81a8880f59ed2aaa5d288339',
    'visibleRows':'ADDITIONS_TO_MMHB_REVIEW_ARTIFACTS; REMAINING_ROWS_NOT_VISIBLE',
    'worktreeChecked':False,'applicationRuntime':'UNPROVEN'},
 'r18f':{'status':'PREPARED_AND_TESTED_LOCALLY_REPLIT_PENDING','commandSha256':digest,
    'automaticContinuationCondition':'Exact child/head/branch, 508 regular additions, every exact path and Git blob ID matches prior delivered review bytes; then original R18C source/pin/candidate checks run.'}}
(HERE/'r18e-user-result-analysis.json').write_text(json.dumps(observations,indent=2)+'\n')
readme=f'''MyMentalHealthBuddy R18F — instructions and scope

1. Download MMHB-RUNTIME-CONTRACT-R18F.txt.
2. Upload that single TXT to /home/runner/workspace in the MMHB Replit project, beside package.json. Wait until its exact filename is visible in Files. Do not extract the review ZIP into the Replit workspace for this run.
3. Run the checksum-and-execute command below. Leave Files and the editor unchanged until the command ends. Return the complete terminal output.

cd /home/runner/workspace &&
printf '%s\\n' '{digest}  MMHB-RUNTIME-CONTRACT-R18F.txt' |
sha256sum -c - &&
env -u BASH_ENV bash --noprofile --norc MMHB-RUNTIME-CONTRACT-R18F.txt

What this does: the R18E result establishes a direct child commit and 508 changed paths, but displayed only the first 80. R18F compares the complete committed delta with a finite catalog of exact Git blob identities computed from 20 previous local delivery archives. Every accepted path must be an addition of a regular, non-executable file and match an exact known review-artifact path and blob. Filenames alone never grant acceptance. Unknown paths, changed known bytes, modifications, deletions, symlinks, executable additions, wrong parent, wrong HEAD/branch, or a count other than 508 stop continuation.

The comparison uses Git's content-addressed blob identities; it does not independently authenticate who made the commit or rehash all committed blob bodies with SHA256. Archive SHA256s and the finite catalog are included in the review kit. Original Git expectation is retained for ancestry; this successor conditionally accepts only the one observed child commit for the retained-runtime check. It does not rewrite any failed receipt or modify a Git reference or repository configuration.

If every change matches, the same command continues R18C's existing 63-pin, current-source, retained candidate/input, es6-symbol, graph and reviewed synthetic helper checks. A match of committed review artifacts is not a current-worktree pass: original source/candidate checks remain required and can still fail. Scope comparison confirms all original pins, six embedded helpers, source review constants and prefix are unchanged. Success remains a retained-contract result, not application startup or deployment.

The command writes only a new .mmhb-release-evidence/r18f-* report through the existing report workflow. It does not install packages, compile, change source or Git state, start the app, connect to the database, send email, call an AI service, or deploy. Reviewed helper code can run with synthetic dependencies and transports only after its existing gates pass. VM contexts and before/after observations are not OS isolation or a concurrent-editor lock. Original snapshots do not inventory every ignored file. No network request is intentionally added by the commit inspector; Git lazy fetch is disabled for its metadata queries.

The terminal includes grouped counts covering all committed paths and every unmatched row. Git's pager is disabled for the new comparison, eliminating the R18E 'Press RETURN' interruption. No commit messages, author emails, source bodies or environment values are printed by that comparison.

Local qualification: 10 real-Git integration fixtures on Node {tests['node']}; 508 actual catalog additions continue to the 11 helper and 20 Resend synthetic cases. Negative fixtures cover known-byte mismatch, unknown application addition, tracked source modification/deletion, executable/symlink addition, count mismatch, wrong parent and uncommitted source drift. Existing fixture files were preserved; operation guards reported no app module loads or real transports. Actual Replit execution is pending; its expected Node remains v24.13.0.

The command TXT is self-contained. The review ZIP is incremental: reproducing its build/tests also requires the earlier delivery archives and R18C source-review fixture assets referenced by the included scripts.

Time: allow 5–15 operator minutes for download/upload/run/output. This is an estimate. The previous 27–61 engineering-hour first-release estimate remains provisional and excludes expanded content/integrations and external waiting. Actual runtime and core user-flow evidence is required to improve it.

References: https://git-scm.com/docs/git-diff (raw format, -z); https://git-scm.com/docs/git (--no-pager, object and environment controls). These document tool behavior; user screenshots supply the MMHB observations.
'''
(ROOT/'MMHB-R18F-Start.txt').write_text(readme)

ledger=ROOT/'MMHB-Readiness-Ledger-2026-09-07.md'
previous=ledger.read_text()
archive=HERE/'r18d-ledger-handoff-archive.md'
if not archive.exists():archive.write_text(previous[:previous.index('## Completed and open gates')])
tail=previous[previous.index('## Completed and open gates'):]
tail=tail.replace('| R18D Git baseline inspection | PREPARED; 7 real-Git fixtures PASS locally | Saved and live Git identities only; no source repair; Replit execution pending |',
 '| R18D Git baseline inspection | COMPLETE in supplied screenshots | Commit mismatch only; integration branch and sampled saved/current identities match |\n'
 '| R18E committed tree comparison | COMPLETE in supplied screenshots | One direct child commit; 508 changed paths; only first 80 displayed; worktree/runtime unqualified |\n'
 '| R18F verified review-addition continuation | PREPARED; 10 integration fixtures PASS locally | All 508 additions must match exact delivered review identities before unchanged retained-runtime checks resume; Replit pending |')
intro=f'''# MyMentalHealthBuddy — working first release

Updated 2026-09-10 after supplied R18D/R18E screenshots. Scope: **MyMentalHealthBuddy.com only**. Next command: **MMHB-RUNTIME-CONTRACT-R18F.txt**. It is prepared and tested locally; Replit execution is pending.

## Current evidence

R18D established a commit-only mismatch: branch `integration` remains correct. Both R18C saved snapshots and current Git HEAD are `15afbd26287e028bb1a1146cad06f08fa77208ce`; original expectation is `ba56d50f2f86bc9e47f829e9596f0d0b31699ab0`. R18E confirms the new commit is a direct child (old-only/new-only counts 0/1), with **508 changed paths**. Its output was limited to 80 rows. Visible rows are additions under verification material; remaining rows have not been reviewed from the screenshots. A Git pager interrupted display, so R18F's new comparison explicitly disables it.

R18C remains failed at PREFLIGHT / GIT_BASELINE. It did not recheck pins, source, candidate, corrected private-module handling or helpers. The last supplied full pin/source/candidate comparison remains R18A. Historical R17B remains failed; its 42 review-file additions were separately accounted for. No release completion percentage is defensible. Actual application runtime and deployed artifact remain **UNPROVEN**.

## Prepared next action

R18F accounts for the entire committed delta against exact known paths and Git blob IDs computed from prior delivered review archive bytes. It requires the exact new HEAD/branch, one original parent, exactly 508 changes, and every change to be a matching regular-file addition. Filenames alone do not grant acceptance. Any modification, deletion, unknown addition, wrong bytes/mode, symlink or unmatched path is reported and stops continuation. Catalog matches refer to content-addressed Git identities, not independent historical authorship or a SHA256 rehash of every committed blob body.

Only after that complete comparison passes does R18F continue R18C's unchanged 63-pin, current source, retained candidate/input, graph, exact es6-symbol and synthetic helper checks. Original prefix and six embedded helper bodies remain unchanged. It writes a fresh report and does not alter Git state or application code. Retained runtime qualification remains distinct from live startup or deployment. Review artifacts being committed cannot establish that ignored or uncommitted app files are unchanged.

Open MMHB-R18F-Start.txt for instructions. Upload only the command TXT beside package.json, wait until visible, verify SHA256 `{digest}`, then execute with clean Bash startup. Return the complete output. Replit AI is unnecessary. Allow an estimated 5–15 operator minutes. The review kit need not be uploaded/extracted into Replit.

## Local verification

Ten real-Git integration fixtures passed. The positive fixture uses 508 actual catalog additions and continues through 11 helper and 20 Resend synthetic cases. Failure fixtures cover changed delivered bytes, unknown application addition, source modification/deletion, executable/symlink additions, count mismatch, wrong parent and uncommitted source drift. Guards observed no real transport or app module load; existing fixture files were preserved. Local Node {tests['node']}; actual Replit qualification pending with its existing v24.13.0 requirement.

## Remaining work and estimates

The earlier **27–61 engineering-hour** range is a low-confidence first-release planning allowance, not measured remaining work or a commitment. It assumes substantial existing implementation and no major redesign, and excludes expanded integrations/content and external waiting. Reestimate after controlled startup and core-flow qualification.

| Work | Planning hours | Acceptance evidence |
| --- | ---: | --- |
| Runtime packaging, configuration, controlled startup | 8–18 | Intended bundle starts with required dependencies/assets and controlled side effects |
| Authentication, data isolation, core flows, AI safety | 12–26 | Real user-flow and failure-case evidence |
| Mobile, accessibility, performance, launch content | 4–10 | Exposed routes usable and launch content reviewed |
| Recovery, CI, deployment, domain verification | 3–7 | Restore/rollback works and intended artifact serves domain |

Queue the sourced mental-health library, calendar assistant, daily content drafts, teaching slides/PDFs, books/affiliate workflows and configured integrations after the working first release. Mentioned plugins are not completed integrations. Clinical evidence labels, editorial review, source rights, consent and plain-language explanations are content requirements; metaphors, spirituality or quantum language do not establish treatment efficacy.

## Continuation prompt

Continue MyMentalHealthBuddy only. Review the complete R18F result. If committed changes are unmatched, inspect their exact rows and evidence before adjusting the finite catalog; never grant acceptance by directory name alone. If all 508 match, review the subsequent unchanged source/candidate/graph/helper results and resolve the next demonstrated runtime blocker. Preserve historical failures and all 63 pins. Do not confuse local fixtures or retained checks with live startup or deployment. Use tested Shell commands and Replit AI only as a last resort.

'''
ledger.write_text(intro+tail)
(ROOT/'MMHB-Ledger.txt').write_bytes(ledger.read_bytes())
files=[command,ROOT/'MMHB-R18F-Start.txt',HERE/'commit-review-r18f.mjs',HERE/'build-runtime-contract-r18f.py',
 HERE/'runtime-contract-body-r18f.mjs',HERE/'runtime-contract-driver-r18f.mjs',HERE/'r18f-delivered-review-blobs.json',
 HERE/'r18f-catalog-provenance.json',HERE/'test-r18f-driver.py',HERE/'r18f-driver-fixture-results.json',
 HERE/'r18f-scope-comparison.json',HERE/'r18e-user-result-analysis.json',HERE/'r18d-ledger-handoff-archive.md',
 Path(__file__).resolve()]
# The new test imports the previously delivered fixture harness. Preserve it.
files.append(HERE/'test-r18c-driver.py')
manifest={'project':'MyMentalHealthBuddy','replitExecution':'PENDING','commandSha256':digest,
 'files':[{'file':str(p.relative_to(ROOT)),'bytes':p.stat().st_size,'sha256':sha(p.read_bytes())} for p in files]}
mf=HERE/'r18f-preparation-record.json';mf.write_text(json.dumps(manifest,indent=2)+'\n')
with zipfile.ZipFile(ROOT/'MMHB-R18F-Kit.zip','w',zipfile.ZIP_DEFLATED) as z:
    for p in files+[mf]:z.write(p,p.relative_to(ROOT))
print(json.dumps({'commandSha256':digest,'fixtures':tests['fixtureCount'],'unchanged':unchanged,'kitFiles':len(files)+1},indent=2))
