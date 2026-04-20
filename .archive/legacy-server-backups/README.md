Archived from runtime server/ tree to satisfy Runtime Purity Rule.

Reason:
- .bak files must not remain inside server/ runtime paths.
- Files were moved, not deleted.
- This archive is non-runtime and preserves rollback history.

Moved by:
- safe-mode governor cleanup

Rollback examples:
- mv .archive/legacy-server-backups/server/app.mjs.bak.1776489488 server/
- mv .archive/legacy-server-backups/server/routes/ai.mjs.bak.1776489294 server/routes/
