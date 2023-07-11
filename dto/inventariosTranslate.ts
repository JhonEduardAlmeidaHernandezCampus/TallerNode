import { Expose, Type, Transform } from "class-transformer";

export class putInventarios {
    @Expose({ name: "Producto"})
    @Transform(({value}) => {if(Math.floor(value) && typeof value == "number") return Math.floor(value); else throw {status: 200, message: `Los datos no cumplen con los parametros de entrada`};}, {toClassOnly: true})
    id_producto: number;

    @Expose({ name: "Bodega_Origen"})
    @Transform(({value}) => {if(Math.floor(value) && typeof value == "number") return Math.floor(value); else throw {status: 200, message: `Los datos no cumplen con los parametros de entrada`};}, {toClassOnly: true})
    id_bodega_origen: number;

    @Expose({ name: "Bodega_Destino"})
    @Transform(({value}) => {if(Math.floor(value) && typeof value == "number") return Math.floor(value); else throw {status: 200, message: `Los datos no cumplen con los parametros de entrada`};}, {toClassOnly: true})
    id_bodega_destino: number;

    @Expose ({ name: "Count"})
    @Transform(({value}) => {if(Math.floor(value) && typeof value == "number") return Math.floor(value); else throw {status: 200, message: `Los datos no cumplen con los parametros de entrada`};}, {toClassOnly: true})
    cantidad: number;

    constructor(id_producto: number, id_bodega_origen: number, id_bodega_destino: number, cantidad: number){
        this.id_producto = id_producto;
        this.id_bodega_origen = id_bodega_origen;
        this.id_bodega_destino = id_bodega_destino;
        this.cantidad = cantidad;
    }
}




/* id_bodega_origen, id_bodega_destino, id_producto, cantidad */