import dotenv from 'dotenv';
import { Router } from 'express';
import mysql from 'mysql2';
import postBodega from '../middleware/middlewareBodegas.js';

let storageBodegas = Router();
dotenv.config();

let con = undefined;

storageBodegas.use((req, res, next) => {
    let connect = JSON.parse(process.env.MY_CONNECT)
    con = mysql.createPool(connect);
    next();
})

storageBodegas.get("/", (req, res)=>{
    con.query(
    /*sql*/`SELECT * FROM bodegas ORDER BY nombre ASC`,
    (err, data, fil) => {
        res.send(JSON.stringify(data))
    }) 
})

/* 
    {
        "Nombre": "bodegad adasd",
        "Responsable": 16,
        "Estado": 1,
        "Creado_Por": 16,
        "Actualizado_Por": null
    }
*/

storageBodegas.post("/", postBodega, (req, res)=>{

    const {nombre, id_responsable, estado, created_by, update_by} = req.body;

    con.query(
        `SELECT id FROM bodegas ORDER BY id DESC`,

        (err, data, fil) => {
            
            let newId = data[0].id + 1;

            con.query(
                `INSERT INTO bodegas (id, nombre, id_responsable, estado, created_by, update_by) VALUES (?,?,?,?,?,?)`,
                [newId, nombre, id_responsable, estado, created_by, update_by],

                (err, dat, fill) => {
                    if (err) {
                        console.log(err);
                        res.status(400).send("Error al ingresar el registro en la bodega")
                    } else {
                        res.send("Registro ingresado satisfactoriamente")
                    }
                }
            )
        }
    ) 
});

export default storageBodegas;