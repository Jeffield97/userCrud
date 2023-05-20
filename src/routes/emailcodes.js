const express = require('express');
const { verifyCode } = require('../controllers/emailcodes.controller');

const Emailcode = express.Router();

Emailcode.route('/verify/:code')
    .get(verifyCode)

module.exports = Emailcode;