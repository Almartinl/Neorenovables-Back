// import db from "../mysql.js";

const db = require("../mysql.js")

const bungalowsQueries = {};

bungalowsQueries.addBungalows = async (bungalowsData) => {
  let conn = null;
  try {
    conn = await db.createConnection();
    console.log(bungalowsData);
    let bungalowObj = {
      nombre: bungalowsData.nombre,
      usuario: bungalowsData.usuario,
      planta: bungalowsData.planta,
      nombrebungalow: bungalowsData.nombrebungalow,
    };
    return await db.query(
      "INSERT INTO bungalows SET ?",
      bungalowObj,
      "insert",
      conn
    );
  } catch (e) {
    throw new Error(e);
  } finally {
    conn && (await conn.end());
  }
};

bungalowsQueries.getAllBungalow = async (usuario) => {
  let conn = null;
  try {
    conn = await db.createConnection();
    return await db.query(
      "SELECT bungalows.id, bungalows.usuario, bungalows.nombre, bungalows.planta, modelosbungalow.nombre as nombrebungalow FROM bungalows join modelosbungalow on bungalows.nombrebungalow = modelosbungalow.id where bungalows.usuario = ? ",
      [usuario],
      "select",
      conn
    );
  } catch (e) {
    throw new Error(e);
  } finally {
    conn && (await conn.end());
  }
};

bungalowsQueries.deleteBungalowById = async (id) => {
  let conn = null;
  try {
    conn = await db.createConnection();
    return await db.query(
      "DELETE FROM bungalows WHERE id =?",
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

bungalowsQueries.addPresupuesto = async (presupuestoData) => {
  let conn = null;
  try {
    conn = await db.createConnection();
    console.log(presupuestoData);
    let bungalowObj = {
      usuario: presupuestoData.usuario,
      descripcion: presupuestoData.descripcion,
    };
    return await db.query(
      "INSERT INTO presupuestos SET ?",
      bungalowObj,
      "insert",
      conn
    );
  } catch (e) {
    throw new Error(e);
  } finally {
    conn && (await conn.end());
  }
};

bungalowsQueries.getAllPresupuesto = async () => {
  let conn = null;
  try {
    conn = await db.createConnection();
    return await db.query(
      "SELECT presupuestos.id, usuarios.nombre, usuarios.email, presupuestos.descripcion FROM presupuestos join usuarios on presupuestos.usuario = usuarios.id",
      [],
      "select",
      conn
    );
  } catch (e) {
    throw new Error(e);
  } finally {
    conn && (await conn.end());
  }
};

bungalowsQueries.deletePresupuestoById = async (id) => {
  let conn = null;
  try {
    conn = await db.createConnection();
    return await db.query(
      "DELETE FROM presupuestos WHERE id =?",
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

bungalowsQueries.getCountPresupuesto = async () => {
  let conn = null;
  try {
    conn = await db.createConnection();
    return await db.query(
      "SELECT COUNT(*) as presupuesto FROM presupuestos",
      [],
      "select",
      conn
    );
  } catch (e) {
    throw new Error(e);
  } finally {
    conn && (await conn.end());
  }
};

module.exports = bungalowsQueries;

// export default bungalowsQueries;
