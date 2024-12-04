const db = require("../db/db");

const getArticulos = async (data) => {
  const { filtro } = data.body;

  let strFiltro = ``;
  if (filtro) {
    strFiltro = ` WHERE ( "NOMBRE" like '%${filtro}%') `;
  }

  try {
    const articulosAll = await db.any(
      `SELECT * FROM public."ARTICULOS" ${strFiltro} ORDER BY "ARTICULO_ID" ASC `
    );
    return articulosAll;
  } catch (error) {
    console.error("<<getArticulos>> : Error fetching API key:", error);
    return false;
  }
};

const getArticulo = async (data) => {
  const { id } = data.params;
  if (!id || isNaN(id)) {
    throw new Error("Invalid ID parameter");
  }

  try {
    const articuloAll = await db.one(
      `SELECT * FROM public.articulos WHERE (articulo_id = ${id})`
    );
    //destructurar datos
    const { nombre } = articuloAll;
    console.log(nombre);
    return articuloAll;
  } catch (error) {
    console.error("<<getArticulo>> : Error fetching API key:", error);
    return false;
  }
};

//Borrador

//const getOrders = async (data) => {
  const getOrders = async (id, pedidos) => {
    console.log("MODELO");
    console.log("pedidos", pedidos.length);
    let i = 0;
    let createdOrders = []; // Inicializa el array para guardar todos los resultados
   //const { cliente_id, articulo_id, unidades } = pedidos[i];
   const { articulo_id, unidades } = pedidos[i];
    console.log("cliente_id:", id)
    console.log("articulo_id:",articulo_id)
    console.log("unidades",unidades)
   // console.log("Procesando Clientes y articulos entrada :", data);

      const getCliente = await db.oneOrNone(
        `SELECT cliente_id FROM clientes WHERE cliente_id = $1`, 
        [id]
      );
    
      if (!getCliente) {   
        const response = { error: true, mensaje: "Cliente no existe" }
        return response;
      }
      console.log("Cliente encontrado:", getCliente);

      // Inserción inicial de la cotización
      const articulosAll = await db.one(`INSERT INTO
                                          doctos_ve (tipo_docto, cliente_id)
                                          VALUES ('cotizacion', '${id}')
                                          RETURNING docto_ve_id`);
      const doctoVeId = articulosAll.docto_ve_id;
      console.log("Cotización creada: ", articulosAll);
    
    //return false ;
  
    try {
        const data = pedidos[i];
      //   console.log("Procesando Clientes y articulos entrada :", data);

      // const getCliente = await db.oneOrNone(
      //   `SELECT cliente_id FROM clientes WHERE cliente_id = $1`, 
      //   [id]
      // );
    
      // if (!getCliente) {   
      //   const response = { error: true, mensaje: "Cliente no existe" }
      //   return response;
      // }
      // console.log("Cliente encontrado:", getCliente);

      // // Inserción inicial de la cotización
      // const articulosAll = await db.one(`INSERT INTO
      //                                     doctos_ve (tipo_docto, cliente_id)
      //                                     VALUES ('cotizacion', '${id}')
      //                                     RETURNING docto_ve_id`);
      // const doctoVeId = articulosAll.docto_ve_id;
      // console.log("Cotización creada: ", articulosAll);
      

    
      for (let i = 0; i < pedidos.length; i++) {
        const data = pedidos[i];
        console.log("Procesando pedido:", data);
  
        // Validar si el artículo existe y tiene precio válido
        const getClientes = await db.one(
          `SELECT count(precio) AS existes
           FROM precios 
           WHERE articulo_id = '${data.articulo_id}' AND 
           (precio_empresa_id = '210')`
        );
        const existes = parseInt(getClientes.existes);
        console.log("Artículo existe:", existes);
  
        if (!existes) {
          // createdOrders.push({
          //   error: true,
          //   message: `Artículo con ID ${data.articulo_id} no existe o no tiene precio válido.`,
          // });
          // continue; // Salta al siguiente pedido
          const response = { error: true, 
            mensaje: `Artículo con ID ${data.articulo_id} no existe o no tiene precio válido.` }
          return response;
        }
  
        const articulosPrecio = await db.one(`SELECT precio
                                              FROM precios 
                                              WHERE articulo_id = '${data.articulo_id}' AND 
                                              (precio_empresa_id = '210')`);
        const precio = parseFloat(articulosPrecio.precio.replace(/[$,]/g, ""));
        const unidades = data.unidades;
        const totalNeto = precio * unidades;
  
        console.log("Precio limpio:", precio);
        console.log("Total Neto:", totalNeto);
  
        // Inserción en el carrito
        await db.one(`INSERT INTO
                       doctos_ve_det (docto_ve_id, clave_articulo, articulo_id, unidades, unidades_comprom,
                       unidades_surt_dev, unidades_a_surtir, precio_unitario, pctje_dscto,
                       dscto_art, pctje_dscto_cli , dscto_extra, pctje_dscto_vol , pctje_dscto_promo ,
                       precio_total_neto, pctje_comis, rol, notas, posicion)
                       VALUES ('${doctoVeId}','abc','${data.articulo_id}','${data.unidades}','1','0','0',
                       '${precio}', '0.00','0.00', '0.00','0.00' ,'0.00',
                       '0.00','${totalNeto}','0.00','N','1','1')
                       RETURNING docto_ve_id AS id`);
  
        // Actualización del carrito
        await db.any(`UPDATE doctos_ve
                      SET importe_neto = (SELECT SUM(precio_total_neto) FROM doctos_ve_det WHERE docto_ve_id = '${doctoVeId}')
                      WHERE docto_ve_id = '${doctoVeId}'`);

                      console.log("pedidos.length", pedidos.length)

    //if (i = pedidos.length){
    createdOrders.push({
      //error: true,
      //cliente_id: id,
     message: `Artículo ${data.articulo_id} agregado al carrito exitosamente.`,
    // message:  `Carrito Id : ${doctoVeId} creado exitosamente.`,
    });
    //}
       
      }
      console.log("Todos los pedidos procesados.");
  
    } catch (error) {
      // console.error("Error al procesar los pedidos:", error);
      // createdOrders.push({
      //   error: false,
      //   message: "Ocurrió un error al procesar los pedidos.",
      //   details: error.message,
      // });
      console.error("Error en addCartId:", error);
      return { error: true, message: "Error al crear carrito." };
    }
  
    // Devuelve el resultado al final, fuera del bucle
    // return {
    //   cliente_id: Number(id),
    //   carrito_creado: doctoVeId,
    //   createdOrders}
      const response = { error: false,
                         created: true, 
                         cliente_id: Number(id),
                         carrito_creado: doctoVeId,
                         createdOrders }
      return response;
  };
  
  
   //BORRADOR 2
   const addProducts = async (data) => {
    console.log("Inicia la API para agregar múltiples productos al carrito.");
    const { id } = data.params; // ID del carrito
    const { productos } = data.body; // Lista de productos

    const getCarrito = await db.one(`SELECT count(doctos_ve.docto_ve_id) AS existe
     FROM doctos_ve
	  INNER JOIN doctos_ve_det ON doctos_ve.docto_ve_id = doctos_ve_det.docto_ve_id
     WHERE doctos_ve.docto_ve_id = '${id}'`
  );
  const existeCar = parseInt(getCarrito.existe);
  console.log(existeCar);

  if (!existeCar) {
     console.log("Carrito no existe");
     const response = { error: true, mensaje: "Carrito no existe" }
      return response;
   }
  
  
  
    try {
      // Verificar relación cliente-carrito
      const clienteId = productos[0]?.cliente_id;
      const getCliente = await db.one(`
        SELECT COUNT(doctos_ve.docto_ve_id) AS existeCliente
        FROM clientes
        INNER JOIN doctos_ve ON clientes.cliente_id = doctos_ve.cliente_id
        WHERE doctos_ve.cliente_id = ${clienteId} AND doctos_ve.docto_ve_id = '${id}'
      `);
      if (parseInt(getCliente.existeCliente) === 0) {
        //return { error: true, message: "No tiene relación el carrito con el cliente." };
        const response = { error: true, mensaje: "No tiene relación el carrito con el cliente." }
      return response;
      }
  
      const results = [];
      for (const producto of productos) {
        const { articulo_id, unidades, cliente_id } = producto;
  
        // Validar existencia de producto
        const getArticulo = await db.one(`
          SELECT COUNT(articulos.articulo_id) AS existe
          FROM articulos
          INNER JOIN precios ON articulos.articulo_id = precios.articulo_id
          WHERE articulos.articulo_id = '${articulo_id}' 
            AND precios.precio_empresa_id = '210'
        `);
        if (parseInt(getArticulo.existe) === 0) {
          //return { error: true, message: `Artículo con ID ${articulo_id} no existe.` };
          const response = { error: true, mensaje: `Artículo con ID ${articulo_id} no existe.`  }
      return response;
        }
  
        // Obtener precio del artículo
        const articulosPrecio = await db.one(`
          SELECT precio
          FROM precios
          WHERE articulo_id = '${articulo_id}' AND precio_empresa_id = '210'
        `);
  
        // Procesar datos
        const precioArt = parseFloat(articulosPrecio.precio.replace(/[$,]/g, ""));
        const totalNeto = precioArt * unidades;
  
        // Revisar si el producto ya existe en el carrito
        const productoExiste = await db.one(`
          SELECT COUNT(articulo_id) AS existe 
          FROM doctos_ve_det 
          WHERE articulo_id = '${articulo_id}' AND docto_ve_id = '${id}'
        `);
  
       // if (productoExiste) {
          if (parseInt(productoExiste.existe) > 0) {
          // Actualizar producto existente
          const productAll = await db.one(`UPDATE doctos_ve_det
            SET  
           unidades = ${unidades},precio_total_neto = ${totalNeto}
           WHERE docto_ve_id = ${id} AND articulo_id = ${articulo_id}
           RETURNING docto_ve_id AS id`);
            const carritoUpdate = await db.any(`UPDATE doctos_ve
             SET importe_neto = (SELECT SUM(precio_total_neto) FROM doctos_ve_det WHERE docto_ve_id = '${id}')
             WHERE docto_ve_id = '${id}'`);
             //results.push({ articulo_id, action: "actualizado", unidades, totalNeto });
            //return productAll;
        } else {
          // Insertar nuevo producto
          await db.one(`
            INSERT INTO doctos_ve_det (
              docto_ve_id, clave_articulo, articulo_id, unidades, unidades_comprom, 
              unidades_surt_dev, unidades_a_surtir, precio_unitario, pctje_dscto,
              dscto_art, pctje_dscto_cli, dscto_extra, pctje_dscto_vol, pctje_dscto_promo,
              precio_total_neto, pctje_comis, rol, notas, posicion
            )
            VALUES (
              ${id}, 'abc', ${articulo_id}, ${unidades}, '1', '0', '0',
              '${precioArt}', '0.00', '0.00', '0.00', '0.00', '0.00', 
              '0.00', '${totalNeto}', '0.00', 'N', '1', '1'
            )
            RETURNING docto_ve_id AS id
          `);
        }
  
        results.push({ articulo_id, unidades, totalNeto });
      }
  
      // Actualizar importe neto del carrito
      await db.none(`
        UPDATE doctos_ve
        SET importe_neto = (
          SELECT SUM(precio_total_neto) 
          FROM doctos_ve_det 
          WHERE docto_ve_id = '${id}'
        )
        WHERE docto_ve_id = '${id}'
      `);
  
      // return {
      //   //message: "Productos agregados o actualizados exitosamente.",
      //   data: results,
      // };
      const response = { error: false, created: true, results }
      return response;
    } catch (error) {
      console.error("Error en addCartId:", error);
      return { error: true, message: "Error al agregar productos al carrito." };
    }
  };
  
   //* 


