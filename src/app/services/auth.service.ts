import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import data from '../../assets/json/data.json';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  orgData = data;
  constructor(private http: HttpClient) {}

  public getUsers(user: any) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("Ind",1);
    queryParams = queryParams.append("OrgID",this.orgData['orgID']);
    queryParams = queryParams.append("UserName",user.username);
    queryParams = queryParams.append("LoginKey",user.password);

    return this.http.get("https://safaikarmachariapi.eaangan.com/api/Login/WebLogin", {params: queryParams})
  }
}