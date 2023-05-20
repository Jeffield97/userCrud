const express = require('express');
const User = require('./user.router');
const router = express.Router();

// colocar las rutas aquí
router.use("/users",User)

module.exports = router;