//agregar metodo Mariana para api products

//1. Listado de todos los productos
const getProducts = async (data) => {
  console.log("Se encuentra en la API de obtener todos productos ");
  try {
    const productsAll =
      await db.any(`SELECT articulos.articulo_id,articulos.nombre, precios.precio, 
                           precios.precio * (impuestos.pctje_unitario / 100) AS monto_impuesto,precios.costo_envio
                    FROM articulos 
                    INNER JOIN precios 
                    ON (articulos.articulo_id = precios.articulo_id AND precios.precio_empresa_id = '210')
                    INNER JOIN impuestos_articulos 
                    ON precios.articulo_id = impuestos_articulos.articulo_id
                    INNER JOIN impuestos
                    ON impuestos_articulos.impuesto_id = impuestos.impuesto_id 
                    WHERE precios.precio_empresa_id = '210'
                    ORDER BY articulos.nombre`);
                      
    //return productsAll;
    // Encapsula los resultados en un objeto
const result = {
  productos: productsAll
};

return result;
    //return productsAll[0];
  } catch (error) {
    //console.error("<<getProducts>> : Error fetching API key:", error);
    return false;
    //return{
    //  success: true,  // Indica que no es un error crítico
    //  message: "La solicitud fue exitosa pero no hay contenido para devolver."
  //};
  }
};

//2. Detalle del producto
const getProduct = async (data) => {
  const { id } = data.params;
  console.log(id)

  if (!id || isNaN(id)) {
    //throw new Error("Invalid Product ID parameter");    
      return {       
        success: true, // Esto indica que no hubo error 404.
        message: "el ID del producto es incorrecto. Por favor, proporcione un ID válido numerico.",
      };
  }

  console.log(
    "Se encuentra en la API de obtener todos productos por Id de producto "
  );
  try {
    const productAll = await db.oneOrNone(`SELECT articulos.articulo_id,
                                                articulos.nombre, 
                                                articulos.notas_ventas, 
                                                precios.precio,
                                                precios.precio * (impuestos.pctje_unitario / 100) AS monto_impuesto,
                                                precios.costo_envio,
                                                COUNT(*) AS total_Articulos
                                           FROM articulos 
                                           INNER JOIN precios 
                                            ON articulos.articulo_id = precios.articulo_id
                                           INNER JOIN impuestos_articulos 
                                            ON precios.articulo_id = impuestos_articulos.articulo_id
                                           INNER JOIN impuestos
                                            ON impuestos_articulos.impuesto_id = impuestos.impuesto_id 
                                           WHERE (articulos.articulo_id = ${id}) AND (precios.precio_empresa_id = '210')
                                           GROUP BY 
                                             articulos.articulo_id, 
                                             articulos.nombre, 
                                             precios.precio, 
                                             precios.costo_envio, 
                                             impuestos.pctje_unitario`);
    // Si no se encuentra ningún resultado
    if (!productAll) {
      console.log("productALL -->", productAll)
      //return null; 
      return {     
       error: true,
       message: "El producto no existe"
      };
    }

    // Si se encuentra el resultado
    return productAll;
    
  } catch (error) {
    //console.error("<<getProduct>> : Error al intentar conectar con la base de datos:", error );
    return false;
  }
};

//3. Busqueda del producto
const getProductSearch = async (data) => {
  let { keyword } = data.params;
  if (!keyword || typeof keyword !== "string" || keyword.trim() === "") {
    //throw new Error("Invalid Product keyword parameter");
    return {       
      error: true, 
      message: "el keyword parametro es incorrecto. Por favor, proporcione un ID válido.",
    };
  }

  console.log(
    "pasa a la api 3 de search de busqueda de productos por nombre ",
    keyword
  );
  const searchTerms = keyword
    .split(" ")
    .filter((term) => term.trim().length > 0); // Filtramos espacios vacíos
  console.log(searchTerms);

  if (searchTerms.length > 1) {
    // Si hay más de una palabra, seleccionamos una palabra para usarla (ej. la primera)
    keyword = searchTerms[0]; // Usamos la primera palabra
    console.log("La keyword ha sido reasignada a la primera palabra:", keyword);
    for (let i = 0; i < searchTerms.length; i++) {
      try {
        productAll = await db.any(
          `SELECT articulos.articulo_id,
              articulos.nombre,
              precios.precio,
              precios.precio * (impuestos.pctje_unitario / 100) AS monto_impuesto,
              precios.costo_envio
           FROM articulos
           INNER JOIN precios
           ON articulos.articulo_id = precios.articulo_id
           INNER JOIN impuestos_articulos
           ON precios.articulo_id = impuestos_articulos.articulo_id
           INNER JOIN impuestos
           ON impuestos_articulos.impuesto_id = impuestos.impuesto_id
           WHERE (precios.precio_empresa_id = '210') AND
                 UPPER(articulos.nombre) LIKE '%' || UPPER($1) || '%'`,
          [`%${searchTerms[i]}%`]
        );
        console.log("Resultados encontrados con la oracion:", searchTerms[i]);
        // Si encuentra algún resultado, rompe el bucle
        if (productAll.length > 0) {
          console.log("Resultados encontrados con la palabra:", searchTerms[i]);
          //return productAll;
          const result = {
            productos: productAll
          };
          return result;
        }
      } catch (err) {
        console.error(err);
      }
    }
    // Si no se encontraron resultados
    if (productAll.length === 0) {
      console.log(
        "No se encontraron resultados con ninguna de las palabras clave."
      );
    }
  } else {
    // Si solo hay una palabra, no hacemos nada y mantenemos la original
    keyword = searchTerms[0]; // No hay cambio, pero nos aseguramos que no haya espacios vacíos
    console.log("La keyword se mantiene igual:", keyword);
  }

  // Después de la condición, puedes continuar utilizando la variable `keyword` con su nuevo valor.
  console.log("El valor final de keyword es:", keyword);

  try {
    const productAll = await db.any(
      `SELECT articulos.articulo_id,
              articulos.nombre,
              precios.precio,
              precios.precio * (impuestos.pctje_unitario / 100) AS monto_impuesto,
              precios.costo_envio
       FROM articulos
       INNER JOIN precios
       ON articulos.articulo_id = precios.articulo_id
       INNER JOIN impuestos_articulos
       ON precios.articulo_id = impuestos_articulos.articulo_id
       INNER JOIN impuestos
       ON impuestos_articulos.impuesto_id = impuestos.impuesto_id
       WHERE ( precios.precio_empresa_id = '210') AND
             UPPER(articulos.nombre) LIKE '%' || UPPER($1) || '%'`,
      [`%${keyword}%`]
    );
    //                                     articulos.nombre LIKE $1`, [`%${keyword}%`]);

    console.log(productAll);
    console.log(keyword);

    if (productAll.length === 0) {
      console.log("entro a que no encontro ningun producto");
      console.log(productAll);
      console.log("keyword:", keyword);
      const idCategoria = await db.oneOrNone(
        `SELECT grupo_linea_id 
         FROM grupos_lineas
         WHERE UPPER(grupos_lineas.nombre) LIKE $1`,
        //  [`%${name}%`]
        [`%${keyword.toUpperCase()}%`]
      );
      console.log("idCategoria:", idCategoria);
      //console.log("idCategoria", idCategoria.grupo_linea_id);

      if (!idCategoria) {
        console.log("no se encontro ningun producto existente en la busqueda de la api 3");
        //return idCategoria;
        const result = {
          productos: idCategoria
        };
        return result;
      } else {
        console.log("idCategoria", idCategoria.grupo_linea_id);
        const getCategory = await db.any(
          `SELECT  articulos.articulo_id,
                 articulos.nombre,
                 precios.precio,
                 precios.precio * (impuestos.pctje_unitario / 100) AS monto_impuesto,
                 precios.costo_envio
        FROM lineas_articulos
        INNER JOIN articulos
        ON lineas_articulos.linea_articulo_id = articulos.linea_articulo_id
        INNER JOIN precios
        ON articulos.articulo_id = precios.articulo_id
        INNER JOIN impuestos_articulos
        ON precios.articulo_id = impuestos_articulos.articulo_id
        INNER JOIN impuestos
        ON impuestos_articulos.impuesto_id = impuestos.impuesto_id
        WHERE (lineas_articulos.grupo_linea_id = ${idCategoria.grupo_linea_id} 
        AND precios.precio_empresa_id = '210')`
        );

        //return getCategory;
        const result = {
          productos: getCategory
        };
        return result;
      }
    }

    //return productAll;
    const result = {
      productos: productAll
    };
    return result;
  } catch (error) {
   // console.error("<<getProductSearch>> : Error fetching API key:", error);
    return false;
  }
};

