var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Expose, Transform } from 'class-transformer';
export class inventario {
    constructor(id_producto, id_bodega, cantidad) {
        this.id_producto = id_producto;
        this.id_bodega = id_bodega;
        this.cantidad = cantidad;
    }
}
__decorate([
    Expose({ name: "producto" }),
    Transform(({ value }) => { if (Math.floor(value) && typeof value == "number")
        return Math.floor(value);
    else
        throw { status: 200, message: `Los datos no cumplen con los parametros de entrada` }; }, { toClassOnly: true }),
    __metadata("design:type", Number)
], inventario.prototype, "id_producto", void 0);
__decorate([
    Expose({ name: "bodega" }) // -Estos son los campos que hay en la base de datos
    ,
    Transform(({ value }) => { if (Math.floor(value) && typeof value == "number")
        return Math.floor(value);
    else
        throw { status: 200, message: `Los datos no cumplen con los parametros de entrada` }; }, { toClassOnly: true }),
    __metadata("design:type", Number)
], inventario.prototype, "id_bodega", void 0);
__decorate([
    Expose({ name: "count" }),
    Transform(({ value }) => { if (Math.floor(value) && typeof value == "number")
        return Math.floor(value);
    else
        throw { status: 200, message: `Los datos no cumplen con los parametros de entrada` }; }, { toClassOnly: true }),
    __metadata("design:type", Number)
], inventario.prototype, "cantidad", void 0);
/* @Transform(({value}) => {if(Math.floor(value) && typeof value == number) return Math.floor(value); else throw {status: 400, message: `Los datos no cumplen con los parametros de entrada`}}, {toClassOnly: true}) */ /* number */
/* @Transform(({value}) => {if(/^[a-z-A-Z]+$/.test(value)) return value; else throw {status: 400, message: `Los datos no cumplen con los parametros de entrada`}}, {toClassOnly: true}) */ /* string */
/* @Transform(({value}) => { if(/\S+@\S+\.\S+/.test(value)) return value; else throw {status: 400, message: `Los datos no cumplen con los parametros de entrada`}}, {toClassOnly: true}) */ /* correo */ 
