import dotenv from 'dotenv';
import { Router } from 'express';
import mysql from 'mysql2';

dotenv.config();
let storageInventarios = Router();

let con = undefined;

storageInventarios.use((req, res, next) => {
    let connect = JSON.parse(process.env.MY_CONNECT);
    con = mysql.createPool(connect);
    next();
})

storageInventarios.post("/", (req, res) => {

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
                        `INSERT INTO inventarios (id, id_bodega, id_producto, cantidad, created_by, update_by, created_at, updated_at, deleted_at) VALUES (78, ?, ?, ?, 11, NULL, NULL, '2023-05-26 01:35:52', NULL)`,
                        [id_bodega, id_producto, cantidad],

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
            }
        }
    )
})

export default storageInventarios;