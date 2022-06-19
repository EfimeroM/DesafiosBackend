import express from "express"
import { adminMiddleware } from "../middlewares/adminMiddleware.js"
import { Controller } from "../controllers/productsController.js"

const productsController = new Controller
export const productsRouter = express.Router()

//get products all
productsRouter.get("/", productsController.getAll)
//get product id
productsRouter.get("/:id", productsController.getById)
//add product
productsRouter.post("/", adminMiddleware, productsController.add)
//delete product by id
productsRouter.delete("/:id", adminMiddleware, productsController.delete)
//update product by id
productsRouter.put("/:id", adminMiddleware, productsController.update)
