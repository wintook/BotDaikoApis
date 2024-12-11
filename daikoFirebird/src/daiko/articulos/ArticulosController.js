const ArticulosModel = require("./ArticulosModel");


// //BORRADOR DE APIS 

//const getOrders = async (req, res) => {
  const getOrders = async (req, res) => {
  const dataArticulos = await ArticulosModel.getOrders(req);
  if (dataArticulos) {
    res.status(200).send(dataArticulos);
  } else {
    res.status(404).send("404 Not Found");
  }
};


//agregar Mariana para products

//1. Listado de todos los productos
const getProducts = async (req, res) => {
  const dataProducts = await ArticulosModel.getProducts(req);
  if (dataProducts) {
    res.status(200).send(dataProducts);
  } else {
    //res.status(404).send("404 Not Found");
    res.status(200).send({
      error: true,  // Indica que no es un error crítico
      message:  "La solicitud tiene un error, API: Listado de todos los productos"
  });
  }
};

//2. Detalle del producto
const getProduct = async (req, res) => {
  
  console.log("entrando al controlador de 2. Detalle del producto");
  const { id } = req.params;
  if (!id || isNaN(id)) {
    //return;
    return res.status(200).send({
      error: true,
      message: "Falta el ID del producto. Por favor, proporcione un ID válido en la ruta.",
    });
  }
  console.log("validacion correcta ");

  const dataProduct = await ArticulosModel.getProduct(req);
  console.log("controlador:dataproduct", dataProduct)

  if (dataProduct == null) {
    res.status(200).send({error: true, message: "El producto no existe"});
  }else if (dataProduct){
    res.status(200).send(dataProduct);
  } else {
    res.status(200).send({
      error: true,
      message: "La solicitud tiene un error, API: Detalle del producto",
    });
  }
  
};

//3. Busqueda del producto
const getProductSearch = async (req, res) => {
  console.log("entrando al controlador de //3. Busqueda del producto");
  let { keyword } = req.params;
  if (!keyword || typeof keyword !== "string" || keyword.trim() === "") {
    //return;
    return res.status(200).send({
      error: true,
      message: "Falta el Keyword del producto. Por favor, proporcione un  válido en la ruta.",
    });
  }
  //productAll.length === 0
  const dataProductSearch = await ArticulosModel.getProductSearch(req);
  console.log("dataproductsearch controlador-->",dataProductSearch)
  if (dataProductSearch) {
    res.status(200).send(dataProductSearch);
  }else if (!dataProductSearch){
    res.status(200).send({error: true, message: "El producto no existe"});
  } 
  else {
    res.status(200).send({
      error: true,
      message: "La solicitud tiene un error, API: Busqueda del producto",
    });
  }
};

//4. Categorias del producto
const getProductCategory = async (req, res) => {
  const dataProductCategory = await ArticulosModel.getProductCategory(req);
  if (dataProductCategory) {
    res.status(200).send(dataProductCategory);
  } else if (!dataProductCategory){
    res.status(200).send({error: true, message: "La categoria no existe"});
  }
  else {
    res.status(200).send({
      error: true,
      message: "La solicitud tiene un error, API: Categorias del producto",
    });
  }
};

//5. crear carrito Virtual
const createCart = async (req, res) => {
  console.log("entrando al controlador:Api: 5. crear carrito Virtual");
  const { body } = req;
  const { cliente_id, articulo_id, unidades } = body;

  if (!cliente_id) {
    return res.status(200).send({
        error: true,
        message: "Falta el ID del cliente. Por favor, proporcione un ID válido en la ruta.",
    });
} else if (!articulo_id) {
    return res.status(200).send({
        error: true,
        message: "Falta el ID del artículo. Por favor, proporcione un ID válido en la ruta.",
    });
} else if (!unidades) {
    return res.status(200).send({
        error: true,
        message: "Falta la cantidad de unidades. Por favor, proporcione el número de unidades en la ruta.",
    });
}

  console.log("validacion correcta ");

  const createdCart = await ArticulosModel.createCart(body);
  console.log("createdcart existe controlador:", createdCart);
  //console.log("createdcart existe controlador:", createCart);
  console.log("createdCart controlador: ", createdCart)
  const errorExists = createdCart.error;
  console.log("errorExists", errorExists)
  const created = createdCart?.created
  console.log("created", created)
  if (errorExists || created ) {
    res.status(200).send(createdCart);
  }else{
    res.status(200).send({
      error: true,
      message: "La solicitud tiene un error, API: crear carrito Virtual",
    });
  }
};

