import {Expose, Type, Transform} from 'class-transformer';

export class postInventarios{
    @Expose({name: "producto"})
    @Transform(({value}) => {if(Math.floor(value) && typeof value == "number") return Math.floor(value); else throw {status: 200, message: `Los datos no cumplen con los parametros de entrada`};}, {toClassOnly: true}) 
    id_producto: number;

    @Expose({name: "bodega"})  // -Estos son los campos que hay en la base de datos
    @Transform(({value}) => {if(Math.floor(value) && typeof value == "number") return Math.floor(value); else throw {status: 200, message: `Los datos no cumplen con los parametros de entrada`};}, {toClassOnly: true})
    id_bodega: number;

    @Expose({name: "count"})
    @Transform(({value}) => {if(Math.floor(value) && typeof value == "number") return Math.floor(value); else throw {status: 200, message: `Los datos no cumplen con los parametros de entrada`};}, {toClassOnly: true})
    cantidad: number;
    constructor(id_producto: number, id_bodega: number, cantidad: number){ // Los campos de la base de datos se cambian por estos campos y se validan de que la información que mande sea la correcta
        this.id_producto = id_producto;
        this.id_bodega = id_bodega;
        this.cantidad = cantidad;
    }
}



/* @Transform(({value}) => {if(Math.floor(value) && typeof value == number) return Math.floor(value); else throw {status: 400, message: `Los datos no cumplen con los parametros de entrada`}}, {toClassOnly: true}) */ /* number */

/* @Transform(({value}) => {if(/^[a-z-A-Z]+$/.test(value)) return value; else throw {status: 400, message: `Los datos no cumplen con los parametros de entrada`}}, {toClassOnly: true}) */ /* string */

/* @Transform(({value}) => { if(/\S+@\S+\.\S+/.test(value)) return value; else throw {status: 400, message: `Los datos no cumplen con los parametros de entrada`}}, {toClassOnly: true}) */ /* correo */