//4. Categorias del producto
const getProductCategory = async (data) => {
  const { name } = data.params;
  if (!name || typeof name !== "string" || name.trim() === "") {
    //throw new Error("Invalid Product name parameter");
    return {       
      error: true, 
      message: "el parametro es incorrecto. Por favor, proporcione uno válido.",
    };
  }
  console.log(
    "pasa a la api 4 de categorias de busqueda de productos por nombre de categoria"
  );
  const idCategoria = await db.oneOrNone(
    `SELECT grupo_linea_id 
     FROM grupos_lineas
     WHERE UPPER(grupos_lineas.nombre) LIKE $1`,
    [`%${name.toUpperCase()}%`]
  );
   
  if (!idCategoria) {
    console.log("entra a return false");
    //   const getProduct = await db.any(
    //     `SELECT articulos.articulo_id,
    // articulos.nombre,
    //                                               precios.precio,
    //                                               precios.precio * (impuestos.pctje_unitario / 100) AS monto_impuesto,
    //                                               precios.costo_envio
    //                                          FROM articulos
    //                                          INNER JOIN precios
    //                                           ON articulos.articulo_id = precios.articulo_id
    //                                          INNER JOIN impuestos_articulos
    //                                           ON precios.articulo_id = impuestos_articulos.articulo_id
    //                                          INNER JOIN impuestos
    //                                           ON impuestos_articulos.impuesto_id = impuestos.impuesto_id
    //                                          WHERE (precios.precio_empresa_id = '42' OR precios.precio_empresa_id = '210') AND
    //                                                UPPER(articulos.nombre) LIKE $1`,
    //     [`%${name.toUpperCase()}%`]
    //   );
    //  
    //return idCategoria;
    const result = {
      productos: idCategoria
    };
    return result;
  }

  try {
    
    const productAll = await db.any(
      `SELECT  articulos.articulo_id,
               articulos.nombre,
               precios.precio,
               precios.precio * (impuestos.pctje_unitario / 100) AS monto_impuesto,
               precios.costo_envio
       FROM lineas_articulos
       INNER JOIN articulos
       ON lineas_articulos.linea_articulo_id = articulos.linea_articulo_id
       INNER JOIN precios
       ON articulos.articulo_id = precios.articulo_id
	     INNER JOIN impuestos_articulos
       ON precios.articulo_id = impuestos_articulos.articulo_id
       INNER JOIN impuestos
       ON impuestos_articulos.impuesto_id = impuestos.impuesto_id
       WHERE (lineas_articulos.grupo_linea_id = ${idCategoria.grupo_linea_id} 
       AND precios.precio_empresa_id = '210')`
    );

    console.log(productAll);
    console.log("acceso a base de datos OK ");
    //return productAll;
    const result = {
      productos: productAll
    };
    return result
  } catch (error) {
    //console.error("<<getProductCategory>> : Error fetching API key:", error);
    return false;
  }
};
//5. crear una carrito nuevo  AQUI
const createCart = async (data) => {
  console.log("entrando al modelo de crear un carrito nuevo");
  let mensaje = "";

//   const getCliente = await db.one(
//     `SELECT cliente_id FROM clientes WHERE cliente_id = '${data.cliente_id}'`
//   );
//   const existe = parseInt(getCliente.existe);
//   console.log("existe:", existe)

//   if (!existe) {   
//     mensaje = "Cliente no existe";
//     return mensaje;
//     //return existe 
//      //return {
//      //    error: true, 
//      //    message: "Cliente no existe"
//      //};
// }


  const getCliente = await db.oneOrNone(
    `SELECT cliente_id FROM clientes WHERE cliente_id = $1`, 
    [data.cliente_id]
  );

  if (!getCliente) {   
    const response = { error: true, mensaje: "Cliente no existe" }
    return response;
    //const mensaje = "Cliente no existe";
    //console.log(mensaje);
    //return mensaje;
  }

  console.log("Cliente encontrado:", getCliente.cliente_id);


  // const getClientes = await db.one(
  //   `SELECT count(precio) AS existes
  //                     FROM precios 
  //                     WHERE articulo_id = '${data.articulo_id}' AND 
  //                     (precio_empresa_id = '210')`
  // );
  // const existes = parseInt(getClientes.existes);
  // console.log("existes:", existes)
    
  // if (!existes) {
  //   mensaje = "Articulo no existe."
  //   return mensaje; 
  //   //return existes; 
  // }
  const getClientes = await db.oneOrNone(
    `SELECT precio AS existes 
     FROM precios 
     WHERE articulo_id = $1 AND precio_empresa_id = $2`,
    [data.articulo_id, '210']
  );

  const existes = getClientes ? true : false; // Si getClientes es null, existes será false
  console.log("existes:", existes);

  if (!existes) {
    const response = { error: true, mensaje: "Artículo no existe." }
    return response;
    // const mensaje = "Artículo no existe.";
    // console.log(mensaje);
    // return mensaje;
  }


  

  try {
    console.log("entro al insert");
    
    const articulosAll = await db.one(`INSERT INTO
                                            doctos_ve (tipo_docto, cliente_id)
                                            VALUES ( 'cotizacion', '${data.cliente_id}')
                                             RETURNING docto_ve_id`);

    const doctoVeId = articulosAll.docto_ve_id;

    const articulosPrecio = await db.one(`SELECT precio
                                          FROM precios 
                                          WHERE articulo_id = '${data.articulo_id}' AND 
                                          (precio_empresa_id = '210')`);

    const precio = articulosPrecio.precio;

    function cleanMoneyString(moneyString) {
      // Elimina el símbolo de dólar y las comas
      return parseFloat(moneyString.replace(/[$,]/g, ""));
    }

    // Limpia y convierte los valores
    const precioArt = cleanMoneyString(precio);
    console.log("preciosart:", precioArt);

    const unidades = data.unidades;
    const totalNeto = precioArt * unidades;

    console.log("preciosart:", precioArt);
    console.log("unidades:", unidades);
    console.log("totalneto", totalNeto);

    console.log(doctoVeId);

    const carritoAll = await db.one(`INSERT INTO
                                      doctos_ve_det (docto_ve_id,clave_articulo,articulo_id,unidades,unidades_comprom,
                                      unidades_surt_dev, unidades_a_surtir,precio_unitario,pctje_dscto,
                                      dscto_art,pctje_dscto_cli ,dscto_extra,pctje_dscto_vol ,pctje_dscto_promo ,
                                     precio_total_neto,pctje_comis,rol,notas,posicion)
                                     VALUES ('${doctoVeId}','abc','${data.articulo_id}','${data.unidades}','1','0','0',
                                      '${precioArt}', '0.00','0.00', '0.00','0.00' ,'0.00',
                                      '0.00','${totalNeto}','0.00','N','1','1')
                                     RETURNING docto_ve_id AS id`);

    const carritoUpdate = await db.any(`UPDATE doctos_ve
                                        SET importe_neto = (SELECT SUM(precio_total_neto) FROM doctos_ve_det WHERE docto_ve_id = '${doctoVeId}')
                                        WHERE docto_ve_id = '${doctoVeId}'`);

    console.log(data.cantidad_prod);

    console.log("ejecucion a BD correcta");
    const response = { error: false, created: true, carritoAll }
    return response;
    //return carritoAll;
  } catch (error) {
   // console.error("<<createCart>> : Error fetching API key:", error);
   return false;
  }
};

