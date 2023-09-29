export class usuario{
    id_usuario:number;
    nombre:string;
    correo:string;
    password:string;
    id_tipo:number | null;
    constructor(id_usuario:number, nombre:string,correo:string ,password:string, id_tipo:number | null) {
        this.id_usuario = id_usuario;
        this.nombre = nombre;
        this.correo = correo;
        this.password = password;
        this.id_tipo = id_tipo;
    }
}