//6. Obtener carrito Virtual
const getCartId = async (req, res) => {

  console.log("entrando al controlador de 6. Obtener carrito virtual");
  const { id } = req.params;
  if (!id || isNaN(id)){
     //return;
     return res.status(200).send({
      error: true,
      message: "Falta el ID del producto. Por favor, proporcione un ID válido en la ruta.",
    });
  }
  console.log("validacion correcta ");

  const dataCartId = await ArticulosModel.getCartId(req);
  if (dataCartId) {
    res.status(200).send(dataCartId);
   // res.status(201).send({ status: "OK", data: dataCartId});
  }else if (!dataCartId){
    res.status(200).send({error: true, message: "Carrito no encontrado."});
  } 
  else {
    //res.status(404).send("404 Not Found");
    res.status(200).send({
      success: true,
      message:  "La solicitud tiene un error, API: Obtener carrito Virtual",
    });
  }
};

//7. Actualizar un carrito
const updateCartId = async (req, res) => {
  const params = req.params;
  const body = req.body;
  const { id } = req.params;
  const { articulo_id, unidades } = body;

  if (!id || isNaN(id)){
    return res.status(200).send({     
     error: true, 
     message: "el  id carrito es incorrecto. Por favor, proporcione uno válido.",
   });
   }
 
  if (!articulo_id || typeof articulo_id !== "string" || articulo_id.trim() === "") {
    return res.status(200).send({     
      error: true, 
      message: "el articulo id es incorrecto. Por favor, proporcione uno válido.",
    });
  }else if (!unidades || typeof unidades !== "string" || unidades.trim() === "") {
    return res.status(200).send({     
      error: true, 
      message: "Las unidades son incorrecto. Por favor, proporcione uno válido.",
    });
  }


  const updateCart = await ArticulosModel.updateCartId(req);
  console.log("updateCart controller-->", updateCart)
  const errorExists = updateCart.error;
  console.log("errorExists", errorExists)
  const created = updateCart?.created
  console.log("created", created)
  if (errorExists || created ) {
  //if (updateCart) {
    res.status(200).send(updateCart);
  // } else if (!updateCart){
  //   res.status(200).send({error: true, message: "Carrito o Articulo no encontrado."});
  }else {
    res.status(200).send({
      error: true,
      message: "Ocurrio un error en la API Actualizar un carrito ",
    });
  }
}

//8. Elimina un carrito
const deleteCartId = async (req, res) => {
  const params = req.params;

  console.log(params);

  const { id } = req.params;
  if (!id || isNaN(id)) {
    //return;
    return res.status(200).send({
      error: true,
      message: "Falta el ID del producto. Por favor, proporcione un ID válido en la ruta.",
    });
  }
  console.log("validacion correcta ");

  const deleteCart = await ArticulosModel.deleteCartId(req);
  if (deleteCart) {
    res.status(200).send({ status: "OK", data: deleteCart });
  } else if (!deleteCart) {
    res.status(200).send({
        error: true,
        message: "Carrito no existe."
});
  }else {
    res.status(200).send({
      error: true,
      message:"Ocurrio un error en la API Elimina un carrito ",
    });
  }
  // if (!deleteCart) {
  //   res.status(404).send(deleteCart);
  //   return false;
  // }
  // res.status(201).send({ status: "OK", data: deleteCart });
};