//6. Obtener carrito Virtual
const getCartId = async (data) => {
  console.log("Se encuentra en la API Obtener carrito virtual");
  const { id } = data.params;
  
  // if (!id || isNaN(id)) {
  //   //throw new Error("Invalid Cart ID parameter");
  //   return {       
  //     success: true, // Esto indica que no hubo error 404.
  //     message: "el ID del carrito es incorrecto. Por favor, proporcione un ID válido numerico.",
  //   };
  // }
  
  try {
    const productAll = await db.any(`SELECT articulos.articulo_id,
                                       doctos_ve_det.precio_unitario,
                                       articulos.nombre,
                                       doctos_ve_det.unidades, 
                                       precios.precio * (impuestos.pctje_unitario / 100) AS monto_impuesto,
                                       precios.costo_envio,        
                                       articulos.estatus,
	                                     doctos_ve_det.dscto_art AS descuento,
	                                    doctos_ve_det.precio_total_neto AS precioTotalArticulos,
	                                    precios.moneda_id,
                                      doctos_ve_det.dscto_extra                                     
                                       FROM  clientes 
	                                   INNER JOIN doctos_ve
	                                    ON clientes.cliente_id = doctos_ve.cliente_id
                                      INNER JOIN doctos_ve_det 
                                        ON doctos_ve.docto_ve_id = doctos_ve_det.docto_ve_id
                                      INNER JOIN impuestos_articulos
                                        ON doctos_ve_det.articulo_id = impuestos_articulos.articulo_id
                                      INNER JOIN impuestos
                                        ON impuestos_articulos.impuesto_id = impuestos.impuesto_id        
                                      INNER JOIN articulos 
                                       ON impuestos_articulos.articulo_id = articulos.articulo_id
                                      INNER JOIN precios
                                       ON articulos.articulo_id = precios.articulo_id
                                      WHERE doctos_ve.docto_ve_id =  ${id} 
                                            AND (precios.precio_empresa_id = '210')
                                            `);

    const dscto_extra =
      productAll.length > 0 ? productAll[0].dscto_extra : null;
    const totalCostoEnvio = productAll.reduce(
      (sum, item) => sum + (item.costo_envio || 0),
      0
    );

    const importeCarrito = await db.oneOrNone(
      `SELECT doctos_ve.docto_ve_id AS id_carrito,
              doctos_ve.importe_neto,
	            clientes.nombre AS nombre_cliente,
	            doctos_ve.folio, 
              doctos_ve.fecha,
              doctos_ve.vendedor_id        
	     FROM  clientes 
       INNER JOIN doctos_ve
       ON clientes.cliente_id = doctos_ve.cliente_id      
       WHERE doctos_ve.docto_ve_id  =  ${id} `
    );

    if (!importeCarrito) {
      //console.error("<<getCartId>> : Carrito no encontrado (404).");
      return importeCarrito;
    }

    importeCarrito.dscto_extra = dscto_extra;
    importeCarrito.total_costo_envio = totalCostoEnvio;

    return {
      Carrito: productAll,
      importeCarrito,
      // message: `Valores del articulo: ${productAll}, total:: ${getImporte}`,
    };
  } catch (error) {
    // console.error("<<getCartId>> : Error fetching API key:", error);
    return false;
  }
};

// //7.Actualizar carrito

const updateCartId = async (data) => {
  console.log("Entro a la API Actualizar carrito");
  const { id } = data.params;
  const { articulo_id, unidades } = data.body;

    // const cartArtExists = await db.oneOrNone(`SELECT count(doctos_ve.docto_ve_id)  AS existeCartArt 
	  //                     FROM public.doctos_ve
	  //                     INNER JOIN doctos_ve_det ON doctos_ve.docto_ve_id = doctos_ve_det.docto_ve_id
    //                     WHERE doctos_ve.docto_ve_id = ${id} AND doctos_ve_det.articulo_id = '${articulo_id}' `);                                        
   
    // const existeCartArt = parseInt(cartArtExists.existeCartArt);
    // console.log("existeCartArt",existeCartArt);
    // console.log("cartArtExists QUERY ",cartArtExists);
    // if (!cartArtExists) {
    //   console.log("entro a articulo no existe en el carrito")
      
    //   //return existeCartArt ;
    //   const response = { error: true, mensaje: "Articulo no existe en el carrito" }
    //   return response;
    // }
    const carritoExists =
      await db.oneOrNone(`SELECT count(docto_ve_id)  AS existe 
      FROM doctos_ve
      WHERE docto_ve_id = ${id}`);

    const existe = parseInt(carritoExists.existe);
    console.log("Entro  encontrar carrito",existe);

    if (!existe) {
      console.log("Entro a no encontrar carrito",existe);
      
      //return existe;
      const response = { error: true, mensaje: "Carrito no existe" }
      return response;

    }


    const cartArtExists = await db.oneOrNone(
      `SELECT doctos_ve.docto_ve_id 
       FROM public.doctos_ve
       INNER JOIN doctos_ve_det ON doctos_ve.docto_ve_id = doctos_ve_det.docto_ve_id
       WHERE doctos_ve.docto_ve_id = $1 AND doctos_ve_det.articulo_id = $2`,
      [id, articulo_id]
    );
  
    const existeCartArt = !!cartArtExists; // true si hay un registro, false si es null
    console.log("existeCartArt:", existeCartArt);
    console.log("cartArtExists QUERY:", cartArtExists);
  
    if (!existeCartArt) {
      console.log("Entro a 'artículo no existe en el carrito'");
      const response = { error: true, mensaje: "Artículo no existe en el carrito" };
      return response;
    }

  try {
    // const carritoExists =
    //   await db.oneOrNone(`SELECT count(docto_ve_id)  AS existe 
    //   FROM doctos_ve
    //   WHERE docto_ve_id = ${id}`);

    // const existe = parseInt(carritoExists.existe);
    // console.log("Entro  encontrar carrito",existe);

    // if (!existe) {
    //   console.log("Entro a no encontrar carrito",existe);
      
    //   //return existe;
    //   const response = { error: true, mensaje: "Carrito no existe" }
    //   return response;

    // }

    const articulosPrecio = await db.oneOrNone(`SELECT precio
        FROM precios 
        WHERE articulo_id = '${articulo_id}' AND 
        (precio_empresa_id = '210')`);

    console.log("Valor de articulosPrecio:", articulosPrecio);

    if (!articulosPrecio) {
      //console.error("<<getCartId>> : Artículo no encontrado (404).");
      console.log("Entro a no encontrar artículos",articulosPrecio);
      //return articulosPrecio;
      const response = { error: true, mensaje: "Articulo no existe" }
      return response;
    }

    const precio = articulosPrecio.precio;
    function cleanMoneyString(moneyString) {
      return parseFloat(moneyString.replace(/[$,]/g, ""));
    }

    const precioArt = cleanMoneyString(precio);
    //const unidades = data.unidades;
    const totalNeto = precioArt * unidades;

    console.log(precioArt);
    console.log(unidades);
    console.log(totalNeto);
    console.log(articulo_id);
    console.log(id);

    const productAll = await db.any(`UPDATE doctos_ve_det
                                             SET  
                                                  unidades = ${unidades}, precio_total_neto = ${totalNeto}
                                                  WHERE docto_ve_id = ${id} AND articulo_id = ${articulo_id}`);
    const carritoUpdate = await db.any(`UPDATE doctos_ve
                                        SET importe_neto = (SELECT SUM(precio_total_neto) FROM doctos_ve_det WHERE docto_ve_id = '${id}')
                                        WHERE docto_ve_id = '${id}'`);
    //return true;
    const response = { error: false, created: true,mensaje: "Carrito Actualizado"  }
    return response;

    //return {
    //  message: "Carrito actualizado.",
    //};
  } catch (error) {
    console.error("<<updateCartId>> : Error fetching API key:", error);
    return false;
  }
};

//     //8.Elimina carrito AQUI

