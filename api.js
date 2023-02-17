const express=require('express');
const {findProfile} = require('./controllers/user');//유저 관련
const {howManySolutions,callAllProblem,callCertainProblem} = require('./controllers/problems');//문제 관련
const {renderSolutions,renderCertainSolution,writeSolution} = require('./controllers/solutions');//해설 관련
const {uploadSolution} = require('./controllers/post');//해설 관련

const router=express.Router();

router.get('/',howManySolutions);//메인 화면

router.get('/user/:id',findProfile);//유저 id의 정보

router.get('/problems/level',callAllProblem);//레벨이 id인 문제들을 가져오기
router.get('/problems/level/:id',callCertainProblem);//레벨이 id인 문제들을 가져오기

router.get('/solutions/:id',renderSolutions);//id 문제의 해설들 가져오기
router.get('/solutions/:id/write',writeSolution);//id 문제의 해설 쓰기
router.get('/solutions/:id/:code',renderCertainSolution);//id 문제의 특정 해설 가져오기
router.post('/upload/:user/:id',uploadSolution);//풀이 올리기
module.exports=router;