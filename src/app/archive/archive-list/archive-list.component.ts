import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';


import { MatDialog, MatPaginator, MatSnackBar, MatTableDataSource } from '@angular/material';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Like } from 'typeorm';
import { NgxSpinnerService } from 'ngx-spinner';
import IArchive from '../../../shared/interfaces/archive.interface';
import { DatabaseService } from '../../../shared/services/database/database.service';
import { ArchiveEntity } from '../../../shared/entities/archive.entitiy';
import { ConfirmationComponent } from '../../../shared/components/confirmation/confirmation.component';
import { ArchiveAddComponent } from '../archive-add/archive-add.component';
import { ExportXlsService } from 'src/shared/services/export.xls.service';

@Component({
  selector: 'app-archive-list',
  templateUrl: './archive-list.component.html',
  styleUrls: ['./archive-list.component.scss']
})
export class ArchiveListComponent implements OnInit {
  public archiveFilterForm: FormGroup;
  public archives: IArchive[];
  displayedColumns: string[] = [
    'd_no',
    's_no',
    'name',
    'tc',
    'edit',
    'delete'
  ];
  public dataSource = new MatTableDataSource<IArchive>();

  @ViewChild(MatPaginator, null) paginator: MatPaginator;

  constructor(
    private _fb: FormBuilder,
    private _databaseService: DatabaseService,
    private dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private _snackBar: MatSnackBar,
    private excelservice: ExportXlsService,
  ) { }

  async ngOnInit() {
    this.archiveFilterForm = this._fb.group({
      tc: ''
    });

    this.archiveFilterForm.controls.tc.valueChanges
      .pipe(debounceTime(2000), distinctUntilChanged())
      .subscribe(async (value: number) => {
        try {
          this.spinner.show();
          await this._databaseService.connection
            .then(async () => {

              const archives = await ArchiveEntity.find({
                tc: value
              });
              this.archives = archives as IArchive[];
              this.dataSource.data = archives;
              this.dataSource.paginator = this.paginator;

            })
            .finally(() => {
              this.spinner.hide();
            });
        } catch (err) {
          console.error(err);
          this._snackBar.open(
            'Hata.',
            'OK',
            {
              duration: 2000
            }
          );
        }
      });

    await this.getArchives();
  }

  public goToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  async getArchives() {
    try {
      this.spinner.show();
      await this._databaseService.connection
        .then(async () => {
          const archives = await ArchiveEntity.find();
          this.archives = archives as IArchive[];
          this.dataSource.data = archives;
          this.dataSource.paginator = this.paginator;
        })
        .finally(() => {
          this.spinner.hide();
        });
    } catch (err) {
      console.error(err);
      this._snackBar.open('Hata Alındı.', 'OK', {
        duration: 2000
      });
    }
  }

  async deleteArchive(archive: IArchive) {
    try {
      const confirmation = {
        message: 'Silinecek veri !!',
        data: archive.name,
        action: 'Sil'
      };

      const dialogRef = this.dialog.open(ConfirmationComponent, {
        minWidth: '25%',
        minHeight: '25%',
        data: { ...confirmation }
      });

      dialogRef.afterClosed().subscribe(async data => {
        if (data) {
          await this._databaseService.connection.then(async () => {
            await ArchiveEntity.delete({ id: archive.id });
            await this.getArchives();
          });
        }
      });
    } catch (err) {
      console.error(err);
      this._snackBar.open('Hata Alındı', 'OK', {
        duration: 2000
      });
    }
  }

  editOrAddArchive(archive?: IArchive): void {
    try {
      const dialogRef = this.dialog.open(ArchiveAddComponent, {
        minWidth: '75%',
        minHeight: '75%',
        data: { ...archive }
      });

      dialogRef.afterClosed().subscribe(async () => {
        await this.getArchives();
      });
    } catch (err) {
      console.error(err);
      this._snackBar.open(
        `hata oluştu ${archive.id ? 'düzenleme' : 'ekleme işlemi'
        }  `,
        'OK',
        {
          duration: 2000
        }
      );
    }
  }
  onExportExcel() {
    console.log(this.archives);
    this.excelservice.jsonToSheetExport('dasd.xlsx', 'sorgu', this.archives);
  }




}
