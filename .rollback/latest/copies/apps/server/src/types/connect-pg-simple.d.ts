declare module "connect-pg-simple" {
  import session from "express-session";
  import { Pool } from "pg";

  interface PgSessionOptions {
    pool: Pool;
    tableName?: string;
    createTableIfMissing?: boolean;
    schemaName?: string;
    ttl?: number;
    disableTouch?: boolean;
    pruneSessionInterval?: number | false;
    errorLog?: (...args: any[]) => void;
  }

  function connectPgSimple(
    session: typeof session
  ): new (options: PgSessionOptions) => session.Store;

  export = connectPgSimple;
}