const deleteCartId = async (data) => {
   const { id } = data.params;
  // if (!id || isNaN(id)) {
  //   throw new Error("Invalid Product ID parameter");
  // }
  console.log("pasa a la api 8 de eliminar carrito ");


  const getCarrito = await db.one(
    `SELECT count(docto_ve_id)  AS existe 
      FROM doctos_ve
      WHERE docto_ve_id = '${id}'`
  );

  const existe = parseInt(getCarrito.existe);

  if (!existe) {
    return existe;
    // console.error("<<getCartId>> : cliente no encontrado (404).");
    // return {
    //   message: "Carrito no existe.",
    // };
  }

  try {
    const cartAll = await db.any(`DELETE FROM doctos_ve
                                      WHERE docto_ve_id = ${id}`);

    const cartDet = await db.any(`DELETE FROM doctos_ve_det
                                      WHERE docto_ve_id = ${id}`);

    //return true;
    return id; 
  } catch (error) {
    //console.error("<<updateCartId>> : Error fetching API key:", error);
    //return false;
    return {       
      success: true, // Esto indica que no hubo error 404.
      message: "Error en lo datos, Favor de validar.",
    };
  }
};

//9. Agregar Producto al Carrito

const addCartId = async (data) => {
  console.log("Inicia la API para agregar múltiples productos al carrito.");
    const { id } = data.params; // ID del carrito
    const { productos } = data.body; // Lista de productos

  //   const getCarrito = await db.one(`SELECT count(doctos_ve.docto_ve_id) AS existe
  //    FROM doctos_ve
	//   INNER JOIN doctos_ve_det ON doctos_ve.docto_ve_id = doctos_ve_det.docto_ve_id
  //    WHERE doctos_ve.docto_ve_id = '${id}'`
  // );

  const getCarrito = await db.one(`SELECT count(docto_ve_id) AS existe
     FROM doctos_ve
     WHERE docto_ve_id = '${id}'`
  );
  const existeCar = parseInt(getCarrito.existe);
  console.log(existeCar);

  if (!existeCar) {
     console.log("Carrito no existe");
     const response = { error: true, mensaje: "Carrito no existe" }
      return response;
   }
  
  
  
    try {
      // Verificar relación cliente-carrito
      const clienteId = productos[0]?.cliente_id;
      const getCliente = await db.one(`
        SELECT COUNT(doctos_ve.docto_ve_id) AS existeCliente
        FROM clientes
        INNER JOIN doctos_ve ON clientes.cliente_id = doctos_ve.cliente_id
        WHERE doctos_ve.cliente_id = ${clienteId} AND doctos_ve.docto_ve_id = '${id}'
      `);
      if (parseInt(getCliente.existeCliente) === 0) {
        //return { error: true, message: "No tiene relación el carrito con el cliente." };
        const response = { error: true, mensaje: "No tiene relación el carrito con el cliente." }
      return response;
      }
  
      const results = [];
      for (const producto of productos) {
        const { articulo_id, unidades, cliente_id } = producto;
  
        // Validar existencia de producto
        const getArticulo = await db.one(`
          SELECT COUNT(articulos.articulo_id) AS existe
          FROM articulos
          INNER JOIN precios ON articulos.articulo_id = precios.articulo_id
          WHERE articulos.articulo_id = '${articulo_id}' 
            AND precios.precio_empresa_id = '210'
        `);
        if (parseInt(getArticulo.existe) === 0) {
          //return { error: true, message: `Artículo con ID ${articulo_id} no existe.` };
          const response = { error: true, mensaje: `Artículo con ID ${articulo_id} no existe.`  }
      return response;
        }
  
        // Obtener precio del artículo
        const articulosPrecio = await db.one(`
          SELECT precio
          FROM precios
          WHERE articulo_id = '${articulo_id}' AND precio_empresa_id = '210'
        `);
  
        // Procesar datos
        const precioArt = parseFloat(articulosPrecio.precio.replace(/[$,]/g, ""));
        const totalNeto = precioArt * unidades;
  
        // Revisar si el producto ya existe en el carrito
        const productoExiste = await db.one(`
          SELECT COUNT(articulo_id) AS existe 
          FROM doctos_ve_det 
          WHERE articulo_id = '${articulo_id}' AND docto_ve_id = '${id}'
        `);
  
       // if (productoExiste) {
          if (parseInt(productoExiste.existe) > 0) {
          // Actualizar producto existente
          const productAll = await db.one(`UPDATE doctos_ve_det
            SET  
           unidades = ${unidades},precio_total_neto = ${totalNeto}
           WHERE docto_ve_id = ${id} AND articulo_id = ${articulo_id}
           RETURNING docto_ve_id AS id`);
            const carritoUpdate = await db.any(`UPDATE doctos_ve
             SET importe_neto = (SELECT SUM(precio_total_neto) FROM doctos_ve_det WHERE docto_ve_id = '${id}')
             WHERE docto_ve_id = '${id}'`);
             //results.push({ articulo_id, action: "actualizado", unidades, totalNeto });
            //return productAll;
        } else {
          // Insertar nuevo producto
          await db.one(`
            INSERT INTO doctos_ve_det (
              docto_ve_id, clave_articulo, articulo_id, unidades, unidades_comprom, 
              unidades_surt_dev, unidades_a_surtir, precio_unitario, pctje_dscto,
              dscto_art, pctje_dscto_cli, dscto_extra, pctje_dscto_vol, pctje_dscto_promo,
              precio_total_neto, pctje_comis, rol, notas, posicion
            )
            VALUES (
              ${id}, 'abc', ${articulo_id}, ${unidades}, '1', '0', '0',
              '${precioArt}', '0.00', '0.00', '0.00', '0.00', '0.00', 
              '0.00', '${totalNeto}', '0.00', 'N', '1', '1'
            )
            RETURNING docto_ve_id AS id
          `);
        }
  
        results.push({ articulo_id, unidades, totalNeto });
      }
  
      // Actualizar importe neto del carrito
      await db.none(`
        UPDATE doctos_ve
        SET importe_neto = (
          SELECT SUM(precio_total_neto) 
          FROM doctos_ve_det 
          WHERE docto_ve_id = '${id}'
        )
        WHERE docto_ve_id = '${id}'
      `);
  
      // return {
      //   //message: "Productos agregados o actualizados exitosamente.",
      //   data: results,
      // };
      const response = { error: false, created: true, results }
      return response;
    } catch (error) {
      console.error("Error en addCartId:", error);
      return { error: true, message: "Error al agregar productos al carrito." };
    }
  };


//11. Crear orden con carrito Virtual

