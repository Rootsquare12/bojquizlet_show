const express=require('express');
const {findProfile,userRank} = require('../controllers/user');

const router=express.Router();

router.get('/find/:id',findProfile);//유저 id의 정보
router.get('/rank',userRank);//유저 순위

module.exports=router;