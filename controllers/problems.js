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
exports.callAllProblem=async (req,res,next) => { // 모든 문제 가져오기(todo)
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