const dao = require("../services/dao.js");

const controller = {};

controller.getAllEstudios = async (req, res) => {
  try {
    const usuarioId = req.query.usuario_id || req.body.usuario_id; // Desde query param o body

    if (!usuarioId) {
      return res.status(400).send("usuario_id es requerido");
    }

    const estudios = await dao.getAllEstudios(usuarioId);
    console.log(estudios);
    if (estudios.length <= 0) return res.status(404).send("No hay estudios");

    return res.send(estudios);
  } catch (e) {
    console.log(e.message);
    return res.status(400).send(e.message);
  }
};

controller.getAllEstudiosAdmin = async (req, res) => {
  try {
    const estudios = await dao.getAllEstudiosAdmin();
    console.log(estudios);
    if (estudios.length <= 0) return res.status(404).send("No hay estudios");

    return res.send(estudios);
  } catch (e) {
    console.log(e.message);
    return res.status(400).send(e.message);
  }
};
controller.getEstudioById = async (req, res) => {
  try {
    const id = req.params.id;
    const estudio = await dao.getEstudioById(id);
    console.log(estudio);
    if (!estudio) return res.status(404).send("Estudio no encontrado");

    return res.send(estudio);
  } catch (e) {
    console.log(e.message);
    return res.status(400).send(e.message);
  }
};

controller.getEstudiosByCliente = async (req, res) => {
  try {
    const clienteId = req.params.clienteId;
    const estudios = await dao.getEstudiosByCliente(clienteId);
    console.log(estudios);
    if (estudios.length <= 0)
      return res.status(404).send("El cliente no tiene estudios");

    return res.send(estudios);
  } catch (e) {
    console.log(e.message);
    return res.status(400).send(e.message);
  }
};

controller.addEstudio = async (req, res) => {
  try {
    const estudioData = req.body;
    const estudioId = await dao.addEstudio(estudioData);
    console.log(estudioId);

    return res.send({
      id: estudioId,
      message: `Estudio con id: ${estudioId} registrado`,
    });
  } catch (e) {
    console.log(e.message);
    return res.status(400).send(e.message);
  }
};

controller.updateEstudio = async (req, res) => {
  try {
    const id = req.params.id;
    const estudioData = req.body;
    const estudio = await dao.updateEstudio(id, estudioData);
    console.log(estudio);

    return res.json({
      success: true,
      message: `Estudio con id: ${id} actualizado`,
    });
  } catch (e) {
    console.log(e.message);
    return res.status(400).send(e.message);
  }
};

controller.updateEstadoEstudio = async (req, res) => {
  try {
    const id = req.params.id;
    const { estado } = req.body;

    if (!estado) {
      return res.status(400).json({
        success: false,
        error: "El campo estado es requerido",
      });
    }

    await dao.updateEstadoEstudio(id, estado);

    return res.json({
      success: true,
      message: `Estado del estudio ${id} actualizado a ${estado}`,
    });
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({
      success: false,
      error: e.message,
    });
  }
};

controller.deleteEstudio = async (req, res) => {
  try {
    const id = req.params.id;
    const estudio = await dao.deleteEstudio(id);
    console.log(estudio);
    if (estudio <= 0) return res.status(404).send("Estudio no existe");

    return res.send(`Estudio con id: ${id} eliminado`);
  } catch (e) {
    console.log(e.message);
    return res.status(400).send(e.message);
  }
};

module.exports = controller;
