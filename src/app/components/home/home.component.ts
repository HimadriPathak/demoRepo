import { Component, OnInit, Input, OnChanges,TemplateRef,ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GetEmpListService } from 'src/app/services/get-emp-list.service';
import { EmpListComponent } from '../emp-list/emp-list.component';
import { SharingService } from 'src/app/services/sharing.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent {
  data: any;
  selectedList = new Set();
  shiftSelected: boolean = true;
  previousShift: boolean = true;
  OrgID: any;
  wardNo:any;
  wards:number[] = [];
  circleNo:any;
  selected: any;
  currDate:string = '';
  morningTime: string ='';
  eveningTime: string ='';
  name: string ='';
  empData: any;
  isLoading: Boolean = false;
  buttonValue = "Exit";
  alertMessage = "Current Data will be lost! Do you want to change the Shift?";
  @ViewChild('default') defaultTemplate!: TemplateRef<any>;
  constructor( 
    private modalService: NgbModal, private router: Router,
    private emplist: GetEmpListService, 
    private shareData: SharingService
  ){}

  // when the page is loaded all the data is assigned to the variables
  ngOnInit(){
    this.data = JSON.parse(localStorage["UserLoginData"] || undefined);
    this.circleNo = this.data.Table[0].CircleNo;
    this.currDate = this.data.Table[0].CurrentDate;
    this.wardNo = this.data.Table[0].WardNo;
    this.name = this.data.Table[0].UserName;
    this.OrgID = this.data.Table[0].OrgID;
    this.morningTime = this.data.Table[0].MorningFrom + " To " + this.data.Table[0].MorningTo;
    this.eveningTime = this.data.Table[0].EveningFrom + " To " + this.data.Table[0].EveningTo;
    localStorage["shiftSelected"] = this.shiftSelected;

    // if wardNo is '0' wards list is displayed 
    if(this.wardNo == 0){
      for(let i = 0; i < this.data.Table1.length; i++){
        this.wards.push(this.data.Table1[i].WardNo);
      }
    // if wardNo. is not '0' employee list function is called which display employee table 
    }else{
      this.selected = this.wardNo;
      this.callemplist();
    }
  }
  // if wardno. is 0 and if some ward is selected from wards list this function calls employee list function for the selected ward 
  updateWardNo(e:any){
    this.selected = e.target.value;
    this.callemplist();
  }

  // checks if their is any selected employee which are not marked yet it will show message box with 2 options continue with changing the ward or not
  // if their is no selected employee is will automatically call change route function 
  callemplist(){
    if(!this.selected){
      this.previousShift = this.shiftSelected;
      return
    }
    else if(this.selectedList.size != 0){
      this.open();
    }else{
      this.changeRoute();

    }
  }

  // it will call the empolyee list service to get employee list and passing all the required parameters
  changeRoute(){
    this.isLoading = true;
    this.emplist.getEmpList({
      'circleNo' : this.circleNo,
      'wardNo' : this.selected,
      'shiftID' : this.shiftSelected ? 1:2
    }).subscribe(
      (data: any) => {
        // after the responce is fetched unwanted fields are removed emp data is shared to another component [emp-list] by a sharing service
        this.empData = data;
        setTimeout(() => {
          this.isLoading= false;
          this.empData.Data.forEach((emp: any) => {
            delete emp['Msg'];
            delete emp['Result'];
            delete emp['LeaveInd'];
            emp.OrgID = this.OrgID;
            emp.CircleNo = this.circleNo;
            emp.WardNo = this.selected;
            emp.ShiftID = this.shiftSelected ? 1:2;
          });
          this.shareData.setData(this.empData);
        }, 1000);
      },
      (err : any) => {
      alert("Data Not Found");
      }
    );
  }
  
  // when the message box is opened their are 2 cases - 1. if pressed "yes" it will change route and remove all the selected employee or 2. return to previous state
  open(template: TemplateRef<any> = this.defaultTemplate) {
		this.modalService.open(template, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      (result) => {
      this.previousShift = this.shiftSelected;
      this.changeRoute();
			},
			(reason) => {
        this.shiftSelected = this.previousShift;
			},
		);
	}

  // when exit button is pressed all the data is removed from the local storage and user is send to login page
  appExit() {
    localStorage.clear();
    this.shareData.setData(undefined);
    history.go(-1);
  }
}
