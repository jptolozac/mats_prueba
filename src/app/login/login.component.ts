import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private error:boolean;
  constructor(private router: Router, private loginService:LoginService){
    this.error=false;
  }
  volverGeneral(){
    this.router.navigate(['']);
  }
  login(form:NgForm){
    const usuario=form.value.usuario;
    const password=form.value.password;
    this.loginService.login(usuario,password).then((token) => {
      //alert(token);
      if(token !=''){
        this.router.navigate(['/Noticias_UD']);
      }
      else{
        this.setError(true);
      }
    });
    
  }
  getError(){
    return this.error;
  }
  setError(error:boolean){
    this.error=error;
  }
}
