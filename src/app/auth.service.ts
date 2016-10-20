import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map'

@Injectable()
export class AuthService {
    isLoggedin: boolean;
    public SERVER:any='http://localhost:3000/';

    constructor(private _http: Http) {    }

    loginUsr(usr){
        return this._http.post(this.SERVER+'loginusr',usr);
    }

    getUser(){
        var jwt = localStorage.getItem('auth_token');
        var authHeader = new Headers();        
        if(jwt){
            authHeader.append('Authorization','Bearer '+jwt);
        }
        return this._http.get(this.SERVER+'pvtdata', {headers:authHeader});
    }

    getUserFromFB(){
        let token = localStorage.getItem('fb_token');
        let fbData = localStorage.getItem('fb_data');
        let authHeader = new Headers();        
        if(token){
            authHeader.append('Authorization','Bearer '+token);
        }      
        
        return this._http.get(this.SERVER+'fbGetProfile',{headers:authHeader});
    }

    ragisterUsr(usr) {       
        return this._http.post(this.SERVER+'addnewusr',usr);            
    }

    fbLogin(){        
        return this._http.get(this.SERVER+'login/facebook');
    }

    fbSignUp(){        
        let fbData = localStorage.getItem('fb_data');        
        return this._http.post(this.SERVER+'fbLogin',{fb:fbData});
    }

    facebookLogin(){
        let token = localStorage.getItem('fb_token');
        let fbData = localStorage.getItem('fb_data');
        let authHeader = new Headers();        
        if(token){
            authHeader.append('Authorization','Bearer '+token);
        }       
        return this._http.post(this.SERVER+'fbLoginAuth',{fb:fbData},{headers:authHeader});
    }
    intWidFB(){
        var jwt = localStorage.getItem('auth_token');
        var authHeader = new Headers();        
        if(jwt){
            authHeader.append('Authorization','Bearer '+jwt);
        }
        let fbData = localStorage.getItem('fb_data');              
        return this._http.post(this.SERVER+'intWidFB',{fb:fbData}, {headers:authHeader});
    }

    intWidINData(){
        var jwt = localStorage.getItem('auth_token');
        var authHeader = new Headers();        
        if(jwt){
            authHeader.append('Authorization','Bearer '+jwt);
        }
        let inData = localStorage.getItem('in_data');              
        return this._http.post(this.SERVER+'intWidIN',{in:inData}, {headers:authHeader});
    }

    in_data(){
        let in_data = localStorage.getItem('in_data');
        if (in_data)  return this._http.post(this.SERVER+'in_data',{in:in_data});
    }
}