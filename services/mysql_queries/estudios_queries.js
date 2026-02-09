// backend/queries/estudioQueries.js

const utils = require("../../utils/utils.js");
const db = require("../mysql.js");

const estudioQueries = {};

// ==================== OBTENER ESTUDIOS ====================

estudioQueries.getAllEstudios = async (usuarioId) => {
  let conn = null;
  try {
    conn = await db.createConnection();
    return await db.query(
      `SELECT e.*, u.nombre as comercial, u.apellido as apellido
       FROM estudios e
       LEFT JOIN users u ON e.usuario_id = u.id
       WHERE e.usuario_id = ?
       ORDER BY e.created_at DESC`,
      [usuarioId],
      "select",
      conn,
    );
  } catch (e) {
    throw new Error(e);
  } finally {
    conn && (await conn.end());
  }
};

estudioQueries.getAllEstudiosAdmin = async () => {
  let conn = null;
  try {
    conn = await db.createConnection();
    return await db.query(
      `SELECT e.*, u.nombre as comercial, u.apellido as apellido
             FROM estudios e
                LEFT JOIN users u ON e.usuario_id = u.id
                ORDER BY e.created_at DESC`,
      [],
      "select",
      conn,
    );
  } catch (e) {
    throw new Error(e);
  } finally {
    conn && (await conn.end());
  }
};

estudioQueries.getEstudioById = async (id) => {
  let conn = null;
  try {
    conn = await db.createConnection();

    const estudio = await db.query(
      `SELECT e.*, 
              ec.tiene_factura, ec.consumo_anual, ec.consumo_mensual, 
              ec.potencia_contratada, ec.precio_energia, ec.precio_potencia, ec.excedentes,
              ei.map_center, ei.zoom, ei.map_type, ei.zonas, ei.panels, 
              ei.map_base_image, ei.desglose_zonas, ei.map_json, ei.total_panels, 
              ei.total_power_kw, ei.total_annual_production,
              eco.panel_potencia, eco.panel_fabricante, eco.inversor_seleccionado,
              eco.inversor_producto_id, eco.inversor_custom, eco.inversor_fabricante,
              eco.inversor_potencia, eco.inversor_precio, eco.bateria_seleccionada,
              eco.bateria_producto_id, eco.bateria_custom, eco.bateria_fabricante,
              eco.bateria_capacidad, eco.bateria_precio, eco.precio_por_watio, eco.energy_meter
       FROM estudios e
       LEFT JOIN estudios_consumo ec ON e.id = ec.estudio_id
       LEFT JOIN estudios_instalacion ei ON e.id = ei.estudio_id
       LEFT JOIN estudios_componentes eco ON e.id = eco.estudio_id
       WHERE e.id = ?`,
      [id],
      "select",
      conn,
    );

    if (estudio.length === 0) return null;

    const result = estudio[0];
    const parseJSONSafe = (data, defaultValue = null) => {
      if (!data) return defaultValue;

      // Si ya es un objeto/array, devolverlo directamente
      if (typeof data === "object") return data;

      // Si es string, intentar parsearlo
      if (typeof data === "string") {
        try {
          return JSON.parse(data);
        } catch (e) {
          console.error("Error parsing JSON string:", data.substring(0, 100));
          return defaultValue;
        }
      }

      return defaultValue;
    };

    // Aplicar parseJSONSafe a todos los campos JSON
    result.consumo_mensual = parseJSONSafe(
      result.consumo_mensual,
      Array(12).fill(0),
    );
    result.map_center = parseJSONSafe(result.map_center, {
      lat: 36.7213,
      lng: -4.4214,
    });
    result.zonas = parseJSONSafe(result.zonas, []);
    result.panels = parseJSONSafe(result.panels, []);
    result.desglose_zonas = parseJSONSafe(result.desglose_zonas, []);

    return result;
  } catch (e) {
    throw new Error(e);
  } finally {
    conn && (await conn.end());
  }
};

