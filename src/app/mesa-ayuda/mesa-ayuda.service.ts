import { Injectable } from '@angular/core';
import { LoginService } from '../login.service';
import { Ticket } from './modelo-ticket';
import { CategoriaMA } from './modelo-categoriaMA';
import { Item } from './modelo-item';
import { Estado } from './modelo-estado';
import { responsable } from './modelo-responsable';
import { Prioridad } from './modelo-prioridad';
import { Comentario } from './modelo-comentario';
import { queja } from './modelo-queja';
import { usuario } from './modelo-usuario';
import { MensajesService } from '../mensajes.service';
import { remitente } from './modelo-remitente';
import { ServicioBackService } from '../servicio-back.service';
import { Observable } from 'rxjs';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class MesaAyudaService {
  //Variable que guarda los tickets
  tickets:Ticket[] | null;
  //variable que guarda la categoría
  categorias:CategoriaMA[] | null;
  //Variable que guarda los items de las categorías
  items:Item[] | null;
  //Variable que almacena los comentarios de un ticket
  comentarios:Comentario[] | null;
  //Variable que almacena las quejas realizadas por los usuarios
  quejas:queja[] | null;
  //Guarda al remitente de algún Ticket
  remitente: remitente;
  constructor(private loginservice:LoginService, private servicio_mensajes:MensajesService, private servicioBackService: ServicioBackService, private datePipe: DatePipe) {
    this.tickets=null;
    this.categorias=null;
    this.items=null;
    this.comentarios=null;
    this.quejas=null;

  }
  //Método que retorna la fecha actual del sistemas
  getFechaActual():Date{
    return new Date();
  }
  //Función que trae todos los tickets del usuario
  getTickets_Usuario(correo:string):Promise<Ticket[] | null>{
    this.tickets = [];
    console.log("El correo del usuario al cual se le buscara sus Ticket es:"+correo);
    /* this. tickets=  [
      new Ticket(1, new remitente(1,"Luisa Perez", "lpere@udistrital.edu.co"), new CategoriaMA(1,"Solicitud"), new responsable(101, "Peter Fierro", "fierro@udistrital.edu.co"),new Item(201,"Certificado", new CategoriaMA(1,"Solicitud")), new Estado(1,"Pendiente"), new Prioridad(2, "Media"), "Este es un ejemplo asunto 1", "Descripción 1",new Date('2023-08-05'), new Date('2023-08-12')),
      new Ticket(2, new remitente(1,"Daniel Torrez", "daniel@udistrital.edu.co"), new CategoriaMA(1,"Solicitud"), new responsable(102, "Sonia Pinzon", "spinzon@udistrital.edu.co"),new Item(201,"Certificado", new CategoriaMA(1,"Solicitud")), new Estado(1,"Pendiente"), new Prioridad(2, "Media"), "Este es un ejemplo asunto 1", "Descripción 1",new Date('2023-08-05'), new Date('2023-08-12')),
      new Ticket(3, new remitente(1,"Juanito Sanchez", "juanito@udistrital.edu.co"), new CategoriaMA(2,"Propuesta de grado"), new responsable(103, "Coordinación", "tecsistematización@udistrital.edu.co"),new Item(201,"Certificado", new CategoriaMA(1,"Solicitud")), new Estado(1,"Pendiente"), new Prioridad(2, "Media"), "Este es un ejemplo asunto 1", "Descripción 1",new Date('2023-08-05'), new Date('2023-08-12')),
      new Ticket(4, new remitente(1,"Vanessa Rios", "vanessa@udistrital.edu.co"), new CategoriaMA(2,"Propuesta de grado"), new responsable(101, "Peter Fierro", "fierro@udistrital.edu.co"),new Item(201,"Certificado", new CategoriaMA(1,"Solicitud")), new Estado(1,"Pendiente"), new Prioridad(2, "Media"), "Este es un ejemplo asunto 1", "Descripción 1",new Date('2023-08-05'), new Date('2023-08-12')),
      new Ticket(5, new remitente(1,"Elva Ginaso", "gina@udistrital.edu.co"), new CategoriaMA(3,"Sin items"), new responsable(101, "Peter Fierro", "fierro@udistrital.edu.co"),null, new Estado(2,"En proceso"), new Prioridad(2, "Media"), "Este es un ejemplo asunto 1", "Descripción 1",new Date('2023-08-05'), new Date('2023-08-12'))
    ]; */
    
    return new Promise<Ticket[] | null>((resolve, reject) => {
      this.servicioBackService.getTicketsUsuario(this.loginservice.getIdUsuario()).forEach((data) => {
        console.log(typeof(data));
        this.insertarTickets(data);
        
        resolve(this.tickets);
      });
    });
     //return this.tickets;
  }

  getTickets_Responsable(correo:string):Promise<Ticket[] | null>{
    this.tickets = [];
    console.log("El correo del responsable al cual se le buscara sus Ticket es: " + correo);

    return new Promise<Ticket[] | null>((resolve, reject) => {
      this.servicioBackService.getTicketsResponsable(this.loginservice.getIdUsuario()).forEach((data) => {
        console.log(typeof(data));
        this.insertarTickets(data);
        
        resolve(this.tickets);
      });
    });
     //return this.tickets;
  }
  //Método que busca un ticket entre varios
  getTicket(id_ticket:number):Promise<Ticket | null>{ //no se usa
    console.log("ID del ticket: " + id_ticket);
    return new Promise<Ticket | null>((resolve, reject) => {
      this.servicioBackService.getTicket(id_ticket).subscribe(data => {
        console.log(data.data);
        const datos = data.data;
        const fechaCreacion = datos.created_at.split("T");

        const prioridad: any = datos.prioridad ?? {
          "id": 0,
          "relevancia": "Sin asignar"
        };

        const ticket = new Ticket(datos.id, new remitente(datos.usuario.id, datos.usuario.name, datos.usuario.email), new CategoriaMA(datos.categoria.id, datos.categoria.nombre), new responsable(datos.responsable.id, datos.responsable.name, datos.responsable.email), new Item(datos.item.id, datos.item.nombre, datos.item.categoria), new Estado(datos.estado.id, datos.estado.nombre), new Prioridad(prioridad.id, prioridad.relevancia), datos.asunto, datos.descripcion, new Date(fechaCreacion[0]), new Date(datos.fecha_limite));
        resolve(ticket);
      });
    });

    //return new Ticket(1, new remitente(1,"Luisa Perez", "lpere@udistrital.edu.co"), new CategoriaMA(1,"Solicitud"), new responsable(101, "Peter Fierro", "fierro@udistrital.edu.co"),new Item(2,"Certificado", new CategoriaMA(1,"Solicitud")), new Estado(1,"Pendiente"), new Prioridad(2, "Media"), "Este es un ejemplo asunto 1", "Descripción 1",new Date('2023-08-05'), new Date('2023-08-12'));
  }

  insertarTickets(data: any){
    this.tickets = [];
    for(const ticket of data.data){
      const fechaCreacion = ticket.created_at.split("T");

      const prioridad: any = ticket.prioridad ?? {
        "id": 0,
        "relevancia": "Sin asignar"
      };

      this.tickets?.push(new Ticket(ticket.id, new remitente(ticket.usuario.id, ticket.usuario.name, ticket.usuario.email), new CategoriaMA(ticket.categoria.id, ticket.categoria.nombre), new responsable(ticket.responsable.id, ticket.responsable.name, ticket.responsable.email), new Item(ticket.item.id, ticket.item.nombre, ticket.item.categoria), new Estado(ticket.estado.id, ticket.estado.nombre), new Prioridad(prioridad.id, prioridad.relevancia), ticket.asunto, ticket.descripcion, new Date(fechaCreacion[0]), new Date(ticket.fecha_limite)));
      //console.log(this.tickets)
    }
    console.log(data, "gurrupleta");
  }

  //Función que trae todos los tickets en general, por lo cual traer inicialmente los pendientes
  getTickets():Promise<Ticket[] | null>{

    return new Promise<Ticket[] | null>((resolve, reject) => {
      this.servicioBackService.getTicketsUsuario("admin").forEach((data) => {
        console.log(typeof(data));
        this.insertarTickets(data);

        resolve(this.tickets);
      });
    });
   
    /* this. tickets=  [
      new Ticket(1, new remitente(1,"Luisa Perez", "lpere@udistrital.edu.co"), new CategoriaMA(1,"Solicitud"), new responsable(101, "Peter Fierro", "fierro@udistrital.edu.co"),new Item(201,"Certificado", new CategoriaMA(1,"Solicitud")), new Estado(1,"Pendiente"), new Prioridad(2, "Media"), "Este es un ejemplo asunto 1", "Descripción 1",new Date('2023-08-05'), new Date('2023-08-12')),
      new Ticket(2, new remitente(1,"Daniel Torrez", "daniel@udistrital.edu.co"), new CategoriaMA(1,"Solicitud"), new responsable(102, "Sonia Pinzon", "spinzon@udistrital.edu.co"),new Item(201,"Certificado", new CategoriaMA(1,"Solicitud")), new Estado(1,"Pendiente"), new Prioridad(2, "Media"), "Este es un ejemplo asunto 1", "Descripción 1",new Date('2023-08-05'), new Date('2023-08-12')),
      new Ticket(3, new remitente(1,"Juanito Sanchez", "juanito@udistrital.edu.co"), new CategoriaMA(2,"Propuesta de grado"), new responsable(103, "Coordinación", "tecsistematización@udistrital.edu.co"),new Item(201,"Certificado", new CategoriaMA(1,"Solicitud")), new Estado(2,"En proceso"), new Prioridad(2, "Media"), "Este es un ejemplo asunto 1", "Descripción 1",new Date('2023-08-05'), new Date('2023-08-12')),
      new Ticket(4, new remitente(1,"Vanessa Rios", "vanessa@udistrital.edu.co"), new CategoriaMA(2,"Propuesta de grado"), new responsable(101, "Peter Fierro", "fierro@udistrital.edu.co"),new Item(201,"Certificado", new CategoriaMA(1,"Solicitud")), new Estado(1,"Pendiente"), new Prioridad(2, "Media"), "Este es un ejemplo asunto 1", "Descripción 1",new Date('2023-08-05'), new Date('2023-08-12')),
      new Ticket(5, new remitente(1,"Elva Ginaso", "gina@udistrital.edu.co"), new CategoriaMA(3,"Sin items"), new responsable(101, "Peter Fierro", "fierro@udistrital.edu.co"),null, new Estado(2,"En proceso"), new Prioridad(2, "Media"), "Este es un ejemplo asunto 1", "Descripción 1",new Date('2023-08-05'), new Date('2023-08-12'))
    ]; */
    /*
    const ticket = this.tickets.find(ticket => ticket.token === id_ticket);
    if (ticket !== undefined) {
      return ticket;
    }*/
    //return this.tickets;
  }
  //Método que retorna las categorías seleccionadas
  getCategorias():Promise<CategoriaMA[] | null>{
    return new Promise<CategoriaMA[] | null>((resolve, reject) => {
      this.servicioBackService.getCategoriasTK().subscribe(data => {
        this.categorias = [];
        for(const categoria of data){
          this.categorias?.push(new CategoriaMA(categoria.id, categoria.nombre));
        }
        //console.log(this.categorias);
        resolve(this.categorias);
      });
    });
    //this.categorias=[new CategoriaMA(1,"Solicitud"), new CategoriaMA(2,"Quejas"), new CategoriaMA(3,"Documentos"),new CategoriaMA(4,"Está no tiene items :v")];
    //return this.categorias;
  }
  //Método para agregar una categoría
  agregarCategoria(nombre:string):Promise<boolean>{
    console.log("La nueva categoria es: "+ nombre);

    return new Promise<boolean>(resolve => {
      this.servicioBackService.crearCategoriaTK(this.loginservice.getToken(), nombre).subscribe(data => {
        console.log(data);
        resolve(data.mensaje == "categoría creada");
      });
    });
    
  }
  //Método para editar las categorias
  editarCategoria(id_categoria:number,nombre:string): Promise<boolean> {
    console.log("El ID de la categoría a editar es:"+id_categoria);
    console.log("Nombre de la categoría editado:"+nombre);
    return new Promise<boolean>((resolve, reject) => {
      this.servicioBackService.editarCategoriasTK(this.loginservice.getToken(), id_categoria, nombre).subscribe(data => {
        console.log(data);
        resolve(data.mensaje == "categoría actualizada");
      });
    });
  }
  //Método para eliminar una categoría de las solicitudes
  eliminarCategoria(id_categoria:number):Promise<boolean> {
    console.log("El ID de la categoría a eliminar es:"+id_categoria);

    return new Promise<boolean>((resolve) => {
      this.servicioBackService.eliminarCategoriaTK(this.loginservice.getToken(), id_categoria).subscribe(data => {
        console.log(data);
        resolve(data.mensaje == "categoría eliminada");
      });
    });
  }  
  //Método que retorna todos los items registrados
  getItems(): Promise<Item[] | null>{
    return new Promise<Item[] | null>(resolve => {
      this.servicioBackService.getItems().subscribe(data => {
        this.items = [];
        for(const item of data.data){
          this.items?.push(new Item(item.id, item.nombre, new CategoriaMA(item.categoria.id, item.categoria.nombre)));
        }
        resolve(this.items);
      });
    });
    
    /* this.items = [
      new Item(1, "Cambio de grupo", new CategoriaMA(1,"Solicitud")),
      new Item(2, "Problema de acceso", new CategoriaMA(1,"Solicitud")),
      new Item(3, "Revisión de contrato", new CategoriaMA(1,"Solicitud")),
      new Item(4, "Falla en el servicio", new CategoriaMA(1,"Solicitud")),
      new Item(5, "Retraso en la entrega",new CategoriaMA(1,"Solicitud")),
      new Item(6, "Facturación incorrecta", new CategoriaMA(2,"Quejas")),
      new Item(7, "Envío de informe",new CategoriaMA(2,"Quejas")),
      new Item(8, "Solicitud de certificado",new CategoriaMA(3,"Documentos")),
      new Item(9, "Revisión de documento",new CategoriaMA(3,"Documentos"))
    ]; */
    //return this.items;
  }
  //Método para agregar un item
  agregarItem(nombre:string, id_categoria:number):Promise<boolean> {
    console.log("Nombre del ítem:"+nombre);
    console.log("id_categoria:"+id_categoria);
    
    return new Promise<boolean>(resolve => {
      this.servicioBackService.crearItem(this.loginservice.getToken(), nombre, id_categoria).subscribe(data => {
        console.log(data);
        resolve(data.mensaje == "item creado");
      });
    });
  }
  //Método para editar los ítems
  editarItem(id_item:number,nombre:string,id_categoria:number):Promise<boolean> {
    console.log("El ID del ítem a editar es:"+id_item);
    console.log("Nombre modificado del ítem:"+nombre);
    console.log("ID de la categoría modificada:"+id_categoria);

    return new Promise<boolean>(resolve => {
      this.servicioBackService.editarItem(this.loginservice.getToken(), id_item, nombre, id_categoria).subscribe(data => {
        console.log(data);
        resolve(data.mensaje == "item editado");
      });
    });
  }
  //Método para eliminar ítems de una categoria
  eliminarItem(id_item:number):Promise<boolean> {
    console.log("El ID del ítem a eliminar es:"+id_item);

    return new Promise<boolean>(resolve => {
      this.servicioBackService.eliminarItem(this.loginservice.getToken(), id_item).subscribe(data => {
        console.log(data);
        resolve(data.mensaje == "item eliminado");
      });
    })
  }   
  //Método que trae los items según el ID de la categoría
  getItemsPorCategoria(id_categoria: number): Item[] | null {
    const items: Item[] = this.items ?? [];
    let itemsCategoria: Item[] = [];
    this.items ? null : this.getItems();
    
    for(const item of items){
      if(item.categoria.id_categoria == id_categoria){
        itemsCategoria.push(item);
      }
    }

    return itemsCategoria;
    /* if(id_categoria == 1){
      this.items = [
        new Item(1, "Cambio de grupo", new CategoriaMA(1,"Solicitud")),
        new Item(2, "Problema de acceso", new CategoriaMA(1,"Solicitud")),
        new Item(3, "Revisión de contrato", new CategoriaMA(1,"Solicitud"))
      ];
      return this.items;
    }
    else if(id_categoria==2){
      this.items = [
        new Item(4, "Falla en el servicio", new CategoriaMA(2,"Quejas")),
        new Item(5, "Retraso en la entrega",  new CategoriaMA(2,"Quejas")),
        new Item(6, "Facturación incorrecta",  new CategoriaMA(2,"Quejas"))
      ];
      return this.items;
    }
    else if(id_categoria==3){
      this.items = [
        new Item(7, "Envío de informe",  new CategoriaMA(3,"Documentos")),
        new Item(8, "Solicitud de certificado", new CategoriaMA(3,"Documentos")),
        new Item(9, "Revisión de documento", new CategoriaMA(3,"Documentos"))
      ];
      return this.items;
    }
    else{
      return null;
    }
     */
  }
  //Método que trae el nombre del usuario para la información personal
  getNombre_usuario():Promise<any>{
    //Buscar el nombre del usuario según el método
    return new Promise<string>((resolve, reject) => {
      this.servicioBackService.getDatosUsuario(this.loginservice.getIdUsuario(), this.loginservice.getToken()).subscribe(data => {
        resolve(data[0]);
      });
    });
  }
  //Método que permite al usuario editar su información personal
  editar_InformacionPersonal(nombre:string,correo:string): Promise<boolean>{
    let error=true;
    console.log("Nombre del usuario:",nombre);
    console.log("Correo del usuario:",correo);
    return new Promise<boolean>((resolve, reject) => {
      this.servicioBackService.editPersonalInfo(this.loginservice.getToken(), nombre, correo).subscribe((data: any) => {
        console.log(data);
        return (data.mensaje == "usuario actualizado");
      });
    });
    //Retorna TRUE si se pudo y FALSE si no.
  }
  //Función usada para filtrar la lista de solicitudes
  /*filtrar(prioridad:string | null,estado:string | null):{

  }*/
  //Método que retorna unos tickets según los filtros aplicados
  filtrar(filtros: any):Promise<Ticket[] | null>{
    let filtrosSeleccionados = filtros;
    //Si llega NULL en prioridad significa que traiga de todas las prioridades
    //Si llega NULL en estado significa que traiga todos los estados
    //Si llega cadena vacía (con longitud cero '0') significa que el usuario no escribio correo para filtrar
    console.log("El ID prioridad es:"+filtrosSeleccionados.prioridad);
    console.table("El ID estado es: ", filtrosSeleccionados.estado);
    (this.loginservice.getTipoUsuario() != "administrador") ? console.log("el correo del usuario es: ", this.loginservice.getIdUsuario()) : console.log("El correo del usuario a buscar es:" + filtrosSeleccionados.correo.trim());

    console.log("filtro? ", filtros.responsable);

    const filtro: Observable<any> = filtros.responsable ? this.servicioBackService.getTicketsUsuarioFiltro
                  (
                    filtrosSeleccionados.correo.trim(), 
                    filtrosSeleccionados.prioridad, 
                    filtrosSeleccionados.estado, 
                    (this.loginservice.getTipoUsuario() != "administrador" || !filtros.lista) ? this.loginservice.getIdUsuario() : ""
                  ) 
                  : this.servicioBackService.getTicketsUsuarioFiltro
                  (
                    (this.loginservice.getTipoUsuario() != "administrador" || !filtros.lista) ? this.loginservice.getIdUsuario() : "",
                    filtrosSeleccionados.prioridad, 
                    filtrosSeleccionados.estado,
                    null
                  );
    
    /* const filtro: Observable<any> = (this.loginservice.getTipoUsuario() != "administrador") ? this.servicioBackService.getTicketsUsuarioFiltro
                  (
                    this.loginservice.getIdUsuario(), 
                    filtrosSeleccionados.prioridad, 
                    filtrosSeleccionados.estado
                  ) 
                  : this.servicioBackService.getTicketsUsuarioFiltro
                  (
                    filtrosSeleccionados.correo.trim(), 
                    filtrosSeleccionados.prioridad, 
                    filtrosSeleccionados.estado
                  ); */

    return new Promise<Ticket[] | null>(resolve => {
      filtro.subscribe(data => {
        this.insertarTickets(data);

        resolve(this.tickets);
      });
    });


    //Retornar los tickets este es un ejemplo
    /* this. tickets=  [
      new Ticket(1, new remitente(1,"Luisa Perez", "lpere@udistrital.edu.co"), new CategoriaMA(1,"Solicitud"), new responsable(101, "Peter Fierro", "fierro@udistrital.edu.co"),new Item(201,"Certificado", new CategoriaMA(1,"Solicitud")), new Estado(1,"Pendiente"), new Prioridad(2, "Media"), "Este es un ejemplo asunto 1", "Descripción 1",new Date('2023-08-05'), new Date('2023-08-12')),
      new Ticket(2, new remitente(1,"Daniel Torrez", "daniel@udistrital.edu.co"), new CategoriaMA(1,"Solicitud"), new responsable(102, "Sonia Pinzon", "spinzon@udistrital.edu.co"),new Item(201,"Certificado", new CategoriaMA(1,"Solicitud")), new Estado(1,"Pendiente"), new Prioridad(2, "Media"), "Este es un ejemplo asunto 1", "Descripción 1",new Date('2023-08-05'), new Date('2023-08-12'))];
    return this.tickets; */
  }
  //Método para buscar un responsable según su correo
  buscar_responsable(correo: string): Promise<responsable | null>{
    return new Promise<responsable | null>(resolve => {
      this.servicioBackService.buscarNuevoResponsable(this.loginservice.getToken(), correo).subscribe(data => {
        console.table(data.responsable);
        const datos = data.responsable;
        if(!datos){
          resolve(null);
        }else{
          const resp: responsable = new responsable(datos.id, datos.name, datos.email);
          resolve(resp);
        }
      });
    });
    
    // Datos estáticos
    /* const usuarios: responsable[] = [
      new responsable(1, 'John Doe', 'nrubios@udistrital.edu.co'),
      new responsable(2, 'Jane Smith', 'jane@example.com'),
      new responsable(3, 'Alice Johnson', 'alice@example.com')
    ];
  
    // Buscar el usuario por correo
    const usuarioEncontrado = usuarios.find(usuario => usuario.correo === correo);
  
    return usuarioEncontrado || null; */
  }
  //Método que cambia al responsable por el ingresado
  cambiar_responsable(id_ticket:number,res:responsable | null): Promise<boolean>{

    return new Promise<boolean>(resolve => {
      if(res == null){
        resolve(false);
      }else {
        console.log("El ID del Ticket es:"+id_ticket);
        console.log("El nuevo responsable es: "+res.name+ " \ncon correo: "+res.correo+" \ny ID:"+res.id_usuario);

        this.servicioBackService.setNuevoResponsable(this.loginservice.getToken(), id_ticket, res.correo).subscribe(data => {
          console.log(data);
          resolve(data.mensaje == "responsable actualizado");
        });
      }
      
    })
    
    //Retorna TRUE si se pudo y FALSE si no.
    //return true;
  }
  //Métodos que cambian los ID por los nombres
  getRemitente_ID(id:number):remitente{
    let rem:remitente;
    rem=new remitente(100,"Juanito Perez","Juanito@gmail.com");
    if(id==101){
      rem=new remitente(101,"Laura Acuña","Laura@gmail.com");
    }
    else if(id==102){
      rem=new remitente(102,"Jaime Lopez","Jaime@gmail.com");
    }  
    else if(id==103){
      rem=new remitente(103,"Yulixa Jimenez","Yulixa@gmail.com");
    }  
    else if(id==104){
      rem=new remitente(104,"Estefanya Hayala","Estefanya@gmail.com");
    }  
    else if(id==105){
      rem=new remitente(105,"Claudia Martinez","Claudia@gmail.com");
    }  
    else if(id==106){
      rem=new remitente(106,"DaviD Rodriguez","David@gmail.com");
    }  
    else if(id==107){
      rem=new remitente(107,"Jeisson Castro","Jeisson@gmail.com");
    }  
    else if(id==108){
      rem=new remitente(108,"Daniela Torres","Daniela@gmail.com");
    } 
    else if(id==111){
      rem=new remitente(111,"Sara Miller","Sara@gmail.com");
    } 
    return rem;
  }
  getCategoria_ID(id:number):Promise<string>{
    return new Promise<string>((resolve) => {
      this.servicioBackService.getCategoriaTK(id).subscribe(data => {
        //console.log(data);
        resolve(data.nombre);
      });
    })
    
    /* let categoria:string="";
    if(id==1){
      categoria="Solicitud";
    }
    else if(id==2){
      categoria="Quejas";
    }
    else if(id==3){
      categoria="Documentos";
    }  
    else if(id==4){
      categoria="Otros (Sin items)";
    }  
    return categoria; */
  }
  getItem_ID(id:number | null): Promise<string>{
    let item:string="N/A";

    return new Promise<string>((resolve) => {
      this.servicioBackService.getItem(id).subscribe(data => {
        resolve(data.nombre);
      });
    })

    
    /* if(id==1){
      item="Cambio de grupo";
    }
    else if(id==2){
      item="Problema de acceso";
    }
    else if(id==3){
      item="Revisión de contrato";
    }
    else if(id==4){
      item="Falla en el servicio";
    }
    else if(id==5){
      item="Retraso en la entrega";
    }
    else if(id==7){
      item="Retraso en la entrega";
    }
    else if(id==8){
      item="Facturación incorrecta";
    }
    return item; */
  }
  //Método que busca un responsable por su ID
  getResponsable_ID(email: string):Promise<responsable> | null{
    let responsableEncontrado: responsable | null = null;
    
    return new Promise<responsable>((resolve) => {
      this.servicioBackService.getResponsableTicket(email).subscribe(data => {
        (typeof(data.mensaje) != 'undefined') ? console.log(data) : ()  => {
          responsableEncontrado = new responsable(data.id, data.name, data.email);
          resolve(responsableEncontrado);
        };
      });
    })
    
    
    // Inicializa con valor nulo
// Se busca al responsable por ID y se retorna en el objeto Responsable
    /* if(id==1){
      responsableEncontrado = new responsable(1, "Coordinación Tecnología en Sistematización Datos e Ingeniería en Telemática", "tecsistematizaciondatos@udistrital.edu.co");
    }
    else if (id == 201) {
      responsableEncontrado = new responsable(201, "Wanumen", "wanumen@gmail.com");
    }else if(id==202){
      responsableEncontrado = new responsable(202, "Sonia", "sonia@gmail.com");
    }
    else if(id==203){
      responsableEncontrado = new responsable(203, "Peter", "peter@gmail.com");
    }
    else if(id==204){
      responsableEncontrado = new responsable(204, "Mariluz", "mariluz@gmail.com");
    }
    else if(id==205){
      responsableEncontrado = new responsable(205, "Mireya", "mireya@gmail.com");
    } */
    //return responsableEncontrado;
  }
  getEstado_ID(id: number): string {
    let estado: string = "";
    if (id == 1) {
        estado = "Pendiente";
    } else if (id == 2) {
        estado = "En proceso";
    } else if (id == 3) {
        estado = "Completada";
    }
    return estado;
  }
  //Método que trae los estados registrados
  getEstados(): Estado[] {
    const estados: Estado[] = [
      new Estado(1, 'Pendiente'),
      new Estado(2, 'En proceso'),
      new Estado(3, 'Completada')
    ];
    return estados;
  }

getPrioridad_ID(id: number | null): string | null {
    let prioridad: string = "Sin asignar";
    if (id == 1) {
        prioridad = "Baja";
    } else if (id == 2) {
        prioridad = "Media";
    } else if (id == 3) {
        prioridad = "Alta";
    }
    return prioridad;
}
getPrioridades():Prioridad[]{
  const prioridad: Prioridad[]=[
  new Prioridad(1,"Baja"),
  new Prioridad(2,"Media"),
  new Prioridad(3,"Alta")
];
  return prioridad;
}
getComentarios(token: number): Promise<Comentario[] | null> {
  this.comentarios = null;

  return new Promise<Comentario[] | null>(resolve => {
    this.servicioBackService.comentariosTicket(token).subscribe(data => {
      console.log(data);
      (data.length > 0) ? this.comentarios = [] : null;
      for(const coment of data){
        const fecha = coment.created_at.split("T");
        this.comentarios?.push(new Comentario(coment.id, coment.comentario, fecha[0]));
      }
      resolve(this.comentarios)
    });
  });

  /* if (token == 103) {
    let comentario1 = new Comentario(1, "Envíar un correo a tecsistematizaciondedatos@gmail.com para solucionar la problematica", new Date());
    let comentario2 = new Comentario(2, "Otro comentario para el token 1", new Date());
    this.comentarios = [comentario1, comentario2];
  }
  if (token == 10) {
    let comentario1 = new Comentario(1, "Envíar un correo a tecsistematizaciondedatos@gmail.com para solucionar la problematica", new Date());
    let comentario2 = new Comentario(2, "Otro comentario para el token 1", new Date());
    this.comentarios = [comentario1, comentario2];
  }

  if (token == 2) {
    let comentario3 = new Comentario(3, "Comentario para el token 2", new Date());
    let comentario4 = new Comentario(4, "Otro comentario para el token 2", new Date());
    let comentario5 = new Comentario(5, "Tercer comentario para el token 2", new Date());
    this.comentarios = [comentario3, comentario4, comentario5];
  }

  return this.comentarios; */
}
//Método para agregar un comentario
agregar_comentario(token:number,comentario:string):boolean{
  console.log("El token del ticket al cual se le agrega un comentario es:",token);
  console.log("El comentario es:",comentario);
  let numeroRandom = Math.floor(Math.random() * (50 - 5 + 1)) + 5;
  
  let comentario_nuevo=new Comentario (numeroRandom,comentario, this.datePipe.transform(new Date(), 'yyyy-MM-dd') ?? "0000/00/00"/* new Date() */);
  if(this.comentarios){
    this.comentarios.push(comentario_nuevo);
  }
  else{
    this.comentarios = [comentario_nuevo];
    //this.comentarios.push(comentario_nuevo);
  }
  //Retorna TRUE si se pudo y FALSE si no se pudo agregar el comentario
  return true;
}
//Método para editar un comentario
editar_comentario(id_comentario:number,comentario:string):boolean{
  console.log("Id del comentario: " + id_comentario);
  console.log("Comentario nuevo: " + comentario);
  if (this.comentarios) {
    const comentarioEncontrado = this.comentarios.find(c => c.id_comentario === id_comentario);
    if (comentarioEncontrado) {
      comentarioEncontrado.comentario = comentario;
      comentarioEncontrado.fecha=this.datePipe.transform(new Date(), 'yyyy-MM-dd') ?? "0000/00/00";
      return false;
    }
    return true;
    
  }
  else{
    return true;
  }
} 
eliminar_comentario(id_comentario: number): boolean {
  console.log("El ID del comentario a eliminar es:",id_comentario);
  if (this.comentarios) {
    const index = this.comentarios.findIndex(c => c.id_comentario === id_comentario);
    if (index !== -1) {
      this.comentarios.splice(index, 1);
      return true; // Comentario eliminado exitosamente
    }
  }
  return false; // Comentario no encontrado
}

//----------------------CRUD TICKETS------------------------
crear_ticket(id_categoria:number,id_item:number | null,asunto:string,descripcion:string):boolean{
  //1.El Token no se tiene, porque se esta creando hasta el momento el ticket
  //2.Id_usuario-Invocar el método de conseguir ID usuario según el correo
  //3. Id_categoria,id_item,asunto y descripcion si se tienen
  //4. ID de responsable inicia siendo la coordinación
  /*
  5.Ya se tiene el método de conseguir la fecha actual aunque es mejor con el Back xd
  6.La fecha limite empieza siendo 15 días la fecha actual
  7.El ID del estado empieza siendo "1" (pendiente)
  8.El ID de la prioridad inicia como baja
  */
  //Variable estática
  console.log("ID de la categoría",id_categoria);
  console.log("ID del item",id_item);
  console.log("Asunto",asunto);
  console.log("Descripcion",descripcion);
  console.log("Fecha:",this.getFechaActual());

  this.servicioBackService.createTicket(asunto, descripcion, this.loginservice.getIdUsuario(), id_categoria, id_item ?? 0)
    .subscribe(data => {
      console.log(data);
    });
  //Retorna TRUE si se creo el Ticket, FALSE si hubo algún error en el servidor
  return true;
}
//Retorna true si se pudo editar
//Falta agregar la validación acerca de que tenga un comentario nuevo al momento de marcar como completado el Ticket
editar_ticket(token:number,id_usuario:number,id_categoria:number,id_item:number | null,asunto:string,descripcion:string, correo_responsable: string | null, fecha_solicitud: String, id_estado:number, id_prioridad:number | null, comentarios: Comentario[] | null):boolean{
  console.log("token:", token);
  console.log("id_usuario:", id_usuario);
  console.log("id_categoria:", id_categoria);
  console.log("id_item:", id_item);
  console.log("asunto:", asunto);
  console.log("descripcion:", descripcion);
  console.log("id_responsable:", correo_responsable);
  console.log("fecha_solicitud:", fecha_solicitud);
  console.log("id_estado:", id_estado);
  console.log("id_prioridad:", id_prioridad);
  console.log("comentarios:", comentarios);

  if(correo_responsable == null || id_item == null || id_prioridad == null){
    return false
  }

  this.servicioBackService.updateTicket(
      this.loginservice.getToken(), 
      token,
      asunto,
      descripcion,
      correo_responsable,
      id_usuario,
      id_categoria,
      id_item,
      id_estado,
      id_prioridad,
      comentarios ?? []
    ).subscribe(data => {
      console.table(data);
    });

  return true;
}
//Retorna true si se pudo eliminar el Ticket
eliminar_ticket(token: number): Promise<boolean> {
  console.log("El token del Ticket a eliminar es:"+token);

  return new Promise<boolean>(resolve => {
    this.servicioBackService.deleteTicket(this.loginservice.getToken(), token).subscribe((data: any) => {
      console.log(data);
      resolve(data.mensaje == "ticket eliminado con éxito");
    });
  });
}

formatoDateparaInput(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

formatoInputDateparaSQL(inputDate: string): string {
  const parts = inputDate.split('-');
  const year = parts[0];
  const month = String(Number(parts[1])).padStart(2, '0');
  const day = String(Number(parts[2])).padStart(2, '0');
  return `${year}-${month}-${day}T00:00:00Z`;
}
//-----------------------------CRUD RECLAMOS
//Método que trae todas las quejas, inicialmente trae las quejas que tengan un false (SIN VER) en su estado
getQuejas(): Promise<queja[] | null>{
  this.quejas = [];

  return new Promise<queja[] | null>(resolve => {
    this.servicioBackService.getQuejas("0").subscribe(data => {
      for(const i of data){
        this.quejas?.push(new queja(i.id, i.asunto, i.descripcion, Boolean(i.visto)));
      }
      resolve(this.quejas);
    });
  });

  /* this.quejas= [
    new queja(1,"Queja de ejemplo 1", "Descripción de la queja 1", false),
    new queja(3,"Queja de ejemplo 3", "Descripción de la queja 3", false),
    new queja(5,"Queja de ejemplo 5", "Descripción de la queja 5", false)
  ]; 
  return this.quejas;*/
}
//Método que filtra los reclamos según el estado
//Si llega NULL por parametro significa que el usuario desea TODOS los reclamos,
//TRUE para los reclamos vistos y FALSE para los no visots
filtrar_Reclamos(estado:boolean | null): Promise<queja[] | null>{
  this.quejas = [];

  
  const visto = (estado != null) ? String(Number(estado)) : "";
  
  return new Promise<queja[] | null>(resolve => {
    this.servicioBackService.getQuejas(visto).subscribe(data => {
      for(const i of data){
        Boolean(i.visto)
        this.quejas?.push(new queja(i.id, i.asunto, i.descripcion, Boolean(i.visto)));
      }
      resolve(this.quejas);
    });
  });
  
  /* console.log("El estado a filtrar es: ", estado, typeof(estado));
  this.quejas= [
    new queja(1,"Queja de ejemplo 1", "Descripción de la queja 1", false),
    new queja(2,"Queja de ejemplo 2", "Descripción de la queja 2", true),
    new queja(3,"Queja de ejemplo 3", "Descripción de la queja 3", false),
    new queja(4,"Queja de ejemplo 4", "Descripción de la queja 4", true),
    new queja(5,"Queja de ejemplo 5", "Descripción de la queja 5", false)
  ];
  return this.quejas; */
}

//Método que recibe el asunto y descripción de una queja para registrarla inicialmente con estado "NO VISTO",
reclamar(asunto:string, descripcion:string):boolean{
  console.log("El asunto de la nueva queja es: " + asunto);
  console.log("Con descripción: " + descripcion);
  let id_quejaAleatorio = 10 + ( Math.random() * (20 - 10 + 1));
  let reclamo= new queja(id_quejaAleatorio,asunto,descripcion,false);
  this.quejas?.push(reclamo);
  this.servicioBackService.createReclamo(asunto, descripcion).subscribe(data => {
    console.log(data);
  });
  //Retorna TRUE si se registro de forma correcto, FALSE sí no se pudo
  return true;
}
getReclamo(id_reclamo:number): queja | null{
  if(this.quejas!=null){
    let quejaEncontrada = this.quejas.find(queja => queja.id_queja === id_reclamo);
    return quejaEncontrada || null;
  }
  else{
    return null;
  } 
}
//Función que cambia el estado de un reclamo
//Retorna TRUE si se pudo, FALSE sino
cambiar_estadoReclamo(id_reclamo: number, estado: boolean): boolean {
  console.log("El  ID del reclamo es:"+id_reclamo);
  console.log("El nuevo estado es:"+estado, typeof(estado));

  this.servicioBackService.cambiarEstadoQueja(id_reclamo, estado).subscribe(data => {
    console.log(data);
  });
  //Basicamente lo de abajo se puede borrar porque solo funciona para datos estáticos
  if (this.quejas != null) {
    const quejaEncontrada = this.quejas.find(q => q.id_queja === id_reclamo);
    if (quejaEncontrada) {
      quejaEncontrada.visto = estado;
      return true;
    }
    return false; // Si no se encontró la queja con el ID especificado
  }
  return false; // Si el arreglo de quejas es null
}
//Método que elimina una queja según su ID
//Retorna TRUE si se pudo eliminar, FALSE si no.
eliminar_reclamo(id_reclamo:number):boolean{
  console.log("El ID del reclamo a eliminar es:"+id_reclamo);
  return true;
}

//Método que busca un usuario según su correo para administrarlo
buscar_usuario(correo:string): Promise<usuario  | null>{
  console.log(correo);

  return new Promise<usuario  | null>((resolve, reject) => {
    this.servicioBackService.getDatosUsuario(correo, this.loginservice.getToken()).subscribe(data => {
      
      if(data.length > 0){
        const tipo = (data[0].tipo_usuario_id) ?? 4;

        if(correo == data[0].email){
          let usu= new usuario(data[0].id, data[0].name, data[0].email, "", tipo);
          resolve(usu);
        }
      }
      
      resolve(null);
    });
  });
  
}
//Validar permisos, retorna TRUE si todavía los tiene, false si no
//Pasar a Login service el valor nuevo de la Cookie
validar_permisosMA(correo:string):boolean{
  console.log("El correo del usuario al cual se buscaran sus correos son:"+correo);
  return false;
}
//----------------------------------CRUD de usuarios --------------------------
//Método que registra a un usuario, si tiene ID 3 es Estudiante, 2 profesor, NULL administrador
registrar_usuario(nombre:string,correo:string,password:string,id_tipo:number | null):boolean{
  console.log("INFORMACIÓN DEL USUARIO");
  console.log("Nombre:"+nombre);
  console.log("Correo:"+correo);
  console.log("Password:"+password);
  console.log("ID tipo de usuario:"+id_tipo);
  const idTipo: number = id_tipo != null ? id_tipo : 4;

  const form = new FormData();
  form.append('name', nombre);
  form.append('email', correo);
  form.append('password', password);
  form.append('tipo_usuario_id', String(idTipo));

  this.servicioBackService.crearUsuario(this.loginservice.getToken(), form).subscribe(data => {
    console.log(data);
  })

  return true;
}
//Método que modifica a un usuario con la información ingresada
//Si llega NULL la contraseña significa que el usuario no la quiso cambiar
editar_usuario(id_usuario:number,nombre:string,correo:string,password:string | null,id_tipo:number | null, permiso_noticias:boolean, permiso_preguntas:boolean, permiso_MA:boolean):boolean{
  console.log("INFORMACIÓN MODIFICADA DEL USUARIO");
  console.log("ID del usuario:"+id_usuario);
  console.log("Nombre nuevo:"+nombre);
  console.log("Correo nuevo:"+correo);
  console.log("Contraseña (opcional) nueva:"+password);
  console.log("ID tipo de usuario:"+id_tipo);
  //Se deben cambiar los permisos del usuario
  console.log("Permiso de noticias:"+permiso_noticias);
  console.log("Permiso de preguntas:"+permiso_preguntas);
  console.log("Permiso de mesa de ayuda:"+permiso_MA);
  
  this.servicioBackService.actualizarDatosUsuario(this.loginservice.getToken(), id_usuario, nombre, correo, password, id_tipo,  permiso_noticias, permiso_preguntas, permiso_MA).subscribe(data => {
    console.log(data);
  });

  return true;
}
//Método que limina a un usuario
eliminar_usuario(id_usuario:number):boolean{
  console.log("ID del usuario a eliminar:"+id_usuario);
  return true;
}
//Cambia la contraseña por una nueva
cambiar_contraseña(correo:string, nueva_password:string):boolean {
  console.log("Correo del usuario a quien le cambia la contraseña:"+correo);
  console.log("Nueva contraseña: "+nueva_password);

  this.servicioBackService.updatePassword(this.loginservice.getToken(), nueva_password, correo).subscribe(data => {
    console.log(data);
  });

  return true;
}

//------------------------------------------------------------------------------

cargarUsuarios(form: FormData): Observable<any>{
  console.log("eche?");
  return this.servicioBackService.cargarUsuarios(this.loginservice.getToken(), form);
}

}