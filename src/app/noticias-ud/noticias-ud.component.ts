import { Component, OnInit } from '@angular/core';
import { NoticiasService } from '../noticias.service';

@Component({
  selector: 'app-noticias-ud',
  templateUrl: './noticias-ud.component.html',
  styleUrls: ['./noticias-ud.component.scss']
})
export class NoticiasUdComponent implements OnInit{
  constructor(private noticia_servicio:NoticiasService){}
  ngOnInit(): void {
    this.noticia_servicio.setIdentificador('UD');  
  }
}
