import { Component,EventEmitter,Input,Output } from '@angular/core';
import { Categoria } from '../categoria.model';

@Component({
  selector: 'app-lista-categorias',
  templateUrl: './lista-categorias.component.html',
  styleUrls: ['./lista-categorias.component.scss']
})
export class ListaCategoriasComponent {
  @Input() categorias: Categoria[] = [];
  @Output() categoriaEditada = new EventEmitter<Categoria>();
  @Output() categoriaEliminada = new EventEmitter<Categoria>();
  @Output() categoriaSubida = new EventEmitter<void>();
  editarCategoria(categoria:Categoria) {
    this.categoriaEditada.emit(categoria);
  }
  eliminarCategoria(categoria:Categoria) {
    this.categoriaEliminada.emit(categoria);
  }
  subirCategoria() {
    this.categoriaSubida.emit();
  }
}