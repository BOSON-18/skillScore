// scripts/monitor-test.js
const { Pool } = require("pg");

const pool = new Pool({
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || "skillscore_dev",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "postgres"
})

async function showStats() {
  const stats = await pool.query(`
    SELECT 
      state,
      COUNT(*) as count,
      AVG(EXTRACT(EPOCH FROM (updated_at - created_at))) as avg_processing_time_sec
    FROM match_results
    WHERE created_at > NOW() - INTERVAL '15 minutes'
    GROUP BY state
    ORDER BY state
  `);

  console.clear();
  console.log("=== MATCH RESULTS (Last 15 min) ===\n");
  console.table(stats.rows);

  const total = await pool.query(`
    SELECT COUNT(*) as total 
    FROM match_results 
    WHERE created_at > NOW() - INTERVAL '15 minutes'
  `);

  console.log(`\nTotal processed: ${total.rows[0].total}`);
}

async function monitor() {
  while (true) {
    try {
      await showStats();
    } catch (err) {
      console.error("Error:", err.message);
    }
    await new Promise(resolve => setTimeout(resolve, 5000)); // Update every 5s
  }
}

monitor();