// ==================== CREAR ESTUDIO ====================

estudioQueries.addEstudio = async (estudioData) => {
  let conn = null;
  try {
    conn = await db.createConnection();

    // 1. Insertar estudio principal
    let estudioObj = {
      usuario_id: estudioData.usuario_id,
      nombre: estudioData.nombre || null,
      direccion: estudioData.direccion,
      poblacion: estudioData.poblacion || null,
      estado: estudioData.estado || "borrador",
      confianza_estudio: estudioData.confianza_estudio || null,
    };

    const estudioId = await db.query(
      "INSERT INTO estudios SET ?",
      estudioObj,
      "insert",
      conn,
    );

    // 2. Insertar consumo (MISMA conexión)
    if (estudioData.consumo) {
      const consumoMensualLimpio = (
        estudioData.consumo.consumoMensual || []
      ).map((v) => parseFloat(v) || 0);
      let consumoObj = {
        estudio_id: estudioId,
        tiene_factura: estudioData.consumo.tieneFactura ? 1 : 0,
        consumo_anual: estudioData.consumo.consumoAnual || null,
        consumo_mensual: JSON.stringify(consumoMensualLimpio),
        potencia_contratada: estudioData.consumo.potenciaContratada || null,
        precio_energia: estudioData.consumo.precioEnergia || null,
        precio_potencia: estudioData.consumo.precioPotencia || null,
        excedentes: estudioData.consumo.excedentes || null,
      };

      await db.query(
        "INSERT INTO estudios_consumo SET ?",
        consumoObj,
        "insert",
        conn,
      );
    }

    // 3. Insertar instalación (MISMA conexión)
    if (estudioData.instalacion) {
      const zonasLimpias = Array.isArray(estudioData.instalacion.zonas)
        ? estudioData.instalacion.zonas
        : [];

      const panelsLimpios = Array.isArray(estudioData.instalacion.panels)
        ? estudioData.instalacion.panels
        : [];

      const desgloseZonasLimpio = Array.isArray(
        estudioData.instalacion.desgloseZonas,
      )
        ? estudioData.instalacion.desgloseZonas
        : [];

      const mapCenterLimpio = estudioData.instalacion.mapCenter || {
        lat: 36.7213,
        lng: -4.4214,
      };
      // ✅ Procesar mapJson correctamente
      let mapJsonString = null;
      if (estudioData.instalacion.mapJson) {
        try {
          // Siempre hacer stringify porque llega como objeto desde el frontend
          mapJsonString =
            typeof estudioData.instalacion.mapJson === "string"
              ? estudioData.instalacion.mapJson
              : JSON.stringify(estudioData.instalacion.mapJson);

          console.log(
            "✅ Backend - mapJson procesado, tamaño:",
            mapJsonString.length,
            "caracteres",
          );
        } catch (e) {
          console.error("❌ Backend - Error procesando mapJson:", e);
          mapJsonString = null;
        }
      }

      let instalacionObj = {
        estudio_id: estudioId,
        map_center: JSON.stringify(mapCenterLimpio),
        zoom: estudioData.instalacion.zoom || null,
        map_type: estudioData.instalacion.mapType || "satellite",
        zonas: JSON.stringify(zonasLimpias),
        panels: JSON.stringify(panelsLimpios),
        map_base_image: estudioData.instalacion.mapBaseImage || null,
        desglose_zonas: JSON.stringify(desgloseZonasLimpio),
        total_panels: estudioData.instalacion.totales?.totalPanels || 0,
        total_power_kw: estudioData.instalacion.totales?.totalPowerKw || 0,
        total_annual_production:
          estudioData.instalacion.totales?.totalAnnualProduction || 0,
        map_json: mapJsonString, // ✅ Usar el string procesado
      };

      await db.query(
        "INSERT INTO estudios_instalacion SET ?",
        instalacionObj,
        "insert",
        conn,
      );
    }

    // 4. Insertar componentes (MISMA conexión)
    if (estudioData.componentes) {
      let componentesObj = {
        estudio_id: estudioId,
        panel_potencia: estudioData.componentes.panelPotencia || null,
        panel_fabricante: estudioData.componentes.panelFabricante || null,
        inversor_seleccionado:
          estudioData.componentes.inversorSeleccionado || null,
        inversor_producto_id:
          estudioData.componentes.inversorProductoId || null,
        inversor_custom: estudioData.componentes.inversorCustom ? 1 : 0,
        inversor_fabricante: estudioData.componentes.inversorFabricante || null,
        inversor_potencia: estudioData.componentes.inversorPotencia || null,
        inversor_precio: estudioData.componentes.inversorPrecio || null,
        bateria_seleccionada:
          estudioData.componentes.bateriaSeleccionada || null,
        bateria_producto_id: estudioData.componentes.bateriaProductoId || null,
        bateria_custom: estudioData.componentes.bateriaCustom ? 1 : 0,
        bateria_fabricante: estudioData.componentes.bateriaFabricante || null,
        bateria_capacidad: estudioData.componentes.bateriaCapacidad || null,
        bateria_precio: estudioData.componentes.bateriaPrecio || null,
        precio_por_watio: estudioData.componentes.precioPorWatio || null,
        energy_meter: estudioData.componentes.energyMeter ? 1 : 0,
      };

      await db.query(
        "INSERT INTO estudios_componentes SET ?",
        componentesObj,
        "insert",
        conn,
      );
    }

    return estudioId;
  } catch (e) {
    throw new Error(e);
  } finally {
    conn && (await conn.end());
  }
};

