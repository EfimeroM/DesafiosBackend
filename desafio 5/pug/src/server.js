const express = require('express')

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"));

const data = [] //inicializamos nuestro array de productos

app.set("views", "./src/views");
app.set("view engine", "pug");

//en la raiz de la ruta vamos a mostrar nuestro formulario de ingreso
app.get("/", (req, res) => {
    res.render("formulario", {});
});
//en la ruta productos mostramos los productos ingresados si es que hay
app.get("/productos", (req, res) => {
    res.render("tabla", {
        data
    });
});
//configuramos la ruta productos con el metodo post para cuando se envia el formulario
app.post("/productos", (req, res) => {
    const { body } = req;
    data.push(body)
    res.render("tabla", {
        data
    });
});

const PORT=8080
const server = app.listen(PORT, ()=>{
console.log(`server started http://localhost:8080`)
})

server.on('error', (err)=> console.log(err))