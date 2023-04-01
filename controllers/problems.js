/*문제와 관련한 정보*/
const logger=require('../logger');
const {Op}=require('sequelize');
const {Problem}=require('../models');

exports.callCertainProblem=async (req,res,next) => { // 특정 레벨의 문제 가져오기
    try
    {
        const level=req.params.id;
        const key=req.query.key;//정렬 기준
        const way=req.query.way;//정렬 방향
        if((key=='posts' || key=='problem_id' || key=='problem_name') && (way=='ASC' || way=='DESC'))
        {
            const info=await Problem.findAll({
                attributes:['problem_id','problem_name','posts'],
                where: {
                    problem_difficulty: level,
                },
                order:[//정렬하기
                    [key,way],
                ]
            });
            res.send(info);
        }
        else
        {
            res.status(404).send("Invalid Body Input.");
        }
    } catch(err) {
        logger.error(err);
    }
}
exports.callAllProblem=async (req,res,next) => { // 모든 문제 가져오기
    try
    {
        let data=[];
        for(let i=0; i<=30; i++)
        {//난이도별 문제 수 및 해설이 달린 문제 수
            const total=await Problem.count({
                where: {
                    problem_difficulty: i,
                },
            });
            const has_solution=await Problem.count({
                where: {
                    problem_difficulty: i,
                    posts: {[Op.gt]:0},
                },
            });
            const info= {
                "problem_difficulty": i,
                "total": total,
                "has_solution": has_solution
            };
            data.push(info);
        }
        res.send(data);
    } catch(err) {
        logger.error(err);
    }
}

exports.getProblemName=async (req,res,next) => {//특정 번호 문제의 이름만 가져오기
    try
    {
        const id=req.params.id;
        const info=await Problem.findOne({
            attributes:['problem_name'],
            where: {
                problem_id: id,
            },
        });
        if(info)
        {
            res.send(info);
        }
        else
        {
            res.status(404).send("No such problem.");
        }
        res.send(data);
    } catch(err) {
        logger.error(err);
    }
}