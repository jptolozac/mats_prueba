import { Component, OnInit, ViewChild } from '@angular/core';
import { Ticket } from '../modelo-ticket';
import { MesaAyudaService } from '../mesa-ayuda.service';
import { LoginService } from 'src/app/login.service';
import { MensajesService } from 'src/app/mensajes.service';
import { CRUDTicketsComponent } from '../crud-tickets/crud-tickets.component';
import {Router } from '@angular/router';
@Component({
  selector: 'app-lista-solicitudes',
  templateUrl: './lista-solicitudes.component.html',
  styleUrls: ['./lista-solicitudes.component.scss']
})
export class ListaSolicitudesComponent  implements OnInit{
  //Variable que permite acceder a los métodos del componente con el CRUD de los Tickets
  @ViewChild(CRUDTicketsComponent) crudTicketsComponent: CRUDTicketsComponent;
  //Total de Tickets cargados
  cantidad_tickets:number;
  //Arreglo que guarda todos los Tickets
  tickets:Ticket[] | null;
  //Variable que guarda el ID de un Ticket para ver, editar o eliminar.
  id_ticket:number;
  //Variables que abren o cierran las ventanas de ver o editar
  ventana_editarTicket:boolean=false;
  ventana_verTicket:boolean=false;
  //------Variables de los Tickets----
  categoriasID: string[] = [];
  estadosID: string[] = [];
  itemsID: string[] = [];
  remitentesID: string[] = [];
  prioridadesID: (string | null)[] = [];
  responsablesID: (string | null)[] = [];
  //Variable para tipo de usuario
  tipo_usuario:string;
  constructor(private servicio_MesaAyuda:MesaAyudaService,private loginservice:LoginService,private servicio_mensajes:MensajesService, private router:Router){
    this.cantidad_tickets=0;
    this.tickets=null;
    this.tipo_usuario="";
  }
  ngOnInit(): void {
    this.tipo_usuario=this.loginservice.getTipoUsuario();
    this.servicio_MesaAyuda.getTickets().then(data => {
      if( this.servicio_MesaAyuda.getTickets()!=null){
        this.tickets = data;
        if(this.tickets!=undefined){
          this.cantidad_tickets=this.tickets?.length;
        }
        else{
          this.cantidad_tickets=0;
        }
      }else{
        this.cantidad_tickets=0;
      }
    })
    
    /*
    this.servicio_MesaAyuda.getTickets().then(data => {
      console.log(data);
      this.tickets = data

      if(this.tickets){
        this.cantidad_tickets=this.tickets.length;
        for(let i=0; i<this.tickets.length; i++){
          this.servicio_MesaAyuda.getCategoria_ID(this.tickets[i].id_categoria).then(async (categoria) => {
            this.categoriasID.push(categoria);
            //usar asincronismo a lo loco aqui
          });
          this.estadosID.push(this.servicio_MesaAyuda.getEstado_ID(this.tickets[i].id_estado));
          this.servicio_MesaAyuda.getItem_ID(this.tickets[i].id_item).then(data => {
            this.itemsID.push(data);
          })
          this.remitentesID.push(this.servicio_MesaAyuda.getRemitente_ID(this.tickets[i].id_usuario).name);
          this.prioridadesID.push(this.servicio_MesaAyuda.getPrioridad_ID(this.tickets[i].id_prioridad));
          this.servicio_MesaAyuda.getResponsable_ID(this.tickets[i].email_responsable)?.then(data => {
            let res = data;
            if(res!=null){
              this.responsablesID.push(res.name);
            }
          });
          
        }  
      } */ 

    }
  
  //Carga los tickets según los filtros
  aplicarFiltros(filtros: any): void {
    filtros.responsable = true;
    filtros.lista = true;
    console.log("filtros", filtros);
    this.servicio_MesaAyuda.filtrar(filtros).then(data => {
      let tickets = data;
      if(data != null){
        this.tickets=tickets;
      }else{
        this.servicio_mensajes.msj_informar("No se han encontrado Tickets que cumplan con los filtros.");
      }
    });
    
  }
  //Método que envía el ID del Ticket que se desea visualizar, y activa la ventana emergente
  ver_ticket(ticket: Ticket):void {
    this.crudTicketsComponent.verTicket(ticket, true);
  }
  //Método que retorna un Ticket según el ID seleccionado
  async eliminar_ticket(id_ticket: number): Promise<void> {
    const confirmado = await this.servicio_mensajes.msj_confirmar(
      "¿Está seguro que desea eliminar el Ticket? Está acción es irreversible",
      "Confirmar",
      "Cancelar"
    );
    
    if (confirmado) {
      this.servicio_MesaAyuda.eliminar_ticket(id_ticket).then(data => {
        console.log(data);
        this.servicio_MesaAyuda.getTickets();
        const eliminado = data;
        if (eliminado) {
          //Invocar al método que recargue todos los Tickets
          this.servicio_mensajes.msj_exito_async("Se ha eliminado el Ticket!").then(data => {
            window.location.reload();
          });
        } else {
          this.servicio_mensajes.msj_errorPersonalizado("No se ha podido eliminar el Ticket!");
        }

      });
    }
  }
  //Métodos que abren o cierran la ventana de editar y envía el ID del ticket en específico
  editar_ticket(id_ticket:number):void {
    this.crudTicketsComponent.getTicket(id_ticket,true);
  }
  CierreVentanaEdit(): void {
    this.ventana_editarTicket = false;
  }
  //Método que cierra la ventana de Ver un Ticket
  CierreVentanaVer(): void {
    this.ventana_verTicket = false;
  }
  //Función que redirige al usuario a las opciones del módulo de mesa de ayuda
  volver_MA(){
    this.router.navigate(['/Mesa_Ayuda']);
  }


}
