const request = require('supertest');
const http = require('http');
const app = require('../../../../src/ServiceDaiko'); // Ruta a tu archivo server.js

let server;

beforeAll((done) => {
  const PORT = 4000; // Puerto fijo para pruebas
  server = http.createServer(app);
  server.listen(PORT, () => {
    global.testUrl = `http://localhost:${PORT}`;
    done();
  });
});

afterAll((done) => {
  server.close(done); // Cierra el servidor después de las pruebas
});

//1. Listado de productos
describe('Pruebas de API: GET /v1/api/products', () => {
  it('debería devolver una lista de productos con más de un elemento', async () => {
    const api_access_token = 'reiHkxHbzG9yWt5eNBJaWYML'; 
   

    const res = await request(global.testUrl)
    //const res = await request(app)
      .get('/v1/api/products')
      //.set('Authorization', `Bearer ${api_access_token}`) // Token de autenticación
      .set('access-token', api_access_token) // Token de autenticación
      .set('Content-Type', 'application/json') // Tipo de contenido
     // .set('Accept', 'application/json'); // Encabezado de aceptación

    // Validaciones de respuesta
    expect(res.statusCode).toEqual(200); // Código de estado esperado
    expect(res.body).toBeDefined(); // Cuerpo de la respuesta debe estar definido
    expect(res.body.productos).toBeInstanceOf(Array); // Validar que sea un array
    expect(res.body.productos.length).toBeGreaterThan(1); // Más de un producto esperado
  });
});


//2. Detalle del producto
describe('Pruebas de API: GET /v1/api/product/:id', () => {
  it('debería devolver el producto correspondiente al ID proporcionado', async () => {
    const api_access_token = 'reiHkxHbzG9yWt5eNBJaWYML'; // Token de autenticación válido
    const id = 211; // ID de producto válido

    const res = await request(global.testUrl)
      .get(`/v1/api/product/${id}`) // Reemplaza ':id' con el valor real
      .set('access-token', api_access_token) // Token de autenticación
      .set('Content-Type', 'application/json'); // Tipo de contenido
      console.log("Respuesta del servidor",res.body); 


    // Validaciones de respuesta
    expect(res.statusCode).toEqual(200); // Verifica el código de estado
    expect(res.body).toBeDefined(); // Asegúrate de que el cuerpo esté definido
    expect(res.body).toHaveProperty('articulo_id', id); // Verifica que el ID coincida
    expect(res.body).toHaveProperty('nombre'); // Asegúrate de que la propiedad 'precio' exista
    expect(res.body).toHaveProperty('notas_ventas'); // Asegúrate de que la propiedad 'precio' exista
    expect(res.body).toHaveProperty('precio'); // Asegúrate de que la propiedad 'precio' exista
    expect(res.body).toHaveProperty('monto_impuesto'); // Asegúrate de que la propiedad 'precio' exista
    expect(res.body).toHaveProperty('costo_envio'); // Asegúrate de que la propiedad 'precio' exista
    expect(res.body).toHaveProperty('total_articulos'); // Asegúrate de que la propiedad 'total_articulos' exista

    // Validaciones adicionales (opcional)
    expect(typeof res.body.articulo_id).toBe('number'); // 'articulo_id' debe ser un número
    expect(typeof res.body.nombre).toBe('string'); // 'articulo_id' debe ser un número
    expect(typeof res.body.notas_ventas).toBe('string'); // 'articulo_id' debe ser un número
    expect(typeof res.body.precio).toBe('string'); // 'precio' debe ser una cadena
    expect(typeof res.body.monto_impuesto).toBe('string'); // 'articulo_id' debe ser un número
    expect(typeof res.body.costo_envio).toBe('string'); // 'articulo_id' debe ser un número
    expect(typeof res.body.total_articulos).toBe('string');
  });
});

//3. Busqueda del producto
describe('Pruebas de API: GET /v1/api/products/search/:keyword', () => {
  it('debería devolver una lista de productos con más de un elemento', async () => {
    const api_access_token = 'reiHkxHbzG9yWt5eNBJaWYML'; 
    const keyword = 'tenis'

    const res = await request(global.testUrl)
      .get(`/v1/api/products/search/${keyword}`)
      .set('access-token', api_access_token) 
      .set('Content-Type', 'application/json')
      console.log("Respuesta del servidor",res.body);  
     

    // Validaciones de respuesta
    expect(res.statusCode).toEqual(200); // Código de estado esperado
    expect(res.body).toBeDefined(); // Cuerpo de la respuesta debe estar definido
    expect(res.body.productos).toBeInstanceOf(Array); // Validar que sea un array
    expect(res.body.productos.length).toBeGreaterThan(1); // Más de un producto esperado
  });
});

