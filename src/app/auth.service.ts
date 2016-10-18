import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map'

@Injectable()
export class AuthService {
    isLoggedin: boolean;

    constructor(private _http: Http) {    }

    loginUsr(usr){
        return this._http.post('http://localhost:3000/loginusr',usr);
    }

    getUser(){
        var jwt = localStorage.getItem('auth_token');
        var authHeader = new Headers();        
        if(jwt){
            authHeader.append('Authorization','Bearer '+jwt);
        }
        return this._http.get('http://localhost:3000/pvtdata', {headers:authHeader});
    }

    getUserFromFB(){
        let token = localStorage.getItem('fb_token');
        let fbData = localStorage.getItem('fb_data');
        let authHeader = new Headers();        
        if(token){
            authHeader.append('Authorization','Bearer '+token);
        }       
        // return this._http.post('http://localhost:3000/fbLogin',{fb:fbData},{headers:authHeader});
        return this._http.get('http://localhost:3000/fbGetProfile',{headers:authHeader});
    }

    ragisterUsr(usr) {       
        return this._http.post('http://localhost:3000/addnewusr',usr);            
    }

    fbLogin(){        
        return this._http.get('http://localhost:3000/login/facebook');
    }

    fbSignUp(){
        // let token = localStorage.getItem('fb_token');
        let fbData = localStorage.getItem('fb_data');        
        return this._http.post('http://localhost:3000/fbLogin',{fb:fbData});
    }

    facebookLogin(){
        let token = localStorage.getItem('fb_token');
        let fbData = localStorage.getItem('fb_data');
        let authHeader = new Headers();        
        if(token){
            authHeader.append('Authorization','Bearer '+token);
        }       
        // return this._http.post('http://localhost:3000/fbLogin',{fb:fbData},{headers:authHeader});
        return this._http.post('http://localhost:3000/fbLoginAuth',{fb:fbData},{headers:authHeader});
    }
}