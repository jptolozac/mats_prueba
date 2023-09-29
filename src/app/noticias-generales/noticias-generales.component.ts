import { Component,OnInit } from '@angular/core';
import { NoticiasService } from '../noticias.service';

@Component({
  selector: 'app-noticias-generales',
  templateUrl: './noticias-generales.component.html',
  styleUrls: ['./noticias-generales.component.scss']
})
export class NoticiasGeneralesComponent implements OnInit {
  constructor(private noticia_servicio:NoticiasService){}
  ngOnInit(): void {
    this.noticia_servicio.setIdentificador('Publico');
  }
}
