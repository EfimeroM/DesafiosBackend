const express = require('express')
const { getCart, addCart, addProductCart, archiveCart } = require('../functions/functions.js')
const carritoRouter = express.Router()
var moment = require('moment') // vamos a usar moment para obtener la fecha y hora actual
var uniqid = require('uniqid')


//view carts
carritoRouter.get("/", (req, res)=>{
    getCart()
        .then(carts=>{
            if(carts.length){
                res.status(200).json(carts)
            }else{
                res.status(200).json({message: "Opsss..no hay carritos para mostrar"})
            }
        })
        .catch(err=> res.status(400).json({error: "Bad request", ruta: req.originalUrl, metodo: req.method}))
})
//create cart && get id cart
carritoRouter.post("/", (req, res)=>{
    const date = moment().format("DD/MM/YYYY HH:mm:ss")
    const cart = {
        id:uniqid(),
        timestamp: date,
        producto:[]
    }
    addCart(cart)
        .then((id)=>{
            if(id){
                res.status(200).json({message: `Carrito agregado con id: ${id}`})
            }else{
                res.status(404).json({message:  "Estamos teniendo problemas con nuestro servicio, porfavor intente nuevamente mas tarde"})
            } 
        })
        .catch(err=> res.status(400).json({error: "Bad request", ruta: req.originalUrl, metodo: req.method}))
})
//delete cart by id
carritoRouter.delete("/:id", (req, res) => {
    const { id } = req.params //obtenemos nuestro id por parametro
    archiveCart.deleteById(id)
        .then(resp=>{
            res.status(200).json({message: `Carrito con id: ${id}, eliminado`})
        })
        .catch(err=> res.status(400).json({error: "Bad request", ruta: req.originalUrl, metodo: req.method}))
})
//get cart by id && products
carritoRouter.get("/:id/productos", (req, res)=>{
    const { id } = req.params
    getCart()
        .then(carts=>{
            const cart = carts.find(cart=>String(cart.id) == String(id))
            if(cart.producto.length){
                res.status(200).json(cart.producto)
            }else{
                res.status(404).json({message:  "Opss..no hay productos en este carrito"})
            }
        })
        .catch(err=> res.status(400).json({error: "Bad request", ruta: req.originalUrl, metodo: req.method}))
})
//add product in cart
carritoRouter.post("/:id/productos", (req, res)=>{
    const { id } = req.params
    const { body } = req
    addProductCart(id, body.id)
        .then(resp=>{
            res.status(200).json({message: `Producto de id: ${body.id}, agregado al carrito ${id}`})
        })
        .catch(err=> res.status(400).json({error: "Bad request", ruta: req.originalUrl, metodo: req.method}))
})
//delete product in cart by id
carritoRouter.delete("/:id/productos/:id_prod", (req, res)=>{
    const { id, id_prod } = req.params
    archiveCart.deleteByIdLvl2(id, id_prod)
        .then(resp=>{
            res.status(200).json({message: `Producto de id: ${id_prod}, eliminado de carrito ${id}`})
        })
        .catch(err=> res.status(400).json({error: "Bad request", ruta: req.originalUrl, metodo: req.method}))
})

module.exports = carritoRouter