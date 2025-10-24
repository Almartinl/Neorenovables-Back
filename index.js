// import cors from "cors";
// import express from "express";
// import dotenv from "dotenv";
// import logger from "morgan";
// import cookieParser from "cookie-parser";
// import db from "./services/mysql.js";
// import userRouter from "./routes/user_router.js";
// import productRouter from "./routes/product_router.js";
// import fileUpload from "express-fileupload";
// import { fileURLToPath } from "url";
// import { dirname, join } from "path";
// import configRouter from "./routes/config_router.js";
// import bungalowsRouter from "./routes/bungalows_router.js";
// import obrasRouter from "./routes/obras_router.js";
// import http from "http";

const cors = require("cors");
const express = require("express");
const dotenv = require("dotenv");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const db = require("./services/mysql.js");
const userRouter = require("./routes/user_router.js");
const productRouter = require("./routes/product_router.js");
const clienteRouter = require("./routes/cliente_router.js");
const fileUpload = require("express-fileupload");
const { fileURLToPath } = require("url");
const { dirname, join } = require("path");

// const configRouter = require("./routes/config_router.js");
// const bungalowsRouter = require("./routes/bungalows_router.js");
// const obrasRouter = require("./routes/obras_router.js");
const http = require("http");
const presupuestosRouter = require("./routes/presupuestos_router.js");
const colaboradorRouter = require("./routes/colaborador_router.js");
const agendaRouter = require("./routes/agenda_routes.js");

dotenv.config();

// Función para utilizar path en ES Modules (exportamos para utilizarla globalmente)
function currentDir() {
  const __filename = require("url").pathToFileURL("./public/pdfs").toString();
  const __dirname = dirname(__filename);
  return { __dirname, __filename };
}

const dirInfo = currentDir();
console.log(dirInfo.__filename);

//const { __dirname } = currentDir();

module.exports = dirInfo;

const app = express();

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || 3000);
app.set("port", port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */
/* eslint no-unreachable: */
function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  console.log("Listening on " + bind);
}

// middlware express
app.use(cors());
app.use(express.json());
app.use(express.text());
app.use(logger("dev"));
app.use(cookieParser());
app.use(express.static(join(__dirname, "public")));

// instanciamos la librería file upload y le añadimos propiedades.
app.use(
  fileUpload({
    createParentPath: true, // Crea la carpeta donde almacenamos las imágenes si no ha sido creada.
    limits: { fileSize: 20 * 1024 * 1024 }, // Limitamos el tamaño de la imagen a 20mb. Por defecto son 50mb.
    abortOnLimit: true, // Interrumpe la carga del archivo si supera el límite especificado.
    responseOnLimit: "Imagen demasiado grande", // Enviamos un mensaje de respuesta cuando se interrumpe la carga.
    uploadTimeout: 0, // Indicamos el tiempo de respuesta si se interrumpe la carga de la imagen.
  })
);

const routes = express.Router();

routes.use("/user", userRouter);

routes.use("/product", productRouter);

routes.use("/clientes", clienteRouter);

routes.use("/presupuestos", presupuestosRouter);

routes.use("/colaborador", colaboradorRouter);

routes.use("/agenda", agendaRouter);

// routes.use("/config", configRouter);

// routes.use("/bungalows", bungalowsRouter);

// routes.use("/obras", obrasRouter);

app.use("/api", routes);

// app.use("/user", userRouter);

// app.use("/product", productRouter);

// app.use("/config", configRouter);

// app.use("/bungalows", bungalowsRouter);

// app.use("/obras", obrasRouter)

// await db.createConnection();

db.createConnection();

module.exports = app;

// export default app;
