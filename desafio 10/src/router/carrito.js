import express from 'express'
import { Controller } from '../controllers/cartsController.js'

const cartsController = new Controller
export const cartRouter = express.Router()

//view carts
cartRouter.get("/", cartsController.getAll)
//create cart && get id cart
cartRouter.post("/", cartsController.add)
//delete cart by id
cartRouter.delete("/:id", cartsController.deleteById)
//get cart by id && products
cartRouter.get("/:id/productos", cartsController.getById)
//add product in cart
cartRouter.post("/:id/productos", cartsController.addProductIncart)
//delete product in cart by id
cartRouter.delete("/:id/productos/:id_prod", cartsController.deleteProductIncart)
