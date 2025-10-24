const dirInfo = require("../index.js");
const dao = require("../services/dao.js");

const controller = {};

controller.getClientes = async (req, res) => {
  try {
    const cliente = await dao.getClientes();
    console.log(cliente);
    // Si no existe devolvemos un 404 (not found)
    if (cliente.length <= 0) return res.status(404).send("clientes no existe");

    return res.send(cliente);
  } catch (e) {
    console.log(e.message);
    return res.status(400).send(e.message);
  }
};

controller.addCliente = async (req, res) => {
  try {
    const clienteData = req.body;
    const cliente = await dao.addCliente(clienteData);
    console.log(cliente);
    // Si no existe devolvemos un 404 (not found)
    if (cliente.length <= 0) return res.status(404).send("clientes no existe");

    return res.send(`Cliente con id: ${cliente} registrado`);
  } catch (e) {
    console.log(e.message);
    return res.status(400).send(e.message);
  }
};

controller.deleteCliente = async (req, res) => {
  try {
    const id = req.params.id;
    const cliente = await dao.deleteCliente(id);
    console.log(cliente);
    // Si no existe devolvemos un 404 (not found)
    if (cliente.length <= 0) return res.status(404).send("clientes no existe");

    return res.send(`Cliente con id: ${id} eliminado`);
  } catch (e) {
    console.log(e.message);
    return res.status(400).send(e.message);
  }
};

controller.updateCliente = async (req, res) => {
  try {
    const id = req.params.id;
    const clienteData = req.body;
    const cliente = await dao.updateCliente(id, clienteData);
    console.log(cliente);
    // Si no existe devolvemos un 404 (not found)
    if (cliente.length <= 0) return res.status(404).send("clientes no existe");

    return res.send(`Cliente con id: ${id} actualizado`);
  } catch (e) {
    console.log(e.message);
    return res.status(400).send(e.message);
  }
};

module.exports = controller;
