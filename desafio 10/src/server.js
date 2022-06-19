import './config/db.js'
import express from 'express';
import dotenv from 'dotenv'
import { productsRouter } from './router/productos.js'
import { cartRouter } from './router/carrito.js'
dotenv.config() //lib variables de entorno

const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"));

//Routes
app.use("/productos", productsRouter);
app.use("/carrito", cartRouter);


//en caso de solicitar una ruta no implementada
app.get('*', (req, res) => {
  res.status(404).json({error: "Not Found", ruta: req.originalUrl, metodo: req.method});
})

const server = app.listen(process.env.PORT, ()=>{
console.log(`server started http://localhost:${process.env.PORT}`)
})
server.on('error', (err)=> console.log(err))