//4. Categorias del producto
describe('Pruebas de API: GET /v1/api/products/category/:name', () => {
  it('debería devolver una lista de productos con más de un elemento', async () => {
    const api_access_token = 'reiHkxHbzG9yWt5eNBJaWYML'; 
    const name = 'ropa'

    const res = await request(global.testUrl)
      .get(`/v1/api/products/category/${name}`)
      .set('access-token', api_access_token) 
      .set('Content-Type', 'application/json')
      console.log("Respuesta del servidor",res.body);  
     

    // Validaciones de respuesta
    expect(res.statusCode).toEqual(200); // Código de estado esperado
    expect(res.body).toBeDefined(); // Cuerpo de la respuesta debe estar definido
    expect(res.body.productos).toBeInstanceOf(Array); // Validar que sea un array
    expect(res.body.productos.length).toBeGreaterThan(1); // Más de un producto esperado
  });
});

/* //5. Crear carrito virtual
 describe('Pruebas de API: POST /v1/api/cart', () => {
  it('debería Crear carrito virtual', async () => {
    const api_access_token = 'reiHkxHbzG9yWt5eNBJaWYML'; 
    const requestBody = {
      cliente_id: 4,
      articulo_id: 235,
      unidades: 2,
    };

    const res = await request(global.testUrl)
      .post('/v1/api/cart')
      .set('access-token', api_access_token) 
      .set('Content-Type', 'application/json')
      .send(requestBody); // Cuerpo de la solicitud
      console.log("Respuesta del servidor",res.body);  
      
    // Validaciones de respuesta
    expect(res.statusCode).toEqual(200); // Código de estado esperado
    expect(res.body).toBeDefined(); // Cuerpo de la respuesta debe estar definido
    expect(res.body).toHaveProperty('carritoAll'); // Verifica que 'carritoAll' esté presente
    expect(res.body.carritoAll).toHaveProperty('id'); // Verifica que 'id' esté dentro de 'carritoAll'
    expect(res.body).toHaveProperty('created', true); // Verifica que 'created' sea true
    expect(res.body).toHaveProperty('error', false);
    // Guardar el carrito_id para usarlo en la siguiente prueba
    carritoId = res.body.carritoAll.id;
    expect(carritoId).toBeDefined(); // Asegurarse de que el carritoId fue generado
  });
});  */

//6. Obtener carrito virtual
describe('Pruebas de API: GET /v1/api/cart/:id', () => {
  it('debería devolver una lista de productos con más de un elemento', async () => {
    const api_access_token = 'reiHkxHbzG9yWt5eNBJaWYML'; 
    const id = '621'

    const res = await request(global.testUrl)
      .get(`/v1/api/cart/${id}`)
      .set('access-token', api_access_token) 
      .set('Content-Type', 'application/json')
      console.log("Respuesta del servidor",res.body);  
     

    // Validaciones de respuesta
    expect(res.statusCode).toEqual(200); // Código de estado esperado
    expect(res.body).toBeDefined(); // Cuerpo de la respuesta debe estar definido
    // Validar que "Carrito" sea un array
    expect(res.body.Carrito).toBeInstanceOf(Array); // Verifica que 'Carrito' sea un array
    expect(res.body.Carrito.length).toBeGreaterThan(0); // Verifica que 'Carrito' tenga al menos un elemento
    
    // Validar que "importeCarrito" sea un objeto y tenga la propiedad 'id_carrito'
    expect(res.body.importeCarrito).toHaveProperty('id_carrito');
    expect(res.body.importeCarrito).toHaveProperty('importe_neto');
    expect(res.body.importeCarrito).toHaveProperty('nombre_cliente');
    expect(res.body.importeCarrito).toHaveProperty('dscto_extra');
    expect(res.body.importeCarrito).toHaveProperty('total_costo_envio');
  });
});


