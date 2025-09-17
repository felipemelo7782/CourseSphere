// middleware.js
module.exports = (req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  console.log('Body:', req.body);
  console.log('Query:', req.query);
  console.log('---');
  next();
};