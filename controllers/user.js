/*유저 관련 정보*/
const logger=require('../logger');
const {User,Solution}=require('../models');

exports.findProfile=async (req,res,next) => {
    try
    {//유저 정보 가져오기
        const name=req.params.id;
        const profile=await User.findOne({
            raw:true,
            attributes:['id','nickname','wrote','likes'],
            where: {
                nickname:name,
            },
        });
        if(profile)
        {//유저가 존재한다면 그 유저가 풀이를 쓴 문제들의 번호 가져오기
            const user_id=profile.id;
            const problems=await Solution.findAll({
                attributes:['problem_id'],
                where: {
                    writer:user_id,
                },
                order:[//번호순
                    ['problem_id','ASC'],
                ]
            })
            const total={profile,problems}
            res.status(200).send(total);
        }
        else
        {
            res.status(404).send("User Not Found.");
        }
    } catch(err) {
        console.error(err);
    }
}