// import bungalowsQueries from "./mysql_queries/bungalows_queries.js";
// import configQueries from "./mysql_queries/config_queries.js";
// import obrasQueries from "./mysql_queries/obras_queries.js";
// import productQueries from "./mysql_queries/product_queries.js";
// import userQueries from "./mysql_queries/user_queries.js";

const bungalowsQueries = require("./mysql_queries/bungalows_queries.js");
const configQueries = require("./mysql_queries/config_queries.js");
const obrasQueries = require("./mysql_queries/obras_queries.js");
const productQueries = require("./mysql_queries/product_queries.js");
const userQueries = require("./mysql_queries/user_queries.js");
const clienteQueries = require("./mysql_queries/cliente_queries.js");
const presupuestosQueries = require("./mysql_queries/presupuestos_queries.js");
const colaboradorQueries = require("./mysql_queries/colaborador_queries.js");
const agendaQueries = require("./mysql_queries/agenda_queries.js");
const estudioQueries = require("./mysql_queries/estudios_queries.js");

const dao = {};

// ===== Categorías =====
dao.getCategorias = () => productQueries.getCategorias();
dao.addCategoria = (data) => productQueries.addCategoria(data);
dao.getCategoriaById = (id) => productQueries.getCategoriaById(id);
dao.deleteCategoria = (id) => productQueries.deleteCategoria(id);
dao.addAtributoCategoria = (categoriaId, nombre, tipo) =>
  productQueries.addAtributoCategoria(categoriaId, nombre, tipo);
dao.getAtributosByCategoria = (id) =>
  productQueries.getAtributosByCategoria(id);

// ===== Productos =====
dao.getProductosByCategoria = (id) =>
  productQueries.getProductosByCategoria(id);
dao.addProducto = (data) => productQueries.addProducto(data);
dao.getProductoById = (id) => productQueries.getProductoById(id);
dao.updateProducto = (id, data) => productQueries.updateProducto(id, data);
dao.deleteProducto = (id) => productQueries.deleteProducto(id);

// ===== Valores =====
dao.addValorProducto = (productoId, atributocategoria_id, valor) =>
  productQueries.addValorProducto(productoId, atributocategoria_id, valor);
dao.getValoresByProducto = (id) => productQueries.getValoresByProducto(id);
dao.deleteValoresByProducto = (id) =>
  productQueries.deleteValoresByProducto(id);

// // ===== Categorías =====
// dao.getCategorias = () => productQueries.getCategorias();
// dao.addCategoria = (data) => productQueries.addCategoria(data);
// dao.getCategoriaById = (id) => productQueries.getCategoriaById(id);
// dao.deleteCategoria = (id) => productQueries.deleteCategoria(id);

// // ===== Productos =====
// dao.getProductosByCategoria = (id) =>
//   productQueries.getProductosByCategoria(id);
// dao.addProducto = (data, ficha) => productQueries.addProducto(data, ficha);
// dao.getProductoById = (id) => productQueries.getProductoById(id);
// dao.updateProducto = (id, data) => productQueries.updateProducto(id, data);
// dao.deleteProducto = (id) => productQueries.deleteProducto(id);

// // ===== Atributos =====
// dao.addAtributo = (productoId, clave, valor) =>
//   productQueries.addAtributo(productoId, clave, valor);

// dao.getAtributosByProducto = (id) => productQueries.getAtributosByProducto(id);

// dao.deleteAtributosByProducto = (id) =>
//   productQueries.deleteAtributosByProducto(id);

// dao.updateAtributo = async (id, nombre, valor) =>
//   productQueries.updateAtributo(id, nombre, valor);

// dao.deleteAtributo = async (id) => productQueries.deleteAtributo(id);

// ===== Usuarios =====

dao.getUsers = async () => await userQueries.getUsers();

//Buscar un usuario por el email
dao.getUserByEmail = async (email) => await userQueries.getUserByEmail(email);

