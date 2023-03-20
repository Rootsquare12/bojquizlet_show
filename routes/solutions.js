const express=require('express');
const multer = require('multer');
const fs=require('fs');
const path=require('path');
const {renderSolutions,renderCertainSolution,writeSolution,updateSolution,uploadPictures,solutionLiked,toggleLike,deleteSolution} = require('../controllers/solutions');//해설 관련
const {verifyToken}=require('../middlewares');
const router=express.Router();
const { S3Client } = require('@aws-sdk/client-s3');
const multerS3 = require('multer-s3');

try {
    fs.readdirSync('uploads');
} catch (error) {
    console.error('Creating Upload File.');
    fs.mkdirSync('uploads');
}

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },
  region: 'ap-northeast-2',
});

const image_upload = multer({
  storage: multerS3({
    s3,
    bucket: 'bojquizlet-pictures',
    key(req, file, cb) {
      cb(null, `original/${Date.now()}_${file.originalname}`);
    },
  }),
   limits: { fileSize: 2 * 1024 * 1024 },
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