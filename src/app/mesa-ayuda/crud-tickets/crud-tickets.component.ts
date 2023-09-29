import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MesaAyudaService } from '../mesa-ayuda.service';
import { CategoriaMA } from '../modelo-categoriaMA';
import { Item } from '../modelo-item';
import { MensajesService } from 'src/app/mensajes.service';
import { Ticket } from '../modelo-ticket';
import { responsable } from '../modelo-responsable';
import { Estado } from '../modelo-estado';
import { Prioridad } from '../modelo-prioridad';
import { Comentario } from '../modelo-comentario';
import { remitente } from '../modelo-remitente';
import { LoginService } from 'src/app/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crud-tickets',
  templateUrl: './crud-tickets.component.html',
  styleUrls: ['./crud-tickets.component.scss']
})
export class CRUDTicketsComponent implements OnInit{
  //Variable del estado de las ventanas, si es TRUE se abre la ventana
  @Input() crear_ticket: boolean;
  @Input() ventana_VerTicket:boolean;
  @Input() ventana_editarTicket:boolean;
  //ID del ticket seleccionado, usado para ver, editar o eliminar
  @Input() idTicket: number;
  //Métodos que emiten que la ventana se cierre
  @Output() ventanaVerCerrada= new EventEmitter<void>();
  @Output() ventanaCrearCerrada = new EventEmitter<void>();
  @Output() ventanaEditCerrada = new EventEmitter<void>();
  //Métodos que abren o cierran la ventana para agregar un comentario
  ventanaResponsable:boolean;
  ventanaComentario:boolean;
  //Objeto que almacena un Ticket
  ticket:Ticket | null;
  //Variables que guardan las categorías, estados y prioridades registradas 
  private categorias:CategoriaMA[] | null;
  private estados:Estado[];
  private prioridades:Prioridad[];
  //Activa o desactiva el resto del formulario si se selecciono una categoría
  //Sirve en el caso que una categoría no tenga ítems, para que no se los solicite al usuario
  mostrar_items: boolean;
  //Guarda los items de la categoría seleccionada
  private itemsPorCategoria: Item[] | null;
  //Variable que guarda el id de la categoría seleccionada
  id_categoriaSeleccionada:number | null;
  //Guardan el id del item, estado y prioridad seleccionada por el usuario
  id_itemseleccionado:number | null;
  id_estadoseleccionado:number | null;
  id_prioridadseleccionada:number | null;
  //Variables que guardan el Asunto y Descripción del Ticket
  asunto:string;
  descripcion:string;
  //Variable que indica si hubo error al crear el ticket
  private error_crear:boolean;
  private error_editar:boolean;
  error_comentario:boolean;
  //Datos de un Ticket
  fecha_solicitud:string;
  fecha_limite:string;
  remitente:remitente;
  txt_categoria:string;
  txt_item:string;
  txt_estado:string;
  //Variable que guarda la cadena de texto al buscar un responsable para asignarlo
  txt_buscarResponsable:string;
  //Variable que guarda al responsable encontrado
  responsable:responsable | null;
  //Variable que guarda a un usuario encontrado y si se confirma se asigna como responsable
  responsable_editar:responsable | null;
  //En caso de que se encuentre al responsable esta variable muestra su información siendo TRUE
  mostrar_responsable:boolean;
  //Guarda la cadena de texto del comentario
  comentario:string;
  //Guarda el conjunto de comentarios por el Ticket
  comentariosPorTicket: Comentario[] | null;
  //Variable que guarda los permisos del usuario que inicio sesión
  permiso_MA:boolean;
  constructor(private router:Router, private servicio_MesaAyuda: MesaAyudaService,private servicio_mensajes:MensajesService,private loginServie:LoginService){
    this.ticket = null;
    this.categorias=null;
    this.mostrar_items=false;
    this.itemsPorCategoria=null;
    this.id_categoriaSeleccionada=null;
    this.id_itemseleccionado=null;
    this.asunto="";
    this.descripcion="";
    this.error_crear=false;
    this.error_editar=false;
    this.txt_categoria="";
    this.txt_item="";
    this.txt_estado="";
    this.fecha_solicitud="";
    this.fecha_limite="";
    this.txt_buscarResponsable="";
    this.ventanaResponsable=false;
    this.responsable=null;
    this.mostrar_responsable=false;
    this.estados=[];
    this.prioridades=[];
    this.id_estadoseleccionado=null;
    this.id_prioridadseleccionada=null;
    this.comentario="";
    this.error_comentario=false;
    this.comentariosPorTicket=null;
    this.responsable_editar=null;
    this.permiso_MA=false;
  }
  ngOnInit(): void {
    //Inicialización de las variables como vacías
    console.log("El error es:"+this.error_crear);
    if(this.loginServie.getPermisoMesaAyuda()=='true' /* || this.loginServie.getTipoUsuario()=="profesor" */){
      this.permiso_MA=true;
    }
    this.ticket = null;
    this.categorias=null;
    this.mostrar_items=false;
    this.itemsPorCategoria=null;
    this.id_categoriaSeleccionada=null;
    this.id_itemseleccionado=null;
    this.asunto="";
    this.descripcion="";
    this.error_crear=false;
    this.error_editar=false;
    this.txt_categoria="";
    this.txt_item="";
    this.txt_estado="";
    this.fecha_solicitud="";
    this.fecha_limite="";
    this.txt_buscarResponsable="";
    this.ventanaResponsable=false;
    this.responsable=null;
    this.mostrar_responsable=false;
    this.estados=[];
    this.prioridades=[];
    this.id_estadoseleccionado=null;
    this.id_prioridadseleccionada=null;
    this.comentario="";
    this.error_comentario=false;
    this.comentariosPorTicket=null;
    this.responsable_editar=null;
    //Luego de inicializar las variables como vacías se traen los estados, y prioridades registradas
    //Los estados son 'Pendiente', 'En proceso'y 'Completada'
    this.estados=this.servicio_MesaAyuda.getEstados();
    //Las prioridades son 'Baja', 'Media'y 'Alta'
    this.prioridades=this.servicio_MesaAyuda.getPrioridades();
    //Iniciar las categorías
    this.servicio_MesaAyuda.getCategorias().then(data => {
      this.setCategorias(data);
      console.log("Las categorias son:", this.getCategorias());
    });
    this.servicio_MesaAyuda.getItems();
    this.setErrorCrear(false);
  }
  //Asigna un valor a las categorías
  setCategorias(cat:CategoriaMA[] | null):void{
    this.categorias=cat;
  }
  //Retorna las categorías
  getCategorias(): CategoriaMA[] | null{
    return this.categorias;
  }
  //Método Get y Set para el error al crear un Ticket
  setErrorCrear(valor:boolean):void{
    this.error_crear=valor;
  }
  getErrorCrear():boolean{
    return this.error_crear;
  }
  //Método Get y Set para el error al editar un Ticket
  setErrorEditar(valor:boolean):void{
    this.error_editar=valor;
  }
  getErrorEditar():boolean{
    return this.error_editar;
  }
  //Método Get y Set para mostrar u ocultar los items de una categoría
  setMostrarItems(valor:boolean):void{
    this.mostrar_items=valor;
  }
  getMostrarItems():boolean{
    return this.mostrar_items;
  }
  //Métodos get y set de items por categoría
  setItemsPorCategoria(items:Item[] | null):void{
    this.itemsPorCategoria=items;
  }
  getItemsPorCategoria(): Item[] | null{
    return this.itemsPorCategoria;
  }
  //Metodo que captura el ID de la categoría seleccionada en una variable
  cargar_categoria(event: any): void {
    if(event.target.value!="null"){
      this.id_categoriaSeleccionada= event.target.value;
      this.id_itemseleccionado=null;
      this.cargarItems(this.id_categoriaSeleccionada);
    }
    else{
      this.setMostrarItems(false);
      this.id_categoriaSeleccionada= null;
    }
  }
  //Según el ID de la categoría seleccionado carga los items
  cargarItems(id_categoria: number | null): void {
    if (id_categoria !== null) {
      let itemsPorCategoria = this.servicio_MesaAyuda.getItemsPorCategoria(id_categoria);
      if (itemsPorCategoria != null) {
        this.setMostrarItems(true);
        this.setItemsPorCategoria(itemsPorCategoria);   
      }
      else{
        this.setMostrarItems(false);
        this.id_itemseleccionado=null;
        this.setItemsPorCategoria(itemsPorCategoria);  
      }
    }
  }
  //Metodo que captura el ID de la categoría seleccionada en una variable
  cargar_item(event: any): void {
    if(event.target.value!="null"){
      this.id_itemseleccionado= event.target.value;
    }
    else{
      this.id_itemseleccionado= null;
    }
  }
  //Método para crear el ticket
  async crear():Promise<void>{
    if(this.id_categoriaSeleccionada!==null && ((this.mostrar_items==true && this.id_itemseleccionado!=null) || this.mostrar_items==false && this.id_itemseleccionado==null) && this.asunto.trim().length>0 && this.descripcion.trim().length>0){
      if(await this.servicio_mensajes.msj_confirmar('¿Está seguro que desea registrar el Ticket?','Confirmar','Cancelar')){
        if(this.servicio_MesaAyuda.crear_ticket(this.id_categoriaSeleccionada,this.id_itemseleccionado,this.asunto,this.descripcion)){
          this.cerrar_crearTicket();
          this.servicio_mensajes.msj_exito('Se ha creado el Ticket!');
          this.error_crear=false;
        }
        else{
          this.cerrar_crearTicket();
          this.servicio_mensajes.msj_errorPersonalizado("Ha ocurrido un error al registrar el Ticket, por favor inténtelo más tarde.")
        }
      }
    }
    else{
      this.servicio_mensajes.msj_datosErroneos();
      this.error_crear=true;
    }  
  }
  //Método que carga los valores del Ticket para mostrarlos o editarlos
  getTicket(id:number,mostrar:boolean) {
    this.idTicket=id;
    this.servicio_MesaAyuda.getTicket(this.idTicket).then(data => {
      this.ticket = data;
      if (this.ticket) {
        this.ventana_editarTicket=mostrar;
        this.fecha_solicitud= this.servicio_MesaAyuda.formatoDateparaInput(this.ticket?.fecha_solicitud);
        this.fecha_limite = this.servicio_MesaAyuda.formatoDateparaInput(this.ticket?.fecha_limite);
        if(this.ventana_editarTicket){
          this.id_categoriaSeleccionada=this.ticket?.categoria.id_categoria;
          let items=this.servicio_MesaAyuda.getItemsPorCategoria(this.id_categoriaSeleccionada);
          if(items){
            if(this.ticket?.item?.id_item==null){
              this.id_itemseleccionado=null;
            }
            else{
              this.id_itemseleccionado=this.ticket?.item?.id_item;
            }
            this.setItemsPorCategoria(items);
            this.setMostrarItems(true);
          }
          else{
            this.id_itemseleccionado=null;
            this.setItemsPorCategoria(items);
            this.setMostrarItems(false);
          }
          if(this.ticket?.item?.id_item==null){
            this.id_itemseleccionado=null;
          }
          else{
            this.id_itemseleccionado=this.ticket?.item?.id_item;
          }
          this.responsable=this.ticket?.responsable;
          this.setItemsPorCategoria(this.servicio_MesaAyuda.getItemsPorCategoria(this.ticket.categoria.id_categoria));
          this.id_estadoseleccionado=this.ticket?.estado.id_estado;
          this.id_prioridadseleccionada=this.ticket?.prioridad.id_prioridad;
          this.servicio_MesaAyuda.getComentarios(this.ticket?.token).then(data => {
            console.log(data);
            this.comentariosPorTicket=data;
          });
        }
      }
      else{
        this.cerrar_verTicket();
        this.cerrar_editarTicket();
        this.servicio_mensajes.msj_informar("No se ha encontrado el Ticket con el ID:"+this.idTicket);  
      }
    });
    
  }
  //Función para ediar un ticket
  async editar_Ticket(){
    if(this.id_categoriaSeleccionada!=null){
      if((this.getMostrarItems()==true && this.id_itemseleccionado!=null) || (this.getMostrarItems()==false && this.id_itemseleccionado==null)){
        console.log(this.id_estadoseleccionado);
        if(this.id_estadoseleccionado!=null){
              if(await this.servicio_mensajes.msj_confirmar('¿Está seguro que desea guardar los cambios', 'Confirmar', 'Cancelar')){
                console.log("El ID del responsable es:"+this.responsable?.id_usuario);
                if(this.responsable?.id_usuario!=undefined && this.ticket!=null && this.servicio_MesaAyuda.editar_ticket(this.ticket?.token,this.ticket?.usuario.id_usuario,this.id_categoriaSeleccionada,this.id_itemseleccionado, this.ticket?.asunto,this.ticket?.descripcion,this.responsable?.correo, this.servicio_MesaAyuda.formatoDateparaInput(this.ticket?.fecha_solicitud),this.id_estadoseleccionado,this.id_prioridadseleccionada, this.comentariosPorTicket)){
                  this.cerrar_editarTicket();
                  this.setErrorEditar(false);
                  this.ngOnInit();
                  if(this.servicio_MesaAyuda.validar_permisosMA(this.loginServie.getToken())){
                    this.servicio_mensajes.msj_exito("Se han guardado los cambios!");
                  }
                  else{
                    this.servicio_mensajes.msj_exito("Felicitaciones, ha terminado con sus Tickets asignados!");
                    this.router.navigate(['/Mesa_Ayuda']);
                  }

                }
                else{
                  this.cerrar_editarTicket();
                  this.setErrorEditar(false);
                  this.servicio_mensajes.msj_errorPersonalizado("No se han podido guardar los cambios. Por favor, inténtelo más tarde.");
                }
              }
        }
        else{
          this.setErrorEditar(true);
          this.servicio_mensajes.msj_errorPersonalizado("Debe agregar un estado al Ticket");
        }
        
      }
      else{
        this.setErrorEditar(true);
        this.servicio_mensajes.msj_errorPersonalizado("Debe agregar un ítem al Ticket");
      }
    }
    else{
      this.setErrorEditar(true);
      this.servicio_mensajes.msj_errorPersonalizado("Debe agregar una categoría al Ticket");
    }
  }

