import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { firstValueFrom } from 'rxjs';
import { MenusService } from 'src/app/services/menus.service';
import {ThemePalette} from '@angular/material/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-add-menu-ui',
  templateUrl: './add-menu-ui.component.html',
  styleUrls: ['./add-menu-ui.component.css']
})
export class AddMenuUIComponent implements OnInit {
onSave() {
throw new Error('Method not implemented.');
}
  isLoading: boolean = true;
  module: any=[];
  btnSave     : string = "Save";
  listData = new MatTableDataSource<any>([]);

 
  pageSizeOptions   : number[] = [5, 10, 25, 100];
  
  displayedColumns: string[] = ['moduleName'];
  addedColumns: string[] = [    
    'select',
  ];

  allChecked = false; // Track the state of the "Check All" checkbox
  listData2: any[] = []; // Initialize with data or fetch from a service
  selectedModules: any[] = [...this.listData2];
  selectedRows: Set<any> = new Set();
  allSelected: boolean = false;

 mergeColumns: any = this.addedColumns.concat(this.displayedColumns);
  
  constructor(private menuService : MenusService) { }
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.loadModule();
  }

  async loadModule(): Promise<void> {
    try {
      this.isLoading = true;
      this.module = await firstValueFrom(this.menuService.getModules());
      this.listData = this.module;
      this.listData.paginator = this.paginator;
      this.listData.sort = this.sort;
      this.isLoading = false;
  
    } catch (error) {
      console.error('Error fetching module data:', error);
      this.isLoading = false;
    }
  }
  
  toggleAllRows(checked: boolean): void {

      if (checked) {
        console.log('Selecting all rows:', this.listData);
        this.listData.data.forEach(row => this.module.add(row));
      } else {
        console.log('Deselecting all rows');
        this.selectedRows.clear();
      }
      this.updateAllSelected();
    //  else {
    //   console.warn('listData or listData.data is undefined or not an array');
    // }
  }


  updateAllSelected(): void {
    if (this.listData && Array.isArray(this.listData.data)) {
      this.allSelected = this.listData.data.length > 0 && this.selectedRows.size === this.listData.data.length;
    } else {
      this.allSelected = false;
    }
  }

  isAllSelected(): boolean {
    return this.allSelected;
  }

  toggleRowSelection(row: any, checked: boolean): void {
    if (checked) {
      this.selectedRows.add(row);
    } else {
      this.selectedRows.delete(row);
    }
    this.updateAllSelected();
  }

  isSelected(row: any): boolean {
    return this.selectedRows.has(row);
  }





}

