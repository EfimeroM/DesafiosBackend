const { configMySql } = require("../db/config")
const knex = require("knex")(configMySql);

const get = async function(req, res){
    try {
      const products = await knex.select().from("productos");
        if(products.length){
            res.status(200).json(products)
        }else{
            res.status(200).json({message: "Opsss..no hay productos para mostrar"})
        }
    }catch (error){
        res.status(400).json({error: error, ruta: req.originalUrl, metodo: req.method})
    }
}
const getById = async function(req, res){
    const { id } = req.params
    try {
      const products = await knex.select().from("productos").where("id", parseInt(id));
        if(products.length){
            res.status(200).json(products)
        }else{
            res.status(200).json({message: `Opsss..producto con id: ${id} no existe`})
        }
    }catch (error){
        res.status(400).json({error: error, ruta: req.originalUrl, metodo: req.method})
    }
}
const add = async function(req, res){
    let { body } = req;
    try {
        const response = await knex.insert(body).from("productos");
        res.status(200).json({message: `Producto agregado con id: ${response}`})
    }catch (error){
        res.status(400).json({error: error, ruta: req.originalUrl, metodo: req.method})
    }
}
const deleteProduct = async function(req, res){
    const { id } = req.params
    try {
        const response = await knex.del().from("productos").where("id", parseInt(id));
        if(response){
            res.status(200).json({message: `Producto con id: ${id} eliminado`})
        }else{
            res.status(400).json({error: `Producto con id: ${id} no existe`, ruta: req.originalUrl, metodo: req.method})
        }
    }catch (error){
        res.status(400).json({error: error, ruta: req.originalUrl, metodo: req.method})
    }
}
const update = async function(req, res){
    const { id } = req.params
    const { body } = req
    try {
        const response = await knex.from("productos").update(body).where("id", parseInt(id));
        if(response){
            res.status(200).json({message: `Producto con id: ${id}, actualizado`})
        }else{
            res.status(400).json({error: `Producto con id: ${id} no existe`, ruta: req.originalUrl, metodo: req.method})
        }
    }catch (error){
        res.status(400).json({error: error, ruta: req.originalUrl, metodo: req.method})
    }
}
module.exports = { get, getById, add, deleteProduct, update }