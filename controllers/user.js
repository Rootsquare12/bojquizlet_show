/*유저 관련 정보*/
const logger=require('../logger');
const {User,Solution,Problem}=require('../models');

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
            const wrote=await Solution.findAll({
                include:[{
                    model:Problem,
                    attributes:['problem_id','problem_name'],
                }],
                attributes:['likes'],
                where: {
                    writer:user_id,
                },
                order:[//번호순
                    ['problem_id','ASC'],
                ]
            })
            const total={profile,wrote};
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

exports.userRank=async (req,res,next) => { // 유저 순위
    try
    {
        const key=req.query.key;//정렬 기준
        const way=req.query.way;//정렬 방향
        if((key=='wrote' || key=='likes') && (way=='ASC' || way=='DESC'))
        {
            const info=await User.findAll({
                attributes:['nickname','wrote','likes'],
                order:[//정렬하기
                    [key,way],
                ]
            });
            res.send(info);
        }
        else
        {
            res.status(404).send("Invalid Body Input.");
        }
    } catch(err) {
        logger.error(err);
    }
}