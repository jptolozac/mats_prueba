import { Component, OnInit, ViewChild } from '@angular/core';
import { MesaAyudaService } from '../mesa-ayuda.service';
import { LoginService } from 'src/app/login.service';
import { MensajesService } from 'src/app/mensajes.service';
import { Router } from '@angular/router';
import { Ticket } from '../modelo-ticket';
import { CRUDTicketsComponent } from '../crud-tickets/crud-tickets.component';
import { remitente } from '../modelo-remitente';

@Component({
  selector: 'app-solicitudes-asignadas',
  templateUrl: './solicitudes-asignadas.component.html',
  styleUrls: ['./solicitudes-asignadas.component.scss']
})
export class SolicitudesAsignadasComponent  implements OnInit{
  //Variable que permite acceder a algunas funciones del CRUD de los Tickets
  @ViewChild(CRUDTicketsComponent) crudTicketsComponent: CRUDTicketsComponent;
  //Variable que guarda la cantidad de Tickets asignados
  cantidad_tickets:number;
  //Variable que guarda los Ticket asignados
  tickets:Ticket[] | null;
  //Variable que guarda el ID de un Ticket para ver o editar
  id_ticket:number;
  //Abre o cierra las ventandas de ver o editar un Ticket
  ventana_editarTicket:boolean=false;
  ventana_verTicket:boolean=false;
  //------Variables de los Tickets----
  categoriasID: string[] = [];
  estadosID: string[] = [];
  itemsID: string[] = [];
  remitentesID: (remitente | null)[] = [];
  prioridadesID: (string | null)[] = [];
  //Guarda los permisos del usuario
  permiso_usuario:string;
  constructor(private servicio_MesaAyuda:MesaAyudaService,private loginServie:LoginService,private servicio_mensajes:MensajesService, private router:Router){
    this.cantidad_tickets=0;
    this.tickets=null;
    this.permiso_usuario="";
  }
  //Inicializar las variables
  ngOnInit(): void {
      this.permiso_usuario = this.loginServie.getPermisoMesaAyuda();
      this.servicio_MesaAyuda.getTickets_Responsable(this.loginServie.getIdUsuario()).then(data => {
        if(data){
          this.tickets = data;
          if(this.tickets){
            this.cantidad_tickets=this.tickets.length;
          }
          else{
            this.cantidad_tickets=0;
          }
        }
        else{
          this.cantidad_tickets=0;
        }
      });
      
  }
  //Carga los tickets según los filtros
  aplicarFiltros(filtros: any): void {
    filtros.responsable = true;
    console.log("filtros", filtros);
    this.servicio_MesaAyuda.filtrar(filtros).then(data => {
      let tickets = data;
      if(data != null){
        this.tickets=tickets;
      }
      else{
        this.servicio_mensajes.msj_informar("No se han encontrado Tickets que cumplan con los filtros.");
      }
    });
    
  }
  //Métodos que abren y cierran la ventana de VER UN TICKET
  ver_ticket(ticket: Ticket):void {
    this.crudTicketsComponent.verTicket(ticket, true);
  }
  
  editar_ticket(id_ticket:number):void {
    this.crudTicketsComponent.getTicket(id_ticket,true);
  }
  CierreVentanaEdit(): void {
    this.ventana_editarTicket = false;
  }

  CierreVentanaVer(): void {
    this.ventana_verTicket = false;
  }
  volver_MA(){
    this.router.navigate(['/Mesa_Ayuda']);
  }


}
