import dotenv from 'dotenv';
import { Router } from 'express';
import mysql from 'mysql2';

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

export default storageBodegas;