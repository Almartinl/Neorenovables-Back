const utils = require("../../utils/utils.js");
const db = require("../mysql.js");

const agendaQueries = {};

agendaQueries.getAgenda = async () => {
  const conn = await db.createConnection();
  try {
    return await db.query("SELECT * FROM agenda", [], "select", conn);
  } finally {
    conn && conn.end();
  }
};

agendaQueries.getAgendaByPresupuesto = async (id) => {
  const conn = await db.createConnection();
  try {
    return await db.query(
      "SELECT * FROM agenda WHERE presupuesto_id = ?",
      [id],
      "select",
      conn
    );
  } finally {
    conn && conn.end();
  }
};

agendaQueries.addCita = async (citaData, documentoUrl) => {
  const conn = await db.createConnection();
  try {
    const citaObj = {
      presupuesto_id: citaData.presupuesto_id,
      cita: citaData.cita,
      fecha_inicio: citaData.fecha_inicio,
      fecha_fin: citaData.fecha_fin,
      notas: citaData.notas,
      tipo: citaData.tipo,
      estado: citaData.estado,
      tecnicos: citaData.tecnicos,
      contacto: citaData.contacto,
      telefono: citaData.telefono,
      direccion: citaData.direccion,
      poblacion: citaData.poblacion,
      doc_url: documentoUrl,
    };

    const result = await db.query(
      "INSERT INTO agenda SET ?",
      citaObj,
      "insert",
      conn
    );
    return result;
  } finally {
    conn && conn.end();
  }
};

agendaQueries.deleteCita = async (id) => {
  const conn = await db.createConnection();
  try {
    return await db.query(
      "DELETE FROM agenda WHERE id = ?",
      [id],
      "delete",
      conn
    );
  } finally {
    conn && conn.end();
  }
};

agendaQueries.updateCita = async (id, citaData) => {
  let conn = null;
  try {
    conn = await db.createConnection();

    let citaObj = {
      presupuesto_id: citaData.presupuesto_id,
      cita: citaData.cita,
      fecha_inicio: citaData.fecha_inicio,
      fecha_fin: citaData.fecha_fin,
      notas: citaData.notas,
      tipo: citaData.tipo,
      estado: citaData.estado,
      tecnicos: citaData.tecnicos,
      contacto: citaData.contacto,
      telefono: citaData.telefono,
      direccion: citaData.direccion,
      poblacion: citaData.poblacion,
      doc_url: citaData.doc_url,
    };

    // 🔑 limpiamos los campos que no vienen en el body
    citaObj = await utils.removeUndefinedKeys(citaObj);

    return await db.query(
      "UPDATE agenda SET ? WHERE id = ?",
      [citaObj, id],
      "update",
      conn
    );
  } catch (e) {
    throw new Error(e);
  } finally {
    conn && (await conn.end());
  }
};

module.exports = agendaQueries;
