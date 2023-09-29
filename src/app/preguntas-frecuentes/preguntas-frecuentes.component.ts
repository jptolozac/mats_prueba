import { Component} from '@angular/core';
import { Categoria } from '../categoria.model';
import { PreguntasFrecuentesService } from '../preguntas-frecuentes.service';
import { Tarjeta } from '../tarjeta.model';
import { LoginService } from '../login.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-preguntas-frecuentes',
  templateUrl: './preguntas-frecuentes.component.html',
  styleUrls: ['./preguntas-frecuentes.component.scss']
})
export class PreguntasFrecuentesComponent {
  //Variable que almacena la busqueda que desea realizar el usuario
  txt_buscar:string;
  //Variable que guarda la cadena con el número de cheboxes activados
  txt_lista:string
  //Categorías guarda todas las categorías del sistema
  categorias:Categoria[];
  //Variable que guarda las tarjetas
  Tarjetas:Tarjeta[];
  //Ocultar o mostrar las opciones de la lista desplegable
  mostrarCheckboxes: boolean = false;
  //Ocualta o muestra la ventana emergente
  mostrarVentana:boolean;
  ventana_editar:boolean;
  ventana_subir:boolean;
  ventanaCat_subir:boolean;
  ventanaCat_editar:boolean;
  //Usuario guarda el tipo de usuario que inicio sesión
  usuario:string;
  permiso_usuario:string;
  totalCheckboxesActivos: number;
  checkboxesActivos: Categoria[];
  constructor(private preguntasService: PreguntasFrecuentesService, private loginService: LoginService){
    this.categorias = [];
    this.Tarjetas = []; 
    this.txt_buscar = "";
    this.txt_lista = "";
    this.mostrarVentana=false;
    this.ventana_editar=false;
    this.ventana_subir=false;
    this.usuario=this.loginService.getTipoUsuario();
    this.permiso_usuario=this.loginService.getPermisoPreguntas();
    this.totalCheckboxesActivos = 0;
    this.checkboxesActivos = [];
  }
  //Método para inicializar las variables.
  ngOnInit(): void {
    this.txt_lista="Seleccione las categorías";
    this.preguntasService.obtener_categorias().then((data) => {
      this.categorias = data;
      this.preguntasService.obtener_tarjetas(this.loginService.getTipoUsuario(), [], "").then(data => {
        this.Tarjetas = data;
      });
    });
    
  }
  //Método para buscar entre las tarjetas la que se adecue a lo ingresado por el usuario
  buscar(){
    this.checkboxesActivos= this.categorias.filter(categoria => categoria.seleccionado);
    this.totalCheckboxesActivos = this.checkboxesActivos.length;

    const categorias: number[] = [];
    for(const categoria of this.checkboxesActivos){
      categorias.push(categoria.id);
    }
    console.log(categorias, this.txt_buscar, this.loginService.getTipoUsuario());
    this.Tarjetas = this.preguntasService.buscar(categorias, this.txt_buscar, this.loginService.getTipoUsuario());

    if(this.totalCheckboxesActivos>0){
      //Si hay algún checkbox activo se busca tambien por la categoría
      for(var i=0; i<this.totalCheckboxesActivos; i++){
        //Envíar el id de la categoría y la cadena 
        if(this.txt_buscar.trim().length>0){
          console.log(this.checkboxesActivos[i].id+this.txt_buscar);
        }
        else{
          //buscar solo las categorías
        }
      }

    }
    else if(this.txt_buscar.trim().length>0){
      //Buscar solo por cadena de texto
    }
  }
  //Cada vez que se activa un checkbox se ejecuta el filtro
  activar() {
    this.checkboxesActivos = this.categorias.filter(categoria => categoria.seleccionado);

    for(const categoria of this.checkboxesActivos){
      console.log(categoria.nombre);
    }
    
    this.totalCheckboxesActivos = this.checkboxesActivos.length;
    if(this.totalCheckboxesActivos > 0) {
      this.txt_lista = `Categorías seleccionadas (${this.totalCheckboxesActivos})`;
    }
    else{
      this.txt_lista="Seleccione las categorías";
    }
  }
  //--------------------------Tarjetas------
  itemsPorPagina = 10; // Número de tarjetas a mostrar por página
  paginaActual = 1; // Página actual seleccionada

  // Método para obtener las tarjetas correspondientes a la página actual
  obtenerTarjetasPaginaActual():Tarjeta[] {
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;
    return this.Tarjetas.slice(inicio, fin);
  }
  // Método para obtener el número total de páginas
  get totalPaginas(): number {
  return Math.ceil(this.Tarjetas.length / this.itemsPorPagina);
  }

