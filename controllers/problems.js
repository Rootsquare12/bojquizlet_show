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
        let t_cnt=new Array(31).fill(0); //난이도별 총 문제수
        let s_cnt=new Array(31).fill(0); //난이도별 해설이 달린 문제 수
        const problems=await Problem.findAll({} );
        const cnt=problems.length;
        for(let i=0; i<cnt; i++)
        {//각 문제별로 난이도 및 해설 존재 여부 확인
            const now=problems[i];
            const info=JSON.parse(JSON.stringify(now));
            const dif=info.problem_difficulty;
            const has_solution=info.posts;
            t_cnt[dif]+=1;
            if(has_solution>0)
            {
                c_cnt[dif]+=1;
            }
        }
        for(let i=0; i<=30; i++)
        {//모아진 데이터로 json 데이터 만들기
            const info= {
                "problem_difficulty": i,
                "total": t_cnt[i],
                "has_solution": s_cnt[i]
            };
            data.push(info);
        }
        res.send(data);
    } catch(err) {
        console.error(err);
    }
}