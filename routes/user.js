const express=require('express');
const {findProfile} = require('../controllers/user');

const router=express.Router();

router.get('/:id',findProfile);//유저 id의 정보

module.exports=router;