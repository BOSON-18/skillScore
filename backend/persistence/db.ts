import { Pool, QueryResult, QueryResultRow } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export class DbError extends Error {
  public readonly code?: string;
  public readonly cause: unknown;

  constructor(message: string, code?: string, cause?: unknown) {
    super(message);
    this.name = "DbError";
    this.code = code;
    this.cause = cause;
  }
}

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params: unknown[] = []
): Promise<QueryResult<T>> {
  try {
    return await pool.query<T>(text, params);
  } catch (err: unknown) {
    const pgError = err as { code?: string };

    console.error("DB_ERROR:", pgError.code);

    throw new DbError(
      "Database operation failed",
      pgError.code,
      err
    );
  }
}
