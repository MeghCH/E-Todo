const notFound = (_req, res, _next) => {
  res.status(404).json({ msg: "Notfound" });
};

module.exports = notFound;