//9. Agregar Producto al Carrito

  const addCartId = async (req, res) => {
    const { id } = req.params; // ID del carrito
    const { productos } = req.body; // Lista de productos
    const body = req.body;
    console.log("CONTROLADOR");
  
    if (!id || isNaN(id)) {
      return res.status(400).send({
        error: true,
        message: "Falta el ID del carrito. Por favor, proporcione un ID válido.",
      });
    }
    if (!Array.isArray(productos) || productos.length === 0) {
      return res.status(200).send({
        error: true,
        message: "Debe enviar una lista de productos válida.",
      });
    }
  
    if (!body.productos || !Array.isArray(body.productos)) {
      return res.status(200).send({
        error: true,
        message: "La estructura de datos es incorrecta. Se esperaba un arreglo de productos.",
      });
    }
    
    // Iterar sobre cada producto para validarlo
    for (const producto of body.productos) {
      const { cliente_id, articulo_id, unidades } = producto;
      console.log("cliente_id", cliente_id);
      console.log("articulo_id:", articulo_id);
      console.log("unidades", unidades);
    
      if (!cliente_id) {
        return res.status(200).send({
          error: true,
          message: "Falta el ID del cliente en uno de los productos. Por favor, proporcione un ID válido.",
        });
      }
    
      if (!articulo_id) {
        return res.status(200).send({
          error: true,
          message: "Falta el ID del artículo en uno de los productos. Por favor, proporcione un ID válido.",
        });
      }
    
      if (!unidades || unidades <= 0) {
        return res.status(200).send({
          error: true,
          message: "Falta la cantidad de unidades o es inválida en uno de los productos. Proporcione un número mayor a 0.",
        });
      }
    }
  
      const results = await ArticulosModel.addCartId(req);
      console.log("results existe controlador:", results);
    console.log("results controlador: ", results)
    const errorExists = results.error;
    console.log("errorExists", errorExists)
    const created = results?.created
    console.log("created", created)
    if (errorExists || created ) {
      res.status(200).send(results);
    }else{
      res.status(200).send({
        error: true,
        message: "La solicitud tiene un error, API: crear carrito Virtual",
      });
    }
   };

//11. Crear orden con carrito Virtual

const createOrder = async (req, res) => {
  console.log("entrando al controlador de 11. Crear orden con carrito Virtual");
  const { body } = req;
  const { docto_ve_id, tipo_docto, estatus, vendedor_id, cliente_id, estatus_pago, metadata_pago } = body;

  // Si todos los campos están presentes, continúa con el procesamiento normal
if (!docto_ve_id) {
    return res.status(200).send({
        error: true,
        message: "Falta el ID del carrito. Por favor, proporcione un ID válido en la ruta.",
    });
} else if (!tipo_docto) {
    return res.status(200).send({
      error: true,
        message: "Falta el tipo de documento. Por favor, proporcione un tipo de documento válido.",
    });
} else if (!estatus) {
    return res.status(200).send({
      error: true,
        message: "Falta el estatus del documento. Por favor, proporcione un estatus válido.",
    });
} else if (!vendedor_id) {
    return res.status(200).send({
      error: true,
        message: "Falta el ID del vendedor. Por favor, proporcione un ID válido en la ruta.",
    });
} else if (!cliente_id) {
    return res.status(200).send({
      error: true,
        message: "Falta el ID del cliente. Por favor, proporcione un ID válido en la ruta.",
    });
} else if (!estatus_pago) {
    return res.status(200).send({
      error: true,
        message: "Falta el estatus de pago. Por favor, proporcione un estatus de pago válido.",
    });
} else if (!metadata_pago || !metadata_pago.pasarela_pago) {
    return res.status(200).send({
      error: true,
        message: "Falta la metadata de pago. Por favor, proporcione información de pago válida.",
    });
}
  
  console.log("validacion correcta ");
  console.log(body);

  const createdOrder = await ArticulosModel.createOrder(body);
  if (createdOrder) {
    res.status(200).send({ error: true, data: createdOrder });
  } else if (!createdOrder) {
    res.status(200).send({
        error: true,
        data: {message: "Articulo y/o carrito no existe."}
});
  }else {
    res.status(200).send({
      success: true,
      message: "La solicitud fue exitosa pero no hay contenido para devolver.",
    });
  }
  // if (!createdOrder) {
  //   res.status(404).send(createdOrder);
  //   return false;
  // }
  // res.status(201).send({ status: "OK", data: createdOrder });
};

