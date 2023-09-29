export class Noticia{
    id:number;
    titulo:string;
    fecha:string;
    descripcion:string;
    archivo: string;
    likes:number;
    apoyado:boolean;
    tipo_usuario = [];
    constructor(id:number, titulo:string, fecha:string, descripcion:string, archivo:string, likes:number, apoyado:boolean){
        this.id=id;
        this.titulo = titulo;
        this.fecha=fecha;
        this.descripcion= descripcion;  
        this.archivo = archivo;
        this.likes= likes;
        this.apoyado= apoyado;
    }
}