  //Método que retorna los datos de un responsable
  buscar_responsable(){
    this.servicio_MesaAyuda.buscar_responsable(this.txt_buscarResponsable).then(data => {
      this.responsable_editar = data;
      if(this.responsable_editar!=null){
        this.mostrar_responsable=true;
      }
      else{
        this.servicio_mensajes.msj_errorPersonalizado("No se encontro al usuario con el correo: "+this.txt_buscarResponsable);
        this.txt_buscarResponsable="";
        this.mostrar_responsable=false;
      }
    });
    
  }
  //Método que asigna un responsable al usuario
  async asignar_responsable(){
    if(await this.servicio_mensajes.msj_confirmar('¿Está seguro?', 'Confirmar', 'Cancelar')){
      this.servicio_MesaAyuda.cambiar_responsable(this.idTicket, this.responsable_editar).then(editado => {
        if(this.responsable_editar!=null && editado){
          this.responsable=this.responsable_editar;
          this.servicio_mensajes.msj_exito('Se ha añadido al responsable!');
          this.cerrar_responsable();
          this.txt_buscarResponsable="";
          this.mostrar_responsable=false;
        }
        else{
          this.servicio_mensajes.msj_errorPersonalizado("Ha ocurrido un error al modificar el responsable. Por favor, inténtelo más tarde.");
          this.txt_buscarResponsable="";
          this.mostrar_responsable=false;
          this.cerrar_responsable();
        }
      });
    }

  }

