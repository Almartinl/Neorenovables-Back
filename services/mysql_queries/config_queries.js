// import db from "../mysql.js";

const db = require("../mysql.js")

const configQueries = {};

configQueries.getCountModels = async () => {
  let conn = null;
  try {
    conn = await db.createConnection();
    return await db.query(
      "select count(*) as modelos from modelosbungalow",
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

configQueries.getDisposicion = async () => {
  let conn = null;
  try {
    conn = await db.createConnection();
    return await db.query("select * from disposicion", [], "select", conn);
  } catch (e) {
    throw new Error(e);
  } finally {
    conn && (await conn.end());
  }
};

configQueries.getOrientacion = async (disposicion) => {
  let conn = null;
  try {
    conn = await db.createConnection();
    return await db.query(
      "select * from orientacion where disposicion = ?",
      disposicion,
      "select",
      conn
    );
  } catch (e) {
    throw new Error(e);
  } finally {
    conn && (await conn.end());
  }
};

configQueries.getModelo = async (orientacion) => {
  let conn = null;
  try {
    conn = await db.createConnection();
    return await db.query(
      "select * from modelo where orientacion = ?",
      orientacion,
      "select",
      conn
    );
  } catch (e) {
    throw new Error(e);
  } finally {
    conn && (await conn.end());
  }
};

configQueries.getTipo = async (modelo) => {
  let conn = null;
  try {
    conn = await db.createConnection();
    return await db.query(
      "select * from tipo where modelo = ?",
      modelo,
      "select",
      conn
    );
  } catch (e) {
    throw new Error(e);
  } finally {
    conn && (await conn.end());
  }
};

configQueries.getBungalowa = async (tipo) => {
  let conn = null;
  try {
    conn = await db.createConnection();
    return await db.query(
      "select * from bungalowa where tipo = ?",
      tipo,
      "select",
      conn
    );
  } catch (e) {
    throw new Error(e);
  } finally {
    conn && (await conn.end());
  }
};

configQueries.getBungalowb = async (bungalowa) => {
  let conn = null;
  try {
    conn = await db.createConnection();
    return await db.query(
      "select * from bungalowb where bungalowa = ?",
      bungalowa,
      "select",
      conn
    );
  } catch (e) {
    throw new Error(e);
  } finally {
    conn && (await conn.end());
  }
};

configQueries.getBungalowc = async (bungalowb) => {
  let conn = null;
  try {
    conn = await db.createConnection();
    return await db.query(
      "select * from bungalowc where bungalowb = ?",
      bungalowb,
      "select",
      conn
    );
  } catch (e) {
    throw new Error(e);
  } finally {
    conn && (await conn.end());
  }
};

configQueries.getModeloBungalowSimple = async ({
  disposicion,
  orientacion,
  modelo,
  tipo,
}) => {
  let conn = null;
  try {
    conn = await db.createConnection();
    return await db.query(
      "select planta, modelo3d, id from modelosbungalow where disposicion = ? and orientacion = ? and modelo = ? and tipo = ?",
      [disposicion, orientacion, modelo, tipo],
      "select",
      conn
    );
  } catch (e) {
    throw new Error(e);
  } finally {
    conn && (await conn.end());
  }
};

configQueries.getModeloBungalowDoble = async ({
  disposicion,
  orientacion,
  modelo,
  tipo,
  bungalowa,
  bungalowb,
}) => {
  let conn = null;
  try {
    conn = await db.createConnection();
    return await db.query(
      "select planta, modelo3d, id from modelosbungalow where disposicion = ? and orientacion = ? and modelo = ? and tipo = ? and bungalowa = ? and bungalowb = ?",

      [disposicion, orientacion, modelo, tipo, bungalowa, bungalowb],
      "select",
      conn
    );
  } catch (e) {
    throw new Error(e);
  } finally {
    conn && (await conn.end());
  }
};

configQueries.getModeloBungalowTriple = async ({
  disposicion,
  orientacion,
  modelo,
  tipo,
  bungalowa,
  bungalowb,
  bungalowc,
}) => {
  let conn = null;
  try {
    conn = await db.createConnection();
    return await db.query(
      "select planta, modelo3d, id from modelosbungalow where disposicion = ? and orientacion = ? and modelo = ? and tipo = ? and bungalowa = ? and bungalowb = ? and bungalowc = ?",

      [disposicion, orientacion, modelo, tipo, bungalowa, bungalowb, bungalowc],
      "select",
      conn
    );
  } catch (e) {
    throw new Error(e);
  } finally {
    conn && (await conn.end());
  }
};

module.exports = configQueries

// export default configQueries;
