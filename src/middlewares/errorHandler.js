export const notFound = (req, res) => {
  res.status(404).json({ message: "Not Found" });
};

export const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    message: err.message || "Server Error",
    stack: process.env.NODE_ENV === "production" ? "🥲" : err.stack,
  });
};
