use rusqlite::{Connection, Result};
use std::path::PathBuf;
use std::fs;

pub struct DbClient {
    pub conn: Connection,
}

impl DbClient {
    pub fn new(db_path: PathBuf) -> Result<Self> {
        if let Some(parent) = db_path.parent() {
            if !parent.exists() {
                fs::create_dir_all(parent).expect("Failed to create database directory");
            }
        }
        let conn = Connection::open(db_path)?;

        let client = Self { conn };
        client.init_schema()?;

        Ok(client)
    }

    fn init_schema(&self) -> Result<()> {
        let schema = include_str!("schema.sql");
        self.conn.execute_batch(schema)?;
        Ok(())
    }

    // Example methods to insert entities and relations for testing persistence layer
    pub fn insert_entity(&self, id: &str, kind: &str, label: Option<&str>, tech: Option<&str>, status: Option<&str>, properties: &str) -> Result<()> {
        self.conn.execute(
            "INSERT INTO entities (id, kind, label, tech, status, properties) VALUES (?1, ?2, ?3, ?4, ?5, ?6)
             ON CONFLICT(id) DO UPDATE SET kind=?2, label=?3, tech=?4, status=?5, properties=?6, updated_at=CURRENT_TIMESTAMP",
            rusqlite::params![id, kind, label, tech, status, properties],
        )?;
        Ok(())
    }

    pub fn insert_relation(&self, from_id: &str, to_id: &str, rel_type: &str, label: Option<&str>) -> Result<()> {
        self.conn.execute(
            "INSERT INTO relations (from_id, to_id, rel_type, label) VALUES (?1, ?2, ?3, ?4)",
            rusqlite::params![from_id, to_id, rel_type, label],
        )?;
        Ok(())
    }
}
