const notFound = (req, res, next) => {
  res.status(404).json({ msg: 'Notfound' });
};

module.exports = notFound;
