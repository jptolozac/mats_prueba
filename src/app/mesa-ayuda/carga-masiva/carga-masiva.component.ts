import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MesaAyudaService } from '../mesa-ayuda.service';
import { MensajesService } from 'src/app/mensajes.service';

@Component({
  selector: 'app-carga-masiva',
  templateUrl: './carga-masiva.component.html',
  styleUrls: ['./carga-masiva.component.scss']
})
export class CargaMasivaComponent {
    //Variables que abren o cierran la ventana de carga masiva
    @Input() abrir_ventana:boolean;
    @Output() cerrar_ventana= new EventEmitter<void>();
    csvFile: File | null;
    //Métodos que inicializan las variables
    constructor(private servicio_MA: MesaAyudaService, private servicio_mensajes:MensajesService){
      this.limpiar_variables();
    }
    limpiar_variables(){
      this.csvFile=null;
    }
    
    onFileSelected(event: any) {
      this.csvFile = event.target.files[0];
    }
  
    onDragOver(event: Event) {
      event.preventDefault();
    }
  
    onDrop(event: DragEvent) {
      event.preventDefault();
      const files = event.dataTransfer?.files;
      if (files && files.length > 0) {
        this.csvFile = files[0];
      }
    }
    //Método que envía el archivo a Laravel, faltaría agregar mensaje de exito o error
    async enviarArchivo() {
      if (this.csvFile) {
        if(await this.servicio_mensajes.msj_confirmar("¿Está seguro que desea subir el archivo?", "Confirmar", "Cancelar")){
          const formData = new FormData();
          formData.append('carga_usuarios', this.csvFile, this.csvFile.name);
          
          this.servicio_MA.cargarUsuarios(formData).subscribe(data => {
            if(data.mensaje == "Usuarios insertados correctamente"){
              this.servicio_mensajes.msj_exito("Se han registrado los usuarios");
            }else{
              this.servicio_mensajes.msj_errorPersonalizado("No se pudieron cargar los usuarios");
            }
          }, error => {
            this.servicio_mensajes.msj_errorPersonalizado("No se pudieron cargar los usuarios, asegurese que no hayan estudiantes repetidos");
          });
        
          // Aquí deberías hacer la petición HTTP para enviar el archivo a Laravel
          this.cerrar();

        }
      }
    }
    cancelarArchivo() {
      this.csvFile = null;
    }
    cerrar(): void {
      this.abrir_ventana=false;
      this.cerrar_ventana.emit();
      this.limpiar_variables();
    }


}
