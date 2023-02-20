/*유저 관련 정보*/
const logger=require('../logger');
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
            res.status(404).send("User Not Found.");
        }
    } catch(err) {
        console.error(err);
    }
}