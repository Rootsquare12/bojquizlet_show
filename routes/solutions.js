const express=require('express');
const {isLoggedIn,isNotLoggedIn} = require('../middlewares');
const {renderSolutions,renderCertainSolution,writeSolution} = require('../controllers/solutions');

const router=express.Router();

router.get('/:id',renderSolutions);//id 문제의 해설들 가져오기
router.get('/:id/write',writeSolution);//id 문제의 해설 쓰기
router.get('/:id/:code',renderCertainSolution);//id 문제의 특정 해설 가져오기
module.exports=router;