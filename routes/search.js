const express=require('express');
const {searchProblem} = require('../controllers/search');//

const router=express.Router();

router.get('/',searchProblem);//문제 검색하기

module.exports=router;