const logger=require('../logger');
const {Op}=require('sequelize');
const {Problem}=require('../models');

exports.howManySolutions=async(req,res,next) => { // 현재까지 해설이 달린 문제 수
    try
    {
        const total=await Problem.count({
            where: {
                posts: {[Op.gt]:0},
            },
        });
        const info= {
            "solutions": total,
        };
        res.send(info);
    } catch(err) {
        logger.error(err);
    }
}