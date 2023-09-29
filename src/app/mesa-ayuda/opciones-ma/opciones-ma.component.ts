import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/login.service';
import { MesaAyudaService } from '../mesa-ayuda.service';
import { MensajesService } from 'src/app/mensajes.service';

@Component({
  selector: 'app-opciones-ma',
  templateUrl: './opciones-ma.component.html',
  styleUrls: ['./opciones-ma.component.scss']
})
export class OpcionesMAComponent implements OnInit {
  crear_ticket: boolean;
  crear_reclamo: boolean;
  lista_reclamos: boolean;
  ventana_administrar:boolean;
  ver_categorias:boolean;
  ver_items:boolean;
  ocultar=false;
  tipo_usuario:string;
  permiso_usuario:string;
  //Nuevo
  abrir_ventana:boolean;
  //---
  constructor(private router: Router, private loginService:LoginService, private servicio_MA:MesaAyudaService,private servicio_mensajes:MensajesService) {}

  ngOnInit(): void {
    this.crear_ticket = false;
    this.crear_reclamo = false;
    this.lista_reclamos=false;
    this.ventana_administrar=false;
    this.ver_categorias=false;
    this.ver_items=false;
    this.abrir_ventana=false;
    this. tipo_usuario=this.loginService.getTipoUsuario();
    this.permiso_usuario=this.loginService.getPermisoMesaAyuda();
  }

  crearTicket() {
    this.crear_ticket = true;
  }

  CierreVentanaCrear(): void {
    this.crear_ticket = false;
  }

  realizar_reclamo() {
    this.crear_reclamo = true;
  }

  CierreRealizarReclamo() {
    this.crear_reclamo = false;
  }
  mostrar_listaReclamos(){
    this.lista_reclamos=true;
  }
  Cierrre_listaReclamos(){
    this.lista_reclamos=false;
  }

  URL_listaTickets() {
    this.router.navigate(['/Lista_Tickets']);
  }

  URL_listaSolicitudes() {
    this.router.navigate(['/Lista_Solicitudes']);
  }
  URL_solicitudesAsignadas(){
    this.router.navigate(['/Solicitudes_Asignadas']);
  }
  mostrar_AdmUsuarios(){
    this.ventana_administrar=true;
  }
  cerrar_AdmUsuarios(){
    this.ventana_administrar=false;
  }
  mostrar_AdmCategorias(){
    this.ver_categorias=true;
  }
  cerrar_AdmCategorias(){
    this.ver_categorias=false;
  }
  mostrar_AdmItems(){
    if(this.servicio_MA.getCategorias()!=null){
      this.ver_items=true;
    }
    else{
      this.servicio_mensajes.msj_informar("Debe existir al menos una categoría para administrar los ítems.");
    }
    
  }
  cerrar_AdmItems(){
    this.ver_items=false;
  }
  mostrar_cargaMasiva(){
    this.abrir_ventana=true;
  }
  cerrar_ventana(){
    this.abrir_ventana=false;
  }
}
