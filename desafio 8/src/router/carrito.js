const express = require('express')
const cartsController = require("../controllers/cartsController")
const carritoRouter = express.Router()

//view carts
carritoRouter.get("/", cartsController.get)
//create cart && get id cart
carritoRouter.post("/", cartsController.add)
//delete cart by id
carritoRouter.delete("/:id", cartsController.deleteById)
//get cart by id && products
carritoRouter.get("/:id/productos", cartsController.getById)
//add product in cart
carritoRouter.post("/:id/productos", cartsController.addProductIncart)
//delete product in cart by id
carritoRouter.delete("/:id/productos/:id_prod", cartsController.deleteProductIncart)

module.exports = carritoRouter