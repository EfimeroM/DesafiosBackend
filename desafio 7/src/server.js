const express = require('express')
const { engine } = require("express-handlebars");
require('dotenv').config() //lib variables de entorno
var moment = require('moment'); // vamos a usar moment para obtener la fecha y hora actual
const Contenedor = require('./class/contenedor') //manejo de archivos

const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"));

//Variables de entorno
const PORT=process.env.PORT
const admin=process.env.ADMIN
//routes
const productosRouter = express.Router()
const carritoRouter = express.Router()
//Class
const archiveProducts = new Contenedor('./src/data/products.txt')
const archiveCart = new Contenedor('./src/data/cart.txt')

let products = []
let cart = []

//config handlebars
app.set("views", "./src/views");
app.set("view engine", "hbs");
app.engine(
    "hbs",
    engine({
      extname: ".hbs",
      defaultLayout: "index.hbs",
      layoutsDir: __dirname + "/views/layout",
      partialsDir: __dirname + "/views/partials",
    }),
);

//Home view
app.get("/", (req, res) => {
  if(admin=="true"){
    res.render("home", {
      admin
    });
  }else{
    res.render("home",{})
  }
});

//get products all
productosRouter.get("/", (req, res)=>{
  setTimeout(() => {
    getProducts()
    .then((resp)=>{
      getCart()
        .then((cart)=>{
          if(admin=="true"){
            res.render("products", {
              admin,
              products:resp,
              cart:cart
            })
          }else{
            res.render("products", {
              products:resp,
              cart:cart
            })
          }
        })
    })
  }, 200);
})
//get product id
productosRouter.get("/:id", (req, res)=>{
  const { id } = req.params //obtenemos nuestro id por parametro
  getProducts()
    .then((resp)=>{
      const product = resp.filter(product=> product.id === parseInt(id))
      if(admin=="true"){
        res.render("products", {
          admin,
          products:product
        })
      }else{
        res.render("products", {
          products:product
        })
      }
    })
})
//add product
productosRouter.post("/", (req, res)=>{
  let { body } = req;
  const date = moment().format("DD/MM/YYYY hh:mm:ss")
  body = {
    ...body,
    timestamp:date
    }
  if(admin=="true"){
    addProduct(body)
        .then(()=>{
            getProducts()
                .then((resp)=>{
                    res.render("products", {
                    admin,
                    products:resp
                    })
                })
      })
  }else{
    res.status(401).json({
      error :"Unauthorized",
      ruta: "api/productos",
      metodo: "POST"
    })
  }
})
//delete product by id
productosRouter.delete("/:id", (req, res) => {
    const { id } = req.params //obtenemos nuestro id por parametro
    if(admin=="true"){
      archiveProducts.deleteById(parseInt(id))
      }else{
        res.status(401).json({
          error :"Unauthorized",
          ruta: req.path,
          metodo: req.method
        })
      }
})
//update product by id
productosRouter.put("/:id", (req, res) => {
  const { id } = req.params //obtenemos nuestro id por parametro
  const { body } = req
  if(admin=="true"){
    getProducts()
      .then((resp)=>{
        updateProduct(body, id, resp)       
      })
  }else{
    res.status(401).json({
      error :"Unauthorized",
      ruta: req.path,
      metodo: req.method
    })
  }
})
//view carts
carritoRouter.get("/", (req, res)=>{
  setTimeout(() => {
    getCart()
      .then((resp)=>{
        res.render("cart", {
          cart:resp
        })
      })
  }, 200);
})
//create cart && get id cart
carritoRouter.post("/", (req, res)=>{
  let { body } = req;
  const date = moment().format("DD/MM/YYYY hh:mm:ss")
  body = {
    ...body,
    timestamp: date
  }
  addCart(body)
        .then(()=>{
            getCart()
                .then((resp)=>{
                    res.render("cart", {
                    cart:resp
                    })
                })
      })
})
//delete cart by id
carritoRouter.delete("/:id", (req, res) => {
  const { id } = req.params //obtenemos nuestro id por parametro
  archiveCart.deleteById(parseInt(id))
})
//get cart by id && products
carritoRouter.get("/:id/productos", (req, res)=>{
  const { id } = req.params
  setTimeout(() => {
    getCart()
    .then((resp)=>{
      const productsCart = resp.find(prod=>prod.id == parseInt(id))
      if(productsCart){
        res.render("cart", {
          id,
          productsCart
        })
      }else{
        res.status(404).json({
          error :"404 Not Found",
          ruta: req.path,
          metodo: req.method
        })
      }
    })
  }, 200);
})
//delete product in cart by id
carritoRouter.delete("/:id/productos/:id_prod", (req, res)=>{
  const { id, id_prod } = req.params
  archiveCart.deleteByIdLvl2(id, id_prod)
})
//add product in cart
carritoRouter.post("/:id/productos", (req, res)=>{
  const { id } = req.params
  const { body } = req
  addProductCart(id, body)
})
//Routes
app.use("/api/productos", productosRouter);
app.use("/api/carrito", carritoRouter);

const server = app.listen(PORT, ()=>{
console.log(`server started http://localhost:${PORT}`)
})
server.on('error', (err)=> console.log(err))

//Functions Product
const getProducts = async () => {
  return new Promise( (resolve, reject) => {
    products = archiveProducts.getAll()
    resolve(products)
  })
}
const addProduct = async (body) => {
  return new Promise( (resolve, reject) => {
      let idNewProduct = archiveProducts.save(body)
      resolve(idNewProduct)
  })
}
const updateProduct = async (body, id, products) => {
    const productos = products.map(p =>
      p.id === parseInt(id)
        ? { ...p,
          nombre: body.nombre,
          descripcion: body.descripcion,
          codigo: body.codigo,
          foto: body.foto,
          precio: body.precio,
          stock: body.stock
        }
        : p
      )
    archiveProducts.updateAll(productos)
}

//Functions Cart
const addCart = async (body) => {
  return new Promise( (resolve, reject) => {
      let idNewCart = archiveCart.save(body)
      resolve(parseInt(idNewCart))
  })
}
const getCart = async (id) => {
  return new Promise( (resolve, reject) => {
    cart = archiveCart.getAll()
    resolve(cart)
  })
}
const addProductCart = async (id, product) => {
  return new Promise( (resolve, reject) => {
    let state = archiveCart.saveLvl2(id, product)
    resolve(state)
  })
}