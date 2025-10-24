// import { currentDir } from "../index.js";
// import dao from "../services/dao.js";

const dao = require("../services/dao.js")

// const __dirname = currentDir().__dirname;

const controller = {};

controller.getCountModels = async (req, res) => {
  const {} = req.body;
  try {
    const models = await dao.getCountModels();

    if (models.length <= 0) return res.status(404).send("modelos no existe");

    return res.send(models);
  } catch (e) {
    console.log(e.message);
    return res.status(400).send(e.message);
  }
};

controller.getDisposicion = async (req, res) => {
  const {} = req.body;
  try {
    const config = await dao.getDisposicion();

    if (config.length <= 0) return res.status(404).send("disposicion no existe");

    return res.send(config);
  } catch (e) {
    console.log(e.message);
    return res.status(400).send(e.message);
  }
};

controller.getOrientacion = async (req, res) => {
  const { disposicion } = req.body;
  try {
    const config = await dao.getOrientacion(disposicion);

    if (config.length <= 0) return res.status(404).send("orientacion no existe");

    return res.send(config);
  } catch (e) {
    console.log(e.message);
    return res.status(400).send(e.message);
  }
};

controller.getModelo = async (req, res) => {
  const { orientacion } = req.body;
  try {
    const config = await dao.getModelo(orientacion);

    if (config.length <= 0) return res.status(404).send("modelo no existe");

    return res.send(config);
  } catch (e) {
    console.log(e.message);
    return res.status(400).send(e.message);
  }
};

controller.getTipo = async (req, res) => {
  const { modelo } = req.body;
  try {
    const config = await dao.getTipo(modelo);

    if (config.length <= 0) return res.status(404).send("tipo no existe");

    return res.send(config);
  } catch (e) {
    console.log(e.message);
    return res.status(400).send(e.message);
  }
};

controller.getBungalowa = async (req, res) => {
  const { tipo } = req.body;
  try {
    const config = await dao.getBungalowa(tipo);

    if (config.length <= 0) return res.status(404).send("bungalowa no existe");

    return res.send(config);
  } catch (e) {
    console.log(e.message);
    return res.status(400).send(e.message);
  }
};

controller.getBungalowb = async (req, res) => {
  const { bungalowa } = req.body;
  try {
    const config = await dao.getBungalowb(bungalowa);

    if (config.length <= 0) return res.status(404).send("bungalowb no existe");

    return res.send(config);
  } catch (e) {
    console.log(e.message);
    return res.status(400).send(e.message);
  }
};

controller.getBungalowc = async (req, res) => {
  const { bungalowb } = req.body;
  try {
    const config = await dao.getBungalowc(bungalowb);

    if (config.length <= 0) return res.status(404).send("bungalowc no existe");

    return res.send(config);
  } catch (e) {
    console.log(e.message);
    return res.status(400).send(e.message);
  }
};

controller.getModeloBungalowSimple = async (req, res) => {
  const { disposicion,orientacion,modelo,tipo } = req.body;
    
  try {
    const config = await dao.getModeloBungalowSimple({disposicion,orientacion,modelo,tipo});
    if (config.length <= 0) return res.status(404).send("modelo simple no existe");

    return res.send(config);
  } catch (e) {
    console.log(e.message);
    return res.status(400).send(e.message);
  }
};

controller.getModeloBungalowDoble = async (req, res) => {
  const { disposicion,orientacion,modelo,tipo,bungalowa,bungalowb } = req.body;
    
  try {
    const config = await dao.getModeloBungalowDoble({disposicion,orientacion,modelo,tipo,bungalowa,bungalowb});
    if (config.length <= 0) return res.status(404).send("modelo doble no existe");

    return res.send(config);
  } catch (e) {
    console.log(e.message);
    return res.status(400).send(e.message);
  }
};

controller.getModeloBungalowTriple = async (req, res) => {
  const { disposicion,orientacion,modelo,tipo,bungalowa,bungalowb,bungalowc } = req.body;
    
  try {
    const config = await dao.getModeloBungalowTriple({disposicion,orientacion,modelo,tipo,bungalowa,bungalowb,bungalowc});
    if (config.length <= 0) return res.status(404).send("modelo triple no existe");

    return res.send(config);
  } catch (e) {
    console.log(e.message);
    return res.status(400).send(e.message);
  }
};

module.exports = controller

// export default controller;