const createOrder = async (data) => {
  console.log("entrando al crear orden con con carrito virtual");

  const getCartExiste = await db.one(
    `SELECT count(docto_ve_fte_id) AS existe FROM doctos_ve_ligas WHERE docto_ve_fte_id = '${data.docto_ve_id}' `
  );
    console.log("getCartExiste", getCartExiste);
  const existe = parseInt(getCartExiste.existe);

  console.log(existe);
  if (existe) {
    const getCartId = await db.oneOrNone(
      `SELECT  doctos_ve.cliente_id as cliente_id , 
                     doctos_ve.docto_ve_id as carrito_id,
                     doctos_ve_ligas.docto_ve_dest_id  as orden_id
        FROM doctos_ve 
        INNER JOIN doctos_ve_ligas
        ON  (doctos_ve_ligas.docto_ve_fte_id = doctos_ve.docto_ve_id )
        WHERE doctos_ve.docto_ve_id = '${data.docto_ve_id}'
       `
    );
    console.log("getCartId", getCartId)

    console.log("entra a return false; El valor ya existe ");
    return {
      message: `El valor ya existe.`,
      getCartId,
    };
  }

  try {
    console.log("entro al insert");
    const metadataPagoStr = JSON.stringify(data.metadata_pago);
    const articulosAll =
      await db.oneOrNone(`INSERT INTO doctos_ve (tipo_docto, estatus,vendedor_id, cliente_id, estatus_pago, metadata_pago)
                    SELECT '${data.tipo_docto}', '${data.estatus}', '${data.vendedor_id}', '${data.cliente_id}', 
                            '${data.estatus_pago}', '${metadataPagoStr}'
                    FROM doctos_ve
                    WHERE cliente_id = '${data.cliente_id}' AND docto_ve_id = '${data.docto_ve_id}'
                    RETURNING docto_ve_id`);

    // Verificar si articulosAll está vacío (null)
    console.log("articulosAll", articulosAll)
  if (!articulosAll) {
    console.log(true, 'No hay relación con el cliente');
    return {
     // error: true,
      message: "No hay relación con el cliente",
    };
  }     


    //id_carrito NUEVO (Pedido)
    const doctoVeId = articulosAll.docto_ve_id;

    const ordenAll = await db.any(`INSERT INTO 
                                      doctos_ve_det (docto_ve_id,clave_articulo,articulo_id,unidades,unidades_comprom,
                                      unidades_surt_dev, unidades_a_surtir,precio_unitario,pctje_dscto,                                 
                                      dscto_art,pctje_dscto_cli ,dscto_extra,pctje_dscto_vol ,pctje_dscto_promo ,                               
                                      precio_total_neto,pctje_comis,rol,notas,posicion)	                               
                                     SELECT '${doctoVeId}',clave_articulo,articulo_id,unidades,unidades_comprom,
                                      unidades_surt_dev, unidades_a_surtir,precio_unitario,pctje_dscto,                                 
                                      dscto_art,pctje_dscto_cli ,dscto_extra,pctje_dscto_vol ,pctje_dscto_promo ,                               
                                      precio_total_neto,pctje_comis,rol,notas,posicion
                                     FROM doctos_ve_det
                                     WHERE docto_ve_id = '${data.docto_ve_id}'
                                     RETURNING docto_ve_det_id`);
    //id_Articulo del NUEVO carrito (Pedido)
    const doctoVeDetId = ordenAll.docto_ve_det_id;

    //Insertar la relacion del Id_carrito VIEJO (cotizacion) --> id_carrito NUEVO (pedido)
    const ordenIdAll =
      await db.oneOrNone(`INSERT INTO doctos_ve_ligas (docto_ve_fte_id, docto_ve_dest_id)
                                                 VALUES('${data.docto_ve_id}','${doctoVeId}')                                                 
                                                 ON CONFLICT (docto_ve_liga_id) DO NOTHING
                                                 RETURNING docto_ve_liga_id`);
    // Verificar si articulosAll está vacío (null)
    console.log("data.docto_ve_id", data.docto_ve_id)
    console.log("doctoVeId", doctoVeId)
    console.log("ordenIdAll", ordenIdAll)
  if (!ordenIdAll) {
    console.log(true, 'el carrito ya tiene orden');
    return {
      error: false,
      message: "No hay relación con el cliente",
    };
  }                                              
    //Id de la realacion tabla docto_ve_ligas ---> docto_de_ligas_det
    const doctoVeLiga = ordenIdAll.docto_ve_liga_id;

    console.log("ejecucion a BD correcta");
    //===============================
    console.log("ya esta creado la orden")
    const getCartId = await db.one(
      `SELECT  doctos_ve.cliente_id as cliente_id , 
                     doctos_ve.docto_ve_id as carrito_id,
                     doctos_ve_ligas.docto_ve_dest_id  as orden_id
        FROM doctos_ve 
        INNER JOIN doctos_ve_ligas
        ON  (doctos_ve_ligas.docto_ve_fte_id = doctos_ve.docto_ve_id )
        WHERE doctos_ve.docto_ve_id = '${data.docto_ve_id}'
       `
    );
    
    return {
      //error: true,
      message: `Orden creada con exito`,
      getCartId,
    };
    //return doctoVeId;
    //===============================
  
  } catch (error) {
   // console.error("<<createOrder>> : Error fetching API key:", error);
    return false;
  //  return {       
  //   success: true, 
  //   message: "Error en lo datos, Favor de validar.",
  // };
  }
};

//12. Listado de ordenes por usuario:
const getOrderId = async (data) => {
  console.log("Entro a la API Listado de ordenes por usuario");
  const { id } = data.params;
  const { product_id } = data.params;
  console.log(id);
  console.log(product_id);


  try {
    const productAll = await db.any(`SELECT 
                                      docto_ve_id AS id_orden                                     
                                      FROM doctos_ve                             
                                      WHERE cliente_id =  ${id} 
                                            AND tipo_docto = 'Pedido'`);

    //return productAll;

    if (productAll.length === 0) {
      console.log("productAll", productAll)
      return null;
      // return {
      //   message: "El cliente no tiene ninguna orden.",
      // };
    } else {
      return productAll;
    }
  } catch (error) {
    //console.error("<<getOrderId>> : Error fetching API key:", error);
    return false;
    //return {       
    //  success: true, 
    //  message: "Error en lo datos, Favor de validar.",
    //};
  }
};

// //13. Estado de la Orden

const getEdoOrderId = async (data) => {

  const { id } = data.params;
  const { product_id } = data.params;
  console.log(id);
  console.log(product_id);
 

  try {
    const productAll = await db.any(`SELECT 
                                     cliente_id,
                                     estatus AS estatus_orden,
                                     estatus_pago
                                     FROM doctos_ve                             
                                     WHERE docto_ve_id =  ${id} 
                                     AND tipo_docto = 'Pedido'`);
    // return true;
    //return productAll;
    if (productAll.length === 0) {
      return null;
      //return {
      //  message: "No existe Orden.",
      //};
    } 
      return productAll;
      
    
  } catch (error) {
    //console.error("<<getEdoOrderId>> : Error fetching API key:", error);
    return false;
    //return {       
    //  success: true, 
    //  message: "Error en lo datos, Favor de validar.",
    //};
  }
};

// //14. Actualizar Estado de Pago de la Orden

const updatePagoOrderId = async (data) => {
  console.log("Entro a la API  Actualizar Estado de Pago de la Orden");
  const { id } = data.params;


  const { estatus_pago } = data.body;

  const productAll = await db.any(`SELECT 
    cliente_id,
    estatus AS estatus_orden,
    estatus_pago
    FROM doctos_ve                             
    WHERE docto_ve_id =  ${id} 
    AND tipo_docto = 'Pedido'`);
  // return true;
  //return productAll;
  if (productAll.length === 0) {
    return null;
    // return {
    //   message: "No existe Orden.",
    // };
  }

  try {
    const productAll = await db.any(`UPDATE doctos_ve
                                             SET  
                                             estatus_pago = '${estatus_pago}'
                                                  WHERE docto_ve_id = ${id} AND tipo_docto = 'Pedido'`);
    return id;
    //return id;
  } catch (error) {
    //console.error("<<updatePagoOrderId>> : Error fetching API key:", error);
    return false;
    // return {       
    //   success: true, 
    //   message: "Error en lo datos, Favor de validar.",
    // };
  }
};

// //15. Actualizar Estado  de la Orden

const updateOrderId = async (data) => {
  console.log("Entro a la API  Actualizar Estado  de la Orden");
  const { id } = data.params;


  const { estatus } = data.body;

  const productAll = await db.any(`SELECT 
    cliente_id,
    estatus AS estatus_orden,
    estatus_pago
    FROM doctos_ve                             
    WHERE docto_ve_id =  ${id} 
    AND tipo_docto = 'Pedido'`);
  // return true;
  //return productAll;
  if (productAll.length === 0) {
    return null;
    // return {
    //   message: "No existe Orden.",
    // };
  }

  try {
    const productAll = await db.any(`UPDATE doctos_ve
                                             SET  
                                             estatus = '${estatus}'
                                                  WHERE docto_ve_id = ${id} AND tipo_docto = 'Pedido'`);
    //return true;
    return id;
  } catch (error) {
    //console.error("<<updateOrderId>> : Error fetching API key:", error);
    //return false;
    return {       
      success: true, 
      message: "Error en lo datos, Favor de validar.",
    };
  }
};

//     //16.Elimina Producto de un carrito

