const {Op}=require('sequelize');
const {Problem}=require('../models');
exports.callCertainProblem=async (req,res,next) => { // 문제 레벨별로 정리하기
    try
    {
        const level=req.params.id;
        const info=await Problem.findAll({
            where: {
                problem_difficulty: level,
            },
        });
        res.send(info);
    } catch(err) {
        console.error(err);
    }
}
exports.callAllProblem=async (req,res,next) => { // 모든 문제 가져오기
    try
    {
        let data=[];
        for(let i=0; i<=30; i++)
        {
            const total=await Problem.count({ // 총 문제 수
                where: {
                    problem_difficulty: i,
                },
            });
            const has_solution=await Problem.count({ // 해설이 존재하는 문제 수
                where: {
                    problem_difficulty: i,
                    posts: {[Op.gt]: 0},
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
        console.error(err);
    }
}