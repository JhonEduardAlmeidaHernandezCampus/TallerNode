# Aplicación con Node.js y Express.js



Esta aplicación que utiliza Node.js y Express.js para crear y gestionar diferentes rutas relacionadas con la base de datos.

## Requisitos previos

- Node.js instalado en tu máquina.



## Instalación

1. Para descargar Node.js ve a la siguiente página "[Download | Node.js (nodejs.org)](https://nodejs.org/en/download)".
2. Descarga la versión de Node.js correspondiente a su sistema operativo.
3. Clona este repositorio en tu máquina local.
4. Abre una terminal en el editor de código de tu preferencia, se recomienda "Visual Studio Code".
5. Ejecuta el siguiente comando para instalar las dependencias:

​		`npm install;`

6. Una vez instaladas las dependencias, tienes que ejecutar el nodemon de la siguiente manera.

   `npm run dev;`

   

## Configuración

1. Asegurarse de tener creada la base de datos, si no cuentas con una base de datos, este proyecto ya trae una por defecto en la ruta `db/db.sql`
2. Crea un archivo `.env` en el directorio raíz de la aplicación, teniendo como ejemplo el archivo `.env.example`
3. Dentro del archivo `.env` , define las siguientes variables de entorno:

```
MY_CONFIG={"hostname": "", "port": }
MY_CONNECT={"host": "", "user": "", "password": "", "database": "", "port": "3306"}
```



## Uso

Puedes probar diferentes rutas accediendo a:

- `http://"hostname":"port"/bodegas`  rutas relacionadas con bodegas.

- `http://"hostname":"port"/productos`  rutas relacionadas con productos.

- `http://"hostname":"port"/inventarios`  rutas relacionadas con inventarios.

  

# EndPoint de Bodegas

### GET: `http://"hostname":"port"/bodegas`

Este EndPoint devuelve una lista de bodegas existentes en orden alfabético.

**Ejemplo:**

```
[
  {
    "id": 50,
    "nombre": "A Bodega",
    "id_responsable": 11,
    "estado": 1,
    "created_by": null,
    "update_by": null,
    "created_at": "2023-05-25",
    "updated_at": "2023-05-25",
    "deleted_at": null
  },
  {
    "id": 36,
    "nombre": "asdefg",
    "id_responsable": 11,
    "estado": 1,
    "created_by": 11,
    "update_by": null,
    "created_at": "2022-06-29",
    "updated_at": "2022-06-29",
    "deleted_at": null
  },
  ...
]
```

### POST: `http://"hostname":"port"/bodegas`

Este EndPoint permite agregar una nueva bodega.

**Parámetros de entrada:**

- `id` : id consecuente con los datos que hay en la tabla. "No se puede repetir el mismo id".

- `nombre` : Nombre de la bodega.
- `id_responsable` : ID del responsable de la bodega.
- `estado`: Estado de la bodega.
- `created_by` : ID del usuario que creó la bodega.
- `update_by` : ID del usuario que actualizó la bodega.
- `created_at` : Fecha y hora de creación de la bodega en formato "YYYY-MM-DD HH:mm:ss". "este campo puede ser o no obligatorio"
- `updated_at` : Fecha y hora de actualización de la bodega en formato "YYYY-MM-DD HH:mm:ss". "este campo puede ser o no obligatorio"
- `deleted_at` : Fecha y hora de eliminación de la bodega en formato "YYYY-MM-DD HH:mm:ss". "este campo puede ser o no obligatorio"

**Ejemplo:**

```
{
  "id": 1,
  "nombre": "Bodega doña Lucrecia",
  "id_responsable": 16,
  "estado": 1,
  "created_by": 16,
  "update_by": null,
  "created_at": "2022-06-02 15:33:48",
  "updated_at": null,
  "deleted_at": null
}
```

## Importante

si el valor el valor es `null`, tener en cuenta que se debe escribir en minúscula.



# EndPoints Inventarios

### 1. POST: `http://"hostname":"port"/inventarios`

Este EndPoint permite ingresar o modificar un inventario de producto en una bodega, los parámetros a enviar son los siguientes.

- `id_producto`: ID del producto.
- `id_bodega`: ID de la bodega.
- `cantidad`: Cantidad del producto en el inventario.

##### Ejemplo de solicitud:

```
{
  "id_producto": 123,
  "id_bodega": 456,
  "cantidad": 10
}
```

- Si el producto ya existe en el inventario de la bodega, se actualizara el inventario sumando la cantidad que acabamos de enviar.

- Si el producto no existe en el inventario de la bodega, se creara un nuevo inventario, agregándole la bodega y la cantidad que acabamos de enviar.

  

### 2. PUT: `http://"hostname":"port"/inventarios/translate`

Este EndPoint permite trasladar una cantidad de producto de una bodega a otra, modificando sus inventarios y creando un historial por cada transacción que se haga. 

- `id_bodega_origen`: ID de la bodega de origen.
- `id_bodega_destino`: ID de la bodega de destino.
- `id_producto`: ID del producto a trasladar.
- `cantidad`: Cantidad del producto a trasladar.

##### Ejemplo de solicitud:

```
{
  "id_bodega_origen": 456,
  "id_bodega_destino": 789,
  "id_producto": 123,
  "cantidad": 5
}
```

El EndPoint realiza las siguientes instrucciones:

- Verifica si la bodega de origen tiene suficiente cantidad del producto para el traslado.
- Si la cantidad es suficiente, resta la cantidad trasladada del inventario de la bodega de origen.
- Si la bodega de destino ya tiene el producto en el inventario, suma la cantidad trasladada al inventario existente.
- Si la bodega de destino no tiene el producto en el inventario, crea una nuevo inventario con la cantidad.
- Registra un historial de traslado.



# EndPoint de Productos

### GET `http://"hostname":"port"/productos`

Este EndPoint devuelve la lista de productos junto con la suma de productos que hay en todas la bodegas, ordenados de manera descendente según la cantidad total.

**Ejemplo:**

```
[
  {
    "name_Bodega": "bodega2",
    "Id_Producto": 28,
    "nombre": "Leche",
    "descripcion": "deslactosada",
    "total": "87000"
  },
  {
    "name_Bodega": "bodega7",
    "Id_Producto": 27,
    "nombre": "chocolisto",
    "descripcion": "jjjjjj",
    "total": "55281"
  },
  ...
]
```



### POST `http://"hostname":"port"/productos`

Este EndPoint permite agregar un nuevo producto a la tabla de productos y asignamos una cantidad inicial del producto en la tabla inventarios por defecto.

**Parámetros de entrada:**

- `id` : id consecuente con los datos que hay en la tabla. "No se puede repetir el mismo id".

- `nombre` : Nombre del producto.
- `descripcion` : Descripción del producto.
- `estado`: Estado del producto.
- `created_by`: ID del usuario que creó el producto.
- `update_by`: ID del usuario que actualizó el producto.
- `created_at` : Fecha y hora de creación del producto en formato "YYYY-MM-DD HH:mm:ss".
- `updated_at`: Fecha y hora de actualización del producto en formato "YYYY-MM-DD HH:mm:ss".
- `deleted_at`: Fecha y hora de eliminación del producto en formato "YYYY-MM-DD HH:mm:ss".

**Ejemplo de los datos a pasar:**

```
{
  "id": 1,
  "nombre": "Producto A",
  "descripcion": "Descripción del Producto A",
  "estado": 1,
  "created_by": 123,
  "update_by": null,
  "created_at": "2022-06-02 15:33:48",
  "updated_at": null,
  "deleted_at": null
}
```