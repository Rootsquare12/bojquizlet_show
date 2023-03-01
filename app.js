const express=require('express');
const cors=require('cors');
const path=require('path');
const axios=require('axios');
const morgan=require('morgan');
const cookieParser=require('cookie-parser');
const dotenv=require('dotenv');
const passport=require('passport');
const {sequelize}=require('./models');
const passportConfig=require('./passport');

const main=require('./routes/main');
const user=require('./routes/user');
const problems=require('./routes/problems');
const solutions=require('./routes/solutions');
const jwt=require('./routes/jwt_check');

const { authorize } = require('passport');
const helmet=require('helmet');
const hpp=require('hpp');
const logger=require('./logger');

const update_problems=require('./get_data');
const { update } = require('./models/user');

dotenv.config();

const app=express();
const whitelist=["http://localhost:3000","http://localhost:5173","https://localhost:5173","https://boj-quizlet.vercel.app"];

const corsOptions = (req, res, next) => { 
    res.header('Access-Control-Allow-Origin', '*'); 
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 
    'Content-Type, Authorization, Content-Length, X-Requested-With');
    next();
}
//app.use(corsOptions);

app.set('port',process.env.PORT || 3000); // 포트 설정
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

//update_problems();

app.use('/',main);//메인 화면
app.use('/user',user);//유저 정보
app.use('/problems',problems);//문제 정보
app.use('/solutions',solutions);//해설 정보
app.use('/jwt',jwt);//jwt 토큰 인증하기
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