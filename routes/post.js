/*아직 개발 중인 곳이다. 풀이를 작성한 것을 DB에 저장하는 곳.*/

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { afterUploadFile, uploadSolution } = require('../controllers/post'); //파일 경로지정, 글올리기
const { isLoggedIn } = require('../middlewares');

const router = express.Router();

try {//파일을 서버에 저장하는 폴더를 만든다.
  fs.readdirSync('uploads');
} catch (error) {
  console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
  fs.mkdirSync('uploads');
}

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) { //파일 저징 위치
      cb(null, 'uploads/');
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname); // 파일 이름
      cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },//용량 제한
});

// POST /post/img
router.post('/img', isLoggedIn, upload.array('many'), afterUploadFile);

// POST /post
const upload2 = multer();
router.post('/', isLoggedIn, upload2.none(), uploadSolution);

module.exports = router;