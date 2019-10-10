import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ContactsComponent } from '../shared/contacts/contacts.component';
import { MatDialog } from '@angular/material/dialog';
import { Accounts } from './accounts.model';
import { apiResponse } from './accounts.datasource';
import { MatSnackBar } from '@angular/material/snack-bar';

// key:value mappings for custom sort
const rateMappings = {
  Cold: 1,
  Warm: 2,
  Hot: 3,
  No: 1,
  Maybe: 2,
  Yes: 3
};

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent implements OnInit {

  // only display these columns, according to their array index
  displayedColumns: string[] = ['Name', 'Id', 'AnnualRevenue', 'AccountNumber', 'Rating', 'UpsellOpportunity__c', 'Actions'];
  dataSource: MatTableDataSource<Accounts>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(public dialog: MatDialog, private snackBar: MatSnackBar) {
    this.dataSource = new MatTableDataSource(apiResponse.records);
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'AnnualRevenue':
          return +item[property]; // conversion to number
        case 'Rating':
        case 'UpsellOpportunity__c':
          return item[property] ? rateMappings[item[property]] : 0; // number value according to rateMappings object
        default:
          return item[property] ? item[property].trim().toLowerCase() : ''; // conversion to lowercase
      }
    };
    this.dataSource.sort = this.sort;
  }

  // filters data with search input
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // opens dialog box for viewing contacts
  viewContacts(row: any) {
    this.dialog.open(ContactsComponent, {
      data: { account: row }
    });
  }

  // show notification for future implementation of dialog box with add/view notes functionality
  addNotes(row: any) {
    this.snackBar.open('It should open dialog box with add/view notes functionality', 'Okay', {
      duration: 4000,
    });
  }
}