//7. Actualizar un carrito 
 describe('Pruebas de API: PUT /v1/api/cart/:id', () => {
  it('debería devolver una lista de productos con más de un elemento', async () => {
    const api_access_token = 'reiHkxHbzG9yWt5eNBJaWYML'; 
    const id = '621'
    const requestBody = {
      articulo_id: "235",
      unidades: "2",
    };

    const res = await request(global.testUrl)
      .put(`/v1/api/cart/${id}`)
      .set('access-token', api_access_token) 
      .set('Content-Type', 'application/json')
      .send(requestBody); // Cuerpo de la solicitud
      console.log("Respuesta del servidor",res.body);  
      
    // Validaciones de respuesta
    expect(res.statusCode).toEqual(200); // Código de estado esperado
    expect(res.body).toBeDefined(); // Cuerpo de la respuesta debe estar definido
    expect(res.body).toHaveProperty('mensaje'); // Verifica que 'carritoAll' esté presente
    expect(res.body).toHaveProperty('created', true); // Verifica que 'created' sea true
    expect(res.body).toHaveProperty('error', false);
  });
}); 

/* //let VarGlobal = "";
//8. Eliminar carrito virtual
describe('Pruebas de API: DELETE /v1/api/cart/:id', () => {
  it('debería el carrito indicado', async () => {
    const api_access_token = 'reiHkxHbzG9yWt5eNBJaWYML'; 
    const id = '618'

    const res = await request(global.testUrl)
      .delete(`/v1/api/cart/${id}`)
      .set('access-token', api_access_token) 
      .set('Content-Type', 'application/json')
      console.log("Respuesta del servidor",res.body);  
     

    // Validaciones de respuesta
    expect(res.statusCode).toEqual(200); // Código de estado esperado
    expect(res.body).toBeDefined(); // Cuerpo de la respuesta debe estar definido
    expect(res.body).toHaveProperty('status'); 
    expect(res.body).toHaveProperty('data'); 
  });
}); */

//9. Agregar Producto al Carrito
describe('Pruebas de API: POST /api/cart/:id/productos', () => {
  it('debería devolver una lista de productos con más de un elemento', async () => {
    const api_access_token = 'reiHkxHbzG9yWt5eNBJaWYML'; 
    const id = '621'
    const requestBody = 
    {
      "productos": [
        { "articulo_id": 235, "unidades": 1, "cliente_id": 4 }
      ]
    }

    const res = await request(global.testUrl)
      .post(`/v1/api/cart/${id}/productos`)
      .set('access-token', api_access_token) 
      .set('Content-Type', 'application/json')
      .send(requestBody); // Cuerpo de la solicitud
      console.log("Respuesta del servidor",res.body);  
      
    // Validaciones de respuesta
    expect(res.statusCode).toEqual(200); // Código de estado esperado
    expect(res.body).toBeDefined(); // Cuerpo de la respuesta debe estar definido
    // Validar que 'results' sea un array y tenga al menos un producto
    expect(res.body.results).toBeInstanceOf(Array); // Verifica que 'results' sea un array
    expect(res.body.results.length).toBeGreaterThan(0);

    expect(res.body).toHaveProperty('created', true); // Verifica que 'created' sea true
    expect(res.body).toHaveProperty('error', false);
    //expect(res.body).toHaveProperty('results'); // Verifica que 'carritoAll' esté presente
    //expect(res.body.results).toHaveProperty('articulo_id'); 
    expect(res.body.results[0]).toHaveProperty('articulo_id'); 
    expect(res.body.results[0].articulo_id).toEqual(235);
    expect(res.body.results[0]).toHaveProperty('unidades'); 
    expect(res.body.results[0].unidades).toEqual(1);
    expect(res.body.results[0]).toHaveProperty('totalNeto'); 
    expect(res.body.results[0].totalNeto).toEqual(7125);        
  });
}); 


/* //10. Eliminar producto al carrito
describe('Pruebas de API: DELETE /v1/api/cart/:id/:product_id', () => {
  it('debería devolver una lista de productos con más de un elemento', async () => {
    const api_access_token = 'reiHkxHbzG9yWt5eNBJaWYML'; 
    const id = '621'
    const product_id = '7528'
   

    const res = await request(global.testUrl)
      .delete(`/v1/api/cart/${id}/${product_id}`)
      .set('access-token', api_access_token) 
      .set('Content-Type', 'application/json')
      console.log("Respuesta del servidor",res.body);  
      
    // Validaciones de respuesta
    expect(res.statusCode).toEqual(200); // Código de estado esperado
    expect(res.body).toBeDefined(); // Cuerpo de la respuesta debe estar definido
    expect(res.body).toHaveProperty('mensaje'); // Verifica que 'carritoAll' esté presente
    expect(res.body).toHaveProperty('created', true); // Verifica que 'created' sea true
    expect(res.body).toHaveProperty('error', false);
  });
});  */

