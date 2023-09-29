export class Comentario{
    id_comentario:number;
    comentario:string;
    fecha: string;
    constructor(id_comentario:number, comentario:string,fecha:string){
        this.id_comentario = id_comentario;
        this.comentario = comentario;
        this.fecha =fecha;
    }
    
}   