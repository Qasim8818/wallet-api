import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  user: "postgres",
  host: "127.0.0.1",
  database: "indexdemo",
  password: "1234",
  port: 5432,
});

async function setupDatabase() {
  await pool.query(`CREATE EXTENSION IF NOT EXISTS pgcrypto`);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS tenants (
      id SERIAL PRIMARY KEY,
      name TEXT UNIQUE
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS employees_partitioned (
      id SERIAL PRIMARY KEY,
      tenant_id INT REFERENCES tenants(id),
      name TEXT,
      manager_id INT,
      department TEXT NOT NULL,
      salary NUMERIC,
      metadata JSONB,
      created_at TIMESTAMP DEFAULT NOW()
    ) PARTITION BY LIST (department)
  `);

  const departments = ['Engineering', 'HR', 'Sales'];
  for (const dept of departments) {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS employees_${dept.toLowerCase()} PARTITION OF employees_partitioned
      FOR VALUES IN ('${dept}')
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_${dept.toLowerCase()}_metadata 
      ON employees_${dept.toLowerCase()} USING GIN (metadata)
    `);
  }

  await pool.query(`
    CREATE TABLE IF NOT EXISTS events (
      id SERIAL PRIMARY KEY,
      tenant_id INT REFERENCES tenants(id),
      entity TEXT,
      entity_id INT,
      event_type TEXT,
      event_data JSONB,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);

  console.log("✅ Tables, partitions, and JSONB indexes created.");
}

async function insertSampleData() {
  const tenants = ['Google', 'Uber', 'Airbnb'];
  for (const t of tenants) {
    await pool.query(`INSERT INTO tenants(name) VALUES($1) ON CONFLICT DO NOTHING`, [t]);
  }

  for (let i = 1; i <= 50; i++) {
    const tenant_id = Math.floor(Math.random() * 3) + 1;
    const department = ['Engineering', 'HR', 'Sales'][Math.floor(Math.random() * 3)];
    const manager_id = i <= 5 ? null : Math.floor(Math.random() * (i - 1)) + 1;
    const salary = Math.floor(Math.random() * 100000) + 50000;
    const metadata = { skills: ['SQL','Node.js','PostgreSQL'], level: ['Junior','Mid','Senior'][Math.floor(Math.random()*3)] };

    await pool.query(`
      INSERT INTO employees_partitioned (tenant_id, name, manager_id, department, salary, metadata)
      VALUES ($1,$2,$3,$4,$5,$6)
    `, [tenant_id, `Employee${i}`, manager_id, department, salary, metadata]);
  }

  console.log("✅ Sample employees inserted.");
}

async function logEvent(entity, entity_id, event_type, data, tenant_id=1) {
  await pool.query(`
    INSERT INTO events (tenant_id, entity, entity_id, event_type, event_data)
    VALUES ($1, $2, $3, $4, $5)
  `, [tenant_id, entity, entity_id, event_type, data]);
}

async function advancedQueries() {
  console.log("\n--- Recursive Query: Subordinates ---");
  const subRes = await pool.query(`
    WITH RECURSIVE subordinates AS (
      SELECT id, name, manager_id, department
      FROM employees_partitioned
      WHERE manager_id IS NULL
      UNION ALL
      SELECT e.id, e.name, e.manager_id, e.department
      FROM employees_partitioned e
      INNER JOIN subordinates s ON e.manager_id = s.id
    )
    SELECT * FROM subordinates
  `);
  console.table(subRes.rows.slice(0, 10));

  console.log("\n--- Window Function: Salary Rank ---");
  const rankRes = await pool.query(`
    SELECT name, department, salary,
           RANK() OVER(PARTITION BY department ORDER BY salary DESC) AS dept_rank
    FROM employees_partitioned
  `);
  console.table(rankRes.rows.slice(0, 10));

  console.log("\n--- Materialized View: Top Earners ---");
  await pool.query(`
    CREATE MATERIALIZED VIEW IF NOT EXISTS top_earners AS
    SELECT tenant_id, department, name, salary
    FROM employees_partitioned
    WHERE salary > 90000
  `);
  await pool.query(`REFRESH MATERIALIZED VIEW top_earners`);
  const mvRes = await pool.query(`SELECT * FROM top_earners LIMIT 10`);
  console.table(mvRes.rows);

  console.log("\n--- JSONB Search Example (skill = PostgreSQL) ---");
  const jsonRes = await pool.query(`
    SELECT * FROM employees_partitioned
    WHERE metadata @> '{"skills":["PostgreSQL"]}'
    LIMIT 10
  `);
  console.table(jsonRes.rows);

  console.log("\n--- Seq Scan Trap Example ---");
  const trapRes = await pool.query(`
    EXPLAIN ANALYZE SELECT * FROM employees_partitioned WHERE salary > 95000
  `);
  trapRes.rows.forEach(r => console.log(r["QUERY PLAN"].trim()));
}

async function main() {
  try {
    await setupDatabase();
    await insertSampleData();
    await logEvent('employee', 1, 'CREATE', { salary: 75000 });
    await advancedQueries();
    console.log("\n✅ Full demo complete: Hierarchy + Partitioning + JSONB search + Analytics + Performance!");
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

main();