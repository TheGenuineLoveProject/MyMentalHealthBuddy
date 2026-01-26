# MCP Tools Specification

## Overview
This document describes the proposed Model Context Protocol (MCP) tool registry for The Genuine Love Project platform automation.

## Design Principles
1. **Human-triggered only**: No background autonomy or scheduled runs
2. **Deterministic**: Same inputs always produce same outputs
3. **Non-destructive**: Never delete or overwrite without explicit confirmation
4. **Auditable**: All actions logged with timestamps
5. **Reversible**: Changes can be rolled back

## Proposed Tool Registry

### 1. scan_platform
Scans the codebase for compliance issues.

**Input**:
```json
{
  "scope": "all" | "pages" | "components" | "content",
  "checks": ["seo", "safety", "benefits", "language"]
}
```

**Output**:
```json
{
  "timestamp": "ISO-8601",
  "summary": {
    "totalFiles": 555,
    "issuesFound": 0,
    "issuesByType": {}
  },
  "filesWithIssues": []
}
```

### 2. verify_build
Runs build verification and reports status.

**Input**:
```json
{
  "includeTests": false,
  "includeLint": true
}
```

**Output**:
```json
{
  "timestamp": "ISO-8601",
  "buildSuccess": true,
  "lintErrors": [],
  "warnings": []
}
```

### 3. generate_page_context
Generates SEO and benefits context for a page.

**Input**:
```json
{
  "routeKey": "/wellness",
  "category": "wellness"
}
```

**Output**:
```json
{
  "title": "Wellness Hub — The Genuine Love Project",
  "description": "...",
  "benefitKeys": ["balance", "resilience"],
  "relatedRoutes": ["/tools", "/breathing"]
}
```

### 4. plan_patches
Creates a patch plan without modifying files.

**Input**:
```json
{
  "scanResultsPath": "scripts/.scan-results.json"
}
```

**Output**:
```json
{
  "patchPlan": [
    {
      "file": "path/to/file.jsx",
      "actions": ["add_seo", "add_safety_footer"],
      "dryRun": true
    }
  ]
}
```

## Security Rules
1. Tools cannot access external networks
2. Tools cannot modify production database
3. Tools cannot access user data
4. Tools cannot execute arbitrary code
5. All tool outputs are sanitized

## Integration Pattern
```typescript
interface MCPTool {
  name: string;
  description: string;
  inputSchema: JSONSchema;
  outputSchema: JSONSchema;
  execute: (input: unknown) => Promise<unknown>;
}
```

## Approval Workflow
1. Tool proposes changes (dry-run)
2. Human reviews proposed changes
3. Human approves or rejects
4. If approved, tool executes changes
5. Changes are logged and auditable

## Forbidden Operations
- Background execution without human trigger
- Automatic content generation without review
- Database modifications
- File deletion without explicit confirmation
- External API calls
- User data access
