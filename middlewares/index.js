const jwt=require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  try {
    const key=process.env.JWT_SECRET;
    req.decoded = jwt.verify(req.headers.authorization, key);
    return next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') { // 유효기간 초과
      res.status(419).send("Timed Out");
    }
    res.status(401).send("Invalid User.");
  }
};

exports.verifyOrigin = (req, res, next) => {
  const desiredOrigin = process.env.TARGET_ORIGIN;
  const semiOrigin = process.env.TESTING_ORIGIN;
  const requestOrigin = req.get('Origin');
  if ((desiredOrigin === requestOrigin) || (semiOrigin === requestOrigin)) {
    next();
  } else {
    res.status(403).send("Forbidden User.");
  }
};