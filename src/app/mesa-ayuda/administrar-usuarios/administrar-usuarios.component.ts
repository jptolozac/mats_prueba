import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MesaAyudaService } from '../mesa-ayuda.service';
import { MensajesService } from 'src/app/mensajes.service';
import { usuario } from '../modelo-usuario';
import { LoginService } from 'src/app/login.service';

@Component({
  selector: 'app-administrar-usuarios',
  templateUrl: './administrar-usuarios.component.html',
  styleUrls: ['./administrar-usuarios.component.scss']
})
export class AdministrarUsuariosComponent implements OnInit{
  //Variables que abren o cierran la ventana para administrar usuarios
  @Input() ventana_administrar:boolean;
  @Output() ventanaAdministrarCerrada= new EventEmitter<void>();
  //NUEVO
  @Input() ventana_cambiarPassword:boolean;
  @Output() ventanaPasswordCerrada= new EventEmitter<void>();
  //Variable que abre o cierra la ventana para crear un usuario
  ventana_crear:boolean;
  //Variable que guarda si un usuario fue encontrado o no
  encontrado:boolean;
  //Guarda la información del usuario
  usuario: usuario  | null;
  //Variables que guardan la información del usuario
  txt_nombre:string;
  txt_correo:string;
  txt_password:string;
  txt_confirmarPassword:string;
  id_tipo:number | null;
  //Cambia botones de editar por guardar y viceversa
  bloquear:boolean;
  //Variable que almancena si hubo error en alguna operación
  error:boolean;
  //Variable que guarda la cadena con el correo a buscar
  txt_buscar:string;
  //Variables que guardan TRUE o FALSE según el permiso del usuario
  permiso_noticias:boolean;
  permiso_preguntas:boolean;
  permiso_MA:boolean;
  cantidad_permisos:number;
  constructor(private servicio_MA:MesaAyudaService, private servicio_mensajes:MensajesService, private loginService:LoginService){

  }
  //Métodos que inicializan las variables
  ngOnInit(): void {
      this.limpiar_variables();
  }
  limpiar_variables(){
    this.ventana_crear=false;
    this.encontrado=false;
    this.usuario=null;
    this.encontrado=false;
    this.txt_nombre="";
    this.txt_correo="";
    this.txt_password="";
    this.txt_confirmarPassword="";
    this.id_tipo=3;
    this.error=false;
    this.txt_buscar="";
    //Inicia siendo true para que el disabled este activo
    this.bloquear=true;
    //BUSCAR EN LOGIN SERVICE LOS PERMISOS Y ASIGNARLOS AQUÍ
    this.permiso_noticias=false;
    this.permiso_preguntas=false;
    this.permiso_MA=false;
    this.cantidad_permisos=0;
    if(this.permiso_noticias){
      this.cantidad_permisos++;
    }
    if(this.permiso_preguntas){
      this.cantidad_permisos++;
    }
    if(this.permiso_MA){
      this.cantidad_permisos++;
    }
  }
   //NUEVO
   cerrar_password(): void {
    this.ventana_cambiarPassword=false;
    this.ventanaPasswordCerrada.emit();
    this.limpiar_variables();
  }
  async nueva_password(){
    if(this.txt_password==this.txt_confirmarPassword){
      if(this.txt_password.trim().length>0 && this.txt_confirmarPassword.trim().length>0){
        this.error=false;
      if(await this.servicio_mensajes.msj_confirmar("¿Está seguro que desea cambiar de contraseña:", "Confirmar", "Cancelar")){
        if(this.servicio_MA.cambiar_contraseña(this.loginService.getIdUsuario(),this.txt_password)){
          this.cerrar_password();
          this.servicio_mensajes.msj_exito("Se ha cambiado la contraseña!");
        }
        else{
          this.cerrar_password();
          this.servicio_mensajes.msj_errorPersonalizado("No se ha cambiado la contraseña. Por favor, inténtelo más tarde.");
        }
      }
      }
      else{
        this.error=true;
        this.servicio_mensajes.msj_datosErroneos();
      }
    }
    else{
      this.error=true;
      this.servicio_mensajes.msj_errorPersonalizado("La constraseña y su confirmación no coinciden.");
    }
  }
  //Método que abre la ventana para crear un usuario
  crear_usuario(){
    this.limpiar_variables();
    this.ventana_crear=true;
  }
  //Método que cierra la vetnana para crear un usuario
  cerrar_crear(){
    this.limpiar_variables();
    this.ventana_crear=false;
  }
  cerrar(): void {
    this.ventana_administrar=false;
    this.ventanaAdministrarCerrada.emit();
    this.limpiar_variables();
  }
  //Método que busca un usuario según su correo institucional
  buscar():void {
    this.servicio_MA.buscar_usuario(this.txt_buscar).then(data => {
      this.usuario = data;
      if(this.usuario!=null){
        this.encontrado=true;
        this.txt_nombre=this.usuario.nombre;
        this.txt_correo=this.usuario.correo;
        this.txt_password="";
        this.id_tipo=this.usuario.id_tipo;
      }
      else{
        this.encontrado=false;
        this.servicio_mensajes.msj_informar("El correo del usuario ingresado no fue encontrado");
      }
    });
    
  }
  //Método que asigna el valor seleccionado en la lista desplegable a la variable
  cargar_tipoUsuario(event: any): void {
    if(event.target.value!="null"){
      this.id_tipo=event.target.value;
    }
    else{
      this.id_tipo= null;
    }
  }
  //Método que registra al usuario
  async registrar_usuario(){
    if(this.txt_nombre.trim().length > 0 && this.txt_correo.trim().length > 0 && this.txt_password.trim().length > 0 && this.txt_confirmarPassword.trim().length > 0 && this.txt_password===this.txt_confirmarPassword){
      this.error=false;
      if(await this.servicio_mensajes.msj_confirmar("¿Está seguro de registrar al usuario?", "Confirmar", "Cancelar")){
          if(this.servicio_MA.registrar_usuario(this.txt_nombre,this.txt_correo, this.txt_password, this.id_tipo)){
            this.limpiar_variables();
            this.cerrar_crear();
            this.servicio_mensajes.msj_exito("Se ha registrado al usuario");
          }
          else{
            this.limpiar_variables();
            this.cerrar_crear();
            this.servicio_mensajes.msj_errorPersonalizado("Ha ocurrido un error al registrar el usuario. Por favor, inténtelo más tarde.")
          }
      }
    }
    else{
      this.error=true;
      this.servicio_mensajes.msj_datosErroneos();
    }
  }
  //Funcion que cambia los botones en caso de que se vaya a editar
  editar(){
    this.bloquear=false;
  }
  //Función que cambia los botones de guardar a editar
  cancelar(){
    //BUSCAR EN LOGIN SERVICE LOS PERMISOS Y ASIGNARLOS AQUÍ
    this.permiso_noticias=true;
    this.permiso_preguntas=false;
    this.permiso_MA=true;
    this.cantidad_permisos=0;
    if(this.permiso_noticias){
      this.cantidad_permisos++;
    }
    if(this.permiso_preguntas){
      this.cantidad_permisos++;
    }
    if(this.permiso_MA){
      this.cantidad_permisos++;
    }
    this.bloquear=true;
  }
  //Método usado para guardar los cambios realizados al usuario
  async guardar_cambios(){
    if(this.txt_password==this.txt_confirmarPassword){
      if(this.txt_nombre.trim().length > 0 && this.txt_correo.trim().length > 0){
        this.error=false;
        if(await this.servicio_mensajes.msj_confirmar("¿Está seguro que desea guardar los cambios?", "Confirmar", "Cancelar")){
            if(this.usuario?.id_usuario!=undefined && this.servicio_MA.editar_usuario(this.usuario?.id_usuario,this.txt_nombre,this.txt_correo, this.txt_password, this.id_tipo, this.permiso_noticias,this.permiso_preguntas,this.permiso_MA)){
              this.limpiar_variables();
              this.servicio_mensajes.msj_exito("Se han guardado los cambios");
            }
            else{
              this.limpiar_variables();
              this.servicio_mensajes.msj_errorPersonalizado("Ha ocurrido un error al modificar el usuario. Por favor, inténtelo más tarde.")
            }
        }
      }
      else{
        this.error=true;
        this.servicio_mensajes.msj_datosErroneos();
      }
    }else{
      this.servicio_mensajes.msj_errorPersonalizado("Si desea cambiar la clave, la contraseña ingresada debe coincidir con su confirmación");
    }
  }
  //Método que elimina a un usuario
  async eliminar(){
    if(await this.servicio_mensajes.msj_confirmar("¿Está seguro que desea borrar el registro del usuario?", "Confirmar", "Cancelar")){
      if(this.usuario?.id_usuario!=undefined && this.servicio_MA.eliminar_usuario(this.usuario?.id_usuario)){
        this.limpiar_variables();
        this.servicio_mensajes.msj_exito("Se ha eliminado el registro del usuario");
      }
      else{
        this.servicio_mensajes.msj_errorPersonalizado("No se ha podido eliminar el registro del usuario");
      }
    }
  }
  //Función que cambia el texto según el número de permisos del usuario
  activar() {
    this.cantidad_permisos = 0; // Reinicia la cantidad de permisos cada vez
  
    if (this.permiso_noticias) {
      this.cantidad_permisos++;
    }
  
    if (this.permiso_preguntas) {
      this.cantidad_permisos++;
    }
  
    if (this.permiso_MA) {
      this.cantidad_permisos++;
    }
  }
}
