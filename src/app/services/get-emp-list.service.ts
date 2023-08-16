import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import data from '../../assets/json/data.json';


@Injectable({
  providedIn: 'root'
})
export class GetEmpListService {
  orgData = data;
  constructor(private http: HttpClient) {}

  public getEmpList(data:any){
    let queryParams = new HttpParams();
    queryParams = queryParams.append("Ind",2);
    queryParams = queryParams.append("OrgID",this.orgData['orgID']);
    queryParams = queryParams.append("CircleNo",data.circleNo);
    queryParams = queryParams.append("WardNo",data.wardNo);
    queryParams = queryParams.append("ShiftID",data.shiftID);
    console.log(queryParams);
    let httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded'}),
    };

    return this.http.post("https://safaikarmachariapi.eaangan.com/api/Login/EmpList?", queryParams.toString(), httpOptions)
  }
}
