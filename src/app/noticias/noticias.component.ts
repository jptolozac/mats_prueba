import { Component, Input, OnInit} from '@angular/core';
import { LoginService } from '../login.service';
import { Noticia } from '../noticia.model';
import { NoticiasService } from '../noticias.service';
import { Router } from '@angular/router';
import { NavigationExtras } from '@angular/router';
import { ServicioBackService } from '../servicio-back.service';
@Component({
  selector: 'app-noticias',
  templateUrl: './noticias.component.html',
  styleUrls: ['./noticias.component.scss']
})
export class NoticiasComponent implements OnInit{

  //Variable que guardan la ruta de la imagen
  private imagenActual:string;
  private imagenNueva:string;
  private imagenOriginal:string;
  //Vector que guarda el tipo de imagen según la opción
  private imagenes: string[];
  //Vector que guarda todas las noticias que se retornen según la pestaña actual y tipo de usuario
  private noticias:Noticia[];
  //Según su componente padre trae la pestaña en la cual se encuentra, para traer las noticias de esa pestaña
  /*@Input()*/ identificador:string;
  //Variable que guarda el número de la pagina en la cual se encuentra el usuario
  private num_pag:string;
  //Variable que guarda el número de noticias
  private cantidad_noticias:number;
  //Variables que representan el rango que las noticias que se mostraran, ej inicio=1, fin=10, mostrará 
  //solo las primeras 10 noticias de las 50 existentes.
  private inicio:number;
  private fin:number;
  
  
  //Palancas que activas las opciones de paginacións según el número de páginas.
  activar1: boolean;
  activar2: boolean;
  activar3: boolean;
  activar4: boolean;
  activar5: boolean;
  //Variable que guarda el tipo de usuario
  private usuario:string;

  //Variables para borrar
  texto:string;

  //Variables para no borrar (IMPORTANTES)
  permiso_usuario: string;
  token: string;
  id_usuario: string;
  cantNoticias: number;


  /*Método constructor
    Variables:
  -LoginService: Se usa para acceder al tipo de usuario, con el fin de saber las 
  noticias del mismo.
  -servicioNoticias: Se usa para obtener las noticias según el tipo de usuario.
  -router: Se usa para redireccionar la página de acuerdo a las opciones de las noticias
  */
  constructor(private loginService:LoginService, private servicioNoticias:NoticiasService, private router:Router, private servicioBackService: ServicioBackService){
    this.imagenActual = '';
    this.imagenNueva = '';
    this.imagenOriginal = '';
    this.identificador='';
    this.num_pag='';
    this.usuario=='';
    this.permiso_usuario=='';
    this.token=='';
    this.id_usuario=='';

    this.cantidad_noticias=0;
    this.inicio=0;
    this.fin=0;

    //Vaciar los arreglos cada vez que se cargue la página.
    this.imagenes=[];
    this.noticias=[];

    this.activar1=false;
    this.activar2=false;
    this.activar3=false;
    this.activar4=false;
    this.activar5=false;

  }
  //Método usado para inicializar las variables.
  ngOnInit(): void {
    
    this.setTipoUsuario(this.loginService.getTipoUsuario());
    //Se inicializa las URL de las imagenes.
    this.imagenActual = '../../assets/images/estrella.png';
    this.imagenNueva = '../../assets/images/estrella_activa.png';
    this.imagenOriginal = '../../assets/images/estrella.png';
    this.permiso_usuario = this.loginService.getPermisoNoticias();
    this.token = this.loginService.getToken();
    this.id_usuario = this.loginService.getIdUsuario();
    

    this.identificador=this.servicioNoticias.getIdentificador();
    this.servicioNoticias.getNoticias(this.getTipoUsuario(),this.identificador, this.permiso_usuario, this.texto, this.getCantidadNoticias()).then((data) =>{
      this.noticias = data;
      
      //Carga inicial de la cantidad de noticias, si es menor a 50 ese será el tamaño, sino el tamaño será 50
      if(this.noticias.length<=50){
        this.cantidad_noticias=this.noticias.length;
      }
      else{
        this.setCantidadNoticias('50');
      }
      this.cargarImagenes(/*this.noticias*/);
      this.cargarPaginacion();

      //Inicialización de los rangos de las noticias que se mostraran. Así como del número de página.
      this.setInicio(0);
      if(this.cantidad_noticias<=9){
        this.setFin(this.cantidad_noticias);
      }
      else{
        this.setFin(9);
      }
      this.setPagina('1');

      console.log(this.noticias);

      this.servicioNoticias.setCantidadNoticias(this.noticias.length);
    });
    

    
    
  }

