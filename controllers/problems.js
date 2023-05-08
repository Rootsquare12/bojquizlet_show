/*문제와 관련한 정보*/
const logger=require('../logger');
const {QueryTypes}=require('sequelize');
const {Problem, sequelize}=require('../models');

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
    {//여기부터
        const query='select problem_difficulty,count(distinct p.problem_id) as total,count(distinct s.problem_id) as has_solution from problems as p left outer join solutions as s on p.problem_id=s.problem_id group by problem_difficulty order by problem_difficulty';
        const result=await sequelize.query(query,{type:QueryTypes.SELECT});
        res.send(result);
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