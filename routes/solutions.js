const express=require('express');
const {renderSolutions,renderCertainSolution,writeSolution,updateSolution,uploadPictures,solutionLiked,toggleLike,deleteSolution} = require('../controllers/solutions');//해설 관련
const {verifyToken}=require('../middlewares');
const router=express.Router();
const multer=require('multer');
const fs=require('fs');

try {
    fs.readdirSync('uploads');
} catch (error) {
    console.error('Creating Upload File.');
    fs.mkdirSync('uploads');
}
  
const image_upload = multer({
  storage: multer.diskStorage({
     destination(req, file, cb) {
       cb(null, 'uploads/');
     },
     filename(req, file, cb) {
       const ext = path.extname(file.originalname);
       cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
     },
   }),
   limits: { fileSize: 5 * 1024 * 1024 },
});
const solution_upload=multer();

router.post('/img',verifyToken,image_upload.single('img'),uploadPictures);//그림 파일 올리기

router.get('/find/:id',renderSolutions);//id 문제의 해설들 가져오기
router.get('/find/:id/:user',verifyToken,renderCertainSolution);//id 문제의 특정 해설 가져오기
router.get('/find/:id/:user/check_like',verifyToken,solutionLiked);//현재 유저가 현재 보고 있는 해설에 좋아요를 표시했는지 확인하기
router.put('/find/:id/:user/toggle_like',verifyToken,toggleLike);//id 문제의 특정 해설에 좋아요 표시하기
router.post('/write/:id',verifyToken,solution_upload.none(),writeSolution);//새로운 해설 쓰기
router.put('/update/:id',verifyToken,solution_upload.none(),updateSolution);//특정 해설 수정하기
router.delete('/delete/:id',verifyToken,deleteSolution);//유저가 특정 문제에 쓴 본인의 해설 삭제하기

module.exports=router;