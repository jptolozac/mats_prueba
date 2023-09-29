import { AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { NoticiasService } from '../noticias.service';
import { Noticia } from '../noticia.model';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { LoginService } from '../login.service';
import { PDFNoticiaComponent } from '../pdf-noticia/pdf-noticia.component';
import { ServicioBackService } from '../servicio-back.service';
@Component({
  selector: 'app-opciones-noticia',
  templateUrl: './opciones-noticia.component.html',
  styleUrls: ['./opciones-noticia.component.scss']
})
export class OpcionesNoticiaComponent implements OnInit,AfterViewInit{
  //Variable que desactiva o activa la edición de la informaciónd de la noticia
  //dependiendo de si el usuario seleciono la opción de "ver" o de "editar".
  desactivar:boolean;
  //Variable que guarda la noticia que el usuario vaya a ver o editar.
  noticia:Noticia;
  //Variables del checbox tipo de usuario
  todos:boolean;
  estudiantes: boolean;
  profesores: boolean;
  noticias:Noticia[];
  pagina:string;
  opciones: string[];

  public pdfUrl: string = `http://localhost:8000/api/v1/archivo/`;

  constructor(private route: Router, private routerURL: ActivatedRoute, private servicioNoticia: NoticiasService, private sanitizer: DomSanitizer, private loginService: LoginService, private servicioBackService: ServicioBackService){
    //Para borrar
    this.estudiantes=false;
    this.profesores=false;
    this.todos=false;
    this.opciones = [];
    //
    this.error = false;
  }
  //Varaible que guarda el ID de la noticia
  id_noticia:number;
  //Variable que guarda ver o editar dependiendo de la opción seleccionada
  private opcion:string;
  //Varible que guarda error si los datos que se envían están incompletos
  error:boolean;
  //Variable que guarda el titulo y descripción de la noticia
  titulo:string;
  descripcion:string;
  fecha:string;
  
  ngOnInit(){
    this.todos=false;
    this.estudiantes = false;
    this.profesores = false;
    console.log(this.opciones);
    this.routerURL.queryParams.subscribe(params => {
      this.opcion = params['opcion'];
      this.pagina= params['pagina'];
    });  
    this.id_noticia = parseInt(this.routerURL.snapshot.params['id']);
    if(this.opcion=="editar"){
      this.desactivar=false;
    }else if(this.opcion=="ver"){
      this.desactivar=true;
    }
    this.servicioNoticia.getNoticias(this.loginService.getTipoUsuario(),this.pagina, this.loginService.getTipoUsuario(), "", 0).then((data) => {
      this.noticias = data;

      this.noticia=this.servicioNoticia.getNoticia(this.id_noticia);
      console.log(this.noticia);
      //Para cargar los checkboxs
      const categorias=this.servicioNoticia.getNoticia_Tipo(this.noticia);
      if(this.opcion=="editar" && categorias.length>0){
        for(var i=0;i<categorias.length;i++){
          if(categorias[i]==1){
            this.todos=true;
            this.estudiantes = true;
            this.profesores = true;
            break;
          }
          if(categorias[i]==3){
            this.estudiantes=true;
          }
          if(categorias[i]==2){
            this.profesores=true;
          }
        }
      }
      
      
      this.titulo=this.noticia.titulo;
      this.descripcion=this.noticia.descripcion;
      this.fecha=this.noticia.fecha;
    });
  }

  getPDF(id: number): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.pdfUrl + id);
  }

  volver(){
    if(this.pagina=="Publico"){
      this.route.navigate(['/']);
    }
    else if(this.pagina=="UD"){
      this.route.navigate(['/Noticias_UD']);
    }
    else if(this.pagina="Interes"){
      this.route.navigate(['/Noticias_Interes']);
    }
  }
  getIdNoticia(){
    return this.id_noticia;
  }
  getOpcion(){
    return this.opcion;
  }
  //Método que guarda la información modificada
  guardar(){
    if(this.titulo.trim().length > 0 && this.descripcion.trim().length>0 && (this.todos!==false || this.estudiantes!==false || this.profesores!==false)){
      this.error=false;
      this.noticia.titulo=this.titulo;
      this.noticia.descripcion=this.descripcion;
      this.noticia.fecha=this.fecha;

      //Cambiar luego
      const categorias:number[]=[];
      if(this.todos==true){
        categorias[0]=1;
        /* categorias[1]=2;
        categorias[2]=3; */
      }
      if(this.estudiantes==true){
        categorias.push(3);
      }
      if(this.profesores==true){
        categorias.push(2);
      }  
      this.servicioNoticia.editarNoticia(this.noticia.id,this.noticia,categorias).subscribe(async (data) => {
        console.log(data);
        console.log('desde noticiaservice: ', this.noticia);
        location.reload();
        alert(data.mensaje);
      });
      this.guardarPDF();
      this.volver();
    }
    else{
      this.error=true;
    }
  }
  //Método usado para activar todos los checkbox en caso de que se seleccione la opción de "Todos"
  activar_todos(){

    if(this.todos==false){
      this.estudiantes=true;
      this.profesores=true;
      this.todos=true;
    }
    else{
      this.todos=false;
    }
  }
  

  /*
  Método que ajusta el tamaño del textarea que 
  contiene la descripción de la noticia para que sea
  igual de grande a está.
  */
  ngAfterViewInit(): void {
    this.adjustTextareaHeight();
  }
  adjustTextareaHeight() {

    const textareatitulo = document.getElementById('titulo') as HTMLTextAreaElement;
    textareatitulo.style.height = 'auto';
    textareatitulo.style.height = `${textareatitulo.scrollHeight}px`;

    const textarea = document.getElementById('descripcion') as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }

  @ViewChild('pdfComponent') pdfComponent!: PDFNoticiaComponent; // Obtener referencia al componente hijo

  guardarPDF() {
    // Verificar que el PDF esté cargado en el componente hijo antes de enviarlo al backend
    if (this.pdfComponent.selectedFile) {
      const pdfFile: File = this.pdfComponent.selectedFile;
      this.servicioBackService.setPDF(pdfFile, this.id_noticia);
      // Aquí puedes implementar la lógica para enviar el PDF al backend utilizando servicios o HTTP requests
      // Por ejemplo, puedes llamar a un método en el servicio que envíe el PDF al servidor
      // this.miServicio.enviarPDFAlBackend(pdfFile).subscribe(...);
    } else {
      // Manejo de error si el PDF no está cargado
      console.log('Error: No se ha seleccionado ningún archivo PDF.');
    }
  }

  enviarDatos(){
    
  }

}