//Añadir un nuevo usuario
dao.addUser = async (userData) => await userQueries.addUser(userData);

//Buscar usuario por Id
dao.getUserById = async (id) => await userQueries.getUserById(id);

//Eliminar user por Id
dao.deleteUser = async (id) => await userQueries.deleteUser(id);

// Modificar usuario por su id
dao.updateUser = async (id, userData) =>
  await userQueries.updateUser(id, userData);

dao.getVerify = async (id) => await userQueries.getVerify(id);

dao.getCountUser = async () => await userQueries.getCountUser();

dao.getClientes = async () => await clienteQueries.getClientes();

dao.addCliente = async (clienteData) =>
  await clienteQueries.addCliente(clienteData);

dao.deleteCliente = async (id) => await clienteQueries.deleteCliente(id);

dao.updateCliente = async (id, clienteData) =>
  await clienteQueries.updateCliente(id, clienteData);

dao.getPresupuestos = async () => await presupuestosQueries.getPresupuestos();

dao.getPresupuestosByUser = async (id) =>
  await presupuestosQueries.getPresupuestosByUser(id);

dao.addPresupuesto = async (presupuestoData) =>
  await presupuestosQueries.addPresupuesto(presupuestoData);

dao.addPresupuestoItem = async (itemData, idPresupuesto) =>
  await presupuestosQueries.addPresupuestoItem(itemData, idPresupuesto);

dao.deletePresupuesto = async (presupuestoId) =>
  await presupuestosQueries.deletePresupuesto(presupuestoId);

dao.updatePresupuesto = async (presupuestoData) =>
  await presupuestosQueries.updatePresupuesto(presupuestoData);

dao.deleteItemsNotInList = async (presupuesto_id, itemIds) =>
  await presupuestosQueries.deleteItemsNotInList(presupuesto_id, itemIds);

dao.updatePresupuestoItems = async (items) => {
  for (const item of items) {
    await presupuestosQueries.updatePresupuestoItem(item);
  }
};

// ==================== ESTUDIOS ====================

dao.getAllEstudios = async (usuarioId) =>
  await estudioQueries.getAllEstudios(usuarioId);

dao.getAllEstudiosAdmin = async () =>
  await estudioQueries.getAllEstudiosAdmin();

dao.getEstudioById = async (id) => await estudioQueries.getEstudioById(id);

dao.getEstudiosByCliente = async (clienteId) =>
  await estudioQueries.getEstudiosByCliente(clienteId);

dao.addEstudio = async (estudioData) =>
  await estudioQueries.addEstudio(estudioData);

dao.updateEstudio = async (id, estudioData) =>
  await estudioQueries.updateEstudio(id, estudioData);

dao.updateEstadoEstudio = async (id, estado) =>
  await estudioQueries.updateEstadoEstudio(id, estado);

dao.deleteEstudio = async (id) => await estudioQueries.deleteEstudio(id);

// Obtener Citas
dao.getAgenda = async () => await agendaQueries.getAgenda();

dao.getAgendaByPresupuesto = async (id) =>
  await agendaQueries.getAgendaByPresupuesto(id);

dao.addCita = async (citaData, documentoUrl) =>
  await agendaQueries.addCita(citaData, documentoUrl);

dao.deleteCita = async (id) => await agendaQueries.deleteCita(id);

dao.updateCita = async (id, data) => await agendaQueries.updateCita(id, data);

// Obtener Colaboradores
dao.getColaboradores = async () => await colaboradorQueries.getColaboradores();

// Añadir Colaboradores
dao.addColaborador = async (colaboradorData, img) =>
  await colaboradorQueries.addColaborador(colaboradorData, img);

// Actualizar Colaboradores
dao.updateColaborador = async (id, colaboradorData) =>
  await colaboradorQueries.updateColaborador(id, colaboradorData);

// Eliminar Colaboradores
dao.deleteColaborador = async (id) =>
  await colaboradorQueries.deleteColaborador(id);

