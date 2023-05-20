const catchError = require('../utils/catchError');
const User = require('../models/User');
const bcrypt = require('bcrypt')
const sendEmail = require("../utils/sendEmail")
const crypto = require("crypto");
const EmailCode = require('../models/EmailCode');
const getAll = catchError(async (req, res) => {
    const users = await User.findAll()
    return res.json(users)
});
const register = catchError(async (req, res) => {
    const { firstName, lastName, email, password, country, image, frontBaseUrl } = req.body
    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = await User.create({
        firstName, lastName, email, password: hashedPassword, country, image, isVerified: false
    })
    const code = crypto.randomBytes(32).toString("hex")
    // const {id}=newUser
    await EmailCode.create({code,userId:newUser.id})
    
    await sendEmail({
        to: email, // Email del receptor
        subject: "Este es el asunto del correo", // asunto
        text: `Click the next link for active your account: ${frontBaseUrl+"/verify_email/"+code}` // texto
    })

    return res.json(newUser)
});
const login = catchError(async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ where: { email } })
    if (!user) return res.json({ msg: 'Invalid credentials' })
    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) return res.json({ msg: 'Invalid credentials' })
    const token = await jwt.sign({ user }, process.env.TOKEN_SECRET)
    return res.json({ user, token })
});

module.exports = {
    getAll,
    register,
    login
}