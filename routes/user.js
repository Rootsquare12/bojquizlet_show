const express=require('express');
const {findProfile,userRank,verifyEmail,checkEmail} = require('../controllers/user');
const {verifyToken}=require('../middlewares');

const router=express.Router();

router.get('/find/:id',findProfile);//유저 id의 정보
router.get('/rank',userRank);//유저 순위
router.post('/send_email',verifyToken,verifyEmail);//유저 인증 메일 보내기
router.post('/check_email',verifyToken,checkEmail);//유저 인증 메일 보내기

module.exports=router;