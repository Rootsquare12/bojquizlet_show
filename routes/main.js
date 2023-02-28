const express=require('express');
const {howManySolutions} = require('../controllers/main');

const router=express.Router();

router.get('/',howManySolutions);//메인 화면

module.exports=router;