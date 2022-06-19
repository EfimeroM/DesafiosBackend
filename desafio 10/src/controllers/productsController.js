import { ProductsModel } from "../models/products.models.js";

export class Controller{
    async getAll(req, res){
        try {
            const response = await ProductsModel.find();
            res.status(200).json(response)
        } catch (error) {
            res.status(400).json({error: error, ruta: req.originalUrl, metodo: req.method})
        }
    }
    async getById(req, res){
        const { id } = req.params
        try {
            const response = await ProductsModel.find({ _id: id });
            res.status(200).json(response)
        }catch (error){
            res.status(400).json({error: error, ruta: req.originalUrl, metodo: req.method})
        }
    }
    async add(req, res){
        let { body } = req;
        try {
            const response = await ProductsModel.create(body)
            res.status(200).json({message: `Producto agregado con id: ${response._id}`})
        }catch (error){
            res.status(400).json({error: error, ruta: req.originalUrl, metodo: req.method})
        }
    }
    async delete(req, res){
        const { id } = req.params
        try {
            const response = await ProductsModel.deleteOne({ _id: id });
            res.status(200).json({message: `Producto con id: ${id} eliminado`})
        }catch (error){
            res.status(400).json({error: error, ruta: req.originalUrl, metodo: req.method})
        }
    }
    async update(req, res){
        const { id } = req.params
        const { body } = req
        try {
            const response = await ProductsModel.updateOne({ _id: id }, body)
            res.status(200).json({message: `Producto con id: ${id}, actualizado`})
        }catch (error){
            res.status(400).json({error: error, ruta: req.originalUrl, metodo: req.method})
        }
    }
}