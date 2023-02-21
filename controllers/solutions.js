/*해설 관련 정보*/
const logger=require('../logger');
const {User,Problem,Solution}=require('../models');
exports.renderSolutions=async (req,res,next) => { // 특정 문제의 해설들을 가져오기
    try
    {
        const id=req.params.id;
        const info=await Solution.findAll({
            where: {
                problem_id: id,
            },
        });
        res.send(info);
    } catch(err) {
        logger.error(err);
    }
}

exports.renderCertainSolution=async (req,res,next) => { // 특정 문제의 특정 해설만 가져오기 : 여기도 수정해야 합니다.
    try
    {
        const id=req.params.id;
        const user=req.params.user;
        const info=await Solution.findAll({
            where: {
                problem_id: id,
                writer: user,
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
    } catch(err) {
        logger.error(err);
    }
}

exports.writeSolution=async (req,res,next) => { // 특정 문제에 풀이 작성하기
    try
    {
        const id=req.params.id;
        const user_id=req.params.user;
        const user=await User.findOne({
            where: {
                nickname:user_id,
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
            {//유저와 문제 번호가 모두 올바를 경우 풀이를 작성한다.
                const data=await Solution.create({
                  content: req.body.solution,
                  source_code: req.body.code,
                  writer: user_id,
                  problem_id: id,
                  likes: 0,
                });
                User.increment('wrote', { by: 1, where: { nickname:user_id}});
                Problem.increment('posts', { by: 1, where: { problem_id:id}});
                logger.info(user+" has wrote solution at problem "+id+".");
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

exports.uploadPictures=async (req,res,next) => { // 그림 파일 저장하기
    const IMG_URL = `/img/${req.file.filename}`;
    logger.info(IMG_URL);
    res.json({ url: IMG_URL });
}