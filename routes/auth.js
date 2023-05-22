const express=require('express');
const {newUser,loginProcess} = require('../controllers/auth');
const {verifyOrigin}=require('../middlewares');

const router=express.Router();

router.post('/join',verifyOrigin,newUser);//회원가입하기
router.post('/login',verifyOrigin,loginProcess);//로그인하기

module.exports=router;