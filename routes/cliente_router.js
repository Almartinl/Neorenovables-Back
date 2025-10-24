const express = require("express");
const clientesController = require("../controller/clientes_controller.js");

const clienteRouter = express.Router();

clienteRouter.get("/", clientesController.getClientes);
clienteRouter.post("/add_cliente", clientesController.addCliente);
clienteRouter.delete("/delete/:id", clientesController.deleteCliente);
clienteRouter.patch("/update/:id", clientesController.updateCliente);

module.exports = clienteRouter;
