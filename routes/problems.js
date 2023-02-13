const express=require('express');
const {isLoggedIn,isNotLoggedIn} = require('../middlewares');
const {callCertainProblem} = require('../controllers/problems');

const router=express.Router();

router.get('/level/:id',callCertainProblem);//특정 레벨의 문제들 불러오기
module.exports=router;