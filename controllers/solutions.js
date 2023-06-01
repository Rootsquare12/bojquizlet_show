/*해설 관련 정보*/
const logger=require('../logger');
const {QueryTypes}=require('sequelize');
const {User,Problem,Solution,sequelize}=require('../models');
const db=require('../models');
const sanitizeHtml=require('sanitize-html');

exports.renderSolutions=async (req,res,next) => { // 특정 문제의 해설들을 가져오기
    try
    {
        const id=req.params.id; //수정하기
        const query='select nickname,count(user) as likes from (users inner join solutions on users.id=writer) left outer join like_table as l on solutions.id=l.solution where problem_id=? group by nickname order by likes DESC';
        const result=await sequelize.query(query,{type:QueryTypes.SELECT,replacements:[id]});
        res.status(200).send(result);
    } catch(err) {
        logger.error(err);
        next(err);
    }
}

exports.renderCertainSolution=async (req,res,next) => { // 특정 문제의 특정 해설만 가져오기
    try
    {
        const id=req.params.id;
        const user=req.params.user;
        const exist=await User.findOne({//해당 유저가 있는지 확인한다.
            raw:true,
            where:{nickname:user}
        });
        if(exist)
        {//유저가 존재한다면 그 유저가 이 문제에 쓴 해설을 갖고온다.
            const user_id=exist.id;
            const info=await Solution.findOne({
                where: {
                    problem_id: id,
                    writer: user_id,
                },
            });
            if(info)
            {
                res.send(info);
            }
            else
            {
                res.status(404).send("No Solution Found.");
            }
        }
        else
        {//유저 이름이 잘못된 경우
            res.status(404).send("User Not found.");
        }
    } catch(err) {
        logger.error(err);
        next(err);
    }
}

exports.writeSolution=async (req,res,next) => { // 특정 문제에 풀이 작성하기
    try
    {
        const id=req.params.id;
        const user_id=req.decoded.user_id;//유저가 가진 jwt토큰을 해독했을때, 나온 아이디
        const user=await User.findOne({
            where: {
                id:user_id,
            },
        });
        if(user)
        {
            const problem=await Problem.findOne({
                where: {//문제번호 id인 문제가 있는지 확인한다.
                    problem_id:id,
                },
            });
            if(problem)
            {//유저와 문제 번호가 모두 올바를 경우 풀이를 작성한다.
                const content=req.body.solution;
                await Solution.create({
                    content: content,
                    source_code: req.body.code,
                    language: req.body.language,
                    writer: user_id,
                    problem_id: id,
                });
                res.send("Solution Written Successfully.");
            }
            else
            {//없는 문제라면
              res.status(404).send("Problem Not Found.");
            }
        }
        else
        {//없는 사람이라면
             res.status(404).send("User Not Found.");
        }
    } catch(err) {
        logger.error(err);
        next(err);
    }
}

exports.updateSolution=async (req,res,next) => { //특정 풀이 수정하기
    try
    {
        const id=req.params.id;
        const user_id=req.decoded.user_id;//유저가 가진 jwt토큰을 해독했을때, 나온 아이디
        const user=await User.findOne({
            where: {
                id:user_id,
            },
        });
        if(user)
        {
            const problem=await Problem.findOne({
                where: {
                    problem_id:id,
                },
            });
            if(problem)
            {//유저와 문제 번호가 모두 올바를 경우, 현 유저가 기존에 쓴 풀이를 찾는다.
                const exSolution=await Solution.findOne({
                    where: {
                        writer:user_id,
                        problem_id:id,
                    }
                });
                if(exSolution)
                {//그런 풀이가 존재한다면 수정한다.
                    const content=req.body.solution;
                    await Solution.update({
                        content:content,
                        source_code:req.body.code,
                        language: req.body.language,
                    },{
                        where:{writer:user_id,problem_id:id},
                    });
                    res.send("Solution Updated Successfully.");
                }
                else
                {//그런 풀이가 없는 경우
                    res.status(404).send("Solution Not Found.");
                }
            }
            else
            {//없는 문제라면
                res.status(404).send("Problem Not Found.");
            }
        }
        else
        {//없는 사람이라면
            res.status(404).send("User Not Found.");
        }
    } catch(err) {
        logger.error(err);
        next(err);
    }
}

exports.uploadPictures=async (req,res,next) => { //그림 파일 저장하기
    try
    {
        res.json({ url: req.file.location });
    } catch(err) {
        logger.error("Error occured while Uploading image.");
        next(err);
    }
}