let carritoId;
//5. Crear carrito virtual
describe('Pruebas de API: POST /v1/api/cart', () => {
  it('debería Crear carrito virtual', async () => {
    const api_access_token = 'reiHkxHbzG9yWt5eNBJaWYML'; 
    const requestBody = {
      cliente_id: 4,
      articulo_id: 235,
      unidades: 2,
    };

    const res = await request(global.testUrl)
      .post('/v1/api/cart')
      .set('access-token', api_access_token) 
      .set('Content-Type', 'application/json')
      .send(requestBody); // Cuerpo de la solicitud
      console.log("Respuesta del servidor",res.body);  
      
    // Validaciones de respuesta
    expect(res.statusCode).toEqual(200); // Código de estado esperado
    expect(res.body).toBeDefined(); // Cuerpo de la respuesta debe estar definido
    expect(res.body).toHaveProperty('carritoAll'); // Verifica que 'carritoAll' esté presente
    expect(res.body.carritoAll).toHaveProperty('id'); // Verifica que 'id' esté dentro de 'carritoAll'
    expect(res.body).toHaveProperty('created', true); // Verifica que 'created' sea true
    expect(res.body).toHaveProperty('error', false);
    // Guardar el carrito_id para usarlo en la siguiente prueba
    carritoId = res.body.carritoAll.id;
    expect(carritoId).toBeDefined(); // Asegurarse de que el carritoId fue generado
  });
}); 

//11. Crear orden con carrito virtual
 describe('Pruebas de API: POST /v1/api/orders', () => {
  it('debería devolver una lista de productos con más de un elemento', async () => {
    const api_access_token = 'reiHkxHbzG9yWt5eNBJaWYML'; 
    const requestBody = 
    {
      //"docto_ve_id": 621, 
      "docto_ve_id": carritoId, // Usa el carritoId aquí
      "tipo_docto": "Pedido", 
      "estatus": "EN TRANSITO", 
      "vendedor_id": 123,
       "cliente_id": 4, 
       "estatus_pago": "PENDIENTE",
        "metadata_pago": 
        { 
         "pasarela_pago": "2"
          }
 }

    const res = await request(global.testUrl)
      .post('/v1/api/orders')
      .set('access-token', api_access_token) 
      .set('Content-Type', 'application/json')
      .send(requestBody); // Cuerpo de la solicitud
      console.log("Respuesta del servidor",res.body);  
      
    // Validaciones de respuesta
    expect(res.statusCode).toEqual(200); // Código de estado esperado
    expect(res.body).toBeDefined(); // Cuerpo de la respuesta debe estar definido
    expect(res.body).toHaveProperty('error'); // Verifica que 'error' esté presente
    expect(res.body.error).toEqual(true); // Verifica que 'error' tenga el valor 'true'

    expect(res.body).toHaveProperty('data'); // Verifica que 'data' esté presente
    
    
    
    expect(res.body.data).toHaveProperty('message'); // Verifica que 'message' esté dentro de 'data'
    expect(res.body.data.message).toEqual('Orden creada con exito'); // Verifica que el mensaje sea el esperado

    expect(res.body.data).toHaveProperty('getCartId'); // Verifica que 'getCartId' esté presente dentro de 'data'
   
    expect(res.body.data.getCartId).toHaveProperty('cliente_id'); // Verifica que 'cliente_id' esté en 'getCartId'
    //expect(res.body.data.getCartId.cliente_id).toEqual(4); // Verifica que 'cliente_id' tenga el valor correcto

    expect(res.body.data.getCartId).toHaveProperty('carrito_id'); // Verifica que 'carrito_id' esté en 'getCartId'
    //expect(res.body.data.getCartId.carrito_id).toEqual(621); // Verifica que 'carrito_id' tenga el valor correcto

    expect(res.body.data.getCartId).toHaveProperty('orden_id'); // Verifica que 'orden_id' esté en 'getCartId'
    //expect(res.body.data.getCartId.orden_id).toEqual(626); 
  });
}); 


