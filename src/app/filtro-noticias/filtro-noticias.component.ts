import { Component, Input, OnInit } from '@angular/core';
import {EventEmitter} from '@angular/core';
import { Output } from '@angular/core';
import { LoginService } from '../login.service';
import { NavigationExtras, Router } from '@angular/router';
import { NoticiasService } from '../noticias.service';
@Component({
  selector: 'app-filtro-noticias',
  templateUrl: './filtro-noticias.component.html',
  styleUrls: ['./filtro-noticias.component.scss']
})
export class FiltroNoticiasComponent implements OnInit{
  cantidad_noticias:number[] = [];

  @Input() total_noticias:number;
  cantNoticias: number;

  desactivar:boolean[];
  txt_buscar:string;
  @Output() enviarTexto = new EventEmitter<string>();
  @Output() tam = new EventEmitter<string>();
  tipo_usuario:string;
  permiso_usuario: boolean;
  constructor(private login:LoginService, private router:Router, private servicioNoticias:NoticiasService){}
  cargar_cantidad(event:any) {
    const seleccion=event.target.value;
    this.tam.emit(seleccion);
  }

  enviar() {
    this.enviarTexto.emit(this.txt_buscar);
  }
  ngOnInit(): void {
    this.generarOpcionesSelect();
    this.tipo_usuario=this.login.getTipoUsuario();
    this.permiso_usuario = this.login.getPermisoNoticias() == 'true';
    //this.permiso_usuario = this.login.getPermisoUsuario();
    
  }
  generarOpcionesSelect(): void {
    this.servicioNoticias.getCantidadNoticias().subscribe((data) => {
      this.cantNoticias = data;
      const rangoMaximo = Math.ceil(this.cantNoticias / 5) * 5;
      console.log('cantidad', this.cantNoticias);
      for (let i = 5; i <= rangoMaximo; i += 5) {
        this.cantidad_noticias.push(i);
      }
    });
    const rangoMaximo = Math.ceil(this.total_noticias / 5) * 5;
    console.log(this.cantidad_noticias);
    for (let i = 5; i <= rangoMaximo; i += 5) {
      this.cantidad_noticias.push(i);
    }
  }
  //Método que enruta a la pestaña para subir noticias si se hace click en el botón
  subir_noticia(){
    this.router.navigate(['subir_noticia']);
  }
}
