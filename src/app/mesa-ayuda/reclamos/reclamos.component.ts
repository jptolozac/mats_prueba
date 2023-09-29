import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { MensajesService } from 'src/app/mensajes.service';
import { MesaAyudaService } from '../mesa-ayuda.service';
import { queja } from '../modelo-queja';
@Component({
  selector: 'app-reclamos',
  templateUrl: './reclamos.component.html',
  styleUrls: ['./reclamos.component.scss']
})
export class ReclamosComponent implements OnChanges {
  //Variables que contrarlan la apertura o cierre de la ventana para crear quejas.
  @Input() abrir_realizarReclamo: boolean;
  @Output() cerrar_realizarReclamo = new EventEmitter<void>();
  //Variables que contrarlan la apertura o cierre de la ventana de lista de quejas
  @Input() lista_reclamos: boolean;
  @Output() cerrar_listaReclamos = new EventEmitter<void>();
  //Variable que abre o cierra la ventana para ver los detalles de algún reclamo
  detalles_reclamo:boolean;
  //Guardan el asunto y descripción del reclamo
  asunto: string;
  descripcion: string;
  //Variable usada para aplicar estilo de borde rojo en caso de que haya error
  error_crearReclamo: boolean;
  //Variable que guarda si alguna operación con el servicio fue realizada de forma correcta
  operacion_existosa: boolean;
  //Variable que guarda las quejas realizadas por los usuarios
  quejas: queja[] | null;
  //Guarda la cantidad de quejas registradas.
  cantidad_quejas:number;
  //Guarda los valores de una queja
  reclamo:queja | null;
  //Guarda si una queja fue vista o no
  estado_reclamo:boolean;
  //Guarda el estado seleccionado para filtrar
  estado_seleccionado:boolean | null;
  constructor(private mensajes:MensajesService, private Servicio_MA:MesaAyudaService){
    this.quejas=null;
    this.cantidad_quejas=0;
    this.reclamo=null;
    this.estado_reclamo = false;
    this.estado_seleccionado=false;
  }
  //Método que verifica si hay cambios recargar las quejas cargadas
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['lista_reclamos'] && changes['lista_reclamos'].currentValue === true) {
      this.Servicio_MA.getQuejas().then(data => {
        this.quejas = data;
        if(this.quejas!=null){
          this.cantidad_quejas=this.quejas.length;
        } 
        else{
          this.cantidad_quejas=0;
        } 
      });
    }
  }
  //Inicializa las variables
  ngOnInit(): void {
      this.asunto="";
      this.descripcion="";
      this.error_crearReclamo=false;
      this.operacion_existosa=false;
      this.detalles_reclamo=false;
      this.Servicio_MA.getQuejas().then(data => {
        this.quejas = data;
        console.log(data);
        if(this.quejas!=null){
          this.cantidad_quejas=this.quejas.length;
        } 
        else{
          this.cantidad_quejas=0;
        } 
      });
  }
  //Función para filtrar los reclamos según el estado seleccionado
  filtrar(){
    console.log("estado reclamo: ", this.estado_seleccionado)
    this.Servicio_MA.filtrar_Reclamos(this.estado_seleccionado).then(data => {
      if(data){
        this.quejas = data;
      }
      else{
        this.mensajes.msj_informar("No se han encontrado reclamos que cumplan con el filtro.");
      }
    });
  }
  //Función que registra la información de una queja
  async reclamar(){
    if(this.asunto.trim().length > 0 && this.descripcion.trim().length > 0){
      this.error_crearReclamo=false;
      if(await this.mensajes.msj_confirmar("¿Está seguro que desea registrar la queja?", "Confirmar", "Cancelar")){
        this.operacion_existosa=this.Servicio_MA.reclamar(this.asunto,this.descripcion);
        if(this.operacion_existosa==true){
          this.mensajes.msj_exito("Se ha registrado el reclamo");
          this.ngOnInit();
          this.cerrar_crearReclamo();
        }
        else{
          this.cerrar_crearReclamo();
          this.ngOnInit();
          this.mensajes.msj_errorPersonalizado("Ha ocurrido un error al registrar el reclamo. Por favor, inténtelo más tarde.");
        }
      }
    }
    else{
      this.error_crearReclamo=true;
      this.mensajes.msj_errorPersonalizado("Debe ingresar un asunto y una descripción para registrar la queja");
    }
  }
  cerrar_crearReclamo(): void {
    this.abrir_realizarReclamo = false;
    this.asunto="";
    this.descripcion="";
    this.error_crearReclamo=false;
    this.operacion_existosa=false;
    this.cerrar_realizarReclamo.emit();
  }
  cerrar_listaQuejas(): void {
    this.quejas=null;
    this.cerrar_listaReclamos.emit();
  }
  //Método que busca una queja para visualizarla
  ver_queja(id_queja:number){
    this.reclamo=this.Servicio_MA.getReclamo(id_queja);
    if(this.reclamo!=null){
      this.detalles_reclamo=true;
      console.log(Boolean(0));
      console.log("reclamo visto: ", this.reclamo.visto, typeof(this.reclamo.visto))
      this.estado_reclamo=this.reclamo.visto;
    }
    else{
      this.mensajes.msj_errorPersonalizado("No se ha encontrado la queja en los registros.");
    }
  }
  //Método que elimina una queja
  async eliminar_queja(id_queja:number){
    if(await this.mensajes.msj_confirmar("¿Está seguro que desea eliminar el reclamo?", "Confirmar", "Cancelar")){
      if(this.Servicio_MA.eliminar_reclamo(id_queja)){
        this.ngOnInit();
        this.mensajes.msj_exito("Se ha eliminado el reclamo.");
        
      }
      else{
        this.mensajes.msj_errorPersonalizado("Ha ocurrido un error al eliminar el reclamo. Por favor, inténtelo más tarde.")
      }
    }
  }
  //Método que cambia el estado de una queja
  async guardar(){
    console.log(this.estado_reclamo);
    if(this.reclamo!=null){
      if(await this.mensajes.msj_confirmar("¿Guardar cambios?", "Sí, guardar", "Cancelar")){
        console.log(typeof(this.estado_reclamo), this.estado_reclamo);
        if(this.Servicio_MA.cambiar_estadoReclamo(this.reclamo.id_queja,this.estado_reclamo)){
          this.cerrar_verQueja();
          this.mensajes.msj_exito("Se han guardado los cambios");
          
        }
        else{
          this.mensajes.msj_informar("No se han guardado los cambios");
        }
      }  
    }
  }
  cerrar_verQueja(){
    this.detalles_reclamo=false;
    this.reclamo=null;
  }
  //Asigna el valor cambiado de la lista desplegable con los estados
  marcar_visto(event:any) {
    this.estado_reclamo=event.target.value;
  }
}
