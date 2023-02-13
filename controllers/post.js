/*글 올리기 기능(TODO)*/
const { Solution } = require('../models');

exports.afterUploadImage = (req, res) => {
  console.log(req.file);
  res.json({ url: `/file/${req.file.filename}` });
};

exports.uploadSolution = async (req, res, next) => {
  try {
    const solution = await Post.create({
      content: req.body.content,
      file: req.body.url,
      nickname: req.user.id,
    });
    res.redirect('/');
  } catch (error) {
    console.error(error);
    next(error);
  }
};