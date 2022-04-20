const express = require('express')
const adminMiddleware = require("../middlewares/adminMiddleware")
const productsController = require("../controllers/productsController")
const productosRouter = express.Router()

//get products all
productosRouter.get("/", productsController.get)
//get product id
productosRouter.get("/:id", productsController.getById)
//add product
productosRouter.post("/", adminMiddleware, productsController.add)
//delete product by id
productosRouter.delete("/:id", adminMiddleware, productsController.deleteProduct)
//update product by id
productosRouter.put("/:id", adminMiddleware, productsController.update)

module.exports = productosRouter