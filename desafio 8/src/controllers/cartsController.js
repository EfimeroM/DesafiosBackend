const { configMySql } = require("../db/config")
const knex = require("knex")(configMySql);

const get = async function(req, res){
    try {
      const carts = await knex.select().from("carritos");
        if(carts.length){
            res.status(200).json(carts)
        }else{
            res.status(200).json({message: "Opsss..no hay carritos para mostrar"})
        }
    }catch (error){
        res.status(400).json({error: error, ruta: req.originalUrl, metodo: req.method})
    }
}
const add = async function(req, res){
    try {
        const response = await knex.insert({}).from("carritos");
        res.status(200).json({message: `Carrito agregado con id: ${response}`})
    }catch (error){
        res.status(400).json({error: error, ruta: req.originalUrl, metodo: req.method})
    }
}
const deleteById = async function(req, res){
    const { id } = req.params
    try {
        const response = await knex.del().from("carritos").where("id", parseInt(id));
        if(response){
            res.status(200).json({message: `Carrito con id: ${id}, eliminado`})
        }else{
            res.status(400).json({error: `Carrito con id: ${id} no existe`, ruta: req.originalUrl, metodo: req.method})
        }
    }catch (error){
        res.status(400).json({error: error, ruta: req.originalUrl, metodo: req.method})
    }
}
const getById = async function (req, res){
    const { id } = req.params
    try {
      const idProducts = await knex.select("id", "timestamp", "nombre", "descripcion", "codigo", "foto", "precio", "stock").from("products_in_cart").join("productos", "idProduct", "id").where("idCart", parseInt(id));
        if(idProducts.length){
            res.status(200).json(idProducts)
        }else{
            res.status(200).json({message: "Opsss..no hay productos para mostrar en este carrito"})
        }
    }catch (error){
        res.status(400).json({error: error, ruta: req.originalUrl, metodo: req.method})
    }
}
const addProductIncart = async function(req, res){
    const { id } = req.params
    const { body } = req
    try {
        const response = await knex.insert({idCart:parseInt(id), idProduct:parseInt(body.id)}).from("products_in_cart");
        res.status(200).json({message: `Producto con id: ${body.id} agregado al carrito ${id}`})
    }catch (error){
        res.status(400).json({error: error, ruta: req.originalUrl, metodo: req.method})
    }
}
const deleteProductIncart = async function(req, res){
    const { id, id_prod } = req.params
    try {
        const response = await knex.del().from("products_in_cart").where("idCart", parseInt(id)).andWhere("idProduct", parseInt(id_prod));
        res.status(200).json({message: `Producto con id: ${id_prod} eliminado`})
    }catch (error){
        res.status(400).json({error: error, ruta: req.originalUrl, metodo: req.method})
    }
}
module.exports = {get, add, deleteById, getById, addProductIncart, deleteProductIncart}