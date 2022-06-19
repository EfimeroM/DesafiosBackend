import { CartsModel } from "../models/carts.models.js";

export class Controller{
    async getAll(req, res){
        try {
            const response = await CartsModel.find();
            res.status(200).json(response)
        } catch (error) {
            res.status(400).json({error: error, ruta: req.originalUrl, metodo: req.method})
        }
    }
    async add(req, res){
        try {
            const response = await CartsModel.create({productos:[]})
            res.status(200).json({message: `Carrito agregado con id: ${response._id}`})
        }catch (error){
            res.status(400).json({error: error, ruta: req.originalUrl, metodo: req.method})
        }
    }
    async deleteById(req, res){
        const { id } = req.params
        try {
            const response = await CartsModel.deleteOne({ _id: id })
            res.status(200).json({message: `Carrito con id: ${id}, eliminado`})
        }catch (error){
            res.status(400).json({error: error, ruta: req.originalUrl, metodo: req.method})
        }
    }
    async getById (req, res){
        const { id } = req.params
        try {
            const response = await CartsModel.findOne({ _id: id })
            res.status(200).json(response)
        }catch (error){
            res.status(400).json({error: error, ruta: req.originalUrl, metodo: req.method})
        }
    }
    async addProductIncart(req, res){
        const { id } = req.params
        const { body } = req
        try {
            const response = await CartsModel.updateOne({_id: id}, {$addToSet: {productos: body}})
            res.status(200).json({message: `Producto con id: ${body._id} agregado al carrito ${id}`})
        }catch (error){
            res.status(400).json({error: error, ruta: req.originalUrl, metodo: req.method})
        }
    }
    async deleteProductIncart(req, res){
        const { id, id_prod } = req.params
        try {
            const response = await CartsModel.updateOne({_id: id},{$pull: {productos: {_id: id_prod}}})
            res.status(200).json({message: `Producto con id: ${id_prod} eliminado`})
        }catch (error){
            res.status(400).json({error: error, ruta: req.originalUrl, metodo: req.method})
        }
    }
}