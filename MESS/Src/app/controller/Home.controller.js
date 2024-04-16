const sharp = require('sharp')

class HomeController{
    Home(req,res){
        res.render('index')
    }
}
module.exports = new HomeController