const express=require('express');
const {newUser,loginProcess} = require('../controllers/auth');

const router=express.Router();

router.post('/join',newUser);//회원가입하기
router.post('/login',loginProcess);//로그인하기

module.exports=router;