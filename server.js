/*const http=require('http');
const https=require('https');
const app = require('./app');
const fs=require('fs');

http.createServer(app).listen(3000);

if(process.env.NODE_ENV === 'production') {
  const options = { // letsencrypt로 받은 인증서 경로를 입력
    ca: fs.readFileSync('/etc/letsencrypt/live/bojquizlet-database.com/fullchain.pem'),
    key: fs.readFileSync('/etc/letsencrypt/live/bojquizlet-database.com/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/bojquizlet-database.com/cert.pem')
  };
  https.createServer(options, app).listen(443);
}*/
const app = require('./app');

app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기중');
});