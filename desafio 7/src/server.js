const express = require('express')
const { engine } = require("express-handlebars");
require('dotenv').config() //lib variables de entorno

const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"));

//Variables de entorno
const PORT=process.env.PORT

//Routes
app.use("/productos", require('./router/productos'));
app.use("/carrito", require('./router/carrito'));

//config handlebars
app.set("views", "./src/views");
app.set("view engine", "hbs");
app.engine(
    "hbs",
    engine({
      extname: ".hbs",
      defaultLayout: "index.hbs",
      layoutsDir: __dirname + "/views/layout",
      partialsDir: __dirname + "/views/partials",
    }),
);

//en caso de solicitar una ruta no implementada
app.get('*', (req, res) => {
  res.status(404).json({error: "Not Found", ruta: req.originalUrl, metodo: req.method});
})

const server = app.listen(PORT, ()=>{
console.log(`server started http://localhost:${PORT}`)
})
server.on('error', (err)=> console.log(err))

