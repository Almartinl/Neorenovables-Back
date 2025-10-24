// import express from "express";
// import configController from "../controller/configurador_controller.js";

const express = require("express");
const configController = require("../controller/configurador_controller.js")

const configRouter = express.Router();

configRouter.get("/", configController.getCountModels);

configRouter.get("/disposicion", configController.getDisposicion);

configRouter.post("/orientacion", configController.getOrientacion);

configRouter.post("/modelo", configController.getModelo);

configRouter.post("/tipo", configController.getTipo);

configRouter.post("/bungalowa", configController.getBungalowa)

configRouter.post("/bungalowb", configController.getBungalowb)

configRouter.post("/bungalowc", configController.getBungalowc)

configRouter.post("/modelosimple", configController.getModeloBungalowSimple)

configRouter.post("/modelodoble", configController.getModeloBungalowDoble)

configRouter.post("/modelotriple", configController.getModeloBungalowTriple)

module.exports = configRouter

// export default configRouter;
