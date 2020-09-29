import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';


import { MatDialog, MatSnackBar } from '@angular/material';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Like } from 'typeorm';
import { NgxSpinnerService } from 'ngx-spinner';
import IArchive from '../../../shared/interfaces/archive.interface';
import { DatabaseService } from '../../../shared/services/database/database.service';
import { ArchiveEntity } from '../../../shared/entities/archive.entitiy';
import { ConfirmationComponent } from '../../../shared/components/confirmation/confirmation.component';

@Component({
  selector: 'app-archive-list',
  templateUrl: './archive-list.component.html',
  styleUrls: ['./archive-list.component.scss']
})
export class ArchiveListComponent implements OnInit {
  public archiveFilterForm: FormGroup;
  public archives: IArchive[];

  constructor(
    private _fb: FormBuilder,
    private _databaseService: DatabaseService,
    private dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private _snackBar: MatSnackBar
  ) { }

  async ngOnInit() {
    this.archiveFilterForm = this._fb.group({
      name: ''
    });

    this.archiveFilterForm.controls.name.valueChanges
      .pipe(debounceTime(2000), distinctUntilChanged())
      .subscribe(async (value: string) => {
        try {
          this.spinner.show();
          await this._databaseService.connection
            .then(async () => {
              if (typeof value === 'string') {
                const archives = await ArchiveEntity.find({
                  name: Like(`%${value}%`)
                });
                this.archives = archives as IArchive[];
              }
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
            await ArchiveEntity.update({ id: archive.id }, { d_no: archive.d_no });
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
}
