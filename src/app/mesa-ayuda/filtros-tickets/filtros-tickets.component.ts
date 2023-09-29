import { Component, EventEmitter, Output } from '@angular/core';
import { MesaAyudaService } from '../mesa-ayuda.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-filtros-tickets',
  templateUrl: './filtros-tickets.component.html',
  styleUrls: ['./filtros-tickets.component.scss']
})
export class FiltrosTicketsComponent {
  @Output() filtrosAplicados= new EventEmitter<any>();
  prioridadSeleccionada: string = 'null';
  estadoSeleccionado: string = 'null';
  correo:string;
  filtrarPorCorreo: boolean;
  constructor(private router:Router) {
    this.correo="";
    if(this.router.url === '/Lista_Solicitudes' || this.router.url === '/Solicitudes_Asignadas'){
      this.filtrarPorCorreo=true;
    } 
  }

  filtrar(): void {
    const filtros = {
      prioridad: this.prioridadSeleccionada,
      estado: this.estadoSeleccionado,
      correo:this.correo
    };

    this.filtrosAplicados.emit(filtros);
  }
}
