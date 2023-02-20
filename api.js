const express=require('express');
const multer=require('multer');
const fs=require('fs');
const {findProfile} = require('./controllers/user');//유저 관련
const {howManySolutions,callAllProblem,callCertainProblem,getProblemName} = require('./controllers/problems');//문제 관련
const {renderSolutions,renderCertainSolution,writeSolution,uploadPictures} = require('./controllers/solutions');//해설 관련
const {uploadSolution} = require('./controllers/post');//해설 관련

const router=express.Router();

try {
    fs.readdirSync('uploads');
  } catch (error) {
    console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
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
   limits: { fileSize: 10 * 1024 * 1024 },
});
const solution_upload=multer();

router.get('/',howManySolutions);//메인 화면

router.get('/user/:id',findProfile);//유저 id의 정보

router.get('/problems/level',callAllProblem);//레벨이 id인 문제들을 가져오기
router.get('/problems/level/:id',callCertainProblem);//레벨이 id인 문제들을 가져오기
router.get('/problems/name/:id',getProblemName);//id 번오 문제의 제목 가져오기

router.post('/img',image_upload.array('img'),uploadPictures);//그림 파일 올리기
router.get('/solutions/:id',renderSolutions);//id 문제의 해설들 가져오기
router.post('/solutions/:id/write/:user',solution_upload.none(),writeSolution);//id 문제의 해설 쓰기
router.get('/solutions/:id/:user',renderCertainSolution);//id 문제의 특정 해설 가져오기
module.exports=router;