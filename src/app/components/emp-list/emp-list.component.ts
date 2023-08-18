import { Component, Input, OnChanges,TemplateRef,ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MarkAttendanceService } from 'src/app/services/mark-attendance.service';
import { SharingService } from 'src/app/services/sharing.service';


@Component({
  selector: 'app-emp-list',
  templateUrl: './emp-list.component.html',
  styleUrls: ['./emp-list.component.css']
})

export class EmpListComponent {

  constructor(private modalService: NgbModal, private shareData: SharingService, private markEmployeeAttendance : MarkAttendanceService, private router: Router){}

  @Input() wardNo:any;
  @Input() selected:any;
  @Input() shiftSelected: any;
  @Input() selectedList: any;
  selectedIndexes: number[] = [];
  showAlert: boolean = false;
  closeResult = '';
  alertMessage = '';
  data:any;
  employees: any;
  present:Boolean;
  @ViewChild('default') defaultTemplate!: TemplateRef<any>;
  

  // when the component is called it gets the shared data from sharing service and stores it in empolyee object array
  ngOnChanges() {
    this.employees = this.shareData.getData();
    this.employees = this.employees.Data;
    this.selectedIndexes = [];
    this.selectedList.clear();
    if(this.wardNo != 0){
      this.present = this.employees.some(employee => employee['IsPresent'] == true);
    }
  }

  // when an employee is selected it checks if it is jamadar or SI and if jamadar has already marked the attendance it will not update selected list
  updateSelectedList(emp:any){
    if(this.present){
      return
    }
    // if employee is present in selected list delete that employee else add the employee to the list
    else if(this.selectedList.has(emp)){
      this.selectedList.delete(emp);
    }
    else{
      this.selectedList.add(emp);
    }
  }

  // this function tells which row is selected and which isn't based on the index of the row and adds selected class to the row to change its color
  onRowClick(index: number) {
    if(this.present){
      return
    }
    const selectedIndex = this.selectedIndexes.indexOf(index);
    if (selectedIndex > -1) {
      this.selectedIndexes.splice(selectedIndex, 1);
    } else {
      this.selectedIndexes.push(index);
    }
  }
  isRowSelected(index: number): boolean {
    return this.selectedIndexes.indexOf(index) > -1;
  }


  // when clicked on submit button it calls mark employee attendance service and mark attendance functionby passing all the required parameters
  submit(){
    this.data = this.markEmployeeAttendance.markAttendance(this.wardNo,this.selected,this.shiftSelected,this.selectedList, this.employees)
    this.data.subscribe(
      // after the responce is fetched it displays the message and sends back to the default home page
          (data: any) => {
            setTimeout(() => {
              this.alertMessage = data.Message + "!!   Sending Back to Home Page";
              this.open();
            }, 10);
          },
          // if an error occured is shows an alert console logs the message
          (err : any) => {
            alert("Data Not Found");
            console.log(err)
          }
        );
  }


  // when the message box is opened it shows 2 options but both does the same thing calls the change route function to navigate to the home page
  open(template: TemplateRef<any> = this.defaultTemplate) {
		this.modalService.open(template, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      (result) => {
        this.changeRoute()
			},
			(reason) => {
        this.changeRoute()
			},
		);
	}

  // set the shared data to null and send the user to home page
  changeRoute(){
    this.shareData.setData(undefined);
    this.router.navigateByUrl('/',{skipLocationChange:true}).then(()=>{
      this.router.navigate(['/home'])})
  }

}
