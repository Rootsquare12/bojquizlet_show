const express=require('express');
const {renderSolutions,renderCertainSolution,writeSolution,updateSolution,uploadPictures} = require('../controllers/solutions');//해설 관련
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

router.post('/img',image_upload.single('img'),uploadPictures);//그림 파일 올리기

router.get('/:id',verifyToken,renderSolutions);//id 문제의 해설들 가져오기
router.post('/:id/write',verifyToken,solution_upload.none(),writeSolution);//새로운 해설 쓰기
router.put('/:id/update',verifyToken,solution_upload.none(),updateSolution);//특정 해설 수정하기
router.get('/:id/:user',renderCertainSolution);//id 문제의 특정 해설 가져오기
//router.delete('/:id/write/:user/delete',deleteSolution);//해설 삭제하기

module.exports=router;