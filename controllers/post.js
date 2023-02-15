/*글 올리기 기능(TODO)*/
const {Problem}=require('../models');
const {Solution} = require('../models');

exports.afterUploadImage = (req, res) => {
  console.log(req.file);
  res.json({ url: `/file/${req.file.filename}` });
};

exports.uploadSolution = async (req, res, next) => {
  try
  {
    const user=req.params.user;
    const id=req.params.id;
    const solution = await Solution.create({
      content: "Hello World!",
      //file: req.body.url,
      nickname: user,
      problem_id: id,
    });
    const result=await Problem.update({
      posts:sequelize.literal('posts+1')
    },{
      where: {problem_id: id},
    });
    res.send(solution);
  } catch (error) {
    console.error(error);
    next(error);
  }
};