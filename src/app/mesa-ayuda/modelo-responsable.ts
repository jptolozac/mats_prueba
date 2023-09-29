export class responsable{
    id_usuario:number;
    name:string;
    correo:string;
    //mirar lo de perimsos
    constructor(id_usuario: number,name: string,correo: string) {
        this.id_usuario = id_usuario;
        this.name = name;
        this.correo = correo;
    }
}    