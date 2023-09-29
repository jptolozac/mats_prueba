import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/login.service';
import { MesaAyudaService } from '../mesa-ayuda.service';
import { MensajesService } from 'src/app/mensajes.service';
@Component({
  selector: 'app-informacion-usuario',
  templateUrl: './informacion-usuario.component.html',
  styleUrls: ['./informacion-usuario.component.scss']
})
export class InformacionUsuarioComponent implements OnInit{
  //Variable que guarda el nombre del usuario
  nombre:string;
  //Variable que almacena el correo del usuario
  correo:string;
  //Variable que guarda el tipo de usuario
  tipo_usuario: string;
  //Variable que activa o desactiva la ventana emergente
  ventana_editar:boolean;
  //Variables que almacenan los cambios que se desean realizar a la información personal del usuario
  nombre_editar:string;
  correo_editar:string;
  //Variable que guarda el error en caso de editar
  error:boolean;
  //NUEVO
  ventana_cambiarPassword:boolean;
  constructor(private loginService:LoginService,private servicio_MesaAyuda:MesaAyudaService, private servicio_mensajes:MensajesService){
    this.nombre="";
    this.correo="";
    this.tipo_usuario="";
    this.ventana_editar=false;
    this.error=false;
    this.ventana_cambiarPassword=false;
  }
  ngOnInit(): void {
    this.nombre="";
    this.correo="";
    this.tipo_usuario="";
    this.ventana_editar=false;
    this.error=false;
    this.ventana_cambiarPassword=false;
    this.tipo_usuario=this.loginService.getTipoUsuario();
    this.servicio_MesaAyuda.getNombre_usuario().then(data => {
      console.log("nombre: ", data);
      this.nombre = data.name;
    });
    this.correo=this.loginService.getIdUsuario();
  }
  //NUEVO
  cambiar_password():void{
    this.ventana_cambiarPassword=true;
  }
  cerrar_password():void{
    this.ventana_cambiarPassword=false;
  }
  editar():void{
    this.ventana_editar=true;
    this.nombre_editar=this.nombre;
    this.correo_editar=this.correo;
  }
  async guardar(){
    if(this.nombre_editar.trim().length>0 && this.correo_editar.trim().length>0){
      if(await this.servicio_mensajes.msj_confirmar('¿Está seguro que desea guardar los cambios?','Si, guardar','Cancelar')){
        this.error=false;  
        if(await this.servicio_MesaAyuda.editar_InformacionPersonal(this.nombre_editar,this.correo_editar)){
          this.servicio_mensajes.msj_exito('Los cambios han sido guardados!');
          this.cerrar();
        }
        else{
          this.cerrar();
          this.servicio_mensajes.msj_errorPersonalizado("Ha ocurrido un error al guardar los cambios. Por favor, inténtelo más tarde.");
        }    
      }
    }
    else{
      this.servicio_mensajes.msj_datosErroneos();
      this.error=true;
    }  
  }  
  cerrar():void{
    this.ventana_editar=false;
    this.ngOnInit();
  }

}