const deleteProdId = async (data) => {
  let mensaje = "";

  console.log("Entro a la API 16.Elimina Producto de un carrit");
  const { id } = data.params;
  const { product_id } = data.params;
 

  const getCarrito = await db.one(`SELECT count(docto_ve_id)  AS existe  FROM doctos_ve 
                                    WHERE docto_ve_id = ${id}`);

  const existe = parseInt(getCarrito.existe);
  
  
  if (!existe) {
  //if (!getCarrito){
    //return existe;
    console.log("el carrito no existe")
    const response = { error: true, mensaje: "Carrito no existe" }
    return response;
    // mensaje = "El carrito no existe. "; 
    // return mensaje;
    //return{  message: "el carrito no existe"}
  }
  console.log("mensaje", mensaje)
    // if (mensaje) {
    //   console.log("Mensaje acumulado:", mensaje);
    //   return mensaje;
    // }

  const getProduct = await db.one(`SELECT count(docto_ve_id)  AS existes  
                                     FROM doctos_ve_det 
                                    WHERE docto_ve_id = ${id}
                                      AND articulo_id = ${product_id}`
  );

  const existes = parseInt(getProduct.existes);

  if (!existes) {
    //return existes;
    console.log("el articulo no existe")
    const response = { error: true, mensaje: "Articulo no existe" }
    return response;
    // mensaje = "El artículo no existe en el carrito. ";
    // return mensaje; 
    //return{
    //  message: "el Articulo no existe"
   // }
  }
   console.log("mensaje", mensaje)
    // if (mensaje) {
    //   console.log("Mensaje acumulado:", mensaje);
    //   return mensaje;
    // }
    
  try {
    //*nuevo 23 nov
    // Consulta para obtener el precio unitario
    const getPrecioUnitario = await db.oneOrNone(`
      SELECT precio_unitario,unidades 
      FROM doctos_ve_det 
      WHERE docto_ve_id = ${id} AND articulo_id = ${product_id}`);
      
     
    if (!getPrecioUnitario) {
      console.log("no se encontro precio unitario")
    }

    const { precio_unitario, unidades } = getPrecioUnitario;
    function cleanMoneyString(moneyString) {
      return parseFloat(moneyString.replace(/[$,]/g, ""));
    }
    const precio_unitarioClean = cleanMoneyString(precio_unitario);
    const precio_unitarioFinal = precio_unitarioClean * unidades
    console.log("precio_unitario:",precio_unitario)
    console.log("unidades",unidades)
    console.log("precio_unitarioFinal", precio_unitarioFinal)

    // Consulta para obtener el importe neto actual
    const importeNetoQuery = await db.oneOrNone(`
      SELECT importe_neto 
      FROM doctos_ve 
      WHERE docto_ve_id = ${id}
    `);
    

    if (!importeNetoQuery) {
      console.log("No se encontró el documento con el importe neto.");
    }

    const { importe_neto } = importeNetoQuery;
    console.log("importe_neto",importe_neto)

      // Elimina el símbolo de dólar y las comas
    // function cleanMoneyString(moneyString) {
    //   return parseFloat(moneyString.replace(/[$,]/g, ""));
    // }
    
    //Calcula el nuevo importe neto
    const importe_netoFin = cleanMoneyString(importe_neto);
    //const precio_unitarioFin = cleanMoneyString(precio_unitarioFinal);
    console.log("importe_netoFin",importe_netoFin)
   // console.log("precio_unitarioFin",precio_unitarioFinal)
    const nuevoImporteNeto = importe_netoFin - precio_unitarioFinal;
    console.log("nuevoImporteNeto",nuevoImporteNeto);

     
    // Actualizar la tabla doctos_ve con el nuevo importe neto
    const updateQuery = await db.any(`
      UPDATE doctos_ve 
      SET importe_neto = ${nuevoImporteNeto}
      WHERE docto_ve_id = ${id}
    `);
    

    
    //*nuevo 23 de nov fin
    const cartDet = await db.any(`DELETE FROM doctos_ve_det 
                                    WHERE docto_ve_id = ${id}
                                      AND articulo_id = ${product_id}`);

  
    //if (cartDet.length === 0){
     // console.log("no existe")
      // return {       
      //   //success: true, 
      //   message: "No existe carrito o articulo. Revisa Datos ",
      // };
    //}
    //return true;
    
    console.log("si existe")
    // mensaje = `Producto con ID ${id} eliminado del carrito`;
    // return mensaje; 
    const response = { error: false, created: true, mensaje: `Producto con ID ${id} eliminado del carrito` }
    return response;
  } catch (error) {
    //console.error("<<updateCartId>> : Error fetching API key:", error);
    return false;
  }
};

//17. Get List Category
const getListCategory = async (data) => {
  console.log("Entro a la API 17. Get List Category");

  try {
    
    const productsAll = await db.any(`SELECT grupo_linea_id, nombre 
                    FROM public.grupos_lineas
	                  WHERE   grupo_linea_id >= '167' 
	                     AND  grupo_linea_id <= '399' `);
    //return productsAll;
    //return productsAll[0];
     const result = {
       Categorias: productsAll
     };
     return result;
  } catch (error) {
    //console.error("<<getProducts>> : Error fetching API key:", error);
    return false;
  }
};

//18. Get id_invitado
// cliente_id = 7 && carrito_id =  133
const getInvitado = async (data) => {

  console.log("Entro a la API /18. Get id_invitado");
  // const { id } = data.params;
  // if (!id || isNaN(id)) {
  //   throw new Error("Invalid Product ID parameter");
  // }
  console.log("entrando al modelo de la API modo Invitado");

  // const getCliente = await db.one(
  //   `SELECT count(cliente_id) AS existe FROM clientes WHERE cliente_id = '${id}'`
  // );
  // const existe = parseInt(getCliente.existe);
  // console.log(existe);
  // if (existe) {
  //   const getNombre = await db.one(
  //     `SELECT nombre FROM clientes WHERE cliente_id = '${id}'`
  //   );
  //   return {
  //     NombreCliente: ` ${getNombre.nombre}`,
  //   };
  // }

  try {
    console.log("Entro a modo Invitado; no existe el cliente ");
    const getIdInvitado = await db.one(`INSERT INTO clientes (nombre)
	                  VALUES ('Invitado')
	                  RETURNING nombre,cliente_id`);
    console.log(getIdInvitado);
    return getIdInvitado;
  } catch (error) {
    //console.error("<<createCart>> : Error fetching API key:", error);
    return false;
    //return {       
    //  success: true, // Esto indica que no hubo error 404.
    //  message: "Error en lo datos, Favor de validar.",
    //};
  }
};

//19. Paginacion por productos

const getOrdersPag = async (data) => {
  console.log("Entro a la API/19. Paginacion por productos");
  try {
    // Extraer los parámetros necesarios del cuerpo de la solicitud
    const {
      account_id,
      searchQuery,
      perPages: limit,
      current_page,
    } = data.body;
    //console.log('data.body:', data.body);

    console.log("account_id", account_id);
    console.log("searchQuery:", searchQuery);
    console.log("limit:", limit);
    console.log("current_page:", current_page);

    // Calcular el desplazamiento (offset) para la paginación
    const offset = limit * (current_page - 1);
    console.log("offset", offset);

    // Construir la consulta SQL con las uniones y la cláusula WHERE
    let queryStr = `
      SELECT articulos.articulo_id, 
             articulos.nombre, 
             precios.precio, 
             precios.precio * (impuestos.pctje_unitario / 100) AS monto_impuesto, 
             precios.costo_envio
      FROM articulos
      INNER JOIN precios 
          ON (articulos.articulo_id = precios.articulo_id AND precios.precio_empresa_id = '210')
      INNER JOIN impuestos_articulos 
          ON precios.articulo_id = impuestos_articulos.articulo_id
      INNER JOIN impuestos 
          ON impuestos_articulos.impuesto_id = impuestos.impuesto_id 
      WHERE precios.precio_empresa_id = '210' `;

     

    // Si se proporciona un término de búsqueda, añadir la condición LIKE
    if (searchQuery) {
      queryStr += `AND upper(articulos.nombre) LIKE '%${searchQuery.toUpperCase()}%' `;
       // AQUI
      const responesAll2 = await db.any(queryStr);
      const totalAll = responesAll2.length;
      console.log("total", totalAll);
    // AQUI
    }
        // AQUI
      const responesAll2 = await db.any(queryStr);
      const totalAll = responesAll2.length;
      console.log("total", totalAll);
    // AQUI
    

    // Añadir la cláusula de ordenación, límite y desplazamiento para la paginación
    queryStr += `ORDER BY articulos.nombre LIMIT ${limit} OFFSET ${offset}`;

    // Ejecutar la consulta para obtener todos los resultados
    const responesAll = await db.any(queryStr);
    // Obtener el número total de resultados
    const total = responesAll.length;
    console.log("total", total);

    // Ejecutar la consulta para obtener los datos paginados
    const resultData = await db.any(queryStr);

    // Crear el objeto meta con información sobre la paginación
    const meta = {
      count: totalAll,
      count1: total, // Total de resultados obtenidos
      current_page: current_page, // Página actual
      page_size: limit, // Número de resultados por página
      searchQuery: searchQuery, // Término de búsqueda utilizado
    };

    // Crear la respuesta final con los datos y la meta
    const response = {
      meta: meta, // Información sobre la paginación
      data: resultData, // Datos paginados obtenidos de la base de datos
    };

    // Devolver la respuesta final
    return response;
  } catch (error) {
    // Si ocurre un error, registrarlo en la consola y devolver 'false'
    //console.error("Error:", error);
    return false;
    //return {       
     // success: true, // Esto indica que no hubo error 404.
     // message: "Error en lo datos, Favor de validar.",
    //};
  }
};

//20. Obtener id carrito por usuario

