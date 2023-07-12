import dotenv from 'dotenv';
import { Router } from 'express';
import mysql from 'mysql2';
import postProducto from '../middleware/middlewareProductos.js';

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
        `SELECT bodegas.nombre, productos.id, productos.nombre, productos.descripcion, SUM(inventarios.cantidad) AS total FROM productos INNER JOIN inventarios ON productos.id = inventarios.id_producto INNER JOIN bodegas ON inventarios.id_bodega = bodegas.id GROUP BY bodegas.nombre, productos.id, productos.nombre, productos.descripcion ORDER BY total DESC;`, 

    (err, data, fil) => {
        res.send(JSON.stringify(data))
    })
})

/*

*/
storageProductos.post("/", postProducto, (req, res)=>{
    
    const {nombre, descripcion, estado, created_by, update_by} = req.body;

    con.query(
        `SELECT id FROM productos ORDER BY id DESC`, 
        (err, data, fill) => {

            let newIdProductos = data[0].id + 1; 

            con.query(
                `INSERT INTO productos (id, nombre, descripcion, estado, created_by, update_by) VALUES (?,?,?,?,?,?)`, 
                [newIdProductos, nombre, descripcion, estado, created_by, update_by],
        
                (err, data, fil) => {
                    if(err){
                        console.log(err);
                        res.status(500).send("Error al ingresar el producto");
                    } else {
                        con.query(
                            `SELECT id FROM inventarios ORDER BY id DESC`,

                            (err, dataInv, fill) => {

                                let newIdInventario = dataInv[0].id + 1;

                                con.query(
                                    `INSERT INTO inventarios (id, id_bodega, id_producto, cantidad, created_by, update_by) VALUES (?, 12, ?, 1000, 11, null)`, 
                                    [newIdInventario, newIdProductos],
                                    
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
                        )
                    }
                }
            )
        }
    )
})

export default storageProductos;