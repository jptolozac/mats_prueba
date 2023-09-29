export class queja{
    id_queja:number;
    asunto:string;
    descripcion:string;
    visto:boolean;
    constructor(id_queja:number, asunto:string, descripcion:string, visto:boolean){
        this.id_queja=id_queja;
        this.asunto=asunto;
        this.descripcion=descripcion;
        this.visto=visto;
    }
}