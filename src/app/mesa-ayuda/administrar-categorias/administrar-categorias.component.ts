import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CategoriaMA} from '../modelo-categoriaMA';
import { MesaAyudaService } from '../mesa-ayuda.service';
import { MensajesService } from 'src/app/mensajes.service';

@Component({
  selector: 'app-administrar-categorias',
  templateUrl: './administrar-categorias.component.html',
  styleUrls: ['./administrar-categorias.component.scss']
})
export class AdministrarCategoriasComponent implements OnChanges {
  //Variables que abren o cierran la ventana de ver la lista de categorías
  @Input() ver_categorias:boolean;
  @Output() cerrar_categorias= new EventEmitter<void>();
  //Variable que guarda las categorías de las solicitudes
  categorias_MA:CategoriaMA[] | null;
  //Variable que abre o cierra la ventana para editar una categoría
  editar_categoria:boolean;
  //Categoria para editar
  categoria:CategoriaMA | null;
  //Guarda el nombre de la categoría
  txt_nombreCat:string;
  //Abre o cierra la ventana para agregar una categoría
  mostrar_agregar:boolean;
  //Variable que almacena si ocurrio un error o no
  error_categoria:boolean;
  //Variable almacena la cantidad de categorías
  cantidad_categorias:number;
  constructor(private servicio_MA:MesaAyudaService,private servicio_mensajes:MensajesService){
    this.categorias_MA = null;
    this.categoria=null;
    this.txt_nombreCat="";
    this.mostrar_agregar=false;
    this.error_categoria=false;
    this.cantidad_categorias=0;
  }
  //Si hay cambios en el arreglo de categorías los recarga
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['categorias_MA']) {
      this.categorias_MA = null;
      this.servicio_MA.getCategorias().then(data => {
        this.categorias_MA = data;
      });
    }  
  }
  // Métodos que Inicializan las variables
  ngOnInit(): void {
    this.limpiar_variables();
  }
  limpiar_variables():void{
    this.categorias_MA = null;
    this.editar_categoria=false;
    this.categoria=null;
    this.txt_nombreCat="";
    this.error_categoria=false;
    this.servicio_MA.getCategorias().then(data => {
      this.categorias_MA = data;
    
      if(this.categorias_MA!=null){
        this.cantidad_categorias=this.categorias_MA.length;
      }
      else{
        this.cantidad_categorias=0;
      }
    });
  }
  //Cierra la ventana con la lista de categorías
  cerrar(): void {
    this.ver_categorias=false;
    this.cerrar_categorias.emit();
    this.limpiar_variables();
  }
  //Habilita la ventana para editar una categoría
  mostrar_editar(cat:CategoriaMA):void{
    if(cat!=null){
      this.categoria=cat;
      this.editar_categoria=true;
      this.txt_nombreCat=this.categoria.nombre;
    }  
    else{
      this.servicio_mensajes.msj_errorPersonalizado("No se ha encontrado la categoría en los registros.");
    }
    
  }
  //Método que guarda los cambios realizados en la categoría
  async editar(){
    if(this.txt_nombreCat.trim().length > 0){
      this.error_categoria=false;
      if(await this.servicio_mensajes.msj_confirmar("¿Guardar cambios?", "Confirmar", "Cancelar")){
        if(this.categoria?.id_categoria!=undefined && await this.servicio_MA.editarCategoria(this.categoria?.id_categoria,this.txt_nombreCat)){
          this.cerrar_editar();
          this.servicio_mensajes.msj_exito("Cambios guardados");
        }
        else{
          this.cerrar_editar();
          this.servicio_mensajes.msj_errorPersonalizado("Ha ocurrido un error al guardar los cambios. Por favor, inténtelo más tarde.")
        }
      }
    }  
    else{
      this.error_categoria=true;
      this.servicio_mensajes.msj_datosErroneos();
    }
  }
  //Método para eliminar una categoría
  async eliminar(categoria:CategoriaMA){
    this.categoria=categoria;
    if(this.categoria){
      if(await this.servicio_mensajes.msj_confirmar("¿Está seguro de eliminar la categoría?", "Confirmar", "Cancelar")){
        if(await this.servicio_MA.eliminarCategoria(this.categoria.id_categoria)){
          this.servicio_mensajes.msj_exito("Se ha eliminado la categoría");
        }
        else{
          this.servicio_mensajes.msj_errorPersonalizado("Ha ocurrido un error al eliminar la categoría. Por favor, inténtelo más tarde.")
        }
      }
    }
    else{
      this.servicio_mensajes.msj_errorPersonalizado("Ha ocurrido un error al buscar la categoría. Por favor, inténtelo más tarde.");
    }
    
  }
  cerrar_editar():void{
    this.limpiar_variables();
    this.editar_categoria=false;
  }  
  mostrarAgregar():void{
    this.mostrar_agregar=true;
  }
  cerrarAgregar():void{
    this.limpiar_variables();
    this.mostrar_agregar=false;
  }  
  //Método para agregar una nueva categoría
  async agregar(nombre:string){
    if(nombre.trim().length>0){
      if(await this.servicio_mensajes.msj_confirmar("¿Está seguro que desea añadir la categoría?","Confirmar","Cancelar")){
        if(await this.servicio_MA.agregarCategoria(nombre)){
          this.cerrarAgregar();
          this.servicio_mensajes.msj_exito("Se ha añadido la categoría");
        }
        else{
          this.cerrarAgregar();
          this.servicio_mensajes.msj_errorPersonalizado("Ha ocurrido un error al registrar la categoría. Por favor, inténtelo más tarde.");
        }
      }
    }
    else{
      this.error_categoria=true;
      this.servicio_mensajes.msj_datosErroneos();
    }
  }
}
