const express = require('express')
const router = express.Router()
const agvController = require('../app/controller/AGV.controller')


router.post('/taskExecutiontatus',agvController.taskExecutiontatus)
router.post('/agvStatusReport',agvController.agvStatusReport)
module.exports = router