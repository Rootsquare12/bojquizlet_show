/*유저 관련 정보*/
const logger=require('../logger');
const {QueryTypes}=require('sequelize');
const {User,Solution,Problem,sequelize}=require('../models');

exports.findProfile=async (req,res,next) => {
    try
    {//유저 정보 가져오기
        const name=req.params.id;
        const query_1='select u.id,nickname,count(distinct s.id) as wrote,count(l.user) as likes from (users as u left outer join solutions as s on u.id=writer) left outer join like_table as l on s.id=l.solution where nickname=?';
        const info=await sequelize.query(query_1,{raw:true,type:QueryTypes.SELECT,replacements:[name]});
        if(info)
        {//유저가 존재한다면 그 유저가 풀이를 쓴 문제들의 번호 가져오기
            const profile=info[0];
            const user_id=profile.id;
            const query_2='select p.problem_id,problem_name,count(user) as likes from (problems as p inner join solutions as s on p.problem_id=s.problem_id) left outer join like_table as l on s.id=l.solution  where writer=? group by p.problem_id,problem_name order by p.problem_id ASC';
            const wrote=await sequelize.query(query_2,{type:QueryTypes.SELECT,replacements:[user_id]});
            const total={profile,wrote};
            res.status(200).send(total);
        }
        else
        {
            res.status(404).send("User Not Found.");
        }
    } catch(err) {
        console.error(err);
        next(err);
    }
}

exports.userRank=async (req,res,next) => { // 유저 순위
    try
    {
        const key=req.query.key;//정렬 기준
        const way=req.query.way;//정렬 방향
        if((key=='wrote' || key=='likes') && (way=='ASC' || way=='DESC'))
        {
            let query='select nickname,count(distinct s.id) as wrote,count(l.user) as likes from (users as u left outer join solutions as s on u.id=writer) left outer join like_table as l on s.id=l.solution group by nickname order by key way';
            query=query.replace('key',key);
            query=query.replace('way',way);
            const result=await sequelize.query(query,{type:QueryTypes.SELECT});
            res.send(result);
        }
        else
        {
            res.status(404).send("Invalid Body Input.");
        }
    } catch(err) {
        logger.error(err);
        next(err);
    }
}