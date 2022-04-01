const express = require('express')
const http = require("http");
const Contenedor = require('./class/contenedor')

var moment = require('moment'); // vamos a usar moment para obtener la fecha y hora actual
const app = express();
const { engine } = require("express-handlebars");
const server = http.createServer(app);
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());

const io = new Server(server, {});

const controllerArchive = new Contenedor('./src/data/messages.txt')
let messages = [] //inicializamos nuestro array de mensajes
const products = [] //inicializamos nuestro array de productos

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

io.on("connection", (socket) => {
    // Mensaje de bienvenida cuando se conecta un cliente nuevo
    console.log("Un nuevo usuario se ha conectado!");
    socket.emit("mensajeBienvenida", "Bienvenido al desafio numero 6 mas mamoncito");

    //msj cuando el usuario se deconecta
    socket.on("disconnect", () => {
      console.log("❌ Usuario desconectado");
    });

    //desde el back enviamos los productos agregados a todos los usuarios conectados
    io.sockets.emit("productsSendBack", products)
    getMsg()
        .then((messages)=>{
            io.sockets.emit("messagesSendBack", messages);
        })

    //Recibimos los productos añadidos desde el form
    socket.on("addProduct", (data) => {
        products.push(data);
        io.sockets.emit("productsSendBack", products);
    });

    //Recibimos el mensaje añadido desde el form, lo guardamos en nuestro archivo local con la funcion addMsg
    //y emitimos la funcion messagesSendBack con el contenido de nuestro archivo(los mensajes guardados)
    socket.on("addMessage", (msj) => {
        const date = moment().format("DD/MM/YYYY hh:mm:ss")
        //añadimos la fecha y hora actual al mensaje
        msj = {
            ...msj,
            date
        }
        addMsg(msj)
            .then(()=>{
                getMsg()
                    .then((messages)=>{
                        io.sockets.emit("messagesSendBack", messages);
                    })
            })
    });
});


app.get("/", (req, res) => {
    res.render("main", {
        products
    });
});
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"));

const PORT=8080
server.listen(PORT, ()=>{
console.log(`server started http://localhost:8080`)
})

server.on('error', (err)=> console.log(err))

//Funciones 
const getMsg = async () => {
    return new Promise( (resolve, reject) => {
        messages = controllerArchive.getAll()
        resolve(messages)
    })
}
const addMsg = async (msj) => {
    return new Promise( (resolve, reject) => {
        resolve(controllerArchive.save(msj))
    })
}