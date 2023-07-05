import dotenv from 'dotenv';
import { Router } from 'express';
import mysql from 'mysql2';

dotenv.config();
let storageProductos = Router();

let con = undefined;

storageProductos.use((req, res, next) => {
    let connect = JSON.parse(process.env.MY_CONNECT);
    con = mysql.createPool(connect);
    next();
})

storageProductos.get("/", (req, res)=>{
    con.query(
        `SELECT bodegas.nombre AS name_Bodega, productos.id AS Id_Producto, productos.nombre, productos.descripcion, SUM(inventarios.cantidad) AS total FROM productos INNER JOIN inventarios ON productos.id = inventarios.id_producto INNER JOIN bodegas ON inventarios.id_bodega = bodegas.id GROUP BY bodegas.nombre, productos.id, productos.nombre, productos.descripcion ORDER BY total DESC;`, 

    (err, data, fil) => {
        res.send(JSON.stringify(data))
    })
})

export default storageProductos;