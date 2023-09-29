import { Component } from '@angular/core';
import { LoginService } from './login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent{
  //Menú hamburgesa
  showMenu: boolean = false;
  constructor(private loginService: LoginService, private router:Router){}
  //Mostrar menú contraido
  toggleMenu() {
    this.showMenu = !this.showMenu;
  }
  //Mensaje de loguearse usado para mostrar Login si va a iniciar sesion o Logout si ya inicio sen
  estalogueado(){
    return this.loginService.estaLogueado();
  }
  //Método para cerrar sesión
  logout(){
    this.loginService.logout();
  }
  inicio(){
    this.router.navigate(['']);
  }
}