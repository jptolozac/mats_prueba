import { CategoriaMA } from "./modelo-categoriaMA";


export class Item{
    id_item:number;
    nombre:string;
    categoria:CategoriaMA;
    constructor(id_item:number, nombre:string, categoria:CategoriaMA){
        this.id_item=id_item;
        this.nombre=nombre;
        this.categoria=categoria;
    }

}