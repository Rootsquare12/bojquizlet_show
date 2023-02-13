const express=require('express');
const {isLoggedIn,isNotLoggedIn} = require('../middlewares');
const {renderMain,renderProfile,renderJoin,renderProblem} = require('../controllers/page');

const router=express.Router();

router.use((req,res,next) => {
    res.locals.user=req.user;
    next();
});
router.get('/',renderMain);//메인 화면
router.get('/join',isNotLoggedIn,renderJoin);
module.exports=router;