//12.Listado de ordenes por usuario
 describe('Pruebas de API: GET /v1/api/orders/user/:id', () => {
  it('debería devolver un Listado de ordenes por usuario', async () => {
    const api_access_token = 'reiHkxHbzG9yWt5eNBJaWYML'; 
    const id = '9'

    const res = await request(global.testUrl)
      .get(`/v1/api/orders/user/${id}`)
      .set('access-token', api_access_token) 
      .set('Content-Type', 'application/json')
      console.log("Respuesta del servidor",res.body);  
      
    // Validaciones de respuesta
    expect(res.statusCode).toEqual(200); // Código de estado esperado
    expect(res.body).toBeDefined(); // Cuerpo de la respuesta debe estar definido
    expect(res.body).toHaveProperty('error', true);
    expect(res.body).toHaveProperty('message'); // Verifica que 'carritoAll' esté presente
  });
}); 


//13. Estado de la orden
describe('Pruebas de API: GET /v1/api/orders/:id/status', () => {
  it('debería devolver informacion de un Estado de la orden', async () => {
    const api_access_token = 'reiHkxHbzG9yWt5eNBJaWYML'; 
    const id = '535'

    const res = await request(global.testUrl)
      .get(`/v1/api/orders/${id}/status`)
      .set('access-token', api_access_token) 
      .set('Content-Type', 'application/json')
      console.log("Respuesta del servidor",res.body);  
     

      // Validaciones de respuesta
    expect(res.statusCode).toEqual(200); // Código de estado esperado
    expect(res.body).toBeDefined(); // Cuerpo de la respuesta debe estar definido

    // Validar que 'data' exista y sea un arreglo
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toBeInstanceOf(Array);

    // Validar que cada objeto en el arreglo tenga las propiedades requeridas
    res.body.data.forEach(item => {
      expect(item).toHaveProperty('cliente_id'); 
      expect(item).toHaveProperty('estatus_orden'); 
      expect(item).toHaveProperty('estatus_pago'); 
    });

    // Validar que el campo 'status' sea 'OK'
    expect(res.body).toHaveProperty('status', 'OK');
  });
});


//14. Actualizar Estado de Pago de la Orden

describe('Pruebas de API: POST /api/orders/:id/status', () => {
  it('Actualizar Estado de Pago de la Orden', async () => {
    const api_access_token = 'reiHkxHbzG9yWt5eNBJaWYML'; 
    const id = '535'
    const requestBody = 
    {
      "estatus_pago": "Pendiente"
    }

    const res = await request(global.testUrl)
      .post(`/v1/api/orders/${id}/status`)
      .set('access-token', api_access_token) 
      .set('Content-Type', 'application/json')
      .send(requestBody); // Cuerpo de la solicitud
      console.log("Respuesta del servidor API 14.",res.body);  
     

    // Validaciones de respuesta
    expect(res.statusCode).toEqual(200); // Código de estado esperado
    expect(res.body).toBeDefined(); // Cuerpo de la respuesta debe estar definido
    expect(res.body).toHaveProperty('status'); 
    expect(res.body).toHaveProperty('data'); 
  });
});

//15.Actualizar Estado de la Orden
describe('Pruebas de API: POST /api/ordenes/:id/estado-orden', () => {
  it('Actualizar Estado de la Orden', async () => {
    const api_access_token = 'reiHkxHbzG9yWt5eNBJaWYML'; 
    const id = '535'
    const requestBody = 
    {
      "estatus": "Pedido"
    }

    const res = await request(global.testUrl)
      .post(`/v1/api/ordenes/${id}/estado-orden`)
      .set('access-token', api_access_token) 
      .set('Content-Type', 'application/json')
      .send(requestBody); // Cuerpo de la solicitud
      console.log("Respuesta del servidor API 15.",res.body);  
     

    // Validaciones de respuesta
    expect(res.statusCode).toEqual(200); // Código de estado esperado
    expect(res.body).toBeDefined(); // Cuerpo de la respuesta debe estar definido
    expect(res.body).toHaveProperty('status'); 
    expect(res.body).toHaveProperty('data'); 
  });
});


//17. Muestra la lista de categorias 
 describe('Pruebas de API: GET v1/api/products/category', () => {
  it('debería devolver una lista de categorias existentes', async () => {
    const api_access_token = 'reiHkxHbzG9yWt5eNBJaWYML'; 
   

    const res = await request(global.testUrl)
      .get('/v1/api/products/category')
      .set('access-token', api_access_token) 
      .set('Content-Type', 'application/json')
      console.log("Respuesta del servidor",res.body);  
      
    // Validaciones de respuesta
    expect(res.statusCode).toEqual(200); // Código de estado esperado
    expect(res.body).toBeDefined(); // Cuerpo de la respuesta debe estar definido
    expect(res.body.Categorias).toBeInstanceOf(Array); // Validar que sea un array
    expect(res.body.Categorias.length).toBeGreaterThan(1); // Más de un producto esperado
  });
}); 



