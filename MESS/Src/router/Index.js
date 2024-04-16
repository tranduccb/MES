const home = require('./Home.js')
const agv = require('./AGV.js')
const map = require('./Map.js')

function router(app){
    app.use('/agv',agv)
    app.use('/map',map)
    app.use('/',home)
}
module.exports = router