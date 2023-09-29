import { Injectable } from '@angular/core';
import { Categoria } from './categoria.model';
import { Tarjeta } from './tarjeta.model';
import { ServicioBackService } from './servicio-back.service';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class PreguntasFrecuentesService {
  private categorias: Categoria[];
  private tarjetas: Tarjeta[];
  private error_CRUD:boolean;
  constructor(private servicioBackService: ServicioBackService, private loginService: LoginService) {
    this.categorias = [];
    this.tarjetas = [];
    this.error_CRUD = false;
  }
  //Método que obtiene todas las categorías
  async obtener_categorias(){
    //Para borrar - Datos de prueba
    this.categorias = [];
    await this.servicioBackService.getCategorias().subscribe(categorias => {
      for(const categoria of categorias.data){
        this.categorias.push(new Categoria(categoria.id, categoria.nombre));
      }
      console.log(categorias);
    });
    
    
    
    /* this.categorias = [
      new Categoria(1, 'Matemáticas'),
      new Categoria(2, 'Física'),
      new Categoria(3, 'Química'),
      new Categoria(4, 'Biología'),
      new Categoria(5, 'Historia'),
      new Categoria(6, 'Literatura'),
      new Categoria(7, 'Geografía'),
      new Categoria(8, 'Inglés'),
      new Categoria(9, 'Informática'),
      new Categoria(10, 'Arte')
    ]; */
    return this.categorias;
  }
  //Trae todas las tarjetas de preguntas frecuentes
  obtener_tarjetas(tipoUsuario: string, categorias: number[], busqueda: string){
    this.tarjetas = [];
    this.tarjetas = [
      //new Tarjeta(100, 'Prueba', 'Prueba edición'),
      new Tarjeta(0, 'Un dato totalmente innecesario xxx', 'Bootstrap no aplica bordes directamente a las filas (row). Las filas de Bootstrap son contenedores que ayudan a organizar y distribuir el contenido en columnas. Por defecto, las filas no tienen bordes visibles.Si estás viendo un borde en una fila, es probable que esté siendo causado por algún otro estilo personalizado o regla CSS en tu código. Puedes inspeccionar el elemento en tu navegador web para identificar qué regla CSS está aplicando el borde.Para quitar un borde que esté afectando la fila, puedes hacer lo siguienteVerifica si tienes alguna clase personalizada o regla CSS aplicada a la fila que esté causando el borde no deseado. Si encuentras alguna, puedes ajustar o eliminar esa regla para eliminar el borde.')
    ];
    return new Promise<any>((resolve) => {
      this.servicioBackService.getPreguntas(tipoUsuario, categorias, busqueda).subscribe(preguntas => {
        console.log(this.loginService.getTipoUsuario(), preguntas);
        resolve(preguntas);
      });
    }).then(preguntas => new Promise<any>((resolve) => {
      console.log(preguntas);
      for(const pregunta of preguntas){
        this.tarjetas.push(new Tarjeta(pregunta.id, pregunta.titulo, pregunta.descripcion));
      }
      console.log(this.tarjetas);
      resolve(this.tarjetas);
    }));
    //return this.tarjetas;
  }
  //Método que trae las categorías por cada tarjeta
  obtener_CategoriasPorTarjeta(id_tarjeta:number){
    let categorias:Categoria[] = [];
    /*
      Aquí se invocaría una consulta la cual traiga las categorías por cada tarjeta
    */
    if(id_tarjeta == 0){
      categorias = [
        new Categoria(1, 'Matemáticas'),
        new Categoria(5, 'Historia'),
        new Categoria(10, 'Arte')
      ];
      return new Promise<Categoria[]>(resolve => {
        resolve(categorias);
      });
    }

    return new Promise<Categoria[]>((resolve) => {
      this.servicioBackService.getCategoriasTarjeta(id_tarjeta)
            .subscribe(data => resolve(data.data));
    }).then(data => new Promise<Categoria[]>((resolve) => {
      for(const categoria of data){
        categorias.push(new Categoria(categoria.id, categoria.nombre));
      }
      resolve(categorias);
    }));
    
    
    /*
    else{
      categorias = [
        new Categoria(5, 'Historia'),
        new Categoria(6, 'Literatura'),
        new Categoria(7, 'Geografía'),
        new Categoria(8, 'Inglés'),
        new Categoria(9, 'Informática'),
        new Categoria(10, 'Arte')
      ];

    }
    return categorias; */
  }
  //Método que obtiene los id de los tipo de usuario que podran ver la tarjeta
  getID_usuario_Tarjeta(id_tarjeta:number):Promise<number[]>{
    let id_tipo:number[]=[];

    /* if(id_tarjeta==1){
      id_tipo[0]=2;
      id_tipo[1]=3;
    }
    else{
      id_tipo[0]=2;
    } */
    return new Promise<number[]>((resolve, reject)=> {
      this.servicioBackService.buscarTiposUsuario_Tarjeta(id_tarjeta).subscribe(data => {
        id_tipo = data;
        resolve(id_tipo);
      });
    });
  }
  //Función que retorna una tarjeta según su ID
  ver_tarjeta(id_tarjeta: number): Tarjeta | null {
    let tarjeta: Tarjeta | null = null;
    for (let i = 0; i < this.tarjetas.length; i++) {
      if (id_tarjeta === this.tarjetas[i].id_tarjeta) {
        tarjeta = this.tarjetas[i];
        break;
      }
    }
    return tarjeta;
  }
  //Metodos que retornan si hubo un error al realizar alguna función CRUD
  setError(error:boolean):void{
    this.error_CRUD=error;
  }
  getError():boolean{
    return this.error_CRUD;
  }
  
  subir_tarjeta(titulo:string,descripcion:string,id_usuario:number[], categorias:Categoria[]):Promise<boolean>{
    //Se filtra para saber cuales categorias fueron seleccionadas
    const listaCategorias = categorias.filter(categoria => categoria.seleccionado);
    let categoriasID: number[] = []
    for(const categoria of listaCategorias){
      categoriasID.push(categoria.id);
    }

    return new Promise<boolean>((resolve, reject) => {
      this.servicioBackService.crearTarjeta(titulo,descripcion,id_usuario, categoriasID).subscribe(data => {
        console.log(data);
        this.setError(false);
        this.servicioBackService.quitarPermisosPreguntas(this.loginService.getIdUsuario()).subscribe(data => {
          console.log(data);
        });
        this.loginService.setPermisoPreguntas('false');
        resolve(this.getError());
      });
    });

    /* console.log("Titulo",titulo);
    console.log("Descripción",descripcion);
    console.log("Id_usuario",id_usuario);
    console.log("Categoria",categoriasID);
    this.setError(false);
    return this.getError(); */
  }
  //Edita una tarjeta según los datos recibidos
  //Enviar un error igual a TRUE en caso de que ocurra algo inesperado.
  editar_tarjeta(id_tarjeta:number,titulo:string,descripcion:string,id_usuario:number[], categorias:Categoria[]):Promise<boolean>{
    //Se filtra para saber cuales categorias fueron seleccionadas
    const listaCategorias = categorias.filter(categoria => categoria.seleccionado);
    let categoriasID: number[] = []
    for(const categoria of listaCategorias){
      categoriasID.push(categoria.id);
    }

    return new Promise<boolean>((resolve, reject) => {
      this.servicioBackService.editarTarjeta(id_tarjeta,titulo,descripcion,id_usuario, categoriasID).subscribe(data => {
        console.log(data);
        this.setError(false);
        resolve(this.getError());
      });
    });
  }
  //Eliminar tarjeta según el ID seleccionado
  eliminar_tarjeta(id_tarjeta:number):boolean {
    console.log("Id de la tarjeta a eliminar: " + id_tarjeta);
    for(var i = 0; i < this.tarjetas.length; i++) {
      if(this.tarjetas[i].id_tarjeta==id_tarjeta){
        this.tarjetas.splice(i, 1);
        this.setError(false);
        break;
      }
      else{
        this.setError(true);
      }
    }  

    this.servicioBackService.deleteTarjeta(id_tarjeta).subscribe(data => {
      console.log(data);
    });

    return this.getError();
  }  
  //Subir categoria
  subir_categoria(nombre:string):boolean {
    console.log("El nombre de la categoria es:" + nombre);
    this.servicioBackService.createCategoria(nombre).subscribe(data => {
      //alert(data.mensaje);
      //window.location.reload();
    });
    this.setError(false);
    return this.getError();
  }
  //Editar categoria
  editar_categoria(id_categoria:number,nombre:string):Promise<boolean>{
    console.log("Id de la categoría"+id_categoria)
    console.log("Nombre"+nombre);

    return new Promise<boolean>((resolve) => {
      this.servicioBackService.editCategoria(id_categoria, nombre).subscribe(data => {
        console.log(data);
  
        this.setError(false);
        resolve(this.getError());
      });
    })
  }
  //Eliminar categoria
  eliminar_categoria(id_categoria:number):Promise<boolean> {
    

    return new Promise<boolean>((resolve, reject) => {
      this.servicioBackService.deleteCategoria(id_categoria).subscribe(data => {
        console.log(data);

        console.log("Id de la categoría"+id_categoria)
        for(var i = 0; i < this.categorias.length; i++) {
          if(this.categorias[i].id==id_categoria){
            this.categorias.splice(i, 1);
            this.setError(false);
            break;
          }
          else{
            this.setError(true);
          }
        }  
        resolve(this.getError());
      });
    })
  }
  //Buscar solo por categorias
  buscar_categoria(id_categoria:number):Tarjeta[]{
    return this.tarjetas;
  }
  //Buscar solo por texto
  buscar_texto(txt_buscar:string):Tarjeta[]{
    return this.tarjetas;
  }
  //Buscar por texto y categorías
  buscar(categorias: number[],txt_buscar: string, tipo_usuario: string):Tarjeta[]{
    this.obtener_tarjetas(tipo_usuario, categorias, txt_buscar).then(data => {
      this.tarjetas = data;
    });

    return this.tarjetas;
  }

}