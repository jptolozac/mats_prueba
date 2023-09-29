import { Component, OnInit } from '@angular/core';
import { NoticiasService } from '../noticias.service';

@Component({
  selector: 'app-noticias-interes',
  templateUrl: './noticias-interes.component.html',
  styleUrls: ['./noticias-interes.component.scss']
})
export class NoticiasInteresComponent implements OnInit {
  constructor(private noticia_servicio:NoticiasService){}
  ngOnInit(): void {
    this.noticia_servicio.setIdentificador('Interes');
    
  }
}
