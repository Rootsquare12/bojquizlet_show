const http=require('http');
const https=require('https');
const app = require('./app');
const fs=require('fs');

/*const options = { // letsencrypt로 받은 인증서 경로를 입력
  ca: fs.readFileSync('/opt/bitnami/apache/conf/bitnami/certs/server.crt'),
  key: fs.readFileSync('/opt/bitnami/apache/conf/bitnami/certs/server.key'),
  cert: fs.readFileSync('/opt/bitnami/apache/conf/bitnami/certs/server.crt')
};*/

http.createServer(app).listen(3000);
//https.createServer(options, app).listen(443);