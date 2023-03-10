const logger=require('../logger');
const {Op}=require('sequelize');
const bcrypt = require('bcrypt');
const jwt=require('jsonwebtoken');
const User = require('../models/user');

exports.newUser=async (req, res, next) => {//새로운 회원 가입하기
  try
  {//먼저 이메일부터 중복을 확인한다.
    const email=req.body.email;
    const exEmail=await User.findOne({where: {email: email}});
    if (exEmail) {//이미 존재하는 이메일일 경우
      res.send("E-Mail Already Exists.");
    }
    else
    {
      const nick=req.body.nickname;
      const exNick=await User.findOne({where: {nickname: nick}});
      if(exNick)
      {//이미 존재하는 닉네임일 경우
        res.send("Nickname Already Exists.");
      }
      else
      {//모두 만족하면 데이터베이스에 등록한다.
        const password=req.body.password;
        const hashed_password=await bcrypt.hash(password,12);
        await User.create({
          email:email,
          nickname:nick,
          password:hashed_password,
          solved:0,
          wrote:0,
          likes:0,
        });
        res.send("Successfully Created User Data.");
      }
    }
  } catch (error) {
    logger.error(error);
  }
}

exports.loginProcess=async (req, res, next) => {//새로운 회원 가입하기
  try
  {//먼저 이메일부터 중복을 확인한다.
    const nick=req.body.nickname;
    const password=req.body.password;
    const exUser=await User.findOne({
      raw:true,
      where: {nickname:nick}
    });
    if(exUser)
    {
      const result=await bcrypt.compare(password,exUser.password);
      if(result)
      {//아이디와 비밀번호가 모두 맞는 경우 토큰을 만들어 전송한다.
        const user_id=exUser.id;//이 유저의 db상 아이디
        const key=process.env.JWT_SECRET;
        const token=jwt.sign({
          type:"JWT",
          user_id: user_id,
          nickname: nick,
        },key,{
          expiresIn:"30m",//토큰 유효기간
          issuer:"rootsquare",//토큰 발행자
        })
        const info={
          "user": nick,
          "token": token
        }
        res.status(200).send(info);
      }
      else
      {//비밀번호가 틀린 경우
        res.status(404).send("Wrong User ID or password.");
      }
    }
    else
    {//아이디가 잘못된 경우
      res.status(404).send("Wrong User ID or password.");
    }
  } catch (error) {
    logger.error(error);
  }
}
