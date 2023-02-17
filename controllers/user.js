/*유저 관련 정보*/
const {User}=require('../models');
exports.findProfile=async (req,res,next) => {
    try
    {
        const name=req.params.id;
        const info=await User.findOne({
            where: {
                nickname:name,
            },
        });
        if(info)
        {
            res.send(info);
        }
        else
        {
            res.send("그런 사람은 없습니다");
        }
    } catch(err) {
        console.error(err);
    }
}