const express = require('express')
require('dotenv').config() //lib variables de entorno

const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"));

//Routes
app.use("/productos", require('./router/productos'));
app.use("/carrito", require('./router/carrito'));


//en caso de solicitar una ruta no implementada
app.get('*', (req, res) => {
  res.status(404).json({error: "Not Found", ruta: req.originalUrl, metodo: req.method});
})

const server = app.listen(process.env.PORT, ()=>{
console.log(`server started http://localhost:${process.env.PORT}`)
})
server.on('error', (err)=> console.log(err))

