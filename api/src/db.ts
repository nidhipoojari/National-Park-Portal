import oracledb from "oracledb";

// Return query rows as plain objects keyed by column name.
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
oracledb.fetchAsString = [oracledb.CLOB];

let pool: oracledb.Pool | null = null;

export async function initPool(): Promise<void> {
  if (pool) return;
  pool = await oracledb.createPool({
    user: process.env.ORACLE_USER,
    password: process.env.ORACLE_PASSWORD,
    connectString: process.env.ORACLE_CONNECT_STRING,
    poolMin: 1,
    poolMax: 10,
    poolIncrement: 1,
  });
  // eslint-disable-next-line no-console
  console.log("[db] Oracle connection pool created");
}

export async function closePool(): Promise<void> {
  if (pool) {
    await pool.close(10);
    pool = null;
  }
}

function getPool(): oracledb.Pool {
  if (!pool) throw new Error("Database pool not initialized");
  return pool;
}

/**
 * Run a read-only SELECT and return the rows.
 */
export async function query<T = Record<string, unknown>>(
  sql: string,
  binds: oracledb.BindParameters = {}
): Promise<T[]> {
  const conn = await getPool().getConnection();
  try {
    const result = await conn.execute<T>(sql, binds, { outFormat: oracledb.OUT_FORMAT_OBJECT });
    return (result.rows as T[]) ?? [];
  } finally {
    await conn.close();
  }
}

/**
 * Call a PL/SQL procedure and capture everything it writes via
 * DBMS_OUTPUT.PUT_LINE. The project's procedures communicate results and
 * error messages through DBMS_OUTPUT, so we enable the buffer, run the
 * procedure, then drain the lines with DBMS_OUTPUT.GET_LINES.
 *
 * @param plsqlCall e.g. "BEGIN add_visitor(:name, :email, :addr, :st, :zip); END;"
 * @param binds bind parameters for the call
 * @returns array of output lines produced by the procedure
 */
export async function callWithOutput(
  plsqlCall: string,
  binds: oracledb.BindParameters = {}
): Promise<string[]> {
  const conn = await getPool().getConnection();
  try {
    await conn.execute(`BEGIN DBMS_OUTPUT.ENABLE(NULL); END;`);
    await conn.execute(plsqlCall, binds, { autoCommit: true });

    const lines: string[] = [];
    let more = true;
    while (more) {
      const result = await conn.execute(
        `BEGIN DBMS_OUTPUT.GET_LINES(:lines, :numlines); END;`,
        {
          lines: {
            dir: oracledb.BIND_OUT,
            type: oracledb.STRING,
            maxArraySize: 100,
          },
          numlines: { dir: oracledb.BIND_INOUT, type: oracledb.NUMBER, val: 100 },
        }
      );
      const out = result.outBinds as unknown as {
        lines: string[];
        numlines: number;
      };
      for (const l of out.lines) {
        if (l !== null && l !== undefined) lines.push(l);
      }
      more = out.numlines === 100;
    }
    return lines;
  } finally {
    await conn.close();
  }
}

export { oracledb };
