import { Component, Input, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Component({
  selector: 'app-pdf-noticia',
  templateUrl: './pdf-noticia.component.html',
  styleUrls: ['./pdf-noticia.component.scss']
})
export class PDFNoticiaComponent implements OnInit{
  @Input() opcion: string | null;
  @Input() id_noticia: number;
  selectedFile: File | null = null;
  pdfURL:string | null = null;
  constructor(private http: HttpClient){}

  ngOnInit(): void {
    console.log(this.opcion);
    if(this.opcion == 'editar'){

    }
  }
  
  cargarArchivoDesdeBackend() {
    // Si la opción es "editar", realizar la solicitud para obtener el archivo PDF del Backend
    if (this.opcion === 'editar' || this.opcion=='ver') {
      
    }
  }

  //Función que resalta el áre de arrastrar y soltar
  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const target = event.currentTarget as HTMLElement | null;
    if (target) {
      target.classList.add('drag-over');
    }
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const target = event.currentTarget as HTMLElement | null;
    if (target) {
      target.classList.remove('drag-over');
    }
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const target = event.currentTarget as HTMLElement | null;
    if (target) {
      target.classList.remove('drag-over');
    }

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.selectedFile = files[0];
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (files && files.length > 0) {
      this.selectedFile = files[0];
    }
  }

  eliminarArchivo() {
    this.selectedFile = null;
  }
}