const dao = require("../services/dao.js");

const agendaController = {};

agendaController.getAgenda = async (req, res) => {
  try {
    const citas = await dao.getAgenda();
    return res.status(200).json(citas);
  } catch (e) {
    console.error("Error:", e.message);
    return res.status(400).send(e.message);
  }
};

agendaController.getAgendaByPresupuesto = async (req, res) => {
  try {
    const { id } = req.params;
    const citas = await dao.getAgendaByPresupuesto(id);
    return res.status(200).json(citas);
  } catch (e) {
    return res.status(400).send(e.message);
  }
};

agendaController.addCita = async (req, res) => {
  try {
    let documentoUrl = null;

    // Si se sube un PDF (campo 'documento')
    if (req.files && req.files.doc_url) {
      const pdf = req.files.doc_url;
      const uploadPath = "./public/documentos/citas/" + pdf.name;
      documentoUrl = "/documentos/citas/" + pdf.name;

      // Guardar el archivo
      pdf.mv(uploadPath, (err) => {
        if (err) {
          console.error("Error al guardar el PDF:", err);
          return res.status(500).send("Error al guardar el documento");
        }
      });
    }

    const addCita = await dao.addCita(req.body, documentoUrl);

    return res.status(200).json({
      message: "Cita creada correctamente",
      id: addCita,
    });
  } catch (e) {
    console.error("Error:", e.message);
    return res.status(400).send(e.message);
  }
};

agendaController.deleteCita = async (req, res) => {
  try {
    const { id } = req.params;
    await dao.deleteCita(id);
    return res.status(200).json({ message: "Cita eliminada" });
  } catch (e) {
    return res.status(400).send(e.message);
  }
};

agendaController.updateCita = async (req, res) => {
  try {
    let documentoUrl = null;

    // Si se sube un PDF (campo 'documento')
    if (req.files && req.files.doc_url) {
      const pdf = req.files.doc_url;
      const uploadPath = "./public/documentos/citas/" + pdf.name;
      documentoUrl = "/documentos/citas/" + pdf.name;

      // Guardar el archivo
      pdf.mv(uploadPath, (err) => {
        if (err) {
          console.error("Error al guardar el PDF:", err);
          return res.status(500).send("Error al guardar el documento");
        }
      });
    }
    const { id } = req.params;

    const datosCita = {
      ...req.body,
      ...(documentoUrl && { doc_url: documentoUrl }),
    };

    await dao.updateCita(id, datosCita);
    return res.status(200).json({ message: "Cita actualizada" });
  } catch (e) {
    return res.status(400).send(e.message);
  }
};

module.exports = agendaController;