//12. Listado de ordenes por usuario:
const getOrderId = async (req, res) => {
  const params = req.params;
  const body = req.body;
  console.log(params);
  console.log(body);
  const { id } = req.params;

  if (!id || isNaN(id) ) {
    return res.status(200).send({
        error: true,
        message: "el  id carrito es incorrecto. Por favor, proporcione uno válido.",
    });
} 
  //return true;
  const dataOrderId = await ArticulosModel.getOrderId(req);
  if (dataOrderId) {
    res.status(200).send({ error: false, data: dataOrderId });
  } else if (!dataOrderId){
    res.status(200).send({
      error: true, 
        message: "El cliente no tiene ninguna orden.",
})
  }else {
    //res.status(404).send("404 Not Found");
    res.status(200).send({
      success: true,
      message: "La solicitud tiene un error<API: Listado de ordenes por usuario>",
    })
  }
};

//13. Estado de la Orden
const getEdoOrderId = async (req, res) => {
  const params = req.params;
  const body = req.body;
  console.log(params);
  console.log(body);

  const { id } = req.params;

  if (!id || isNaN(id) ) {
    return res.status(200).send({
        error: true,
        message: "el ID de la orden es incorrecto. Por favor, proporcione uno válido.",
    });
} 

  const addCart = await ArticulosModel.getEdoOrderId(req);
  if (addCart) {
    res.status(200).send( { status:"OK", data: addCart });

  }else if (!addCart){
    res.status(200).send({
      error:true,
      message: "No existe Orden.",
})
  }else {
    //res.status(404).send("404 Not Found");
    res.status(200).send({
      error: true,
      message: "La solicitud tiene un error<API: Estado de la orden>",
    })
  }
};

//14. Actualizar Estado de Pago de la Orden
const updatePagoOrderId = async (req, res) => {
  const params = req.params;
  const body = req.body;
  console.log(params);
  console.log(body);
  const { id } = req.params;
  
  if (!id || isNaN(id)) {
    return res.status(200).send({
      error: true,
      message: "el ID de la orden es incorrecto. Por favor, proporcione uno válido.",
  });
  }

  const { estatus_pago } = body;
  console.log("estatus_pago",estatus_pago)

  // Si todos los campos están presentes, continúa con el procesamiento normal
if (!estatus_pago) {
    return res.status(200).send({
      error: true,
        message: "Falta el estatus del pago. Por favor, proporcione un valor.",
    });
}

  const updatePago = await ArticulosModel.updatePagoOrderId(req);
  if (updatePago) {
    res.status(200).send({ status:"OK", data: updatePago });
  } else if (!updatePago){
    res.status(200).send({
      error: true,
      message: "No existe Orden.",
})
  }else {
    //res.status(404).send("404 Not Found");
    res.status(200).send({
      error: true,
      message: "La solicitud tiene un error<API: Actualizar Estado de Pago de la Orden>",
    })
  }
};

//15. Actualizar Estado  de la Orden
const updateOrderId = async (req, res) => {
  const params = req.params;
  const body = req.body;
  console.log(params);
  console.log(body);
  const { estatus } = body;
  const { id } = req.params;
  
  if (!id || isNaN(id)) {
    return res.status(200).send({
      error: true,
      message: "el ID de la orden es incorrecto. Por favor, proporcione uno válido.",
  });
  }

  // Si todos los campos están presentes, continúa con el procesamiento normal
if (!estatus) {
    return res.status(200).send({
        error: true,
        message: "Falta el estatus de la orden. Por favor, proporcione un valor.",
    });
}

  const updateOrden = await ArticulosModel.updateOrderId(req);
  if (updateOrden) {
    res.status(200).send({ status:"OK", data: updateOrden });
  } else if (!updateOrden){
    res.status(200).send({ error: true, message:  "No existe Orden."} )
  }else {
    res.status(200).send({
      error: true,
      message: "La solicitud tiene un error<API: Actualizar Estado de la Orden>",
    })
  }
  // if (!updateOrden) {
  //   res.status(404).send(updateOrden);
  //   return false;
  // }
  // res.status(201).send({ status: "OK", data: updateOrden });
};

