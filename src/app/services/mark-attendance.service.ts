import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NONE_TYPE } from '@angular/compiler';



@Injectable({
  providedIn: 'root'
})
export class MarkAttendanceService {

  constructor(private http: HttpClient) { }
  // marking and verifying employee Attendance
  public markAttendance(siward:any,wardNo:any,shift:any, data:any, totaldata: any){
    // if their is no data or previous then it will return none
    if (!data && !totaldata){
      return NONE_TYPE;
    }
    let PresentEmpList: any = []
    let AbsentEmpList: any = []
    let queryParams: any = {}
    let previousPresent: any = []
    // getting data from local storage to get info about MarkedBy 
    let markedByData = JSON.parse(localStorage["UserLoginData"]);

    queryParams["OrgID"] = markedByData.Table[0].OrgID;
    queryParams["CircleNo"] = markedByData.Table[0].CircleNo;
    queryParams["WardNo"] = wardNo;
    queryParams["ShiftID"] = shift ? 1 : 2;
    previousPresent = Array.from(totaldata);
    PresentEmpList = Array.from(data);
    AbsentEmpList = Array.from(data);
    // filtering employee based on the property "IsPresent"
    PresentEmpList = PresentEmpList.filter(function( emp:any ) {
      return emp.IsPresent != true;
    });
    AbsentEmpList = AbsentEmpList.filter(function( emp:any ) {
      return emp.IsPresent == true;
    });
    // removing previously present employee which are now absent
    previousPresent = previousPresent.filter(function( el:any ) {
      return !AbsentEmpList.includes(el);
    });
    // adding the previous present employee to presentEmpList
    PresentEmpList.push(...previousPresent);

    // removing the extra details from the list which are not required in the back-end
    PresentEmpList.forEach((emp:any) =>{
      if(emp['IsPresent'] == false)
      delete emp['EmployeeName'];
      delete emp['IsPresent'];
      emp.MarkedBy = markedByData.Table[0].UserID;
      JSON.stringify(emp);
    })

    AbsentEmpList.forEach((emp:any) =>{
      if(emp['IsPresent'] == false)
      delete emp['EmployeeName'];
      delete emp['IsPresent'];
      emp.MarkedBy = markedByData.Table[0].UserID;
      JSON.stringify(emp);
    })

    // http parameters are passed in json format therefore changing the header content type
    let httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json'}),
    };

    // if absentlist in not empty set queryParamters to absent list and call the http request
    if(AbsentEmpList.length != 0){
      queryParams["PresentEmpList"] = AbsentEmpList;
      // if present list is not empty the http response is not returned unless any error occured
      if(PresentEmpList.length != 0){
        this.http.post("https://safaikarmachariapi.eaangan.com/api/Login/EmpAttendanceAbsenceList", JSON.stringify(queryParams), httpOptions).subscribe(
        (data: any) => {
        },
        (err : any) => {
          alert("Data Not Found");
          console.log(err)
        }
      );
      }
      // if present list is empty the http response is returned
      else{
        return this.http.post("https://safaikarmachariapi.eaangan.com/api/Login/EmpAttendanceAbsenceList", JSON.stringify(queryParams), httpOptions)
      }
    }
    // if present list is not empty query parameters are set to present list and http request is made
    if(PresentEmpList.length != 0){
      queryParams["PresentEmpList"] = PresentEmpList;
      return this.http.post("https://safaikarmachariapi.eaangan.com/api/Login/EmpAttendanceList", JSON.stringify(queryParams), httpOptions)
    }
    return 0;
  }
}