//18. Crear un id_invitado
describe('Pruebas de API: GET /v1/api/invitado', () => {
  it('debería devolver un Listado de ordenes por usuario', async () => {
    const api_access_token = 'reiHkxHbzG9yWt5eNBJaWYML'; 
    

    const res = await request(global.testUrl)
      .get('/v1/api/invitado')
      .set('access-token', api_access_token) 
      .set('Content-Type', 'application/json')
      console.log("Respuesta del servidor",res.body);  
      
    // Validaciones de respuesta
    expect(res.statusCode).toEqual(200); // Código de estado esperado
    expect(res.body).toBeDefined(); // Cuerpo de la respuesta debe estar definido
    expect(res.body).toHaveProperty('nombre');
    expect(res.body).toHaveProperty('cliente_id'); // Verifica que 'carritoAll' esté presente
  });
}); 

//19. Control de la paginación para obtener todos los productos 

 describe('Pruebas de API: POST /v1/api/products/page', () => {
  it('Control de la paginación para obtener todos los productos', async () => {
    const api_access_token = 'reiHkxHbzG9yWt5eNBJaWYML'; 
    const requestBody = 
    {
      "perPages": "1",
      "current_page": "4",
      "searchQuery": ""
    }

    const res = await request(global.testUrl)
      .post('/v1/api/products/page')
      .set('access-token', api_access_token) 
      .set('Content-Type', 'application/json')
      .send(requestBody); // Cuerpo de la solicitud
      console.log("Respuesta del servidor",res.body);  
      
    // Validaciones de respuesta
    expect(res.statusCode).toEqual(200); // Código de estado esperado
    expect(res.body).toBeDefined(); // Cuerpo de la respuesta debe estar definido
    // Validar que "data" sea un array
    expect(res.body.data).toBeInstanceOf(Array); // Verifica que 'Carrito' sea un array
    expect(res.body.data.length).toBeGreaterThan(0); // Verifica que 'Carrito' tenga al menos un elemento
    
    // Validar que "meta" sea un objeto y tenga la propiedad 'meta'
    expect(res.body.meta).toHaveProperty('count');
    expect(res.body.meta).toHaveProperty('count1');
    expect(res.body.meta).toHaveProperty('current_page');
    expect(res.body.meta).toHaveProperty('page_size');
    expect(res.body.meta).toHaveProperty('searchQuery');
  });
}); 


//20. Obtener id carrito por usuario 
describe('Pruebas de API: GET /v1/api/getUserCarrito/:id', () => {
  it('debería devolver un Listado de ordenes por usuario', async () => {
    const api_access_token = 'reiHkxHbzG9yWt5eNBJaWYML';
    const id = 8; 
    

    const res = await request(global.testUrl)
      .get(`/v1/api/getUserCarrito/${id}`)
      .set('access-token', api_access_token) 
      .set('Content-Type', 'application/json')
      console.log("Respuesta del servidor",res.body);  
      
    // Validaciones de respuesta
    expect(res.statusCode).toEqual(200); 
    expect(res.body).toBeDefined(); 
    expect(res.body).toHaveProperty('nombre_cliente');
    expect(res.body).toHaveProperty('carritos_id'); 
  });
}); 


//21. Control de la paginación para obtener todas las categorias 

