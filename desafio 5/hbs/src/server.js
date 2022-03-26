const express = require('express')
const { engine } = require("express-handlebars");

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"));

const data = [] //inicializamos nuestro array de productos

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

//en la raiz de la ruta vamos a mostrar nuestro formulario de ingreso
app.get("/", (req, res) => {
    res.render("ingresar", {});
});
//en la ruta productos mostramos los productos ingresados si es que hay
app.get("/productos", (req, res) => {
    res.render("mostrar", {
        data
    });
});
//configuramos la ruta productos con el metodo post para cuando se envia el formulario
app.post("/productos", (req, res) => {
    const { body } = req;
    data.push(body)
    res.render("mostrar", {
        data
    });
});

const PORT=8080
const server = app.listen(PORT, ()=>{
console.log(`server started http://localhost:8080`)
})

server.on('error', (err)=> console.log(err))