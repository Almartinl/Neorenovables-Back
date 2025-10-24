// import { currentDir } from "../index.js";
// import dao from "../services/dao.js";

const dao = require("../services/dao.js");

// const __dirname = currentDir().__dirname;

const controller = {};

controller.getAllObras = async (req, res) => {
  try {
    const getAllObras = await dao.getAllObras();
    if (getAllObras) return res.send(getAllObras);
  } catch (e) {
    console.log(e.message);
  }
};

controller.getAllObrasPublic = async (req, res) => {
  try {
    const getAllObrasPublic = await dao.getAllObrasPublic();
    if (getAllObrasPublic) return res.send(getAllObrasPublic);
  } catch (e) {
    console.log(e.message);
  }
};

controller.getCountObras = async (req, res) => {
  try {
    const getCountObras = await dao.getCountObras();
    if (getCountObras) return res.send(getCountObras);
  } catch (e) {
    console.log(e.message);
  }
};

controller.addObra = async (req, res) => {
  try {
    const imagenPrincipal = req.files.imagenPrincipal;

    let uploadPrincipal = "./public/images/products/" + imagenPrincipal.name;
    let uploadRelPrincipal = "/images/products/" + imagenPrincipal.name;
    const obra = await dao.addObra(req.body, uploadRelPrincipal);
    imagenPrincipal.mv(uploadPrincipal, (err) => {
      if (err) return res.status(500).send(err);
    });
    // Recorremos el array para procesar cada imagen
    if (req.files.imagen) {
      const images = !req.files.imagen.length
        ? [req.files.imagen]
        : req.files.imagen;
      images.forEach(async (image) => {
        // Ya podemos acceder a las propiedades del objeto image.
        // Obtenemos la ruta de la imagen.
        // let uploadPath = dirname + "/public/images/products/" + image.name;

        let uploadPath = "./public/images/products/" + image.name;
        let uploadRelPath = "/images/products/" + image.name;
        // Usamos el método mv() para ubicar el archivo en nuestro servidor
        image.mv(uploadPath, (err) => {
          if (err) return res.status(500).send(err);
        });

        await dao.addObraImage({ path: uploadRelPath, idObra: obra });
      });
    }
    return res.send("proyecto subido!");
  } catch (e) {
    console.log(e.message);
    return res.status(400).send(e.message);
  }
};

controller.updateObra = async (req, res) => {
  try {
    if (Object.entries(req.body).length === 0)
      return res.status(400).send("Error al recibir el body");
    await dao.updateObra(req.params.id, req.body);
    return res.send(`Obra con id ${req.params.id} modificado`);
  } catch (e) {
    console.log(e.message);
  }
};

module.exports = controller;
// export default controller;
