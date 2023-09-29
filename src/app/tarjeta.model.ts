export class Tarjeta{
    id_tarjeta:number;
    titulo:string;
    descripcion:string;
    constructor(id_tarjeta:number, titulo:string, descripcion:string){
        this.id_tarjeta = id_tarjeta;
        this.titulo = titulo;
        this.descripcion = descripcion;
    }
}