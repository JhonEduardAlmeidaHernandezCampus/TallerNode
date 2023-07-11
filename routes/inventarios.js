import dotenv from 'dotenv';
import { Router } from 'express';
import mysql from 'mysql2';
import { postInventario, putInventario } from '../middleware/middlewareInventarios.js';

dotenv.config();
let storageInventarios = Router();

let con = undefined;

storageInventarios.use((req, res, next) => {
    let connect = JSON.parse(process.env.MY_CONNECT);
    con = mysql.createPool(connect);
    next();
})

/* 
    {
    "producto": 18,
    "bodega": 19,
    "count": 20
    }
*/

storageInventarios.post("/", postInventario, (req, res) => {

    const {id_bodega, id_producto, cantidad} = req.body;

    con.query(
        `SELECT id, id_bodega, id_producto, cantidad FROM inventarios`,

        (err, data, fill) => {
            
            let estado = false;
            let idMod;
            let Total;

            if (err) {
                console.log(err);
                res.status(500).send("Error al consultar los registros");

            } else {

                data.forEach((val) => {

                    if (val.id_bodega == id_bodega && val.id_producto == id_producto) {
                        estado = true;
                        idMod = val.id; 
                        Total = val.cantidad + cantidad;
                    }

                });

                if(estado == true){
                    con.query(
                        `UPDATE inventarios SET id_bodega = ?, id_producto = ?, cantidad = ? WHERE id = ?`,
                        [id_bodega, id_producto, Total, idMod],

                        (error, data, fil) => {
                            if (error) {
                                console.log(error);
                                res.status(500).send("Error al modificar el inventario");

                            } else {
                                res.send("Inventario modificado con exito")
                            }
                        }
                    )
                } else {
                    con.query(
                        `SELECT id FROM inventarios ORDER BY id DESC`,
                        (err, dataPost, fill) => {

                            let newIdPostInventario = dataPost[0].id + 1;

                            con.query(
                                `INSERT INTO inventarios (id, id_bodega, id_producto, cantidad, created_by, update_by, created_at, updated_at, deleted_at) VALUES (?, ?, ?, ?, 11, NULL, NULL, '2023-05-26 01:35:52', NULL)`,
                                [newIdPostInventario, id_bodega, id_producto, cantidad],
        
                                (err, data, fill) => {
                                    if (err) {
                                        console.log(err);
                                        res.status(500).send("Error al insertar el registro");
        
                                    } else {
                                        res.send("Registro ingresado exitosamente")
                                    }
                                }
                            )
                        }
                    )
                }
            }
        }
    )
})


/* 
    {
    "Producto": 18,
    "Bodega_Origen": 19,
    "Bodega_Destino": 20,
    "Count": 1
    }
*/

storageInventarios.put("/translate", putInventario, (req, res) =>{
    const {id_bodega_origen, id_bodega_destino, id_producto, cantidad} = req.body;

    con.query(
        `SELECT id, id_bodega, id_producto, cantidad FROM inventarios WHERE id_bodega = ? AND id_producto = ? OR id_bodega = ? AND id_producto = ?`,
        [id_bodega_origen, id_producto, id_bodega_destino, id_producto],

        (err, data, fil) => {

            let positionOrigen = 0;                                            //
            let positionDestino = 1;                                           //
                                                                               // 
            if(data[0].id_bodega != id_bodega_origen){                         // Este codigo es para cambiar la posicion del array 
                positionOrigen = 1;                                            //
                positionDestino = 0;                                           //
            }                                                                  //

            if(cantidad > data[`${positionOrigen}`].cantidad) {
                if(data[`${positionOrigen}`].cantidad === 0){
                    res.send("No hay producto")
                } else {
                    res.send("No cuento con la cantidad de producto suficiente")
                }
        
            } else {
                if (data.length != 2) {
                    con.query(
                        `SELECT id FROM inventarios ORDER BY id DESC`,

                        (err, data, fill) => {

                            let newId = data[0].id + 1;

                            con.query(
                                /*sql*/ `INSERT INTO inventarios (id, id_bodega, id_producto, cantidad, created_by, update_by, created_at, updated_at, deleted_at) VALUES (?, ?, ?, ?, 11, NULL, NULL, NULL, NULL)`,
                                [newId,id_bodega_destino, id_producto, cantidad],

                                (err, fill) => {
                                    if (err) {
                                        console.log(err);
                                        res.status(500).send("Error al crear el nuevo inventario")
                                    } else {
                                        con.query(
                                            `SELECT id FROM historiales ORDER BY id DESC`,

                                            (err, dataNewHistorial, fill) => {
                                                
                                                let idNewHistorial = dataNewHistorial[0].id + 1;

                                                con.query(
                                                    `INSERT INTO historiales (id, cantidad, id_bodega_origen, id_bodega_destino, id_inventario, created_by, update_by, created_at, updated_at, deleted_at) VALUES(?, ?, ?, ?, ?, 18, NULL, NULL, NULL, NULL)`,
                                                    [idNewHistorial,cantidad, id_bodega_origen, id_bodega_destino, data[`${positionDestino}`].id],

                                                    (err, fill) => {
                                                        if (err) {
                                                            console.log(err);
                                                            res.status(500).send("Error al crear el historial")
                                                        } else {
                                                            res.send("Se creo un nuevo inventario ya que ese producto no existia en esa bodega, y se creo el historial")
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
                } else {

                    let newCount = data[`${positionOrigen}`].cantidad - cantidad; 
                
                    con.query(
                        `UPDATE inventarios SET cantidad = ? WHERE id = ?`,
                        [newCount, data[`${positionOrigen}`].id],
                        (error, fil) => {
                            if(error){
                                console.log(error);
                                res.status(500).send("Error al modificar el dato en la bodega A")
                            } else {
                                
                                let newCountMas = data[`${positionDestino}`].cantidad + cantidad;

                                con.query(
                                    `UPDATE inventarios SET cantidad = ? WHERE id = ?`,
                                    [newCountMas, data[`${positionDestino}`].id],
                                    
                                    (err, fill)=>{
                                        if (err) {
                                            console.log(err);
                                            res.status(500).send("Error al modificar el dato en la bodega B")
                                        } else {
                                            con.query(
                                                `SELECT id FROM historiales ORDER BY id DESC`,

                                                (err, dataHistorial, fill) => {
                                                    
                                                    let newIdHistorial = dataHistorial[0].id + 1;

                                                    con.query(
                                                        `INSERT INTO historiales (id, cantidad, id_bodega_origen, id_bodega_destino, id_inventario, created_by, update_by, created_at, updated_at, deleted_at) VALUES(?, ?, ?, ?, ?, 18, NULL, NULL, NULL, NULL)`,
                                                        [newIdHistorial,cantidad, id_bodega_origen, id_bodega_destino, data[`${positionDestino}`].id],

                                                        (err, fill) => {
                                                            if (err) {
                                                                console.log(err);
                                                                res.status(500).send("Error al crear el historial")
                                                            } else {
                                                                res.send("Se movio el producto y se creo el historial satisfactoriamente")
                                                            }
                                                        }
                                                    )
                                                }
                                            )
                                        }
                                    }
                                )
                            }
                        }
                    )
                }
            }  
        }
        )
})

export default storageInventarios;