  //Método que restorna los tres estados de una solicitud
  getEstados(){
    return this.estados;
  }
  getPrioridades(){
    return this.prioridades;
  }
  //Metodo que captura el ID del estado seleccionado en una variable
  cargar_estado(event: any): void {
    if(event.target.value!="null"){
      this.id_estadoseleccionado= event.target.value;
    }
    else{
      this.id_estadoseleccionado= null;
    }
  }
  cargar_prioridad(event: any): void {
    if(event.target.value!="null"){
      this.id_prioridadseleccionada= event.target.value;
    }
    else{
      this.id_prioridadseleccionada= null;
    }
  }
  //Método que carga los datos de un Ticket que se desea visualizar
  verTicket(ticket: Ticket,mostrar:boolean) {
    this.ventana_VerTicket = mostrar;
    this.idTicket=ticket.token;
    this.ticket = ticket;
    if (this.ticket) {
      ///Verificar fechas
      this.txt_categoria=this.ticket.categoria.nombre;
      if(this.ticket.item!=null){
        this.txt_item=this.ticket.item.nombre;
      }else{
        this.txt_item="";
      }
      this.txt_estado=this.ticket.estado.nombre;
      this.fecha_solicitud= this.servicio_MesaAyuda.formatoDateparaInput(this.ticket?.fecha_solicitud);
      this.fecha_limite = this.servicio_MesaAyuda.formatoDateparaInput(this.ticket?.fecha_limite);
      this.servicio_MesaAyuda.getComentarios(this.ticket?.token).then(data => {
        console.log(data);
        this.comentariosPorTicket=data;
      });
    }
    else{
      this.cerrar_verTicket();
      this.servicio_mensajes.msj_informar("No se ha encontrado el Ticket con el ID:"+this.idTicket);  
    }
  }
  async agregar_comentario():Promise<void>{
    if(this.comentario.trim().length > 0){
      if(await this.servicio_mensajes.msj_confirmar('¿Está seguro que desea agregar el comentario?', 'Confirmar', 'Cancelar')){
        if(this.servicio_MesaAyuda.agregar_comentario(this.idTicket,this.comentario)){
          this.comentariosPorTicket = this.servicio_MesaAyuda.comentarios;
          this.cerrar_comentario();
          this.servicio_mensajes.msj_exito("Se ha añadido el comentario!");
        }
        else{
          this.servicio_mensajes.msj_errorPersonalizado("No se ha podido añadir el comentario");
        }
      }
    }
    else{
      this.servicio_mensajes.msj_datosErroneos();
      this.error_comentario=true;
    }
    
  }
  //Método para editar un comentario de un Ticket
  id_comentarioEditar:number;
  editar:boolean;
  agregar:boolean;
  editar_comentario(id_comentario:number,comentario:string){
    this.id_comentarioEditar=id_comentario;
    this.ventanaComentario=true;
    this.error_comentario=false;
    this.editar=true;
    this.agregar=false;
    this.comentario=comentario;
  }
  async editar_com(){
    if(this.comentario.trim().length > 0){
      if(await this.servicio_mensajes.msj_confirmar('¿Está seguro que desea guardar los cambios?', 'Confirmar', 'Cancelar')){
        this.error_comentario=this.servicio_MesaAyuda.editar_comentario(this.id_comentarioEditar,this.comentario);
        if(this.error_comentario==false){
          this.cerrar_comentario();
          this.servicio_mensajes.msj_exito("Se han guardado los cambios!");
        }
        else{
          this.servicio_mensajes.msj_errorPersonalizado("No se han podido guardar los cambios");
        }
      }   
    }
    else{
      this.servicio_mensajes.msj_datosErroneos();
      this.error_comentario=true;
    }
  }
  async eliminar_comentario(id_comentario:number){
    if(await this.servicio_mensajes.msj_confirmar('¿Está seguro que eliminar el comentario? Está acción es irreversible', 'Confirmar', 'Cancelar')){
      if(this.servicio_MesaAyuda.eliminar_comentario(id_comentario)){
        this.servicio_mensajes.msj_exito("Se ha eliminado el comentario!");
      }
      else{
        this.servicio_mensajes.msj_errorPersonalizado("No se ha podido eliminar el comentario");
      }
    }  
  }
  //Método para abrir o cerrar la ventana para añadir comentarios
  ventana_comentario():void{
    this.ventanaComentario=true;
    this.agregar=true;
  }
  cerrar_comentario():void{
    this.comentario="";
    this.ventanaComentario=false;
    this.agregar=false;
    this.editar=false;
    this.error_comentario=false;
  }
  //Cierra la ventana de crear un Ticket  y reinicia los valore
  cerrar_crearTicket(): void {
    this.crear_ticket = false;
    this.ventanaCrearCerrada.emit();
    this.ngOnInit();
  }
  //Cierra la ventana de editar un Ticket y reinicia los valore
  cerrar_verTicket(): void {
    this.ventana_VerTicket = false;
    this.ventanaVerCerrada.emit();
    this.ngOnInit();
  }
  //Cierra la ventana de editar un Ticket y reinicia los valore
  cerrar_editarTicket(): void {
    this.ventana_editarTicket = false;
    this.ventanaEditCerrada.emit();
    this.ticket=null;
    this.categorias=null;
    this.ngOnInit();
  }
  //Abre la ventana de responsable
  agregar_responsable(): void {
    this.ventanaResponsable=true;
  }
  //Cierra la ventana de agregar un responsable
  cerrar_responsable():void{
    this.txt_buscarResponsable="";
    this.ventanaResponsable=false;
    this.mostrar_responsable=false;
  }

  //método para cambiar el formato en que se muestra una fehca
  formatofecha(fecha:Date):string{
    return this.servicio_MesaAyuda.formatoDateparaInput(fecha);
  }
  
}
