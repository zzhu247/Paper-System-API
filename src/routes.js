const express = require("express");
const router = express.Router();
const db = require("./database");
const { validatePaper, errorHandler } = require("./middleware");

// GET /api/papers
router.get("/papers", async (req, res, next) => {
  try {
    const filters = {
      year: req.query.year ? parseInt(req.query.year) : null,
      published_in: req.query.published_in,
      limit: req.query.limit ? parseInt(req.query.limit) : 10,
      offset: req.query.offset ? parseInt(req.query.offset) : 0,
    };
    // Your implementation here
    const error = {
      error: "Validation Error",
      message: "Invalid query parameter format"
    }

    // Invalid Year
    if (filters.year != null) {
      if (!Number.isInteger(filters.year) || filters.year <= 1900) {
        return errorHandler(error, req, res, next)
      }
    }

    // Invalid Limit
    if (filters.limit != null) {
      if (!Number.isInteger(filters.limit) || filters.limit <= 0 || filters.limit > 100)
        return errorHandler(error, req, res, next)
    }

    // Invalid Offset
    if (filters.offset != null) {
      if (!Number.isInteger(filters.offset) || filters.offset <0)
        return errorHandler(error, req, res, next)
    }

    

  } catch (error) {
    next(error);
  }
});

// GET /api/papers/:id
router.get("/papers/:id", async (req, res, next) => {
  try {
    // Your implementation here
    const paperID = req.params.id;

    // Validate ID => Must be an integer
    if (!Number.isInteger(parseInt(paperID))) {
      return res.status(400).json({ error: "Validation Error", message: "Invalid ID format" });
    }

    // Get the paper ID
    const paper = await dbGet("SELECT * FROM papers WHERE id = ?", [paperID]);

    // If the paper is not found
    if (!paper) {
      return res.status(404).json({ error: "Not Found", message: "Paper not found" });
    }

    // Format timestamps to ISO 8601
    paper.created_at = new Date(paper.created_at).toISOString();
    paper.updated_at = new Date(paper.updated_at).toISOString();

    res.status(200).json(paper);

  } catch (error) {
    next(error);
  }
});

// POST /api/papers
router.post("/papers", async (req, res, next) => {
  try {
    const errors = validatePaper(req.body);
    if (errors.length > 0) {
      return res
        .status(400)
        .json({ error: "Validation Error", messages: errors });
    }

    // Your implementation here
    const {title, author, year, published_in} = req.body;
    const created_at = new Date().toISOString();
    const updated_at = created_at;

    const result = await db.run(
      `INSERT INTO papers (title, author, year, published_in, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)`,
      [title, author, year, published_in, created_at, updated_at]
    );

    // Get the newly created paper
    const paper = await db.get("SELECT * FROM papers WHERE id = last_insert_rowid()");

    res.status(201).json(paper);


  } catch (error) {
    next(error);
  }
});

// PUT /api/papers/:id
router.put("/papers/:id", async (req, res, next) => {
  try {
    const errors = validatePaper(req.body);
    if (errors.length > 0) {
      return res
        .status(400)
        .json({ error: "Validation Error", messages: errors });
    }

    // Your implementation here
    const paperID = req.params.id;
    if (!/^\d+$/.test(paperID) || parseInt(paperID) <= 0) {
      return res.status(400).json({
        error: "Validation Error",
        message: "Invalid ID format",
      });
    }

    // Check if the paper exists
    const existingPaper = await dbGet("SELECT * FROM papers WHERE id = ?", [paperId]);
    if (!existingPaper) {
      return res.status(404).json({ error: "Paper not found" });
    }

    // Extract and prepare update data
    const { title, authors, published_in, year } = req.body;
    const updated_at = new Date().toISOString(); // ISO 8601 timestamp

    // Update the paper in the database
    await dbRun(
      "UPDATE papers SET title = ?, authors = ?, published_in = ?, year = ?, updated_at = ? WHERE id = ?",
      [title, authors, published_in, year, updated_at, paperID]
    );
    const updatedPaper = await dbGet("SELECT * FROM papers WHERE id = ?", [paperId]);

    res.status(200).json(updatedPaper);


  } catch (error) {
    next(error);
  }
});

// DELETE /api/papers/:id
router.delete("/papers/:id", async (req, res, next) => {
  try {
    // Your implementation here
    const paperID = req.params.id;
    if (!/^\d+$/.test(paperID) || parseInt(paperID) <= 0) {
      return res.status(400).json({
        error: "Validation Error",
        message: "Invalid ID format",
      });
    }

    // Check if the paper exists
    const existingPaper = await dbGet("SELECT * FROM papers WHERE id = ?", [paperID]);
    if (!existingPaper) {
      return res.status(404).json({ error: "Paper not found" });
    }

    await dbRun("DELETE FROM papers WHERE id = ?", [paperID]);

    res.status(204).end();



  } catch (error) {
    next(error);
  }
});

module.exports = router;
