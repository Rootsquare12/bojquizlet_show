const express=require('express');
const {howManySolutions,checkToken} = require('../controllers/main');
const {verifyToken}=require('../middlewares');

const router=express.Router();

router.get('/',howManySolutions);//메인 화면
router.get('/jwt',verifyToken,checkToken);//JWT 토큰 유효성 확인

module.exports=router;