  // Método para obtener el arreglo de números de página para la paginación
  get paginas(): number[] {
  const paginas: number[] = [];
  for (let i = 1; i <= this.totalPaginas; i++) {
    paginas.push(i);
  }
  return paginas;
  }

  //Función para mostrar todos los checkboxs
  showCheckboxes() {
    this.mostrarCheckboxes = !this.mostrarCheckboxes;
  }
  // Función para truncar el texto a las primeras 100 palabras
  truncarTexto(texto: string, palabrasMaximas: number): string {
    const palabras = texto.split(' ');
    if (palabras.length <= palabrasMaximas) {
      return texto;
    } else {
      return palabras.slice(0, palabrasMaximas).join(' ') + '...';
    }
  }
  //
  Tarjeta:Tarjeta | null;
  CategoriasPorTarjeta:Categoria[];
  verMas(tarjetaId: number) {
    this.preguntasService.obtener_CategoriasPorTarjeta(tarjetaId).then(categorias => {
      this.CategoriasPorTarjeta = categorias;
      this.Tarjeta=this.preguntasService.ver_tarjeta(tarjetaId);
      this.mostrarVentana = true;
    });
  }
  //---------------------------------------LISTA DE CATEGORIAS--------------------
  /*ventanaCat_subir:boolean;
  ventanaCat_editar:boolean;*/
  error_categoria:boolean;
  nombre_cat:string;
  cat_CRUD:Categoria;
  editarCategoria(categoria:Categoria) {
    this.error_categoria=false;
    this.ventanaCat_editar=true;
    this.nombre_cat=categoria.nombre;
    this.cat_CRUD=categoria;
    // Lógica para editar la categoría en el componente padre
  }
  cerrarCat_Editar(){
    this.ventanaCat_editar=false;
  }
  eliminarCategoria(categoria: any) {
    this.error_categoria=false;
    Swal.fire({
      title: '¿Está seguro que quiere eliminar la categoría?',
      showConfirmButton:false,
      showCancelButton: true,
      showDenyButton:true,
      denyButtonText: 'Sí, eliminar',
      cancelButtonText:'Cancelar'
    }).then(async (result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isDenied) {
        //Invoca el método de editar y verifica si no hubo error
        await this.preguntasService.eliminar_categoria(categoria.id).then(error => {
          this.error_categoria = error;
        });
        if(this.error_categoria==false){
          //Se recargan las tarjetas de nuevo
          Swal.fire('La categoría se ha eliminado!', '', 'success')
        }
        else{
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ha ocurrido un error al eliminar la categoría',
          })
        }
      }
    })
  }
  subirCategoria() {
    this.error_categoria=false;
    this.ventanaCat_subir=true;
    this.nombre_cat="";
    // Lógica para subir una nueva categoría en el componente padre
  }
  agregar_cat(){
    this.error_categoria=false;
    if(this.nombre_cat.trim().length>0){
      Swal.fire({
        title: '¿Está seguro que desea subir la categoría?',
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Confimar',
        cancelButtonText:'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.error_categoria=this.preguntasService.subir_categoria(this.nombre_cat);
          if(this.error_categoria==false) {
            Swal.fire('Se ha subido correctamente la categoria!', '', 'success')
            this.ventanaCat_subir=false;
            this.preguntasService.obtener_categorias().then((data) => {
              this.categorias = data;
            });
          }
          else{
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Ha ocurrido un error al subir la categoria',
            })
          }
        }
      })
    }
    else{
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Por favor, verifique que la información ingresada sea la adecuada',
      })
      this.error_categoria=true;
    }
  }
  editar_cat(){
    this.error_categoria=false;
    if(this.nombre_cat.trim().length>0){
      Swal.fire({
        title: '¿Está seguro que quiere guardar los cambios?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        denyButtonText: `No guardar`,
        cancelButtonText:'Cancelar'
      }).then(async (result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          //Invoca el método de editar y verifica si no hubo error
          this.preguntasService.editar_categoria(this.cat_CRUD.id, this.nombre_cat).then(error => {
            this.error_categoria = error;
          });

          if(this.error_categoria==false){
            Swal.fire('Los cambios han sido guardados!', '', 'success')
            //Se recargan las tarjetas de nuevo
            await this.preguntasService.obtener_categorias().then(data => {
              this.categorias = data;
              this.ventanaCat_editar=false;
            });
          }
          else{
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Ha ocurrido un error al guardar los cambios',
            })
          }  
        } else if (result.isDenied) {
          Swal.fire('Los cambios no han sido guardados', '', 'info')
        }
      })
    }
    else{
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Por favor, verifique que la información ingresada sea la adecuada',
      })
      this.error_categoria=true;
    }
  }
  cerrarCat_Subir(){
    this.ventanaCat_subir=false;
  }


  //---------------------------------------SUBIR TARJETA--------------------
  titulo_subir:string;
  txt_subir:string;
  categorias_subir:Categoria[];
  descripcion_subir:string;
  estudiantes_subir:boolean=false;
  profesores_subir:boolean=false;
  error_subir:boolean=false;
  subir_tarjeta():void{
    this.preguntasService.obtener_categorias().then(data => {
      this.categorias_subir = data;
      this.txt_subir="Seleccione las categorías";
      this.titulo_subir="";
      this.descripcion_subir="";
      this.estudiantes_subir=false;
      this.profesores_subir=false;
      this.ventana_subir=true;
    });
  }
  agregar(){
    let id_usuario:number[]=[];
    if(this.profesores_subir){
      id_usuario.push(2);
    }
    if(this.estudiantes_subir){
      id_usuario.push(3);
    }
    if(this.titulo_subir.trim().length > 0 && this.descripcion_subir.trim().length > 0 && this.categorias_subir.length>0 && id_usuario.length>0) {
      Swal.fire({
        title: '¿Está seguro que desea subir la pregunta frecuente?',
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Confirmar',
        cancelButtonText:'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.preguntasService.subir_tarjeta(this.titulo_subir,this.descripcion_subir,id_usuario,this.categorias_subir).then(data =>{
            this.error_subir = data;
            if(this.error_subir==false) {
              Swal.fire('Se ha creado la pregunta frecuente!', '', 'success')
              //Se recargan las tarjetas de nuevo
              this.preguntasService.obtener_tarjetas(this.loginService.getTipoUsuario(), [], "").then(data => {
                this.Tarjetas = data;
              });
              this.ventana_subir=false; 
              this.permiso_usuario = 'false';
            }else{
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Por favor, verifique que la información ingresada sea la adecuada',
              })
            } 
          });
        }
      })  
    }
    else{
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Por favor, verifique que la información ingresada sea la adecuada',
      })
      this.error_subir=true;
    }
  }
  activar_subir(){
    this.checkboxesActivos = this.categorias_subir.filter(categoria => categoria.seleccionado);
    this.totalCheckboxesActivos = this.checkboxesActivos.length;
    if(this.totalCheckboxesActivos > 0) {
      this.txt_subir = `Categorías seleccionadas (${this.totalCheckboxesActivos})`;
    }
    else{
      this.txt_subir="Seleccione las categorías";
    }
  } 

  //---------------------------------------EDITAR TARJETA--------------------
  tarjetaID:number;
  titulo:string;
  txt_editar:string;
  categoria_editar:Categoria[];
  descripcion:string;
  estudiantes:boolean=false;
  profesores:boolean=false;
  error_editar:boolean=false;
  editar(tarjetaId: number) {
    this.profesores = false;
    this.estudiantes = false;
    this.tarjetaID=tarjetaId;
    /Primero verifica los usuarios a los que pertenece la tarjeta/
    let id_tipo:number[]=[];
    this.preguntasService.getID_usuario_Tarjeta(tarjetaId).then(data => {
      id_tipo = data;
      console.log("data = ", id_tipo);
      for(const tipo of id_tipo){
        if(tipo == 2){
          this.profesores=true;
        }else if(tipo == 3){
          this.estudiantes=true;
        }
      }
    });

    this.preguntasService.obtener_categorias().then(data => {
      this.categoria_editar = data;  
      let cat: Categoria[] = [];
      this.preguntasService.obtener_CategoriasPorTarjeta(tarjetaId).then(categorias => {
        cat = categorias;
        for(var i=0;i<this.categoria_editar.length;i++){
          for(var j=0;j<cat.length;j++){
            if(this.categoria_editar[i].id==cat[j].id){
              this.categoria_editar[i].seleccionado=true;
              break;
            }
          }  
        }
        this.checkboxesActivos = this.categoria_editar.filter(categoria => categoria.seleccionado);
        this.totalCheckboxesActivos = this.checkboxesActivos.length;
        this.txt_editar = `Categorías seleccionadas (${this.totalCheckboxesActivos})`;

        this.Tarjeta = this.preguntasService.ver_tarjeta(tarjetaId);
        if (this.Tarjeta) {
          this.titulo = this.Tarjeta.titulo;
          this.descripcion = this.Tarjeta.descripcion;
        }

        this.ventana_editar = true;
      });
    });
    
  }
  activar_editar(){
    this.checkboxesActivos = this.categoria_editar.filter(categoria => categoria.seleccionado);
    this.totalCheckboxesActivos = this.checkboxesActivos.length;
    if(this.totalCheckboxesActivos > 0) {
      this.txt_editar = `Categorías seleccionadas (${this.totalCheckboxesActivos})`;
    }
    else{
      this.txt_editar="Seleccione las categorías";
    }
  }
  //Verifica y guarda los cambios de la tarjeta
  guardar(){
    let id_usuario:number[]=[];
    if(this.profesores){
      id_usuario[0]=2;
    }
    if(this.estudiantes){
      id_usuario[1]=3
    }
    if(this.titulo.trim().length > 0 && this.descripcion.trim().length > 0 && this.categoria_editar.length>0 && id_usuario.length>0) {
      //Verificar si la información ta bien
      this.error_editar=false;
      if(this.error_editar==false){
        Swal.fire({
          title: '¿Está seguro que quiere guardar los cambios?',
          showDenyButton: true,
          showCancelButton: true,
          confirmButtonText: 'Guardar',
          denyButtonText: `No guardar`,
          cancelButtonText:'Cancelar'
        }).then(async (result) => {       //<====================== AQUI HAY UNA FUNCUIÓN ASÍNCRONAAAA
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
            //Invoca el método de editar y verifica si no hubo error
            await this.preguntasService.editar_tarjeta(this.tarjetaID,this.titulo,this.descripcion,id_usuario,this.categoria_editar).then(error => {
              this.error_editar = error;
            });
              if(this.error_editar==false){
                Swal.fire('Los cambios han sido guardados!', '', 'success')
                //Se recargan las tarjetas de nuevo
                await this.preguntasService.obtener_categorias().then(async (data) => {
                  this.categorias = data;
                  await this.preguntasService.obtener_tarjetas(this.loginService.getTipoUsuario(), [], "").then(data => {
                    this.Tarjetas = data;
                  });
                  this.ventana_editar=false;
                });
            }
            else{
              Swal.fire({
                icon: 'error',
                title: 'Oops...No se ha podido guardar la información',
                text: 'Por favor, verifique que la información ingresada sea la adecuada',
              })
            }  
          } else if (result.isDenied) {
            Swal.fire('Los cambios no han sido guardados', '', 'info')
          }
        })
      }
      else{
        Swal.fire({
          icon: 'error',
          title: 'Oops...No se ha podido guardar la información',
          text: 'Por favor, verifique que la información ingresada sea la adecuada',
        })
        this.error_editar=true;
      }
      
    }
    else{
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Por favor, verifique que la información ingresada sea la adecuada',
      })
      this.error_editar=true;
    }
  }
  //---------------------------------------ELIMINAR TARJETA--------------------
  eliminar(id_tarjeta:number){
    let error_eliminar:boolean = false;
    Swal.fire({
      title: '¿Está seguro que quiere eliminar la pregunta frecuente?',
      showConfirmButton:false,
      showCancelButton: true,
      showDenyButton:true,
      denyButtonText: 'Sí,eliminar',
      cancelButtonText:'Cancelar'
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isDenied) {
        //Invoca el método de editar y verifica si no hubo error
        error_eliminar=this.preguntasService.eliminar_tarjeta(id_tarjeta);
        if(error_eliminar==false){
          //Se recargan las tarjetas de nuevo
          Swal.fire('La tarjeta se ha eliminado!', '', 'success')
        }
        else{
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ha ocurrido un error al eliminar la tarjeta',
          })
        }
        
      }
    })
  }

  //--------------------------------------------------------------------------
  calculateRows(texto: string): number {
    // Calcula el número de líneas dividiendo la longitud del texto por el ancho máximo de una línea
    const maxCharactersPerLine = 50; // Ajusta este valor según el ancho máximo deseado
    const numberOfLines = Math.ceil(texto.length / maxCharactersPerLine);

    // Devuelve el número de líneas como valor para el atributo rows del <textarea>
    return Math.max(3, numberOfLines-5); // Establece un mínimo de 3 líneas para evitar que sea muy pequeño
  }

  cerrarMas() {
    this.mostrarVentana= false;
  }
  cerrarEditar(){
    this.ventana_editar=false;

  }
  cerrarSubir(){
    this.ventana_subir=false;
  }
}