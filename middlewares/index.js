const jwt=require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  try {
    const key=process.env.JWT_SECRET;
     req.decoded = jwt.verify(req.headers.authorization, key);
     return next();
  } catch (error) {
     if (error.name === 'TokenExpiredError') { // 유효기간 초과
       return res.status(419).json({
         code: 419,
         message: 'Timed Out',
       });
     }
     return res.status(401).json({
       code: 401,
       message: 'Invalid Token',
     });
   }
};