  //Método para realizar la busqueda
  buscar(texto: string){
    /*Cambiar el arreglo de 'noticias'
      de a cuerdo al resultado obtenido
      por la busqueda.
      También se deberá cambiar el arreglo con las imagenes
      Y se deberá cargar la paginación
    */
    this.servicioNoticias.getNoticias(this.getTipoUsuario(), this.identificador, this.permiso_usuario, texto, this.getCantidadNoticias()).then(data => {
      //console.log("data: ", this.getTipoUsuario(),this.identificador, this.permiso_usuario, texto, this.getCantidadNoticias());
      this.noticias = data;
      console.log(this.getCantidadNoticias(), texto);
      this.texto = texto;
    })
  }

  /*
  Según la posición retorna la imágen para esa noticia
  */
  getImagenActual(indice: number): string {
    /*Solo se retornaria la imagen, el arreglo ya debería contar con las imagenes adecuadas
    this.imagenes[indice];
    */
    if (this.imagenes[indice]) {
      return this.imagenes[indice];
    } else {
      return this.imagenActual;
    }
  }

  /*Se obtiene la ruta de la imagen actual para cada botón
    Si el elemento está en el arreglo de imagenes se devuelve su valor, si no la imagen base.
  */
  apoyar(indice: number, id_noticia: number) {
    //console.log(id_noticia);
    if (this.imagenes[indice] === this.imagenOriginal) {
      this.imagenes[indice] = this.imagenNueva;
      this.servicioBackService.Apoyo(this.id_usuario, id_noticia).subscribe((data) => {
        console.log(data);
      });
      /*
        Además, se deberá agregar el método de apoyar del servicio, para sumar +1 a los likes de la noticia
      */
    } else {
      this.servicioBackService.DesApoyo(this.id_usuario, id_noticia).subscribe((data) => {
        console.log(data);
      });
      this.imagenes[indice] = this.imagenOriginal;
    }
  }

  /*
    Método que carga el vector de imágenes según el apoyo a las noticias del usuario
  */
  cargarImagenes(){
    for (let i = 0; i < this.noticias.length; i++) {
      console.log(this.noticias[i].apoyado);
      if(this.noticias[i].apoyado == true){
        this.imagenes[i]=this.imagenNueva;
      }
      else{
        this.imagenes[i]=this.imagenOriginal;
      }
    }
  }

