import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import {FacebookService, FacebookLoginResponse,FacebookInitParams} from 'ng2-facebook-sdk/dist';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  providers: [AuthService,FacebookService]
})
export class SignupComponent implements OnInit {

  constructor(
    private _auth: AuthService,
    private router: Router,
    private fb: FacebookService
    ) { 
      let fbParams: FacebookInitParams = {
                  appId: '370960789960977',
                  xfbml: true,
                  version: 'v2.6'
                  };
    this.fb.init(fbParams);
    }

  newUsr: any;
  cb:any;  

  ngOnInit() {
    this.frmReset();    
  }

  frmReset(){
    this.newUsr = {
      fname: '',
      lname: '',
      email: '',
      country: '',
      password: ''
    }
  }

  ragisterUsr() {
    this._auth.ragisterUsr(this.newUsr)
      .map(res => res.json())
      .subscribe(
        data => this.ragistersuccess(data),
        err => this.cb=err,
        () => this.done()
      )
  }

  ragistersuccess(d){
    this.cb=d.msg;
    setTimeout(() => {
      if(d.success) this.router.navigate(['/Login']);
    }, 5000);  
  }


  fbSignup(): void {
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
    this._auth.fbSignUp()
     .map(res => res.json())
     .subscribe(
        data => this.loginWithFB(data),
        err => this.cb='Something went wrong please try again',
        () => this.done()
      )
  }

  loginWithFB(d){
    this.cb=d.msg;
    if(d.success){
    setTimeout(() => {
      this.cb='';
      this.router.navigate(['/Login']);
    }, 2000);  
    }
  }

  done(){  
    console.log('Done');
    setTimeout(() => {
      this.cb='';
      this.frmReset();
    }, 5000);  
  }
}
