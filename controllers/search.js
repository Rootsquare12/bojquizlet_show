/*문제 검색하기*/
const logger=require('../logger');
const {Op}=require('sequelize');
const {Problem}=require('../models');

exports.searchProblem=async (req,res,next) => { // 특정 레벨의 문제 가져오기
    try
    {
        const input=req.query.query;//이 번호의 문제 또는 이 문자열이 들어간 문제
        const info=await Problem.findAll({
            where: {
                [Op.or]:[{problem_id:input},{problem_name:{[Op.like]:"%"+input+"%"}}],
            },
            order:[//문제 번호 순
                ['problem_id','ASC'],
            ]
        });
        res.send(info);
    } catch(err) {
        logger.error(err);
        next(err);
    }
}