  /*
    Retorna las noticias
    1. Se busca las noticias adecuadas
    2. Se cargan las imagenes por noticias
    3. Se realiza la paginación
  */
  getNoticias(){
    return this.noticias;
  }
  /*
    Envía noticias al vector
  */
  setNoticias(noticias:Noticia[]){
    this.noticias=noticias;
  }
  //Retorna el número de la pagina en la cual se encuentra el usuario
  getPagina(){
    return this.num_pag;
  }
  //Asigna el número de la pagina según el parametro de entrada
  setPagina(pagina:string){
    this.num_pag=pagina;
  }
  //Retorna la cantidad de noticias seleccionadas en la lista desplegable
  getCantidadNoticias(){
    return this.cantidad_noticias;
  }
  //El número que se seleccione en la lista desplegable será la cantida de noticias que se mostrarán.
  setCantidadNoticias(tam:string):void{
    //Modificar, dado que nunca llega a NULL
    if(tam!="null"){
      this.cantidad_noticias =parseInt(tam);
      this.cargarPaginacion();
    }
  }
  //Métodos que modifican o retornan el rango de noticias que se motraran.
  setInicio(inicio:number){
    this.inicio =inicio;
  }
  getInicio(){
    return this.inicio;
  }
  setFin(fin:number){
    this.fin=fin;
  }
  getFin(){
    return this.fin;
  }
  //Método que carga la paginación según la cantidad de noticias seleccionada
  cargarPaginacion(){
    if(this.getCantidadNoticias()>=0 && this.getCantidadNoticias()<=10 || this.getCantidadNoticias()>=10){
      this.activar1=true;
    }
    else{
      this.activar1=false;
    }
    if(this.getCantidadNoticias()>10 && this.getCantidadNoticias()<=20 || this.getCantidadNoticias()>=20){
      this.activar2=true;
    }
    else{
      this.activar2=false;
    }
    if(this.getCantidadNoticias()>20 && this.getCantidadNoticias()<=30 || this.getCantidadNoticias()>=30){
      this.activar3=true;
    }
    else{
      this.activar3=false;
    }
    if(this.getCantidadNoticias()>30 && this.getCantidadNoticias()<=40 || this.getCantidadNoticias()>=40){
      this.activar4=true;
    }
    else{
      this.activar4=false;
    }
    if(this.getCantidadNoticias()>40 && this.getCantidadNoticias()<=50){
      this.activar5=true;
    }
    else{
      this.activar5=false;
    }
  }
  //Método que marca los rangos que las noticias que se mostraran
  //según el número de noticias y la página en la que se encuentra el usuario.
  paginacion(pagina:number){
    switch(pagina){
      case 1:
        this.setInicio(0);
        if(this.getCantidadNoticias()<=9){
          this.setFin(this.getCantidadNoticias());
        }
        else{
          this.setFin(9);
        }
        this.setPagina('1');
        break;
      case 2:
        this.setInicio(10);
        if(this.getCantidadNoticias()<=19){
          this.setFin(this.getCantidadNoticias());
        }
        else{
          this.setFin(19);
        }
        this.setPagina('2');
        break;
      case 3:
        this.setInicio(20);
        if(this.getCantidadNoticias()<=29){
          this.setFin(this.getCantidadNoticias());
        }
        else{
          this.setFin(29);
        }
        this.setPagina('3');
        break;
      case 4:
        this.setInicio(30);
        if(this.getCantidadNoticias()<=39){
          this.setFin(this.getCantidadNoticias());
        }
        else{
          this.setFin(39);
        }
        this.setPagina('4');
        break;
      case 5:
        this.setInicio(40);
        if(this.getCantidadNoticias()<=49){
          this.setFin(this.getCantidadNoticias());
        }
        else{
          this.setFin(49);
        }
        this.setPagina('5');
        break;
      default:
        this.setInicio(0);
        if(this.getCantidadNoticias()<=9){
          this.setFin(this.getCantidadNoticias());
        }
        else{
          this.setFin(9);
        }
        this.setPagina('1');
        break;
    }
  }
  //Retorna el tipo de usuario, sirve para determinar si se muestran las opciones de administrador o no.
  getTipoUsuario(){
    return this.usuario;
  }
  setTipoUsuario(usuario:string){
    this.usuario = usuario;
  }
  //Método que redirecciona para ver la noticia, enviando el ID por la URL
  opcionNoticia(id:number, opcion: string) {
    const queryParams: NavigationExtras = {
      queryParams: { opcion: opcion, pagina: this.servicioNoticias.getIdentificador() }
    };
    this.router.navigate(['/noticia', id], queryParams);
  }
  //Método que recorta la descripción para que solo aparezcan las primeras 100 palabras 
  Descripcion(des:string): string{
    let maxPalabras=100;
    let descripcionCompleta=des;
    const palabras = descripcionCompleta.split(' ');
    if (palabras.length > maxPalabras) {
      return palabras.slice(0,maxPalabras).join(' ') + '...';
    }
    return descripcionCompleta;
  }
  eliminar(id_noticia:number){
    this.servicioNoticias.eliminarNoticia(id_noticia);
    this.cargarImagenes(/*this.noticias*/);
    this.cargarPaginacion();
    this.cantidad_noticias=this.noticias.length;
  }

}