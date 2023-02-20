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
            res.status(404).send("해설을 찾을 수 없습니다.");
        }
    } catch(err) {
        console.error(err);
    }
}

exports.writeSolution=async (req,res,next) => { // 특정 문제에 풀이 작성하기
    try
    {
        const id=req.params.id;
        const user=req.params.user;
        const data=await Solution.create({
            content: req.body.solution,
            source_code: req.body.code,
            nickname: user,
            problem_id: id,
        });
        res.send('풀이가 정상적으로 등록되었습니다.');
    } catch(err) {
        console.error(err);
    }
}

exports.uploadPictures=async (req,res,next) => { // 그림 파일 저장하기
    try
    {
        const IMG_URL = `/img/${req.file.filename}`;
        res.json({ url: IMG_URL });
    } catch(err) {
        console.error(err);
    }
}