// Obtener los Paneles
dao.getPaneles = async () => await productQueries.getPaneles();

// Obtener los Inversores
dao.getInversores = async () => await productQueries.getInversores();

//Obtener las baterias
dao.getBaterias = async () => await productQueries.getBaterias();

// Modificar panel por su id
dao.updatePaneles = async (id, panelData) =>
  await productQueries.updatePaneles(id, panelData);

//Modificar inversor por su id
dao.updateInversores = async (id, inversorData) =>
  await productQueries.updateInversores(id, inversorData);

// modificar bateria por su id
dao.updateBaterias = async (id, bateriaData) =>
  await productQueries.updateBaterias(id, bateriaData);

dao.getProductsByCategory = async (categoria) =>
  await productQueries.getProductsByCategory(categoria);

// Añadir datos de la imagen subida al servidor
dao.addImage = async (imageData) => await productQueries.addImage(imageData);

// Obtener una imagen por su id
dao.getImageById = async (id) => await productQueries.getImageById(id);

//Obtener producto por referencia
dao.getProductByRef = async (ref) => await productQueries.getProductByRef(ref);

//Añadir un panel a bbdd
dao.addPanel = async (panelData, pdf) =>
  await productQueries.addPanel(panelData, pdf);

// Añadir un panel a bbdd
dao.addInversor = async (inversorData, pdf) =>
  await productQueries.addInversor(inversorData, pdf);

// Añadir una bateria a bbdd
dao.addBateria = async (bateriaData, pdf) =>
  await productQueries.addBateria(bateriaData, pdf);

// Eliminar un panel por su id
dao.deletePanelById = async (id) => await productQueries.deletePanelById(id);

// Eliminar un inversor por su id
dao.deleteInversorById = async (id) =>
  await productQueries.deleteInversorById(id);

// Eliminar una bateria por su id
dao.deleteBateriaById = async (id) =>
  await productQueries.deleteBateriaById(id);

dao.getOffer = async () => await productQueries.getOffer();

dao.getOfferActive = async () => await productQueries.getOfferActive();

dao.addOffer = async (productData, image) =>
  await productQueries.addOffer(productData, image);

dao.updateOffer = async (id, userData) =>
  await productQueries.updateOffer(id, userData);

dao.getCountModels = async () => await configQueries.getCountModels();

dao.getDisposicion = async () => await configQueries.getDisposicion();

dao.getOrientacion = async (disposicion) =>
  await configQueries.getOrientacion(disposicion);

dao.getModelo = async (orientacion) =>
  await configQueries.getModelo(orientacion);

dao.getTipo = async (modelo) => await configQueries.getTipo(modelo);

// dao.addPresupuesto = async (presupuestoData) =>
//   await bungalowsQueries.addPresupuesto(presupuestoData);

dao.getAllPresupuesto = async () => await bungalowsQueries.getAllPresupuesto();

dao.deletePresupuestoById = async (id) =>
  await bungalowsQueries.deletePresupuestoById(id);

dao.addContact = async (contactData) =>
  await userQueries.addContact(contactData);

dao.getCountContact = async () => await userQueries.getCountContact();

dao.getCountPresupuesto = async () =>
  await bungalowsQueries.getCountPresupuesto();

dao.getAllContact = async () => await userQueries.getAllContact();

dao.getAllObras = async () => await obrasQueries.getAllObras();

dao.getAllObrasPublic = async () => await obrasQueries.getAllObrasPublic();

dao.getCountObras = async () => await obrasQueries.getCountObras();

dao.addObra = async (obraData, image) =>
  await obrasQueries.addObra(obraData, image);

dao.addObraImage = async (imageData) =>
  await obrasQueries.addObraImage(imageData);

dao.updateObra = async (id, obraData) =>
  await obrasQueries.updateObra(id, obraData);

module.exports = dao;

// export default dao;
