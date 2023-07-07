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


// UPDATE 
/* 
    - Validar que la cantidad de unidades que se puedan sacar, si tengo 10 no puedo sacar 11
    - Cambiar la cantidad de origen y destino, al origen restar al destino sumar
    - Ingresar un nuevo historial por cada accion que se haga
*/

storageInventarios.put("/translate", (req, res) =>{
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
                
                let newCount = data[`${positionOrigen}`].cantidad - cantidad; 
                
                con.query(
                    `UPDATE inventarios SET cantidad = ? WHERE id = ?`,
                    [newCount, data[`${positionOrigen}`].id],
                    (error, fil) => {
                        if(error){
                            console.log(error);
                            res.status(500).send("Error")
                        } else {
                            
                            res.send("exito")
                        }
                    }
                )
            }
            
        }

    )
})

export default storageInventarios;