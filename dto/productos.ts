import { Expose, Type, Transform } from "class-transformer";

export class postProductos{

    @Expose({name: "Nombre"})
    @Transform(({value}) => {if(/^[a-z-A-Z\s]+$/.test(value)) return value; else throw {status:400, message:"Error en los parametros"};}, {toClassOnly:true})
    nombre: string;

    @Expose({name: "Descripcion"})
    @Transform(({value}) => {if(/^[a-z-A-Z\s]+$/.test(value)) return value; else throw {status:400, message:"Error en los parametros"};}, {toClassOnly:true})
    descripcion: string;

    @Expose({name: "Estado"})
    @Transform(({value}) => {if(Math.floor(value) && typeof value == "number") return Math.floor(value); else throw {status: 400, message: `Error en los parametros`};}, {toClassOnly: true})
    estado: number;

    @Expose({name: "Creado_Por"})
    @Transform(({value}) => {if(value === null){return value} else {if(Math.floor(value) && typeof value == "number") return Math.floor(value); else throw {status: 400, message: `Error en los parametros`};}}, {toClassOnly: true})
    created_by: number;

    @Expose({name: "Modificado_Por"})
    @Transform(({value}) => {if(value === null){return value} else {if(Math.floor(value) && typeof value == "number") return Math.floor(value); else throw {status: 400, message: `Error en los parametros`};}}, {toClassOnly: true})
    update_by: number;

    constructor(nombre: string, descripcion: string, estado: number, created_by: number, update_by: number){
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.estado = estado;
        this.created_by = created_by;
        this.update_by = update_by;
    }
}