//16. Elimina producto al carrito
const deleteProdId = async (req, res) => {
  const params = req.params;
  const body = req.body;
  console.log(params);
  console.log(body);
  //return true;
  const { id } = params;
  const { product_id } = params;

  if (!id || isNaN(id)) {
    //return;
    return res.status(200).send({
      error: true, 
      message: "el  id carrito es incorrecto. Por favor, proporcione uno válido.",
    });
  }
  if (!product_id || isNaN(product_id)) {
    //return;
    return res.status(200).send({
      error: true, 
      message: "el  id producto es incorrecto. Por favor, proporcione uno válido.",
    });
  }

  const deleteCart = await ArticulosModel.deleteProdId(req);
  const errorExists = deleteCart.error;
  console.log("errorExists", errorExists)
  const created = deleteCart?.created
  console.log("created", created)
  if (errorExists || created ) {
  //if (deleteCart) {
    res.status(200).send(deleteCart);
//   } else if (!deleteCart) {
//     res.status(200).send({
//         error: true,
//         message:  "No existe carrito o articulo. Revisa Datos "
// });
  }else {
    res.status(204).send({
      success: true,
      message: "La solicitud tiene un error<API: Elimina producto del carrito>",
    });
  }
//   if (deleteCart) {
//     //res.status(200).send({ status: "OK" });
//     res.status(200).send(deleteCart);
//   } else {
//     res.status(404).send("404 Not Found");
//   }
 };

//17. Get List Category
const getListCategory = async (req, res) => {
  const dataProducts = await ArticulosModel.getListCategory(req);
  if (dataProducts) {
    res.status(200).send(dataProducts);
  } else {
    //res.status(404).send("404 Not Found");
    res.status(200).send({
      error: true,
      message: "La solicitud tiene un error<API: Muestra lista de categorias>",
    });
  }
};
//18. Get modo id_invitado 

const getInvitado = async (req, res) => {
  const dataProduct = await ArticulosModel.getInvitado(req);
  if (dataProduct) {
    res.status(200).send(dataProduct);
  } else {
    //res.status(404).send("404 Not Found");
    res.status(200).send({
      error: true,
      message: "La solicitud tiene un error, API: Crear un ID invitado ",
    });
  }
};


//19. Control de la paginación para obtener todos los productos 

const getOrdersPag = async (req, res) => {
  console.log("entrando al controlador de 19. Control de la paginación para obtener todos los productos ");
  const { body } = req;
  const { perPages, current_page, searchQuery } = body;

  // Si todos los campos están presentes, continúa con el procesamiento normal
if (!perPages) {
    return res.status(200).send({
        error: true,
        message: "Campo vacio. Por favor, proporcione un ID válido en la ruta.",
    });
}else if (!current_page) {
  return res.status(200).send({
    error: true,
    message: "Campo vacio. Por favor, proporcione un ID válido en la ruta.",
});
}
  const dataProductCategory = await ArticulosModel.getOrdersPag(req);
  if (dataProductCategory) {
    res.status(200).send(dataProductCategory);
  } else {
   // res.status(404).send("404 Not Found");
   res.status(200).send({
    error: true,
    message: "La solicitud tiene un error, API: Paginación para obtener Productos ",
  });
  }
};



