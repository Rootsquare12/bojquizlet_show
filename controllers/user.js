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
            res.send("Hello World,"+name);
        }
        else
        {
            next();
        }
    } catch(err) {
        console.error(err);
    }
}