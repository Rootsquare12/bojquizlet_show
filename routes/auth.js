const express=require('express');
const {newUser} = require('../controllers/auth');

const router=express.Router();

router.post('/join',newUser);//유저 id의 정보

module.exports=router;