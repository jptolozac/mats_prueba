import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { MesaAyudaService } from '../mesa-ayuda.service';
import { MensajesService } from 'src/app/mensajes.service';
import { Item } from '../modelo-item';
import { CategoriaMA } from '../modelo-categoriaMA';
import { Router } from '@angular/router';

@Component({
  selector: 'app-administrar-items',
  templateUrl: './administrar-items.component.html',
  styleUrls: ['./administrar-items.component.scss']
})
export class AdministrarItemsComponent implements OnChanges {
  //Variables que abren o cierran la ventana para ver la lista de ítems.
  @Input() ver_items:boolean;
  @Output() cerrar_items= new EventEmitter<void>();
  //Variable que guarda los ítems de las solicitudes
  items:Item[] | null;
  //Variable que abre o cierra la ventana para editar un ítem
  editar_item:boolean;
  //ítem para editar
  item:Item | null;
  txt_item:string;
  //ID de la categoría a la que pertenece el ítem
  id_categoria:number | null;
  //Variable que guarda las categorías de las solicitudes
  categorias:CategoriaMA[] | null;
  //Ventana que abre o cierra la ventana para agregar un ítem
  mostrar_agregar: boolean;
  //Guarda TRUE o FALSE en caso de algún error al editar o agregar un ítem
  error_item:boolean;
  //Variable que almacena el número de ítems
  cantidad_items:number;
  nombresCategorias: string[];
  constructor(private router: Router, private servicio_MA:MesaAyudaService,private servicio_mensajes:MensajesService){
    this.items=null;
    this.editar_item=false;
    this.item=null;
    this.txt_item="";
    this.categorias=null;
    this.mostrar_agregar=false;
    this.error_item=false;
    this.cantidad_items=0;
    this.nombresCategorias = [];
  }
  //Si hay cambios en los arreglos de ítems o categorías los recarga
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['items'] && changes['categorias'] && changes['ver_items']) {
      this.servicio_MA.getItems().then(data => {
        this.items = data;
      });
      this.servicio_MA.getCategorias().then(data => {
        this.categorias = data;
      });
    }
  }
  //Métodos que inicilizan las variables.
  ngOnInit(): void {
    this.limpiar_variables();
  }
  limpiar_variables():void{
    this.items=null;
    this.editar_item=false;
    this.item=null;
    this.txt_item="";
    this.categorias=null;
    this.mostrar_agregar=false;
    this.error_item=false;
    this.servicio_MA.getItems().then(async data => {
      this.items = data;
      await this.servicio_MA.getCategorias().then(data => {
        this.categorias = data;
        if(this.items!=null){
          this.cantidad_items=this.items.length;
        }
        else{
          this.cantidad_items=0;
        }
        console.log(this.items,this.categorias);
      });
    });
    
  }
  //Cierra la ventana con la lista de ítems
  cerrar(): void {
    this.ver_items=false;
    this.cerrar_items.emit();
    this.limpiar_variables();
  }
  //Abre la ventana para editar un ítem
  mostrar_editar(item:Item):void{
    if(item!=null){
      this.item=item;
      this.editar_item=true;
      this.txt_item=this.item.nombre;
      this.id_categoria=this.item.categoria.id_categoria;
    }  
    else{
      this.servicio_mensajes.msj_errorPersonalizado("No se ha encontrado el ítem");
    }
    
  }
  //Método para editar un ítem
  async editar(){
    if(this.txt_item.trim().length > 0 && this.id_categoria!=null){
      this.error_item=false;
      if(await this.servicio_mensajes.msj_confirmar("¿Guardar cambios?", "Confirmar", "Cancelar")){
        if(this.item?.id_item!=undefined && await this.servicio_MA.editarItem(this.item?.id_item,this.txt_item, this.id_categoria)){
          this.cerrar_editar();
          this.servicio_mensajes.msj_exito("Cambios guardados");
        }
        else{
          this.cerrar_editar();
          this.servicio_mensajes.msj_errorPersonalizado("Ha ocurrido un error al guardar los cambios. Por favor, inténtelo más tarde.");
        }
      }
    }  
    else{
      this.error_item=true;
      this.servicio_mensajes.msj_datosErroneos();
    }
  }
  //Método que elimina un ítem
  async eliminar(item:Item){
    this.item=item;
    if(this.item){
      if(await this.servicio_mensajes.msj_confirmar("¿Está seguro de eliminar el ítem?", "Confirmar", "Cancelar")){
        if(await this.servicio_MA.eliminarItem(this.item.id_item)){
          this.servicio_mensajes.msj_exito("Se ha eliminado el ítem");
        }
        else{
          this.servicio_mensajes.msj_errorPersonalizado("Ha ocurrido un error al eliminar el ítem.")
        }
      }
    }
    else{
      this.servicio_mensajes.msj_errorPersonalizado("Ha ocurrido un error al buscar el registro del ítem.")
    }
    
  }
  //Método que cambia el ID de la categoría por su nombre
  async txt_categoria(id_categoria: number){
    console.log(this.items);
    /* await this.servicio_MA.getCategoria_ID(id_categoria).then(data => {
      console.log(data);
      return data;
    }); */
    return "algo";
  }
  //Metodo que captura el ID de la categoría seleccionada en una variable
  cargar_categoria(event: any): void {
    if(event.target.value!="null"){
      this.id_categoria= event.target.value;
    }
    else{
      this.id_categoria= null;
    }
  }
  cerrar_editar():void{
    this.limpiar_variables();
    this.editar_item=false;
  }  
  mostrarAgregar():void{
    this.id_categoria=null;
    this.mostrar_agregar=true;
  }
  cerrarAgregar():void{
    this.limpiar_variables();
    this.mostrar_agregar=false;
  }  
  async agregar(nombre:string){
    if(nombre.trim().length>0 && this.id_categoria!==null){
      this.error_item=false;
      if(await this.servicio_mensajes.msj_confirmar("¿Está seguro de añadir el ítem?","Confirmar","Cancelar")){
        if(await this.servicio_MA.agregarItem(nombre, this.id_categoria)){
          this.cerrarAgregar();
          this.servicio_mensajes.msj_exito("Se ha añadido el ítem");
        }
        else{
          this.cerrarAgregar();
          this.servicio_mensajes.msj_errorPersonalizado("Ha ocurrido un error al agregar la ítem. Por favor, inténtelo más tarde.");
        }
      }
    }
    else{
      this.error_item=true;
      this.servicio_mensajes.msj_datosErroneos();
    }
  }
}
