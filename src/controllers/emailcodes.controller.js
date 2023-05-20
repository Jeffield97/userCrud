const catchError = require('../utils/catchError');
const EmailCode = require('../models/EmailCode');
const User = require('../models/User');

const verifyCode = catchError(async(req, res) => {
    const {code} = req.params
    const emailcode = await EmailCode.findOne({where:{code}})
    if(!emailcode) return res.json({message:"Error en la activación"})
    const user = await User.findByPk(emailcode.userId)
    const result = await user.update({isVerified:true})
    if(result)
    {      
        const resDel = await EmailCode.destroy({where:{id:emailcode.id}})
        return res.json({message:"Activado correctamente"})
    }
    return res.json({message:"Error en la activación"})
});

module.exports = {
    verifyCode
}