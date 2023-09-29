import { Injectable } from '@angular/core';
import { Noticia } from './noticia.model';
import { LoginService } from './login.service';
import { ServicioBackService } from './servicio-back.service';
import { BehaviorSubject, Observable } from 'rxjs';
//import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})

//rubio puto

export class NoticiasService {
  private noticias:Noticia[];
  //Variable que guarda si las noticias ya fueron cargadas en la pestaña o no.
  private noticiasCargadas:boolean;
  //Variable que guarda la pestaña actual del usuario
  private identificador:string;
  private noticia_tipo: number[];
  private cantNoticias: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private loginService:LoginService/*private http: HttpClient*/, private servicioBackService: ServicioBackService) {
    this.noticiasCargadas=false;
    this.identificador='';
    this.noticias=[];
    this.noticia_tipo = [];
  }
  /*
    Modificar de acuerdo a las noticias
    que se obtendran.
  */
  getNoticiasGenerales(usuario: string, cantidad: number, texto: string){
    //Pasar 1
    return new Promise<any>((resolve, reject) => {
      console.log(this.loginService.getToken(), usuario);
      this.servicioBackService.getNoticiasGenerales(usuario, this.loginService.getToken(), cantidad, texto).subscribe((data) => {
        resolve(data);
      })
    }).then((data) =>{
      /* for(const noticia of data.data.noticias){
        this.noticias.push(new Noticia(noticia.id, noticia.titulo, noticia.fecha, noticia.descripcion, noticia.archivo, noticia.likes, ''));
      } */
      this.noticias = data.data.noticias;
      console.log(this.noticias);
    });
  }
  getNoticiasUD(token:string, cantidad: number, texto: string){
    //Paso 2 o 3
    return new Promise<any>((resolve, reject) => {
      this.servicioBackService.getNoticiasUD(token, cantidad, texto).subscribe((data) => {
        resolve(data.data.noticias);
      });
    }).then((data) => {
      this.noticias = data;
    });    
  }
  getNoticiasInteres(token:string, cantidad: number, texto: string){
    return new Promise<any>((resolve, reject) => {
      this.servicioBackService.getNoticiasInteres(token, cantidad, texto).subscribe((data) => {
        resolve(data.data.noticias);
      });
    }).then((data) => {
      console.log(data);
      this.noticias = data;
    });
  }

  getAllNoticiasUD(texto: string, cantidad: number){
    return new Promise<any>((resolve, reject) => {
      console.log("cantidad: ", cantidad, "\ntexto: ", texto);
      if(texto != "" && cantidad != 0){
        this.servicioBackService.buscarAllNoticiasUD(cantidad, texto).subscribe(data => {
          console.log(data.data);
          resolve(data.data);
        })
      }
      this.servicioBackService.getAllNoticiasUD().subscribe((data) => {
        resolve(data.data);
      });
    }).then((data) => {
      this.noticias = data;
    });
  }
  getAllNoticiasInteres(texto: string, cantidad: number){
    return new Promise<any>((resolve, reject) => {
      if(texto != "" && cantidad != 0){
        this.servicioBackService.buscarAllNoticiasInteres(cantidad, texto).subscribe((data) => {
          resolve(data.data);
        });
      }
      this.servicioBackService.getAllNoticiasInteres().subscribe((data) => {
        resolve(data.data);
      });
    }).then((data) => {
      this.noticias = data;
    });
  }
  getIdentificador(){
    return this.identificador;
  }
  setIdentificador(identificador:string){
    this.identificador = identificador;
  }
  //Método que obtiene las noticias según la pestaña en la cual se encuentrá el usuario
  async getNoticias(usuario:string, identificador:string, permiso:string, texto: string, cantidad: number){
    /*
      if(identificador=="generales"){
        this.noticias=this.getNoticiasGenerales();
      }
      else if(identificador=="ud"){
        this.noticias=this.getNoticiasUD(usuario);
      }
      else if(identificador=="interes"{
        this.noticias=this.getNoticiasInteres(usuario);
      }
    */
      console.log("usuario: ", usuario, "\nidentificador: ", identificador, "\npermiso: ", "\ncantidad: ", cantidad, "\ntexto: ", texto);
    
    if(!this.noticiasCargadas){
      //this.noticiasCargadas=true;
      if(identificador=="Publico"){
        //En publico se traen las noticias de tipo publico
        
        await this.getNoticiasGenerales(this.loginService.getTipoUsuario(), cantidad, texto);
        
       
        /* this.noticias.push(this.noticia1);
        this.noticias.push(this.noticia2); */
      }
      
        /*
          Dependiendo de la pestaña traera unas noticias distintas al usuario
        */
      else if(identificador=="UD" && usuario != 'administrador'){
        await this.getNoticiasUD(this.loginService.getToken(), cantidad, texto);
      }
      else if(identificador=="Interes" && usuario != 'administrador'){
        await this.getNoticiasInteres(this.loginService.getToken(), cantidad, texto);
      }
      else if(identificador=="UD" && (usuario == 'administrador' || permiso == '1')){
        console.log("usuario: ", usuario, "\nidentificador: ", identificador, "\npermiso: ", "\ncantidad: ", cantidad, "\ntexto: ", texto);
        await this.getAllNoticiasUD(texto, cantidad);
      } 
      else if(identificador=="Interes" && (usuario == 'administrador' || permiso == '1')){
        await this.getAllNoticiasInteres(texto, cantidad);
      }
    }
    return this.noticias;
  }

  getCantidadNoticias(): Observable<any>{
    return this.cantNoticias.asObservable();
  }

  setCantidadNoticias(cantidad: number){
    this.cantNoticias.next(cantidad);
  }

  getNoticia_Tipo(noticia: Noticia): number[] {
    try{
    noticia.tipo_usuario.forEach(tipo => {
      switch(tipo){
        case "publico": {
          this.noticia_tipo.push(1);
          this.noticia_tipo.push(2);
          this.noticia_tipo.push(3);
          break;
        }
        case "profesor": this.noticia_tipo.push(2); break;
        case "estudiante": this.noticia_tipo.push(3); break;
        default: this.noticia_tipo = [];
      }
    });
    }catch(err){
      this.noticia_tipo.push(1);
      this.noticia_tipo.push(2);
      this.noticia_tipo.push(3);
    }
    return this.noticia_tipo;
  }

  //Método que retorna una notica, es utilizado cuando se quiere ver o editar una noticia
  getNoticia(id_noticia: number) {
    let noticia: Noticia | undefined; // Usamos el tipo 'Noticia | undefined' para permitir que la variable sea undefined en caso de no encontrar la noticia.
    for (let i = 0; i < this.noticias.length; i++) {
      if (id_noticia === this.noticias[i].id) {
        noticia = this.noticias[i];
        break; // Una vez que se encuentra la noticia, se sale del bucle.
      }
    }
    if (noticia === undefined) {
      // Si no se encontró la noticia, puedes manejar el caso de error aquí, ya sea lanzando una excepción o devolviendo un valor predeterminado.
      throw new Error('La noticia con el ID proporcionado no fue encontrada');
      // O, en lugar de lanzar una excepción, podrías devolver un valor predeterminado:
      // return null; // Si es seguro que 'Noticia' no puede ser null, puedes crear una noticia vacía con un constructor o utilizar 'undefined'.
    }
    console.log('id_noticia',id_noticia);
    return noticia;
  }
  
  //Pasar el archivo PDF al Backend
  /*enviarArchivo(archivo: File) {
    const formData = new FormData();
    formData.append('archivo', archivo);

    return this.http.post('URL_DEL_ENDPOINT', formData);
  }*/
  getNoticiasCargadas(){
    return this.noticiasCargadas;
  }
  setNoticiasCargadas(carga:boolean){
    this.noticiasCargadas=carga;
  }

  //Método para subir una noticia
  /*
    Tengo que verificar que la noticia se suba 
    al grupo de noticias correcto.
  */

  subirNoticia(titulo:string,fecha:string,descripcion:string,noticia_tipo:number[]){
    const form = {
      "titulo": titulo,
      "descripcion": descripcion,
      "noticiaTipo": noticia_tipo
    }

    console.log('form ', form);

    return this.servicioBackService.createNoticia(form);
  }
  editarNoticia(id_noticia:number, noticia:Noticia, noticia_tipo:number[]){
    for (let i = 0; i < this.noticias.length; i++) {
      if (id_noticia === this.noticias[i].id) {
        this.noticias[i] = noticia;
        break; // Una vez que se encuentra la noticia, se sale del bucle.
      }
    }
    console.log('categoría', noticia_tipo);
    const datos = {
      "noticia": noticia,
      "noticia_tipo": noticia_tipo
    }

    //For para insertar el tipo de noticia a la tabla de noticia
    for(let i=0; i<noticia_tipo.length;i++){
      console.log(noticia_tipo[i]+"-"+id_noticia);
    }
    this.getNoticias(this.loginService.getTipoUsuario(), this.identificador, this.loginService.getPermisoNoticias(), "", 0).then((data) => {
      this.noticias = data;
    });

    return this.servicioBackService.setNoticia(datos, id_noticia)    
  }
  eliminarNoticia(id_noticia:number){
    console.log("el id: ", id_noticia);
    this.servicioBackService.deleteNoticia(id_noticia).subscribe(data => {
      alert(data.mensaje);
    });

    for (let i = 0; i < this.noticias.length; i++) {
      if (id_noticia === this.noticias[i].id) {
        this.noticias.splice(i, 1);
        break; // Una vez que se encuentra la noticia, se sale del bucle.
      }
    }
  }

}

