const express = require('express');
const User = require('./user.router');
const Emailcode = require('./emailcodes');
const router = express.Router();

// colocar las rutas aquí
router.use("/users",User)
router.use("/users",Emailcode)

module.exports = router;