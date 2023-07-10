/*유저 관련 정보*/
const nodemailer = require('nodemailer');

const logger=require('../logger');
const {QueryTypes}=require('sequelize');
const {User,Solution,Problem,sequelize}=require('../models');
//const {smtpTransport} = require('../config/email');

const smtpTransport = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    host: process.env.EMAIL_HOST,  // SMTP 서버명
	port: process.env.EMAIL_PORT,  // SMTP 포트
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    },
});

exports.findProfile=async (req,res,next) => {
    try
    {//유저 정보 가져오기
        const name=req.params.id;
        const query_1='select u.id,nickname,count(distinct s.id) as wrote,count(l.user) as likes from (users as u left outer join solutions as s on u.id=writer) left outer join like_table as l on s.id=l.solution where nickname=?';
        const info=await sequelize.query(query_1,{raw:true,type:QueryTypes.SELECT,replacements:[name]});
        if(info)
        {//유저가 존재한다면 그 유저가 풀이를 쓴 문제들의 번호 가져오기
            const profile=info[0];
            const user_id=profile.id;
            const query_2='select p.problem_id,problem_name,count(user) as likes from (problems as p inner join solutions as s on p.problem_id=s.problem_id) left outer join like_table as l on s.id=l.solution  where writer=? group by p.problem_id,problem_name order by p.problem_id ASC';
            const wrote=await sequelize.query(query_2,{type:QueryTypes.SELECT,replacements:[user_id]});
            const total={profile,wrote};
            res.status(200).send(total);
        }
        else
        {
            res.status(404).send("User Not Found.");
        }
    } catch(err) {
        console.error(err);
        next(err);
    }
}

exports.userRank=async (req,res,next) => { // 유저 순위
    try
    {
        const key=req.query.key;//정렬 기준
        const way=req.query.way;//정렬 방향
        if((key=='wrote' || key=='likes') && (way=='ASC' || way=='DESC'))
        {
            let query='select nickname,count(distinct s.id) as wrote,count(l.user) as likes from (users as u left outer join solutions as s on u.id=writer) left outer join like_table as l on s.id=l.solution group by nickname order by key way';
            query=query.replace('key',key);
            query=query.replace('way',way);
            const result=await sequelize.query(query,{type:QueryTypes.SELECT});
            res.send(result);
        }
        else
        {
            res.status(404).send("Invalid Body Input.");
        }
    } catch(err) {
        logger.error(err);
        next(err);
    }
}
exports.verifyEmail=async (req,res,next) => {//유저에게 이메일 인증용 메일을 보낸다.
    try
    {
        const target_user=req.decoded.user_id;
        const target_email=req.body.email;//목표 대상
        const random_number = Math.floor(Math.random() * 888888) + 111111;//6자리 난수
        const email_information={
            from: process.env.EMAIL_USER,
            to: target_email,
            subject: '[SOLUT] 인증번호 알림',
            text: `아래 인증번호를 확인하여 이메일 주소 인증을 완료해 주세요.\n
            연락처 이메일 : ${target_email}\n
            인증번호 6자리 : ${random_number}\n\n
            이메일 인증이 완료된 이후 SOLUT의 모든 서비스를 이용하실 수 있습니다.
            본 메일은 1시간 동안 유효합니다.`, // 이메일 내용
        };
        const now=new Date();
        const deadline = new Date(now.getTime() + 1 * 60 * 60 * 1000);
        await User.update({//인증번호 정보를 db에 등록한다. 제한 시간 안에 입력해야 한다.
            verify_code: random_number,
            verify_time: deadline,
        },{
            where:{id:target_user},
        });
        await smtpTransport.sendMail(email_information);
        res.status(200).send("E-mail has sent. The deadline is "+deadline);
    } catch(err) {
        logger.error(err);
        next(err);
    }
}
exports.checkEmail=async (req,res,next) => {//이메일 인증번호 확인하기
    try
    {
        const target=req.decoded.user_id;//유저 아이디
        const input=req.body.input;//유저가 입력한 것
        const now=new Date();//현재 시각
        const query='select verify,verify_code,verify_time from users where id=?';
        let result=await sequelize.query(query,{type:QueryTypes.SELECT,replacements:[target]});//현재 유저의 인증번호
        result=result[0];
        if(result.verify==1)
        {//이미 인증이 된 유저의 경우
            res.status(200).send("Already Verified user.");
        }
        else
        {//그렇지 않다면
            if((now>result.verify_time) || (input!=result.verify_code))
            {//인증번호가 틀렸거나, 유효기간이 지난 경우
                res.status(200).send("Wrong password or expired.")
            }
            else
            {//맞았다면 이 유저를 인증한다.
                await User.update({verify:true},{where:{id:target}});
                res.status(200).send("User Verified!");
            }
        }
    } catch(err) {
        logger.error(err);
        next(err);
    }
}