describe('Pruebas de API: POST /v1/api/category/page', () => {
  it('Control de la paginación para obtener todos los productos', async () => {
    const api_access_token = 'reiHkxHbzG9yWt5eNBJaWYML'; 
    const requestBody = 
    {
      "perPages": "1",
      "current_page": "4",
      "searchQuery": ""
    }

    const res = await request(global.testUrl)
      .post('/v1/api/category/page')
      .set('access-token', api_access_token) 
      .set('Content-Type', 'application/json')
      .send(requestBody); // Cuerpo de la solicitud
      console.log("Respuesta del servidor",res.body);  
      
    // Validaciones de respuesta
    expect(res.statusCode).toEqual(200); // Código de estado esperado
    expect(res.body).toBeDefined(); // Cuerpo de la respuesta debe estar definido
    // Validar que "data" sea un array
    expect(res.body.data).toBeInstanceOf(Array); // Verifica que 'Carrito' sea un array
    expect(res.body.data.length).toBeGreaterThan(0); // Verifica que 'Carrito' tenga al menos un elemento
    
    // Validar que "meta" sea un objeto y tenga la propiedad 'meta'
    expect(res.body.meta).toHaveProperty('count');
    expect(res.body.meta).toHaveProperty('count1');
    expect(res.body.meta).toHaveProperty('current_page');
    expect(res.body.meta).toHaveProperty('page_size');
    expect(res.body.meta).toHaveProperty('searchQuery');
  });
}); 


//20.Crear Carrito virtual (Agregar 1 o mas)
 describe('Pruebas de API: POST /v1/api/cart/:id', () => {
  it('Crear Carrito virtual (Agregar 1 o mas)', async () => {
    const api_access_token = 'reiHkxHbzG9yWt5eNBJaWYML'; 
    const id = 7;
    const requestBody = 
    {
      "pedidos": [
        {
          "articulo_id": 235,
          "unidades": 2
        },
        {
          "articulo_id": 260,
          "unidades": 2
        }

      ]
    }

    const res = await request(global.testUrl)
      .post(`/v1/api/cart/${id}`)
      .set('access-token', api_access_token) 
      .set('Content-Type', 'application/json')
      .send(requestBody); // Cuerpo de la solicitud
      console.log("Respuesta del servidor",res.body);  
      
     // Validaciones de respuesta
     expect(res.statusCode).toEqual(200); // Código de estado esperado
     expect(res.body).toBeDefined(); // Cuerpo de la respuesta debe estar definido
     expect(res.body).toHaveProperty('created', true); 
     expect(res.body).toHaveProperty('error', false);
     expect(res.body).toHaveProperty('cliente_id', id);
     expect(res.body).toHaveProperty('carrito_creado');
 
     // Validar que 'createdOrders' sea un arreglo
     expect(res.body).toHaveProperty('createdOrders');
     expect(res.body.createdOrders).toBeInstanceOf(Array);
     expect(res.body.createdOrders.length).toBeGreaterThan(0); // Al menos un elemento
     
 
     // Validar que el primer elemento del arreglo contenga 'message'
     const [firstOrder] = res.body.createdOrders; // Extrae el primer elemento
     expect(firstOrder).toHaveProperty('message');
  });
}); 

//10. Eliminar producto al carrito
describe('Pruebas de API: DELETE /v1/api/cart/:id/:product_id', () => {
  it('debería devolver una lista de productos con más de un elemento', async () => {
    const api_access_token = 'reiHkxHbzG9yWt5eNBJaWYML'; 
    const id = '621'
    const product_id = '235'
   

    const res = await request(global.testUrl)
      .delete(`/v1/api/cart/${carritoId}/${product_id}`)
      .set('access-token', api_access_token) 
      .set('Content-Type', 'application/json')
      console.log("Respuesta del servidor",res.body);  
      
    // Validaciones de respuesta
    expect(res.statusCode).toEqual(200); // Código de estado esperado
    expect(res.body).toBeDefined(); // Cuerpo de la respuesta debe estar definido
    expect(res.body).toHaveProperty('mensaje'); // Verifica que 'carritoAll' esté presente
    expect(res.body).toHaveProperty('created', true); // Verifica que 'created' sea true
    expect(res.body).toHaveProperty('error', false);
  });
}); 


//let VarGlobal = "";
//8. Eliminar carrito virtual
describe('Pruebas de API: DELETE /v1/api/cart/:id', () => {
  it('debería el carrito indicado', async () => {
    const api_access_token = 'reiHkxHbzG9yWt5eNBJaWYML'; 
    const id = '618'

    const res = await request(global.testUrl)
      .delete(`/v1/api/cart/${carritoId}`)
      .set('access-token', api_access_token) 
      .set('Content-Type', 'application/json')
      console.log("Respuesta del servidor",res.body);  
     

    // Validaciones de respuesta
    expect(res.statusCode).toEqual(200); // Código de estado esperado
    expect(res.body).toBeDefined(); // Cuerpo de la respuesta debe estar definido
    expect(res.body).toHaveProperty('status'); 
    expect(res.body).toHaveProperty('data'); 
  });
});