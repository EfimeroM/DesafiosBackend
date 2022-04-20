const adminMiddleware = function(req, res, next){
    let user = process.env.ADMIN
    if(user =="true"){
        next()
    }else{
        res.status(401).json({error: "Unauthorized", ruta: req.originalUrl, metodo: req.method})
    }
}

module.exports = adminMiddleware;