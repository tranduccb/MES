const express = require('express')
const router = express.Router()
const homeController = require('../app/controller/Home.controller')


router.get('/index',homeController.Home)
router.get('/',homeController.Home)
module.exports = router