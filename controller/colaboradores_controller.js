// import { currentDir } from "../index.js";
// import dao from "../services/dao.js";

const dao = require("../services/dao.js");

// const __dirname = currentDir().__dirname;

const controller = {};

controller.getColaboradores = async (req, res) => {
  try {
    const colaboradores = await dao.getColaboradores();
    if (colaboradores) return res.send(colaboradores);
  } catch (e) {
    console.log(e.message);
    return res.status(400).send(e.message);
  }
};

controller.addColaborador = async (req, res) => {
  try {
    const logo = req.files.logo;

    let uploadLogo = "./public/img/logos/" + logo.name;
    let uploadRelLogo = "/img/logos/" + logo.name;
    const obra = await dao.addColaborador(req.body, uploadRelLogo);
    logo.mv(uploadLogo, (err) => {
      if (err) return res.status(500).send(err);
    });
    if (obra) {
      return res.send("proyecto subido!");
    }
  } catch (e) {
    console.log(e.message);
    return res.status(400).send(e.message);
  }
};

controller.updateColaborador = async (req, res) => {
  try {
    const id = req.params.id;
    const colaboradorData = req.body;

    // Si se envía una nueva imagen, se maneja la subida
    if (req.files && req.files.logo) {
      const logo = req.files.logo;
      let uploadLogo = "./public/img/logos/" + logo.name;
      let uploadRelLogo = "/img/logos/" + logo.name;

      colaboradorData.logo = uploadRelLogo; // Actualizamos el logo en los datos del colaborador

      logo.mv(uploadLogo, (err) => {
        if (err) return res.status(500).send(err);
      });
    }

    const updatedColaborador = await dao.updateColaborador(id, colaboradorData);
    if (updatedColaborador) {
      return res.send("Colaborador actualizado correctamente!");
    }
  } catch (e) {
    console.log(e.message);
    return res.status(400).send(e.message);
  }
};

controller.deleteColaborador = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedColaborador = await dao.deleteColaborador(id);
    if (deletedColaborador) {
      return res.send("Colaborador eliminado correctamente!");
    }
  } catch (e) {
    console.log(e.message);
    return res.status(400).send(e.message);
  }
};

module.exports = controller;
// export default controller;
