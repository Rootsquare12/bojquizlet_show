/*해설 관련 정보*/

const {Solution}=require('../models');
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

exports.renderCertainSolution=async (req,res,next) => { // 특정 문제의 특정 해설만 가져오기
    try
    {
        const id=req.params.id;
        const user=req.params.user;
        const info=await Solution.findAll({
            where: {
                problem_id: id,
                nickname: user,
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
        const user=req.params.user;
        logger.info(id);
        logger.info(user);
        const data=await Solution.create({
            content: req.body.solution,
            source_code: req.body.code,
            nickname: user,
            problem_id: id,
        });
        logger.info("Yahoo");
        res.send("Thank You!");
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