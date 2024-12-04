const express = require('express');
const router = express.Router();

const ArticulosController = require('./ArticulosController');

router.get('/api/getArticulos', ArticulosController.getArticulos);
router.get('/api/getArticulo/:id', ArticulosController.getArticulo);
//Borrador para pruebas
  router.post('/api/getCarrito/:id', ArticulosController.getOrders);
  router.post('/api/addProducts/:id', ArticulosController.addProducts);
//router.post('/api/cart', ArticulosController.createCart);
//agregar Mariana para primera api de products

//1. Listado de todos los productos
router.get('/api/products', ArticulosController.getProducts);
//2. Detalle del producto
router.get('/api/product/:id', ArticulosController.getProduct);
//3. Busqueda del producto
router.get('/api/products/search/:keyword', ArticulosController.getProductSearch);
//4. Categorias del producto
router.get('/api/products/category/:name', ArticulosController.getProductCategory);
//5. Crear carrito virtual
router.post('/api/cart', ArticulosController.createCart);
//6. Obtener carrito Virtual 
router.get('/api/cart/:id', ArticulosController.getCartId);
// //7. Actualizar un carrito 
router.put('/api/cart/:id', ArticulosController.updateCartId);
// //8. elimina un carrito
router.delete('/api/cart/:id', ArticulosController.deleteCartId);
//9. Agregar Producto al Carrito
router.post('/api/cart/:id/productos', ArticulosController.addCartId);
//11. Crear una orden con carrito virtual 
router.post('/api/orders', ArticulosController.createOrder);
//12. Listado de ordenes por usuario:
router.get('/api/orders/user/:id', ArticulosController.getOrderId);
//13. Estado de la Orden
router.get('/api/orders/:id/status', ArticulosController.getEdoOrderId);
//14. Actualizar Estado de Pago de la Orden
router.post('/api/orders/:id/status', ArticulosController.updatePagoOrderId);
//15.Actualizar Estado de la Orden
router.post('/api/ordenes/:id/estado-orden', ArticulosController.updateOrderId);
// //16. elimina producto de un carrito 
router.delete('/api/cart/:id/:product_id', ArticulosController.deleteProdId);
//17. Muestra la lista de categorias 
router.get('/api/products/category', ArticulosController.getListCategory);
//18. Crear un id_invitado 
router.get('/api/invitado/', ArticulosController.getInvitado);
//19. Control de la paginación para obtener todos los productos 
//router.get('/api/getOrders/category/pag', ArticulosController.getOrdersPag);
router.post('/api/products/page', ArticulosController.getOrdersPag);
//20. Obtener id carrito por usuario 
router.get('/api/getUserCarrito/:id', ArticulosController.getIdCart);
//21. Control de la paginación para obtener todas las categorias 
//router.get('/api/getOrders/CategoryPag', ArticulosController.getCategoryPag);
router.post('/api/category/page', ArticulosController.getCategoryPag);
//22. Crear carrito virtual (Agregar 1 o mas productos)
router.post('/api/cart/:id', ArticulosController.createCartAdd);


module.exports = router;
