const express = require('express')
const {getProducts, addProduct, updateProduct, archiveProducts } = require('../functions/functions.js')
const productosRouter = express.Router()
var moment = require('moment') // vamos a usar moment para obtener la fecha y hora actual
var uniqid = require('uniqid')

const admin=process.env.ADMIN

//get products all
productosRouter.get("/", (req, res)=>{
    getProducts()
        .then(products=>{
            if(products.length){
                res.status(200).json(products)
            }else{
                res.status(200).json({message: "Opsss..no hay productos para mostrar"})
            }
        })
        .catch(err=> res.status(400).json({error: "Bad request", ruta: req.originalUrl, metodo: req.method}))
})
//get product id
productosRouter.get("/:id", (req, res)=>{
    const { id } = req.params
    getProducts()
        .then(resp=>{
            const product = resp.filter(product=> String(product.id) === String(id))
            if(product.length){
                res.status(200).json(product)
            }else{
                res.status(200).json({message: `Opsss..producto con id: ${id} no existe`})
            }
        })
        .catch(err=> res.status(400).json({error: "Bad request", ruta: req.originalUrl, metodo: req.method}))
})
//add product
productosRouter.post("/", (req, res)=>{
    let { body } = req;
    const date = moment().format("DD/MM/YYYY HH:mm:ss")
    body = {
        id:uniqid(),
        timestamp:date,
        ...body
    }
    if(admin=="true"){
        addProduct(body)
            .then(id=>{
                if(id){
                    res.status(200).json({message: `Producto agregado con id: ${id}`})
                }else{
                    res.status(404).json({message:  "Estamos teniendo problemas con nuestro servicio, porfavor intente nuevamente mas tarde"})
                }
            })
            .catch(err=> res.status(400).json({error: "Bad request", ruta: req.originalUrl, metodo: req.method}))
    }else{
      res.status(401).json({error: "Unauthorized", ruta: req.originalUrl, metodo: req.method})
    }
})
//delete product by id
productosRouter.delete("/:id", (req, res) => {
    const { id } = req.params
    if(admin=="true"){
        archiveProducts.deleteById(id)
            .then(resp=>{
                res.status(200).json({message: `Producto con id: ${id}, eliminado`})
            })
            .catch(err=> res.status(400).json({error: "Bad request", ruta: req.originalUrl, metodo: req.method}))
    }else{
        res.status(401).json({error :"Unauthorized", ruta: req.originalUrl, metodo: req.method})
    }
})
//update product by id
productosRouter.put("/:id", (req, res) => {
    const { id } = req.params
    const { body } = req
    if(admin=="true"){
        updateProduct(body, id)
            .then(resp=>{
                res.status(200).json({message: `Producto con id: ${id}, actualizado`})
            })
            .catch(err=> res.status(400).json({error: "Bad request", ruta: req.originalUrl, metodo: req.method}))
    }else{
        res.status(401).json({error :"Unauthorized", ruta: req.originalUrl, metodo: req.method})
    }
})

module.exports = productosRouter