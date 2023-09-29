import { CategoriaMA } from "./modelo-categoriaMA";
import { Estado } from "./modelo-estado";
import { Item } from "./modelo-item";
import { Prioridad } from "./modelo-prioridad";
import { remitente } from "./modelo-remitente";
import { responsable } from "./modelo-responsable";

export class Ticket{
    token:number; //
    usuario: remitente;
    categoria: CategoriaMA;
    responsable: responsable;
    item: Item | null;
    estado: Estado;
    prioridad: Prioridad;
    asunto:string;
    descripcion:string;
    fecha_solicitud:Date;
    fecha_limite:Date;
    constructor(
        token: number,
        usuario: remitente,
        categoria: CategoriaMA,
        responsable: responsable,
        item: Item  | null,
        estado: Estado,
        prioridad: Prioridad,
        asunto: string,
        descripcion: string,
        fecha_solicitud: Date,
        fecha_limite: Date
      ) {
        this.token = token;
        this.usuario = usuario;
        this.categoria = categoria;
        this.responsable = responsable;
        this.item = item;
        this.estado = estado;
        this.prioridad = prioridad;
        this.asunto = asunto;
        this.descripcion = descripcion;
        this.fecha_solicitud = fecha_solicitud;
        this.fecha_limite = fecha_limite;
      }
   
}