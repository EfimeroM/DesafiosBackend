const express = require('express')
const Contenedor = require('./contenedor.js')

const app = express()
const PORT = (8080) //puerto
const server = app.listen(PORT, ()=>{
    console.log(`servidor escuchando en el puerto: http://localhost:${PORT} `)
})
server.on("error", (error) => console.log(error))

let numeroAleatorio = 0
let productoRandom = []
//reutilizamos nuestra clase Contenedor
const controllerArchive = new Contenedor('./productos.txt')

const main = async () => {
    const productos = await controllerArchive.getAll()
    //listado de productos
    app.get('/productos', (req, res) =>{
        res.json(productos)
    })
    //al recargar la pagina nos muestra un producto random entre los 3 disponibles
    app.get('/productoRandom', (req, res) =>{
        numeroAleatorio = Math.floor(Math.random()*3)+1 //almacena un valor random entre 1 a 3
        productoRandom = productos.find((prod)=>prod.id===numeroAleatorio) //buscamos en nuestro array de productos el que tenga el id con valor igual al numero random
        res.json(productoRandom)
    })
    //algo extra para que se vea mas bonito
    app.get('/', (req, res) =>{
        res.send(`<div style='height:90vh;display:flex;justify-content:center;align-items:center'>
                    <h1 style='color:#0d5fd9 ; font-family:calibri;'>Bienvenidos al servidor Express mas mamalon</h1>
                </div>`)
    })
}
main()

