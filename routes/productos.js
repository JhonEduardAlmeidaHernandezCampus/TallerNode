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

storageProductos.post("/", (req, res)=>{
    
    const {id, nombre, descripcion, estado, created_by, update_by, created_at, updated_at, deleted_at} = req.body;

    con.query(
        `INSERT INTO productos (id, nombre, descripcion, estado, created_by, update_by, created_at, updated_at, deleted_at) VALUES (?,?,?,?,?,?,?,?,?)`, 
        [id, nombre, descripcion, estado, created_by, update_by, created_at, updated_at, deleted_at],

        (err, data, fil) => {
            if(err){
                console.log(err);
                res.status(500).send("Error al ingresar el producto");
            } else {
                con.query(
                    `INSERT INTO inventarios (id, id_bodega, id_producto, cantidad, created_by, update_by, created_at, updated_at, deleted_at) VALUES
                    (24, 12, ?, 1000, 11, null, null, null, null)`, 
                    [id],
                    
                    (err, data, fil) => {
                        if(err){
                            console.log(err);
                            res.status(500).send("Error al registrar el inventario");
                        } else {
                            res.send("Inventario registrado exitosamente");
                        }
                    }
                )
            }
        })
})

export default storageProductos;