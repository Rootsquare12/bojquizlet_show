const logger=require('../logger');
const {Op}=require('sequelize');
const bcrypt = require('bcrypt');
const User = require('../models/user');

exports.newUser = async (req, res, next) => {//새로운 회원 가입하기
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