exports.solutionLiked=async (req,res,next) => { //유저가 현재 보고 있는 풀이에 좋아요를 눌렀는지 확인하기
    try
    {
        const problem_id=req.params.id;//문제 번호
        const writer=req.params.user;//풀이를 쓴 사람
        const user_id=req.decoded.user_id;//좋아요를 누르는 사람
        const exist=await User.findOne({//해당 유저가 있는지 확인한다.
            raw:true,
            where:{nickname:writer}
        });
        if(exist)
        {//글 쓴 사람이 실제로 있는 사람이라면
            const writer_id=exist.id;
            const solution=await Solution.findOne({
                raw: true,
                where: {//우선 그러한 풀이가 있는지 찾는다.
                    writer:writer_id,
                    problem_id:problem_id,
                }
            });
            if(solution)
            {//해당 풀이가 존재하는 경우
                const table=db.sequelize.models.like_table;
                solution_id=solution.id;
                const already_liked=await table.findOne({
                    where: {//이 사람이 이 게시글에 좋아요를 이미 눌렀는지
                        user:user_id,
                        solution:solution_id,
                    }
                })
                if(already_liked)
                {//좋아요를 이미 한 상태
                    res.status(200).send("True");
                }
                else
                {//좋아요를 하지 않은 상태
                    res.status(200).send("False");
                }
            }
            else
            {//존재하지 않는 경우
                res.status(404).send("No such solution.")
            }
        }
        else
        {//글쓴사람 이름이 잘못된 경우
            res.status(404).send("No such user.");
        }
    } catch(err) {
        logger.error(err);
        next(err);
    }
}

exports.toggleLike=async (req,res,next) => { //좋아요 표시하기
    try
    {
        const problem_id=req.params.id;//문제 번호
        const writer=req.params.user;//풀이를 쓴 사람
        const user_id=req.decoded.user_id;//좋아요를 누르는 사람
        const exist=await User.findOne({//해당 유저가 있는지 확인한다.
            raw:true,
            where:{nickname:writer}
        });
        if(exist)
        {//글 쓴 사람이 실제로 있는 사람이라면
            const writer_id=exist.id;
            const solution=await Solution.findOne({
                raw: true,
                where: {//우선 그러한 풀이가 있는지 찾는다.
                    writer:writer_id,
                    problem_id:problem_id,
                }
            });
            if(solution)
            {//해당 풀이가 존재하는 경우
                const table=db.sequelize.models.like_table;
                solution_id=solution.id;
                const already_liked=await table.findOne({
                    where: {//이 사람이 이 게시글에 좋아요를 이미 눌렀는지
                        user:user_id,
                        solution:solution_id,
                    }
                })
                if(already_liked)
                {//이 경우 좋아요를 뺀다.
                    table.destroy({//좋아요 테이블에서 해당 정보를 제거한다.
                        where: {
                            user:user_id,
                            solution:solution_id,
                        }
                    })
                    res.send("Like removed.");
                }
                else
                {//이 경우 좋아요를 누른다.
                    table.create({//좋아요 테이블에 해당 정보를 등록한다.
                        user:user_id,
                        solution:solution_id,
                    })
                    res.send("Like added.");
                }
            }
            else
            {//존재하지 않는 경우
                res.status(404).send("No such solution.")
            }
        }
        else
        {//글쓴사람 이름이 잘못된 경우
            res.status(404).send("No such user.");
        }
    } catch(err) {
        logger.error(err);
        next(err);
    }
}

exports.deleteSolution=async (req,res,next) => { //풀이 삭제하기
    try
    {
        const problem_id=req.params.id;//문제 번호
        const user_id=req.decoded.user_id;//좋아요를 누르는 사람
        const solution=await Solution.findOne({
            raw: true,
            where: {//우선 그러한 풀이가 있는지 찾는다.
                writer:user_id,
                problem_id:problem_id,
            }
        });
        if(solution)
        {//해당 풀이가 존재하는 경우
            const solution_id=solution.id;//해설 일련번호
            const table=db.sequelize.models.like_table;
            table.destroy({
                where: {solution: solution_id},
            });
            Solution.destroy({
                where:{
                    writer:user_id,
                    problem_id:problem_id,
                },
            })
            res.status(200).send("Solution Deleted Successful.");
        }
        else
        {
            res.status(404).send("Solution not found.")
        }
    } catch(err) {
        logger.error(err);
        next(err);
    }
}