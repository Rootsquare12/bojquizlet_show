/*해설 관련 정보*/

const {Solution}=require('../models');
exports.renderSolutions=async (req,res,next) => { // 특정 문제의 해설들을 가져오기
    try
    {
        const id=req.params.id;
        /*const info=await Solution.findAll({
            where: {
                problem_id: id,
            },
        });*/
        const info=await Solution.findAll({});
        res.send(info);
    } catch(err) {
        console.error(err);
    }
}

exports.renderCertainSolution=async (req,res,next) => { // 특정 문제의 특정 해설만 가져오기
    try
    {
        const id=req.params.id;
        const code=req.params.code;
        const info=await Solution.findAll({
            where: {
                problem_id: id,
                code: code,
            },
        });
        res.send(info);
    } catch(err) {
        console.error(err);
    }
}

exports.writeSolution=async (req,res,next) => { // 특정 문제에 풀이 작성하기
    try
    {
        const id=req.params.id;
        res.send(id+"번 문제의 풀이를 작성하는 창을 띄워주세요.");
    } catch(err) {
        console.error(err);
    }
}