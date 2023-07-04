/*문제 검색하기*/
const logger=require('../logger');
const {Op,QueryTypes}=require('sequelize');
const {Problem,sequelize}=require('../models');

exports.searchProblem=async (req,res,next) => { // 특정 레벨의 문제 가져오기
    try
    {
        const input=req.query.query;//이 번호의 문제 또는 이 문자열이 들어간 문제
        input=input.toLowerCase();//소문자화
        const query="with target as (select problem_id,problem_name from problems where (problem_id=INPUT or lower(problem_name) like '%INPUT%')) select target.problem_id,target.problem_name,count(id) as solutions from target left outer join solutions on target.problem_id=solutions.problem_id group by problem_id,problem_name order by problem_id ASC";
        query=query.replace('INPUT',input);
        query=query.replace('INPUT',input);
        const result=await sequelize.query(query,{type:QueryTypes.SELECT,replacements:[id]});
        res.send(result);
    } catch(err) {
        logger.error(err);
        next(err);
    }
}