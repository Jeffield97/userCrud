const catchError = require('../utils/catchError');
const User = require('../models/User');
const bcrypt = require('bcrypt')
const sendEmail = require("../utils/sendEmail")
const crypto = require("crypto");
const EmailCode = require('../models/EmailCode');
const jwt = require("jsonwebtoken")

const getAll = catchError(async(req, res) => {
    const results = await User.findAll();
    return res.json(results);
});


const getOne = catchError(async(req, res) => {
    const { id } = req.params;
    const result = await User.findByPk(id);
    if(!result) return res.sendStatus(404);
    return res.json(result);
});

const remove = catchError(async(req, res) => {
    const { id } = req.params;
    await User.destroy({ where: {id} });
    return res.sendStatus(204);
});

const update = catchError(async(req, res) => {
    const { id } = req.params;
    const result = await User.update(
        req.body,
        { where: {id}, returning: true }
    );
    if(result[0] === 0) return res.sendStatus(404);
    return res.json(result[1][0]);
});



const register = catchError(async (req, res) => {
    const { firstName, lastName, email, password, country, image, frontBaseUrl } = req.body
    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = await User.create({
        firstName, lastName, email, password: hashedPassword, country, image, isVerified: false
    })
    const code = crypto.randomBytes(32).toString("hex")
    await EmailCode.create({code,userId:newUser.id})
    
    await sendEmail({
        to: email,
        subject: "Este es el asunto del correo",
        text: `Click the next link for active your account: ${frontBaseUrl+"/verify_email/"+code}`
    })

    return res.json(newUser)
});
const login = catchError(async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ where: { email } })
    if (!user) return res.json({ msg: 'Invalid credentials' })
    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) return res.json({ msg: 'Invalid credentials' })
    console.log(typeof user.isVerified)
    if(!user.isVerified) res.json({msg:"Activa tu cuenta"})
    const token = await jwt.sign({ user }, process.env.TOKEN_SECRET)
    return res.json({ user, token })
});

const me = catchError(async (req,res)=>{
    return res.json(req.user)
})

module.exports = {
    getAll,
    getOne,
    update,
    remove,
    register,
    login,
    me
}