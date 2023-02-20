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
            res.status(404).send("일치하는 사람이 없습니다");
        }
    } catch(err) {
        console.error(err);
    }
}