//20. Obtener id carrito por usuario 
const getIdCart = async (req, res) => {
  console.log("Se encuentra en la API de obtener informacion del usuario NUEVA API en el controlador");
  const dataCartId = await ArticulosModel.getIdCart(req);
  if (dataCartId) {
    res.status(200).send(dataCartId);
   // res.status(201).send({ status: "OK", data: dataCartId});
  } else {
    //res.status(404).send("404 Not Found");
    res.status(200).send({
      error: true,
      message: "La solicitud tiene un error, API: Obtener los carritos de un usuario ",
    });
  }
};

//21. Control de la paginación para obtener todas las categorias

const getCategoryPag = async (req, res) => {

  console.log("entrando al controlador de 21. Control de la paginación para obtener todas las categorias");
  const { body } = req;
  const { perPages, current_page } = body;

  // Si todos los campos están presentes, continúa con el procesamiento normal
if (!perPages) {
    return res.status(200).send({
        error: true,
        message: "Campo vacio. Por favor, proporcione un ID válido en la ruta.",
    });
}else if (!current_page) {
  return res.status(200).send({
    error: true,
    message: "Campo vacio. Por favor, proporcione un ID válido en la ruta.",
});
}


  const dataProductCategory = await ArticulosModel.getCategoryPag(req);
  if (dataProductCategory) {
    res.status(200).send(dataProductCategory);
  } else {
    //res.status(404).send("404 Not Found");
    res.status(200).send({
      error: true,
      message: "La solicitud tiene un error, API: Paginación para obtener Categorias",
    });
  }
};

//22. Crear carrito virtual (Agregar 1 o mas productos)

const createCartAdd = async (req, res) => {
  const { body } = req;
  const { id } = req.params; // ID del carrito
  const { pedidos } = body;  // Array de pedidos { cliente_id, articulo_id, unidades }

  if (!id || isNaN(id)) {
    return res.status(200).send({
      error: true,
      message: "Falta el ID del carrito. Por favor, proporcione un ID válido.",
    });
  }

  // Validar que el campo 'pedidos' sea un array
  if (!Array.isArray(pedidos) || pedidos.length === 0) {
    return res.status(400).send({
      error: true,
      message: "El campo 'pedidos' debe ser un array con al menos un elemento.",
    });
  }
   console.log("CONTROLADOR")
   console.log("pedidos", pedidos.length)
  
  // Validar cada uno de los pedidos en el array
  for (let i = 0; i < pedidos.length; i++) {
    const {  articulo_id, unidades } = pedidos[i];
    console.log("articulo_id:",articulo_id)
    console.log("unidades",unidades)

    if (!articulo_id) {
      return res.status(400).send({
        error: true,
        message: `Falta el ID del artículo en el pedido ${i + 1}.`,
      });
    } else if (!unidades) {
      return res.status(400).send({
        error: true,
        message: `Falta la cantidad de unidades en el pedido ${i + 1}.`,
      });
    }
  }

  try {
    const results = await ArticulosModel.getOrders(id, pedidos);
    console.log("results existe controlador:", results);
  console.log("results controlador: ", results)
  const errorExists = results.error;
  console.log("errorExists", errorExists)
  const created = results?.created
  console.log("created", created)
  if (errorExists || created ) {
       res.status(200).send(results);
    } else {
      res.status(200).send({ error: true, message: "Error al crear los pedidos." });
    }
  } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    res.status(200).send({
      error: true,
      message: "La solicitud tiene un error, API: crear carrito Virtual.",
    });
  }
};



module.exports = {
  //Agregar Mariana para products
  // getArticulos,
 // getArticulo,
   getOrders,
 // addProducts, 
  getProducts,
  getProduct,
  getProductSearch,
  getProductCategory,
  getCartId,
  createCart,
  updateCartId,
  deleteCartId,
  addCartId,
  createOrder,
  getOrderId,
  getEdoOrderId,
  updatePagoOrderId,
  updateOrderId,
  deleteProdId,
  getListCategory,
  getInvitado,
  getOrdersPag,
  getIdCart,
  getCategoryPag,
  createCartAdd
};
