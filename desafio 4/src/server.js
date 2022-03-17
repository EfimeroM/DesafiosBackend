const express = require('express')
const Contenedor = require('./class/contenedor')

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("./src/public"));


const router = express.Router()
const controllerArchive = new Contenedor('./src/data/productos.txt')
let productos = []
let idNewProduct



//devolvemos todos los productos
router.get("/", (req, res) => {
    getProducts()
        .then((resp)=>{
        if(resp){
            console.log("listado de productos");
            res.status(200).json(productos);
        }else{
            res.status(400).json({error :"no existen productos en el archivo"})
        }
        })
})
//devolvemos un producto dependiendo de su id
router.get("/:id", (req, res) => {
    const { id } = req.params //obtenemos nuestro id por parametro
    getProducts()
        .then(()=>{
            let producto = productos.find((prod)=>prod.id === parseInt(id)) //buscamos en nuestro array de productos el que tenga el id con valor igual al numero pasado por parametro
            if(producto){
                console.log("devolvemos un producto dependiendo de su id");
                res.status(200).json(producto)
            }
            else{
                res.status(400).json({error :"producto no encontrado"})
            }
        })
})
//añadimos un producto a traves del metodo post con la informacion recibida en body
router.post("/", (req, res)=>{
    const { body } = req;
    addProduct(body)
        .then((resp)=>{
            res.status(200).send("Producto agregado con id: "+resp);
        })    
})
//devolvemos un producto dependiendo de su id y actualizamos su informacion con lo que reciba de body
router.put("/:id", (req, res) => {
    const { id } = req.params //obtenemos nuestro id por parametro
    const { body } = req
    updateProduct(body, id)
        .then((resp)=>{
            if(resp){
                res.status(200).send("producto con id "+resp+" actualizado")  
            }else{
                res.status(400).json({error :"producto no encontrado"})
            }
        })
})
//borramos un producto dependiendo de su id
router.delete("/:id", (req, res) => {
    const { id } = req.params //obtenemos nuestro id por parametro
    getProducts()
        .then(()=>{
            let producto = productos.find((prod)=>prod.id === parseInt(id)) //buscamos en nuestro array de productos el que tenga el id con valor igual al numero pasado por parametro
            if(producto){
                controllerArchive.deleteById(parseInt(id))
                res.status(200).send("producto con id "+id+" borrado")
            }
            else{
                res.status(400).json({error :"producto no encontrado"})
            }
        })
})

app.use("/api/productos", router);

const PORT=8080
const server = app.listen(PORT, ()=>{
console.log(`server started http://localhost:8080`)
})

server.on('error', (err)=> console.log(err))

//Funciones
const getProducts = async () => {
    productos = await controllerArchive.getAll()
    return productos[0]
}
const addProduct = async (body) => {
    return new Promise( (resolve, reject) => {
        idNewProduct = controllerArchive.save(body)
        resolve(idNewProduct)
    })
}
const updateProduct = async (body, id) => {
    productos = await controllerArchive.getAll()
    let producto = productos.find((prod)=>prod.id === parseInt(id))
    if(producto){
        return new Promise( (resolve, reject) => {
            productos[id-1].title = body.title
            productos[id-1].price = body.price
            productos[id-1].thumbnail = body.thumbnail
            controllerArchive.updateAll(productos)
            resolve(id)
        })
    }
}
