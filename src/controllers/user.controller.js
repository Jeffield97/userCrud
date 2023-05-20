const catchError = require('../utils/catchError');
const User = require('../models/User');
const bcrypt = require('bcrypt')

const getAll = catchError(async (req, res) => {
    const users = await User.findAll()
    return res.json(users)
});
const register = catchError(async (req, res) => {
    const { firstName, lastName, email, password, country, image, isVerified } = req.body
    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = await User.create({
        firstName, lastName, email, password: hashedPassword, country, image, isVerified
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