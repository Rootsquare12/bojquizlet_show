const express=require('express');
const path=require('path');
const axios=require('axios');
const morgan=require('morgan');
const cookieParser=require('cookie-parser');
const session=require('express-session');
const dotenv=require('dotenv');
const passport=require('passport');
const {sequelize}=require('./models');
const passportConfig=require('./passport');
const cors=require('cors');
const api=require('./api');

const { authorize } = require('passport');
const helmet=require('helmet');
const hpp=require('hpp');
const redis = require('redis');
const RedisStore = require('connect-redis')(session);
const logger=require('./logger');

const update_problems=require('./get_data');
const { update } = require('./models/user');

dotenv.config();
const redisClient = redis.createClient({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    password: process.env.REDIS_PASSWORD,
    legacyMode: true,
});

const app=express();
passportConfig();//패스포트 설정
app.set('port',process.env.PORT || 8001); // 포트 설정

sequelize.sync({force: false}) //데이터베이스 연결. force: true로 하면 데이터베이스를 다시 만들 수 있다.
    .then(() => {
        console.log('Database Connected');
    })
    .catch((err) => {
        console.error(err);
    });

if(process.env.NODE_ENV === 'production') {
    app.use(morgan('combined'));
    app.use(
        helmet({
          contentSecurityPolicy: false,
          crossOriginEmbedderPolicy: false,
          crossOriginResourcePolicy: false,
        }),
      );
    app.use(hpp());
}
else {
    app.use(morgan('dev'));
}

app.use(express.static(path.join(__dirname,'public')));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser(process.env.COOKIE_SECRET));
const sessionOption= {
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    },
    store: new RedisStore({ client: redisClient }),
}
if(process.env.NODE_ENV === 'production') {
    sessionOption.proxy=true;
    //sessionOption.cookie.secure=true;
}
app.use(session(sessionOption));
app.use(
    cors({
      origin: ["http://localhost:5173", "https://boj-quizlet.vercel.app"],
      credentials: true,
    })
);

app.use(passport.initialize());
app.use(passport.session());

update_problems();

app.use('/',api);//api 호출하기
app.use('/img',express.static(path.join(__dirname,'uploads')));//이미지 보기

app.use((req,res,next) => {
    const error=new Error(`${req.method} ${req.url} Router Not Found!`);
    error.status=404;
    logger.error(error.message);
    next(error);
});
app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
    res.status(err.status || 500);
    res.send(err.message);
});

module.exports=app;