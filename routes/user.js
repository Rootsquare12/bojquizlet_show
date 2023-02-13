const express=require('express');
const {isLoggedIn,isNotLoggedIn} = require('../middlewares');
const {renderProfile} = require('../controllers/user');

const router=express.Router();

router.get('/:id',renderProfile);//메인 화면
module.exports=router;