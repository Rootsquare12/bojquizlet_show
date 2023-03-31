const express=require('express');
const {callAllProblem,callCertainProblem,getProblemName} = require('../controllers/problems');//문제 관련

const router=express.Router();

router.get('/level',callAllProblem);//레벨이 id인 문제들을 가져오기
router.get('/level/:id',callCertainProblem);//레벨이 id인 문제들을 가져오기

module.exports=router;