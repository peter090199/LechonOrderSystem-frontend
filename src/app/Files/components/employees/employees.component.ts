import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { EmployeesService } from 'src/app/services/employees.service';
import { EmployeesUIComponent } from '../../componentsUI/employees-ui/employees-ui.component';
import { firstValueFrom } from 'rxjs';
import { NotificationsService } from 'src/app/Global/notifications.service';
@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})

export class EmployeesComponent implements OnInit {
  displayedColumns: string[] = ['id', 'empID', 'empName', 'address', 'contactNo', 'actions'];
  employee = new MatTableDataSource<any>([]);
  isLoading = true;
  placeHolder       : string = "Search";
  searchKey         : string = "";
  employees         : any=[];
  pageSizeOptions   : number[] = [5, 10, 25, 100];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private employeeService: EmployeesService, 
    private dialog : MatDialog,
    private notificationsService : NotificationsService
  ){}

  ngOnInit(): void {
    this.loadEmployees();
  }

  applyFilter(){
    this.employee.filter = this.searchKey.trim().toLocaleLowerCase();
  }
  clearSearch(){
    this.searchKey = "";
    this.applyFilter();
  }

  onClickNew(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '400px';
    const dialogRef = this.dialog.open(EmployeesUIComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadEmployees(); // Refresh the table after dialog closure
      }
    });
  }
  
  async loadEmployees(): Promise<void> {
    try {
      this.isLoading = true;
      this.employees = await firstValueFrom(this.employeeService.getEmployees());
      this.employee.data = this.employees;
      this.employee.paginator = this.paginator;
      this.employee.sort = this.sort;
      this.isLoading = false;
  
    } catch (error) {
      console.error('Error fetching employee data:', error);
      this.isLoading = false;
    }
  }
 
  deleteEmployee(employee:any){
    if(!employee){
      this.notificationsService.toastrWarning('No record selected!');
      
    }
    else{
      this.notificationsService.popupWarning(employee.empName,"-"+"Are you sure to delete this employee?").then((result) => {
        if (result.value) {
          this.employeeService.deleteEmployee(employee.empID).subscribe({
              next:()=>{
                this.notificationsService.popupSwalMixin("Successfuly deleted "+ employee.empName);
                this.loadEmployees();
              },
              error:()=>{
                this.notificationsService.toastrError("no employee id");
                this.loadEmployees();
              },
          });
        }
      });
    }
  }

  editEmployee(data?: any): void {
    const dialogRef = this.dialog.open(EmployeesUIComponent, {
      width: '400px',
      data: data || null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadEmployees();
      }
    });
  }


}
