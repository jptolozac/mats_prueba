import { Component, ViewChild} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NoticiasService } from '../noticias.service';
import { PDFNoticiaComponent } from '../pdf-noticia/pdf-noticia.component';
import { ServicioBackService } from '../servicio-back.service';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-subir-noticia',
  templateUrl: './subir-noticia.component.html',
  styleUrls: ['./subir-noticia.component.scss']
})
export class SubirNoticiaComponent{
  //Variables del checbox tipo de usuario
  todos:boolean;
  estudiantes: boolean;
  profesores: boolean;
  pagina:string;

  //Variable que guarda el titulo de la noticia
  titulo:string;
  descripcion:string;

  //Variable que guarda
  error:boolean;
  constructor(private router: Router,private servicioNoticia:NoticiasService, private routerURL: ActivatedRoute, private servicioBackService: ServicioBackService, private loginService: LoginService){
    this.estudiantes=false;
    this.profesores=false;
    this.todos=false;
    this.titulo="";
    this.descripcion="";
    this.error=false;
    this.routerURL.queryParams.subscribe(params => {
      this.pagina= params['pagina'];
    });
  }
  //Método usado para activar todos los checkbox en caso de que se seleccione la opción de "Todos"
  activar_todos(){
    if(this.todos==false){
      this.estudiantes=true;
      this.profesores=true;
      this.todos=true;
    }
    else{
      this.estudiantes=false;
      this.profesores=false;
      this.todos=false;
    }
  }
  getFecha(){
    const fecha = new Date();
    return fecha.toISOString().substr(0, 10); // Convertir la fecha en un formato válido para el input de tipo "date"
  }
  /*
    Invocar el método de subir noticia por cada tipo de usuario
  */
  subir_noticia(){
      if(this.titulo.length > 0 && this.descripcion.length>0 && (this.todos!==false || this.estudiantes!==false || this.profesores!==false)){
        this.error=false;
        let fecha:string;
        fecha=this.getFecha();
        const categorias:number[]=[];
        if(this.todos==true){
          categorias[0]=1;
          categorias[1]=2;
          categorias[2]=3;
        }
        else{
          if(this.estudiantes==true){
            categorias.push(3);
          }
          if(this.profesores==true){
            categorias.push(2);
          }  
        }
        this.servicioNoticia.subirNoticia(this.titulo,fecha,this.descripcion,categorias).subscribe((data: any) => {
          console.log(data);
          this.guardarPDF(data.noticia.id);
          this.volver();
        });
        this.servicioBackService.quitarPermisosNoticias(this.loginService.getIdUsuario()).subscribe(data => {
          console.log(data);
        });
        this.loginService.setPermisoNoticias('false');
      }
      else{
        this.error=true;
      }
  }

  @ViewChild('pdfComponent') pdfComponent!: PDFNoticiaComponent; // Obtener referencia al componente hijo

  guardarPDF(id_noticia: number) {
    if (this.pdfComponent.selectedFile) {
      const pdfFile: File = this.pdfComponent.selectedFile;
      this.servicioBackService.setPDF(pdfFile, id_noticia);
    } else {
      console.log('Error: No se ha seleccionado ningún archivo PDF.');
    }
  }

  //Méotodo que enruta devuelta a noticias_generales
  volver(){
    if(this.pagina=="Publico"){
      this.router.navigate(['/']);
    }
    else if(this.pagina=="UD"){
      this.router.navigate(['/Noticias_UD']);
    }
    else if(this.pagina="Interes"){
      this.router.navigate(['/Noticias_Interes']);
    }
  }
  
}