const getIdCart = async (data) => {
  console.log("Entro a la API 20. Obtener id carrito por usuario");
  const { id } = data.params;
  if (!id || isNaN(id)) {
    //throw new Error("Invalid Cart ID parameter");
    // return [
    //   {
    //     message: "ID del carrito incorrecto. Proporciona uno valido"
    //   }
    // ];
    return {message: "ID del carrito incorrecto. Proporciona uno valido"}
  }
  console.log(
    "Se encuentra en la API de obtener informacion del usuario NUEVA API en el modelo"
  );
  try {
    const productAll = await db.any(`SELECT  clientes.nombre AS nombre_cliente,
                                             ARRAY_AGG(doctos_ve.docto_ve_id ORDER BY doctos_ve.docto_ve_id ASC) AS carritos_id
                                     FROM clientes 
                                     INNER JOIN doctos_ve
                                     ON clientes.cliente_id = doctos_ve.cliente_id 
                                     WHERE doctos_ve.cliente_id = ${id}  
                                          AND doctos_ve.tipo_docto = 'cotizacion'
                                          GROUP BY clientes.nombre;`);

  //  const name = await db.any(`SELECT nombre AS nombre_cliente
  //                             FROM clientes 
  //                             WHERE cliente_id = ${id}`);                                          

    if (productAll.length === 0) {
      console.log("No se encontró ningún carrito existente");

  // Ejecutamos la consulta para obtener solo el nombre del cliente si no hay carritos
  const nameResult = await db.any(`SELECT nombre AS nombre_cliente
                                   FROM clientes 
                                   WHERE cliente_id = ${id}`);
   console.log("nameResult",nameResult)    
   if (nameResult.length === 0){
    // return [
    //   {
    //     message: "No existe cliente. Proporciona uno valido"
    //   }
    // ];
    return {  message: "No existe cliente. Proporciona uno valido"}
   }

  // Extraemos el nombre o asignamos null si no se encontró
  const nombre_cliente = nameResult.length > 0 ? nameResult[0].nombre_cliente : "name";

  // return [
  //   {
  //     nombre_cliente,
  //     carritos_id: null
  //   }
  // ];
  return {
    nombre_cliente,
    carritos_id: null
  }
    } else {
      //return productAll;
      return productAll[0];
    }
  } catch (error) {
    //console.error("<<getIdCart>> : Error fetching API key:", error);
    return false;
    //return {       
    //  success: true, // Esto indica que no hubo error 404.
    //  message: "Error en lo datos, Favor de validar.",
    //};
  }
};

//21. Paginacion de lista de categorias 

const getCategoryPag = async (data) => {

  console.log("Entro a la API 21. Paginacion de lista de categorias ");
  const {
    account_id,
    searchQuery,
    perPages: limit,
    current_page,
  } = data.body;

  console.log("account_id", account_id);
  console.log("searchQuery:", searchQuery);
  console.log("limit:", limit);
  console.log("current_page:", current_page);

  const offset = limit * (current_page - 1);
  console.log("offset", offset);

  if (!searchQuery || searchQuery.trim() === '') {
    console.log('El campo searchQuery está vacío.');
    let queryStr = `
      SELECT grupo_linea_id,nombre FROM public.grupos_lineas`;
    //aqui
    const responesAll1 = await db.any(queryStr);
    const totalAll = responesAll1.length;
    console.log("total", totalAll); 
    //aqui  

    queryStr += ` ORDER BY grupo_linea_id LIMIT ${limit} OFFSET ${offset}`;
    
    const responesAll = await db.any(queryStr);
    const total = responesAll.length;
    console.log("total", total);
 
     const resultData = await db.any(queryStr);
 
     const meta = {
        count1: total, 
        count: totalAll,
        current_page: current_page, 
        page_size: limit, 
        searchQuery: searchQuery, 
       };

       const response = {
        meta: meta, 
        data: resultData, 
       };

        return response;
    } 


  try {
 
    //revisar como usar acentos 
    const idCategoria = await db.oneOrNone(
      `SELECT grupo_linea_id 
       FROM grupos_lineas
       WHERE UPPER(grupos_lineas.nombre) LIKE $1`,
      [`%${searchQuery.toUpperCase()}%`]
    );
    // Si no se encuentra ningún resultado
    if (!idCategoria) {
      console.log("Categoria no encontrado");
      return {
        error: true,
        message: "Categoria no encontrado.",
      };
    }
     
    console.log("idcategoria",idCategoria)
     let queryStr = `
     SELECT  articulos.articulo_id,
               articulos.nombre,
               precios.precio,
               precios.precio * (impuestos.pctje_unitario / 100) AS monto_impuesto,
               precios.costo_envio
       FROM lineas_articulos
       INNER JOIN articulos
       ON lineas_articulos.linea_articulo_id = articulos.linea_articulo_id
       INNER JOIN precios
       ON articulos.articulo_id = precios.articulo_id
	     INNER JOIN impuestos_articulos
       ON precios.articulo_id = impuestos_articulos.articulo_id
       INNER JOIN impuestos
       ON impuestos_articulos.impuesto_id = impuestos.impuesto_id
       WHERE (lineas_articulos.grupo_linea_id = ${idCategoria.grupo_linea_id} 
       AND precios.precio_empresa_id = '210') `;

       //aqui
    const responesAll1 = await db.any(queryStr);
    const totalAll = responesAll1.length;
    console.log("total", totalAll); 
    //aqui  
    

    //queryStr += ` ORDER BY grupo_linea_id LIMIT ${limit} OFFSET ${offset}`;
    queryStr += `ORDER BY articulos.nombre LIMIT ${limit} OFFSET ${offset}`; 
    const responesAll = await db.any(queryStr);
    // Obtener el número total de resultados
    const total = responesAll.length;
    console.log("total", total);
  
    const resultData = await db.any(queryStr);

    const meta = {
      count : totalAll,
      count1: total, 
      current_page: current_page, 
      page_size: limit, 
      searchQuery: searchQuery, 
    };
    //console.log("meta", meta);

    const response = {
      meta: meta, 
      data: resultData, 
    };
      //console.log("response", response)
    
    return response;
  } catch (error) {
    //console.error("Error:", error);
   return false;
    // return {       
      // success: true, // Esto indica que no hubo error 404.
       //message: "Error en lo datos, Favor de validar.",
     //};
  }
};

//Borrador

  const createCartAdd = async (id, pedidos) => {
    console.log("MODELO");
    console.log("pedidos", pedidos.length);
    let i = 0;
    let createdOrders = [];
   const { articulo_id, unidades } = pedidos[i];
    console.log("cliente_id:", id)
    console.log("articulo_id:",articulo_id)
    console.log("unidades",unidades)

      const getCliente = await db.oneOrNone(
        `SELECT cliente_id FROM clientes WHERE cliente_id = $1`, 
        [id]
      );
    
      if (!getCliente) {   
        const response = { error: true, mensaje: "Cliente no existe" }
        return response;
      }
      console.log("Cliente encontrado:", getCliente);

      // Inserción inicial de la cotización
      const articulosAll = await db.one(`INSERT INTO
                                          doctos_ve (tipo_docto, cliente_id)
                                          VALUES ('cotizacion', '${id}')
                                          RETURNING docto_ve_id`);
      const doctoVeId = articulosAll.docto_ve_id;
      console.log("Cotización creada: ", articulosAll);
    
  
    try {
        const data = pedidos[i];
      
      for (let i = 0; i < pedidos.length; i++) {
        const data = pedidos[i];
        console.log("Procesando pedido:", data);
  
        // Validar si el artículo existe y tiene precio válido
        const getClientes = await db.one(
          `SELECT count(precio) AS existes
           FROM precios 
           WHERE articulo_id = '${data.articulo_id}' AND 
           (precio_empresa_id = '210')`
        );
        const existes = parseInt(getClientes.existes);
        console.log("Artículo existe:", existes);
  
        if (!existes) {    
          const response = { error: true, 
            mensaje: `Artículo con ID ${data.articulo_id} no existe o no tiene precio válido.` }
          return response;
        }
  
        const articulosPrecio = await db.one(`SELECT precio
                                              FROM precios 
                                              WHERE articulo_id = '${data.articulo_id}' AND 
                                              (precio_empresa_id = '210')`);
        const precio = parseFloat(articulosPrecio.precio.replace(/[$,]/g, ""));
        const unidades = data.unidades;
        const totalNeto = precio * unidades;
  
        console.log("Precio limpio:", precio);
        console.log("Total Neto:", totalNeto);
  
        // Inserción en el carrito
        await db.one(`INSERT INTO
                       doctos_ve_det (docto_ve_id, clave_articulo, articulo_id, unidades, unidades_comprom,
                       unidades_surt_dev, unidades_a_surtir, precio_unitario, pctje_dscto,
                       dscto_art, pctje_dscto_cli , dscto_extra, pctje_dscto_vol , pctje_dscto_promo ,
                       precio_total_neto, pctje_comis, rol, notas, posicion)
                       VALUES ('${doctoVeId}','abc','${data.articulo_id}','${data.unidades}','1','0','0',
                       '${precio}', '0.00','0.00', '0.00','0.00' ,'0.00',
                       '0.00','${totalNeto}','0.00','N','1','1')
                       RETURNING docto_ve_id AS id`);
  
        // Actualización del carrito
        await db.any(`UPDATE doctos_ve
                      SET importe_neto = (SELECT SUM(precio_total_neto) FROM doctos_ve_det WHERE docto_ve_id = '${doctoVeId}')
                      WHERE docto_ve_id = '${doctoVeId}'`);

                      console.log("pedidos.length", pedidos.length)

    createdOrders.push({
     message: `Artículo ${data.articulo_id} agregado al carrito exitosamente.`,
    });
       
      }
      console.log("Todos los pedidos procesados.");
  
    } catch (error) {
      console.error("Error en addCartId:", error);
      return { error: true, message: "Error al crear carrito." };
    }
  
      const response = { error: false,
                         created: true, 
                         cliente_id: Number(id),
                         carrito_creado: doctoVeId,
                         createdOrders }
      return response;
  };

module.exports = {
  getArticulos,
  getArticulo,
  getOrders,
  addProducts,
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
