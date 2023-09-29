export class Categoria{
    id:number;
    nombre:string;
    //Característica adicional para facilitar un filtro
    seleccionado:boolean;
    constructor(id:number,nombre:string){
        this.id=id;
        this.nombre=nombre;
        this.seleccionado=false;
    }
}