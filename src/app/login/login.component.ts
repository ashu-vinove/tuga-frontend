import { Component, OnInit ,AfterContentInit ,ElementRef } from '@angular/core';
import { Router} from '@angular/router';
import {FacebookService, FacebookLoginResponse,FacebookInitParams} from 'ng2-facebook-sdk/dist';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [AuthService,FacebookService]  
})
export class LoginComponent implements OnInit ,AfterContentInit {

  public user:any;
  public cb:any;

  constructor(
    private _auth: AuthService,
    private router: Router,
    private elementRef:ElementRef,
    private fb: FacebookService
    
  ) { 
     let fbParams: FacebookInitParams = {
                  appId: '370960789960977',
                  xfbml: true,
                  version: 'v2.6'
                  };
    this.fb.init(fbParams);
  }

  ngOnInit() {
    this.user={username:'',password:''}
  }

  ngAfterContentInit() {

  }

  loginUsr() {
    this._auth.loginUsr(this.user)
      .map(res => res.json())
      .subscribe(
        data => this.loginsuccess(data),
        err => this.handleError(err),
        () => this.done()
      )
  }

  facebookLogin(){
    this._auth.fbLogin()
      .map(res => res.json())
      .subscribe(
        data => this.loginsuccess(data),
        err => this.handleError(err),
        () => this.done()
      )
  }

  loginsuccess(d){
    this.cb=d.msg||'';    
    if(d.auth_token) {
      localStorage.setItem('auth_token',d.auth_token)
      this.router.navigate(['/Profile']);
    };
  }

  fbLogin(): void {
    this.fb.login().then(
      (response: FacebookLoginResponse) => this.facebookCB(response),
      (error: any) => console.error(error)
    );
  }

  facebookCB(res){   
    if(res.authResponse.accessToken){
      localStorage.setItem('fb_token',res.authResponse.accessToken);
      this.fb.api('/me',null,{fields: 'first_name,last_name,email,about,hometown,cover'}).then(
        (response: FacebookLoginResponse) => localStorage.setItem('fb_data',JSON.stringify(response)),
        (error: any) => console.error(error)
      );
    }
    this._auth.facebookLogin()
     .map(res => res.json())
     .subscribe(
        data => this.loginsuccess(data),
        err => this.fbErr(err),
        () => this.done()
      )

  }

  fbErr(e){    
    if(e.statusText=="Unauthorized"){
      this.cb='You are not registered , please register with FB';
      setTimeout(()=> {
        this.router.navigate(['/Signup']);  
      }, 3000);
      
    }
  }

  //linked in
  in_login(){
    var self =this;    
     var getInData= setInterval(function(){
        if(localStorage.getItem('in_data')){
          clearInterval(getInData);
          self._auth.in_data()
              .map(res => res.json())
               .subscribe(
                  data => self.IN_cb(data),
                  err => console.log(err),
                  () => self.done()
                )
        }
      },1000)    
  }  
  
  //linked in callback with data
  IN_cb(d){
    this.cb=d.msg||'';    
    if(d.auth_token) {
      localStorage.setItem('auth_token',d.auth_token)
      this.router.navigate(['/Profile']);
    };
  }
  handleError(err){
    console.log(err);
    this.cb='Invalid credentials please try again';
    setTimeout(function(){this.cb='';},3000);
  }
  done(){
    console.log('Done');
  }

}