estudioQueries.updateEstadoEstudio = async (id, estado) => {
  const conn = await db.createConnection();

  await db.query(
    "UPDATE estudios SET estado = ? WHERE id = ?",
    [estado, id],
    "update",
    conn,
  );

  await conn.end();
};

// ==================== ACTUALIZAR ESTUDIO ====================

estudioQueries.updateEstudio = async (id, estudioData) => {
  let conn = null;
  try {
    conn = await db.createConnection();

    // 1. Actualizar estudio principal
    let estudioObj = {
      nombre: estudioData.nombre,
      direccion: estudioData.direccion,
      poblacion: estudioData.poblacion,
      estado: estudioData.estado,
      confianza_estudio: estudioData.confianza_estudio,
    };
    estudioObj = await utils.removeUndefinedKeys(estudioObj);

    await db.query(
      "UPDATE estudios SET ? WHERE id = ?",
      [estudioObj, id],
      "update",
      conn,
    );

    // 2. Actualizar consumo (MISMA conexión)
    if (estudioData.consumo) {
      const consumoMensualLimpio = (
        estudioData.consumo.consumoMensual || []
      ).map((v) => parseFloat(v) || 0);
      let consumoObj = {
        tiene_factura: estudioData.consumo.tieneFactura ? 1 : 0,
        consumo_anual: estudioData.consumo.consumoAnual,
        consumo_mensual: JSON.stringify(consumoMensualLimpio),
        potencia_contratada: estudioData.consumo.potenciaContratada,
        precio_energia: estudioData.consumo.precioEnergia,
        precio_potencia: estudioData.consumo.precioPotencia,
        excedentes: estudioData.consumo.excedentes,
      };
      consumoObj = await utils.removeUndefinedKeys(consumoObj);

      await db.query(
        "UPDATE estudios_consumo SET ? WHERE estudio_id = ?",
        [consumoObj, id],
        "update",
        conn,
      );
    }

    // 3. Actualizar instalación (MISMA conexión)
    if (estudioData.instalacion) {
      const zonasLimpias = Array.isArray(estudioData.instalacion.zonas)
        ? estudioData.instalacion.zonas
        : [];

      const panelsLimpios = Array.isArray(estudioData.instalacion.panels)
        ? estudioData.instalacion.panels
        : [];

      const desgloseZonasLimpio = Array.isArray(
        estudioData.instalacion.desgloseZonas,
      )
        ? estudioData.instalacion.desgloseZonas
        : [];

      const mapCenterLimpio = estudioData.instalacion.mapCenter || {
        lat: 36.7213,
        lng: -4.4214,
      };

      // ✅ Procesar mapJson correctamente
      let mapJsonString = null;
      if (estudioData.instalacion.mapJson) {
        try {
          mapJsonString =
            typeof estudioData.instalacion.mapJson === "string"
              ? estudioData.instalacion.mapJson
              : JSON.stringify(estudioData.instalacion.mapJson);

          console.log(
            "✅ Backend - mapJson actualizado, tamaño:",
            mapJsonString.length,
            "caracteres",
          );
        } catch (e) {
          console.error("❌ Backend - Error procesando mapJson:", e);
          mapJsonString = null;
        }
      }

      let instalacionObj = {
        map_center: JSON.stringify(mapCenterLimpio),
        zoom: estudioData.instalacion.zoom,
        map_type: estudioData.instalacion.mapType,
        zonas: JSON.stringify(zonasLimpias),
        panels: JSON.stringify(panelsLimpios),
        map_base_image: estudioData.instalacion.mapBaseImage,
        desglose_zonas: JSON.stringify(desgloseZonasLimpio),
        total_panels: estudioData.instalacion.totales?.totalPanels || 0,
        total_power_kw: estudioData.instalacion.totales?.totalPowerKw || 0,
        total_annual_production:
          estudioData.instalacion.totales?.totalAnnualProduction || 0,
        map_json: mapJsonString, // ✅ Usar el string procesado
      };

      instalacionObj = await utils.removeUndefinedKeys(instalacionObj);

      await db.query(
        "UPDATE estudios_instalacion SET ? WHERE estudio_id = ?",
        [instalacionObj, id],
        "update",
        conn,
      );
    }

    // 4. Actualizar componentes (MISMA conexión)
    if (estudioData.componentes) {
      let componentesObj = {
        panel_potencia: estudioData.componentes.panelPotencia,
        panel_fabricante: estudioData.componentes.panelFabricante,
        inversor_seleccionado: estudioData.componentes.inversorSeleccionado,
        inversor_producto_id: estudioData.componentes.inversorProductoId,
        inversor_custom: estudioData.componentes.inversorCustom ? 1 : 0,
        inversor_fabricante: estudioData.componentes.inversorFabricante,
        inversor_potencia: estudioData.componentes.inversorPotencia,
        inversor_precio: estudioData.componentes.inversorPrecio,
        bateria_seleccionada: estudioData.componentes.bateriaSeleccionada,
        bateria_producto_id: estudioData.componentes.bateriaProductoId,
        bateria_custom: estudioData.componentes.bateriaCustom ? 1 : 0,
        bateria_fabricante: estudioData.componentes.bateriaFabricante,
        bateria_capacidad: estudioData.componentes.bateriaCapacidad,
        bateria_precio: estudioData.componentes.bateriaPrecio,
        precio_por_watio: estudioData.componentes.precioPorWatio,
        energy_meter: estudioData.componentes.energyMeter ? 1 : 0,
      };
      componentesObj = await utils.removeUndefinedKeys(componentesObj);

      await db.query(
        "UPDATE estudios_componentes SET ? WHERE estudio_id = ?",
        [componentesObj, id],
        "update",
        conn,
      );
    }

    return true;
  } catch (e) {
    throw new Error(e);
  } finally {
    conn && (await conn.end());
  }
};

// ==================== ELIMINAR ESTUDIO ====================

estudioQueries.deleteEstudio = async (id) => {
  let conn = null;
  try {
    conn = await db.createConnection();
    return await db.query(
      "DELETE FROM estudios WHERE id = ?",
      [id],
      "delete",
      conn,
    );
  } catch (e) {
    throw new Error(e);
  } finally {
    conn && (await conn.end());
  }
};

module.exports = estudioQueries;
