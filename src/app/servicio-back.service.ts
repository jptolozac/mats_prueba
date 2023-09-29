import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Noticia } from './noticia.model';
import { Comentario } from './mesa-ayuda/modelo-comentario';

@Injectable({
  providedIn: 'root'
})
export class ServicioBackService {

  private urlApi = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) { }

  public Apoyo(email: string, id_noticia: number){
    const form = {
      "usuario": email,
      "noticia": id_noticia
    }    
    console.log(true);

    return this.http.post<any>(this.urlApi + '/v1/apoyo?accion=agregar', form);
  }

  public DesApoyo(id_usuario: string, id_noticia: number){
    const form = {
      "usuario": id_usuario,
      "noticia": id_noticia
    }    
    //console.log(true);

    return this.http.post<any>(this.urlApi + '/v1/apoyo?accion=eliminar', form);
  }

  public getAllNoticiasUD(): Observable<any> {
    return this.http.get<any>(this.urlApi + '/v1/noticias');
  }
  public buscarAllNoticiasUD(cantidad: number, busqueda: string): Observable<any> {
    return this.http.get<any>(this.urlApi + '/v1/noticias' + '?buscar=' + busqueda + '&cantidad=' + cantidad);
  }
  public getAllNoticiasInteres(): Observable<any> {
    return this.http.get<any>(this.urlApi + '/v1/noticias?orden=likes');
  }
  public buscarAllNoticiasInteres(cantidad: number, busqueda: string): Observable<any> {
    return this.http.get<any>(this.urlApi + '/v1/noticias?orden=likes' + '&buscar==' + busqueda + '&cantidad=' + cantidad);
  }

  public getUsuario(usuario: string, contraseña: string){
    const form = {
      "email": usuario,
      "password": contraseña
    }
    return this.http.post<any>(this.urlApi + '/login', form);
  }

  public getDatosUsuario(correo: string, token: string){
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<any>(this.urlApi + '/v1/users/'+ correo, { headers });
  }

  public getNoticiasGenerales(usuario: string, token: string, cantidad: number, busqueda: string){
    busqueda = busqueda ? busqueda : "";
    if(usuario == 'administrador' || usuario == '' ){
      return this.http.get<any>(this.urlApi + '/v1/tipo_usuario/1' + '?cantidad=' + cantidad + '&buscar=' + busqueda);
    }

    return this.http.get<any>(this.urlApi + '/v1/tipo_usuario/1?usuario=' 
              + token + '&cantidad=' + cantidad + '&buscar=' + busqueda);
  }

  public getNoticiasUD(token: string, cantidad: number, busqueda: string): Observable<any>{

    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    busqueda = busqueda ? busqueda : "";

    return this.http.get(
      this.urlApi + '/v1/users?noticias=true' + '&cantidad=' + cantidad + '&buscar=' + busqueda, 
      { headers }
    );
  }

  public getNoticiasInteres(token: string, cantidad: number, busqueda: string): Observable<any>{

    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    busqueda = busqueda ? busqueda : "";

    return this.http.get(
      this.urlApi + '/v1/users?noticias=true&orden=likes' + '&cantidad=' + cantidad + '&buscar=' + busqueda, 
      { headers }
    );
  }

  public setPDF(archivo: File, id_noticia: number){
    const form = new FormData();
    form.append('archivo', archivo);

    return this.http.post<any>(this.urlApi + '/v1/archivo/' + id_noticia, form).subscribe(
      response => {
        alert('archivo subido con exito '/* , response */);
      }, error => {
        alert('error al subir el archivo '/* , error */);
      }
    );
  }

  public setNoticia(datos: {noticia: Noticia, noticia_tipo: number[]}, id_noticia: number){
    console.log('primeros datos', datos);
    const envDatos = {
      "titulo": datos.noticia.titulo,
      "fecha": datos.noticia.fecha,
      "descripcion": datos.noticia.descripcion,
      "noticiaTipo": datos.noticia_tipo
    }
    return this.http.put<any>(this.urlApi + '/v1/noticias/' + id_noticia, envDatos);
  }

  public createNoticia(form: any){
    return this.http.post<any>(this.urlApi + '/v1/noticias/', form);
  }

  public deleteNoticia(id: number){
    return this.http.delete<any>(this.urlApi + '/v1/noticias/' + id);
  }

  public getCategorias(): Observable<any>{
    return this.http.get<any>(this.urlApi + '/v1/categorias');
  }

  public getCategoriasTarjeta(tarjeta: number){
    return this.http.get<any>(this.urlApi + '/v1/categorias' + '?tarjeta=' + tarjeta);
  }

  public createCategoria(nombre: string){
    const form = new FormData();
    form.append("nombre", nombre);
    return this.http.post<any>(this.urlApi + '/v1/categorias', form);
  }

  public editCategoria(id: number, nombre: string){
    const form = {
      "nombre": nombre
    }

    return this.http.put<any>(this.urlApi + '/v1/categorias/' + id, form);
  }

  public deleteCategoria(id: number){
    return this.http.delete<any>(this.urlApi + '/v1/categorias/' + id);
  }

  public getPreguntas(tipo_usuario: string, categoria: number[], busqueda: string): Observable<any>{
    const parametros = categoria.join(",");
    
    
    if(tipo_usuario != "" && categoria.length != 0){
      console.log(this.urlApi + '/v1/tarjetas' + '?tipoUsuario=' + tipo_usuario + '&categorias=' + parametros + '&buscar=' + busqueda);
      return this.http.get<any>(this.urlApi + '/v1/tarjetas' + '?tipoUsuario=' + tipo_usuario + '&categorias=' + parametros + '&buscar=' + busqueda);
    }
    else if(tipo_usuario != ""){
      console.log(this.urlApi + '/v1/tarjetas' + '?tipoUsuario=' + tipo_usuario + '&buscar=' + busqueda);
      return this.http.get<any>(this.urlApi + '/v1/tarjetas' + '?tipoUsuario=' + tipo_usuario + '&buscar=' + busqueda);
    }
    else if(categoria.length != 0){
      return this.http.get<any>(this.urlApi + '/v1/tarjetas' + '?categorias=' + parametros + '&buscar=' + busqueda);
    }
    return this.http.get<any>(this.urlApi + '/v1/tarjetas' + '&buscar=' + busqueda);
  }

  public buscarTiposUsuario_Tarjeta(id_tarjeta: number){
    return this.http.get<any>(this.urlApi + '/v1/tarjetas/' + id_tarjeta);
  }

  public crearTarjeta(titulo:string,descripcion:string,id_usuario:number[], categorias:number[]){
    const form = {
      "titulo": titulo,
      "descripcion": descripcion,
      "usuarios": id_usuario,
      "categorias": categorias
    }

    return this.http.post<any>('http://localhost:8000/api/v1/tarjetas', form);
  }

  public editarTarjeta(id_tarjeta:number,titulo:string,descripcion:string,id_usuario:number[], categorias:number[]){
    const form = {
      "titulo": titulo,
      "descripcion": descripcion,
      "usuarios": id_usuario,
      "categorias": categorias
    }

    return this.http.put<any>('http://localhost:8000/api/v1/tarjetas/' + id_tarjeta, form);
  }

  public deleteTarjeta(id_tarjeta:number){
    return this.http.delete(this.urlApi + '/v1/tarjetas/' + id_tarjeta);
  }

  public getTicketsUsuario(email: string){
    
    return this.http.get<any>(this.urlApi + '/v1/tickets' + '?user=' + email);
  }

  public getTicketsResponsable(email: string){
    
    return this.http.get<any>(this.urlApi + '/v1/tickets' + '?responsable=' + email);
  }

  public getCategoriaTK(id: number){
    return this.http.get<any>(this.urlApi + '/v1/categoriasTK/' + id);
  }

  public getCategoriasTK(){
    return this.http.get<any>(this.urlApi + '/v1/categoriasTK');
  }

  public getItem(id: number | null){

    return this.http.get<any>(this.urlApi + '/v1/items/' + id);
  }

  public getItems(): Observable<any>{

    return this.http.get<any>(this.urlApi + '/v1/items');
  }

  public getResponsableTicket(email: string){
    
    return this.http.get<any>(this.urlApi + '/v1/tickets' + "?responsable=" + email);
  }
  
  public createReclamo(asunto:string, descripcion:string){
    const form = new FormData();
    form.append("asunto", asunto);
    form.append("descripcion", descripcion);

    return this.http.post<any>(this.urlApi + '/v1/quejas', form);
  }

  public createTicket(asunto: string, descripcion: string, usuario: string, categoria: number, item: number){
    const form = new FormData();
    form.append("asunto", asunto);
    form.append("descripcion", descripcion);
    form.append("usuario", usuario);
    form.append("categoria", categoria.toString());
    form.append("item",  item.toString());
    
    return this.http.post<any>(this.urlApi + '/v1/tickets', form);
  }

  getTicket(id_ticket: number){

    return this.http.get<any>(this.urlApi + "/v1/tickets/" + id_ticket);
  }

  public getTicketsUsuarioFiltro(email: string, prioridad: string, estado: string, responsable: string | null){
    estado = estado == "null" ? "" : estado; 
    prioridad = prioridad == "null" ? "" : prioridad; 
    email = email == "null" ? "" : email; 
    responsable = responsable == null ? "" : responsable;

    console.log((this.urlApi + '/v1/tickets' + 
    '?user=' + email + '&prioridad=' + prioridad + '&estado=' + estado + '&responsable=' + responsable ?? ""));

    return this.http.get<any>(this.urlApi + '/v1/tickets' + 
              '?user=' + email + '&prioridad=' + prioridad + '&estado=' + estado + '&responsable=' + responsable ?? "");
  }

  public updatePassword(token: string, password: string, correo: string){
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    const form = {
      "password": password
    };

    console.log(this.urlApi + '/users/' + correo + '?actualizar=password', form, { headers });
    return this.http.put<any>(this.urlApi + '/v1/users/' + correo + '?actualizar=password', form, { headers });
  }

  public getQuejas(estado: string): Observable<any>{
    (this.urlApi + '/v1/quejas/' + '?estado=' + estado);
    return this.http.get<any>(this.urlApi + '/v1/quejas' + '?estado=' + estado);
  }

  public cambiarEstadoQueja(id: number, estado: boolean): Observable<any>{
    const form = {
      "estado": Number(Boolean(estado))
    }
    console.log(form);

    return this.http.put<any>(this.urlApi + '/v1/quejas/' + id, form);
  }

  public buscarNuevoResponsable(token: string, correo: string): Observable<any>{
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<any>(this.urlApi + '/v1/administradors/' + correo + '?accion=buscarResponsable', { headers });
  }

  public setNuevoResponsable(token: string, id_ticket: number, email: string){
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    const form = {
      'email': email
    }

    return this.http.put<any>(this.urlApi + '/v1/tickets/' + id_ticket + '?actualizar=responsable', form, { headers });
  }

  public comentariosTicket(ticket: number){

    return this.http.get<any>(this.urlApi + '/v1/comentarios/' + ticket);
  }

  public updateTicket(token: string, id: number, asunto: string, descripcion: string, email_responsable: string, user_id: number, categoria_id: number, item_id: number, estado_id: number, prioridad_id:number, comentarios: Comentario[]){
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    const form = {
      "asunto": asunto,
      "descripcion": descripcion,
      "email_responsable": email_responsable,
      "user_id": user_id,
      "categoria_id": categoria_id,
      "item_id": item_id,
      "estado_id": Number(estado_id),
      "prioridad_id": prioridad_id,
      "comentarios": comentarios,
    };
    console.table(form);
    
    return this.http.put<any>(this.urlApi + '/v1/tickets/' + id + '?actualizar=ticket', form, { headers })
  }

  public quitarPermisosNoticias(emailUsuario: string){

    return this.http.delete<any>(this.urlApi + '/v1/PermisosUsuarios/' + emailUsuario + '?permiso=' + 'noticias');
  }
  public quitarPermisosPreguntas(emailUsuario: string){

    return this.http.delete<any>(this.urlApi + '/v1/PermisosUsuarios/' + emailUsuario + '?permiso=' + 'preguntas');
  }

  public actualizarDatosUsuario(token: string, id_usuario:number,nombre:string,correo:string,password:string | null,id_tipo:number | null, permiso_noticias:boolean, permiso_preguntas:boolean, permiso_MA:boolean){
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    const permisos = {
      "noticias": permiso_noticias,
      "preguntas": permiso_preguntas,
      "mesaAyuda": permiso_MA,
    };

    const form = {
      "name": nombre,
      "email": correo,
      "password": password,
      "tipo_usuario_id": id_tipo,
      "permisos": permisos
    };

    console.log((this.urlApi + '/v1/users/' + id_usuario), form);

    return this.http.put<any>(this.urlApi + '/v1/users/' + id_usuario + '?actualizar=usuario', form, { headers });
  }

  cargarUsuarios(token: string, form: FormData){
    const headers = new HttpHeaders({
      "Authorization": "Bearer " + token
    });

    return this.http.post<any>(this.urlApi + '/v1/carga_usuarios', form, { headers });
  }

  deleteTicket(token: string, id: number){
    const headers = new HttpHeaders({
      "Authorization": "Bearer " + token
    });
    
    return this.http.delete<any>(this.urlApi + '/v1/tickets/' + id, { headers });
  }

  crearUsuario(token: string, form: FormData){
    const headers = new HttpHeaders({
      "Authorization": "Bearer " + token
    });

    return this.http.post<any>(this.urlApi + '/v1/users', form, { headers });
  }

  editPersonalInfo(token: string, nombre: string, email: string){
    const headers = new HttpHeaders({
      "Authorization": "Bearer " + token
    });

    const form = {
      "name": nombre,
      "email": email
    }

    return this.http.put<any>(this.urlApi + '/v1/users/modificar', form, { headers });
  }

  editarCategoriasTK(token: string, id: number, nombre: string){
    const headers = new HttpHeaders({
      "Authorization": "Bearer " + token
    });

    const form ={
      "nombre": nombre
    }

    return this.http.put<any>(this.urlApi + '/v1/categoriasTK/' + id, form, { headers });
  }

  eliminarCategoriaTK(token: string, id: number){
    const headers = new HttpHeaders({
      "Authorization": "Bearer " + token
    });

    return this.http.delete<any>(this.urlApi + '/v1/categoriasTK/' + id, { headers });
  }

  crearCategoriaTK(token: string, nombre: string){
    const headers = new HttpHeaders({
      "Authorization": "Bearer " + token
    });

    const form = new FormData();
    form.append("nombre", nombre);

    return this.http.post<any>(this.urlApi + '/v1/categoriasTK', form, { headers });
  }

  editarItem(token: string, id: number, nombre: string, categoria_id: number){
    const headers = new HttpHeaders({
      "Authorization": "Bearer " + token
    });

    const form ={
      "nombre": nombre,
      "categoria_id": categoria_id
    }

    return this.http.put<any>(this.urlApi + '/v1/items/' + id, form, { headers });
  }

  crearItem(token: string, nombre: string, categoria_id: number){
    const headers = new HttpHeaders({
      "Authorization": "Bearer " + token
    });

    const form = new FormData();
    form.append("nombre", nombre);
    form.append("categoria_id", String(categoria_id));

    return this.http.post<any>(this.urlApi + '/v1/items', form, { headers });
  }

  eliminarItem(token: string, id: number){
    const headers = new HttpHeaders({
      "Authorization": "Bearer " + token
    });

    return this.http.delete<any>(this.urlApi + '/v1/items/' + id, { headers });
  }

}
