const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./paper_management.db", (err) => {
  if (err) {
    console.error("Error connecting to database:", err);
  } else {
    console.log("Connected to SQLite database");
    initializeDatabase();
  }
});

// TODO: Create a table named papers with the schema specified in the handout
const initializeDatabase = () => {
  db.run(
    `
    CREATE TABLE IF NOT EXISTS papers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      authors TEXT NOT NULL,
      published_in TEXT NOT NULL,
      year INTEGER NOT NULL CHECK (year > 1900),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP)
      `,
      (err) => {
        if (err) {
          console.error("Error When Creating Table", err)
        } else {
          console.log("Tables are succefully creates");
        }
      }
  );
}
// TODO: Implement these database operations
const dbOperations = {
  createPaper: async (paper) => {
    const result = await new Promise((resolve, reject) => {
      db.run(
        `
        INSERT INTO papers (title, author, published_in, year)
        VALUES(?, ?, ?, ?)

        `,
        [paper.title, paper.author, paper.published_in, paper.year],
        (err) => {
          if (err) {
            reject(err)
            console.error("Fail to create the item", err)
          } else {
            db.get(`SELECT * FROM papers WHERE id = ?`, [this.LastID], 
              (err, row) => {
                if (err) reject(err);
                else resolve(row);
              } );
          }
        }
      );

    }
  );
  return result;
  },

  getAllPapers: async (filters = {}) => {
    const result = await new Promise((resolve, reject) => {
      let query = "SELECT * FROM papers";
      const params = [];
      const conditions = []
      // Validate filters
      // if the filter has year
      if (filters.year != null) {
        conditions.push("year = ?");
        params.push(filters.year);
      }

      // if the filter has published date and blur search
      if (filters.published_in != null) {
        conditions.push("PUBLISHED_IN LIKE ?");
        params.push(`%${filters.published_in}%`);
      }

      // Add the WHERE and AND in the statement
      if (conditions.length >0) {
        query += " WHERE " + conditions.join(" AND ");
      }

      // Mandatory conditions
      query += " LIMIT ? OFFSET ? ";
      params.push(filters.limit, filters.offset);



      db.all(query, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);

      });
    }

    )
    return result
  },

  getPaperById: async (id) => {
    const result = await new Promise((resolve, reject) => {
      db.get("SELECT * FROM papers WHERE id = ?", [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      }
      );
    }
    );
    return result
  },

  updatePaper: async (id, paper) => {
    const result = await new Promise((resolve, reject) => {
      const query = `
      UPDATE papers
      SET title = ?,
      author = ?,
      year = ?,
      published_in = ?,
      updated_at = CURRENT_TIMESTAMP
      WHERE id = ?  
      `
      db.run(
        query,
        [paper.title, paper.author, paper.year, paper. published_in, id],
        (err) => {
          if (err) reject(err);
          else {
            db.get("SELECT * FROM papers WHERE id = ?", [id], (err, row) =>{
              if (err) reject(err);
              else resolve(row);
            });
          }
        }
      );
    }
  );
  return result
  },

  deletePaper: async (id) => {
    // Your implementation here
    const result = await new Promise((resolve, reject) => {
      db.run(
        `
        DELETE FROM papers WHERE id = ?
        `,
        [id], 
        (err)=> {
          if (err) reject(err);
          else resolve();
        } 
      );
    }
    );
    return result;
  },
};

module.exports = {
  db, // export the database instance
  ...dbOperations, // spreads all operations as individual exports
};
