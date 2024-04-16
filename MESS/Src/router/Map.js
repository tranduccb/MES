const express = require('express')
const router = express.Router()
const MapController = require('../app/controller/Map.controller')

router.get('/',MapController.map)
module.exports = router