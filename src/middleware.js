// Request logger middleware
const requestLogger = (req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
};

// Validate paper input
const validatePaper = (paper) => {
  const errors = [];
  if (!data.title) errors.push("Title is required");
  if (!data.authors) errors.push("Authors are required");
  if (!data.published_in) errors.push("Published venue is required");
  
  if (!paper.year) {
    errors.push("Published year is required");
  } else {
    const num_year = parseInt(paper.year)
    if (!Number.isInteger(num_year) || num_year <= 1900) {
        errors.push("Valid year after 1900 is required");
    }
  }
  return errors;
};

// Error handler middleware
const errorHandler = (err, req, res, next) => {
  // err is in format {"error" : "xxx", "messages": ?}
  if (err.error === "Validation Error") {
    res.status(400).json(err)
} else if (err.error === "Paper not found") {
    res.status(404).json(err)
}

  console.error(err);
};

// Validate ID parameter middleware
const validateId = (req, res, next) => {
  const paperID = req.params.id;
  if (!Number.isInteger(parseInt(paperID))) {
    return res.status(400).json({ error: "Validation Error", message: "Invalid ID format" });
  }
  next(paperID,res);
};

module.exports = {
  requestLogger,
  validatePaper,
  errorHandler,
  validateId,
};
