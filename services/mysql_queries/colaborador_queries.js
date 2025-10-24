const db = require("../mysql.js");
const utils = require("../../utils/utils.js");

const colaboradorQueries = {};

colaboradorQueries.getColaboradores = async () => {
  let conn = null;
  try {
    conn = await db.createConnection();
    return await db.query("SELECT * FROM colaboradores", [], "select", conn);
  } catch (e) {
    throw new Error(e);
  } finally {
    conn && (await conn.end());
  }
};

colaboradorQueries.addColaborador = async (colaboradorData, img) => {
  let conn = null;

  try {
    conn = await db.createConnection();

    let colaboradorObj = {
      colaborador: colaboradorData.colaborador,
      logo: img,
    };
    return await db.query(
      "INSERT INTO colaboradores SET ? ",
      colaboradorObj,
      "insert",
      conn
    );
  } catch (e) {
    throw new Error(e);
  } finally {
    conn && (await conn.end());
  }
};

colaboradorQueries.updateColaborador = async (id, colaboradorData) => {
  let conn = null;
  try {
    conn = await db.createConnection();
    let colaboradorObj = {
      colaborador: colaboradorData.colaborador,
      logo: colaboradorData.logo,
    };
    // Eliminamos los campos que no se van a modificar (no llegan por el body)
    colaboradorObj = await utils.removeUndefinedKeys(colaboradorObj);

    return await db.query(
      "UPDATE colaboradores SET ? WHERE id = ?",
      [colaboradorObj, id],
      "update",
      conn
    );
  } catch (e) {
    throw new Error(e);
  } finally {
    conn && (await conn.end());
  }
};

colaboradorQueries.deleteColaborador = async (id) => {
  let conn = null;
  try {
    conn = await db.createConnection();
    return await db.query(
      "DELETE FROM colaboradores WHERE id = ?",
      [id],
      "delete",
      conn
    );
  } catch (e) {
    throw new Error(e);
  } finally {
    conn && (await conn.end());
  }
};

module.exports = colaboradorQueries;
