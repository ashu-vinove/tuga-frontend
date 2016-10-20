import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import {FacebookService, FacebookLoginResponse,FacebookInitParams} from 'ng2-facebook-sdk/dist';
import {AuthService} from '../auth.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers:[AuthService,FacebookService]
})
export class DashboardComponent implements OnInit {

    public usr :Object={ "firstname":"", "lastname":"",  "email":"",   "country":"" ,'profilePic':'' ,'INdp':'','facebookID':'','INid':''};
    public cb :any ='';

  constructor(private router:Router,private _auth:AuthService , private fb: FacebookService) {
     let fbParams: FacebookInitParams = {
                  appId: '370960789960977',
                  xfbml: true,
                  version: 'v2.6'
                  };
    this.fb.init(fbParams);
   }

  ngOnInit() {
    
    if(localStorage.getItem('auth_token')){       
      this.getUser();
    }else{
       this.router.navigate(['/Login']);
    }
  }

  logout(){
    // localStorage.removeItem('auth_token');
    localStorage.clear();
    this.router.navigate(['/Login']);
  }

  getUser(){
    this._auth.getUser()
      .map(res => res.json()) 
      .subscribe(
        data=>this.userProfile(data),
        err=>this.handleError(err),
        ()=>console.log('done')
      )
  }
  userProfile(data){
    {
      this.usr={
        "firstname":data.firstname,
        "lastname":data.lastname,
        "email":data.email,
        "country":data.country,
        "profilePic":data.profilePic||'',
        "INdp":data.INdp||'',
        'facebookID':data.facebookID,
        'INid':data.INid
      }      
    }
  }

  intWidFB(){
    this.fb.login().then(
          (response: FacebookLoginResponse) => this.facebookCB(response),
          (error: any) => this.cb='Somthing went wrong please try again'
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
    this._auth.intWidFB()
     .map(res => res.json())
     .subscribe(
        data => this.intWidFBData(data),
        err => this.intWidFBErr(err),
        () => setTimeout(()=> {
          this.cb='';
        }, 2000)
      )
  }
  
  intWidFBData(data){
    console.log(data);
    if(!data.err){
       location.reload();
    } else{
      if(data.err.code==11000) this.cb='This account is already registered with another account';
      else this.cb='Somthing went wrong please try again';
    }
  }

  intWidFBErr(err){
    console.log(err);
  }

  handleError(e){
    localStorage.removeItem('auth_token');
    this.cb='Somthing went wrong , please try again';
  }


  //linked in integration to old account
  
  intWidIN(){
    var self =this;    
    var getInData= setInterval(function(){
            
      if(localStorage.getItem('in_data')){
        clearInterval(getInData);
        self._auth.intWidINData()
            .map(res => res.json())
             .subscribe(
                data => self.intWidFBData(data),
                err => console.log(err),
                () => console.log('Done...')
              )
      }
    },1000)    
  }
}
