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
}
