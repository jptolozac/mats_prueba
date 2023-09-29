import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ServicioBackService } from './servicio-back.service';
import Swal from 'sweetalert2';
import { MensajesService } from './mensajes.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  //Corresponde al Token generado por la base de datos
  private token:string;
  //Corresponde al tipo de usuario: Estudiante, Profesor, Administrador
  //Variable usada para la obtención de noticias
  private tipo_usuario:any;
  //Permisos de el usuario: Variable usada para saber si el usuario podrá
  //subir,editar y eliminar noticias.
  private permiso_noticias: boolean;
  private permiso_preguntas: boolean;
  private permiso_mesa_ayuda: boolean;

  private data: any;
  private id: number;

  constructor(private route:Router, private cookies:CookieService, private cookie_usuario:CookieService, private cookie_permiso_noticias:CookieService, private cookie_permiso_preguntas:CookieService, private cookie_permiso_mesa_ayuda:CookieService, private servicioBackService: ServicioBackService, private cookie_id:CookieService, private servicioMensajes: MensajesService) {
    this.token="";
    this.tipo_usuario={};
    this.permiso_noticias = false;
    this.permiso_preguntas = false;
    this.permiso_mesa_ayuda = false;
  }
  //Variable que tiene la URL del Backend
  //***private apiUrl = environment.apiUrl;

  recolectar(usuario:string, password:string){
    return new Promise<void>((resolve, reject) => {
      this.servicioBackService.getUsuario(usuario, password).subscribe((data) => {
        this.data = data;
        resolve();
      }, error => {
        this.servicioMensajes.msj_datosErroneos();
        console.log(error.status);
      });
    }).then(() => {
      console.log(this.data);

      if(this.data.message == "ok"){
        this.cookie_id.set('id_usuario', usuario);
        console.log(this.getIdUsuario());
        this.token = this.data.token;
        this.tipo_usuario = this.data.tipo_usuario;
        this.permiso_noticias = this.data.permiso_noticias;
        this.permiso_preguntas = this.data.permiso_preguntas;
        this.permiso_mesa_ayuda = this.data.permiso_mesa_ayuda;
      }else{
        console.log('pailas mi loco');
        this.token = '';
      }

      this.cookies.set("token", this.token);
      this.cookie_usuario.set("tipo_usuario",this.tipo_usuario.perfil);
      this.cookie_permiso_noticias.set("permiso_noticias", this.permiso_noticias.toString());
      this.cookie_permiso_preguntas.set("permiso_preguntas", this.permiso_preguntas.toString());
      this.cookie_permiso_mesa_ayuda.set("permiso_mesa_ayuda", this.permiso_mesa_ayuda.toString());
    })
  }

  getIdUsuario(){
    return this.cookie_id.get('id_usuario');
  }

  async login(usuario:string, password:string){

    const promesa = await this.recolectar(usuario, password);

    return this.cookies.get("token");
  }
  //Esto debería volver la cookie
  getTipoUsuario(){
    return this.cookie_usuario.get("tipo_usuario");
  }
  //Usado para saber si el usuario puede acceder a lo servicios de la comunidad 
  estaLogueado(){
    return this.cookies.get("token");
  }

  getToken(){
    return this.cookies.get("token");
  }

  //Métodos que modifican el valor de las cookies
  setTipoUsuario(tipo_usuario:string){
    this.cookie_usuario.set("tipo_usuario",tipo_usuario);
  }
  
  //Retorna el tipo de permiso del usuario
  getPermisoNoticias(){
    return this.cookie_permiso_noticias.get("permiso_noticias");
  }
  setPermisoNoticias(permiso_usuario:string){
    this.cookie_permiso_noticias.set("permiso_noticias",permiso_usuario);
  }
  
  getPermisoPreguntas(){
    return this.cookie_permiso_preguntas.get("permiso_preguntas");
  }
  setPermisoPreguntas(permiso_usuario:string){
    this.cookie_permiso_preguntas.set("permiso_preguntas",permiso_usuario);
  }
  
  getPermisoMesaAyuda(){
    return this.cookie_permiso_mesa_ayuda.get("permiso_mesa_ayuda");
  }
  setPermisoMesaAyuda(permiso_usuario:string){
    this.cookie_permiso_mesa_ayuda.set("permiso_mesa_ayuda",permiso_usuario);
  }
  
  //Al finalizar sesión se borran las cookies y se redirige al Home de la página
  logout(){
    this.token="";
    this.tipo_usuario="";
    this.permiso_noticias = false;
    this.permiso_preguntas = false;
    this.permiso_mesa_ayuda = false;
    this.cookies.set("token",this.token);
    this.cookie_usuario.set("tipo_usuario",this.tipo_usuario);
    this.cookie_permiso_noticias.set("permiso_noticias", "");
    this.cookie_permiso_preguntas.set("permiso_preguntas", "");
    this.cookie_permiso_mesa_ayuda.set("permiso_mesa_ayuda", "");
    this.route.navigate(['/']);
    location.reload();
  }
}
