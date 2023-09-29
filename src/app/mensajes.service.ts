import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
@Injectable({
  providedIn: 'root'
})
export class MensajesService {

  constructor() { }
  //Mensaje de datos erroneos
  msj_datosErroneos(){
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Por favor, verifique que la información ingresada sea la adecuada',
    })
  }
  //Mensaje de confirmar
  async msj_confirmar(titulo:string,confirmar:string,cancelar:string): Promise<boolean> {
    const result = await Swal.fire({
      title:titulo,
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
    });
    return result.isConfirmed;
  }
  //Mensaje de éxito
  msj_exito(titulo:string){
    Swal.fire(titulo, '', 'success')
  }

  msj_exito_async(titulo:string){
    return Swal.fire(titulo, '', 'success')
  }

  //Mensaje que informa
  msj_informar(descripcion:string){
    Swal.fire(descripcion, '', 'info');
  }
  msj_errorPersonalizado(texto:string){
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: texto,
    })
  }
}