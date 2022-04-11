const Contenedor = require('../class/contenedor') //manejo de archivos
const archiveProducts = new Contenedor('./src/data/products.txt')
const archiveCart = new Contenedor('./src/data/cart.txt')


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
const updateProduct = async (body, id) => {
    const products = await archiveProducts.getAll()
    const productos = products.map(p =>
    p.id === String(id)
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
        resolve(idNewCart)
    })
}
const getCart = async () => {
    return new Promise( (resolve, reject) => {
      cart = archiveCart.getAll()
      resolve(cart)
    })
}
const addProductCart = async (id, idProduct) => {
    const products = await archiveProducts.getAll()
    const product = products.filter(producto => String(producto.id) === String(idProduct))
    return new Promise( (resolve, reject) => {
      let state = archiveCart.saveLvl2(id, ...product)
      resolve(state)
    })
}

module.exports = {getProducts, addProduct, updateProduct, archiveProducts, getCart, addCart, addProductCart, archiveCart}
