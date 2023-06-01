const logger=require('../logger');
const {Op}=require('sequelize');
const {Problem}=require('../models');

exports.howManySolutions=async(req,res,next) => { // 현재까지 해설이 달린 문제 수
    try
    {
        const query='select count(distinct problem_id) as solutions from solutions';
        const info=await sequelize.query(query,{type:QueryTypes.SELECT});
        res.send(info);
    } catch(err) {
        logger.error(err);
        next(err);
    }
}

exports.checkToken=async(req,res,next) => { // 토큰이 유효한지 확인하기
    try
    {//verifyToken을 통해 토큰의 유효성을 확인한다. 만일 별다른 이상이 없다면 반환해준다.
        res.status(200).send("Token is Valid.");
    } catch(err) {
        logger.error(err);
        next(err);
    }
}