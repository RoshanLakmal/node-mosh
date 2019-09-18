function log(req, res, next) {
  console.log('Logging...');
  next(); //If you do not have this it will hangs
}

module.exports = log;
