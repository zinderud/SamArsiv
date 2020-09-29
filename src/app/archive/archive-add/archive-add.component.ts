import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';

import IArchive from '../../../shared/interfaces/archive.interface';
import { DatabaseService } from '../../../shared/services/database/database.service';
import { ConfirmationComponent } from '../../../shared/components/confirmation/confirmation.component';
import { ArchiveEntity } from '../../../shared/entities/archive.entitiy';

@Component({
  selector: 'app-archive-add',
  templateUrl: './archive-add.component.html',
  styleUrls: ['./archive-add.component.scss']
})
export class ArchiveAddComponent implements OnInit {
  public archiveForm: FormGroup;

  constructor(
    private _fb: FormBuilder,
    private _databaseService: DatabaseService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) { }

  async ngOnInit() {
    this.archiveForm = this._fb.group({
      id: null,
      d_no: [null],
      s_no: [null],
      name: [null],
      tc: [null],
    });

    this.route.paramMap.subscribe(async params => {
      this.id.patchValue(parseInt(params['params'].id, null));
      if (this.id.value) {
        await this.getArchive(this.id.value);
      }
    });
  }

  get id() {
    return this.archiveForm.get('id');
  }

  get d_no() {
    return this.archiveForm.get('d_no');
  }

  get s_no() {
    return this.archiveForm.get('s_no');
  }

  get name() {
    return this.archiveForm.get('name');
  }

  get tc() {
    return this.archiveForm.get('tc');
  }

  async getArchive(id: number) {
    try {
      await this._databaseService.connection.then(async () => {
        const archive = await ArchiveEntity.findOne(id);
        this.archiveForm.patchValue(archive);
      });
    } catch (err) {
      console.error(err);
      this._snackBar.open('hata', 'OK', {
        duration: 2000
      });
    }
  }

  async deactivateArchive() {
    try {
      const archive = this.archiveForm.value as IArchive;

      const confirmation = {
        message: 'silme işlemi',
        data: archive.name,
        action: 'sil'
      };

      const dialogRef = this.dialog.open(ConfirmationComponent, {
        minWidth: '25%',
        minHeight: '25%',
        data: { ...confirmation }
      });

      dialogRef.afterClosed().subscribe(async data => {
        if (data) {
          await this._databaseService.connection.then(async () => {
            await ArchiveEntity.update({ id: archive.id }, { name: archive.name });
            this.archiveForm.controls.status.setValue(false);
          });
        }
      });
    } catch (err) {
      console.error(err);
      this._snackBar.open('hata .', 'OK', {
        duration: 2000
      });
    }
  }

  async activateArchive() {
    try {
      const archive = this.archiveForm.value as IArchive;

      const confirmation = {
        message: 'aktif',
        data: archive.name,
        action: 'aktif'
      };

      const dialogRef = this.dialog.open(ConfirmationComponent, {
        minWidth: '25%',
        minHeight: '25%',
        data: { ...confirmation }
      });

      dialogRef.afterClosed().subscribe(async data => {
        if (data) {
          await this._databaseService.connection.then(async () => {
            await ArchiveEntity.update({ id: archive.id }, { name: archive.name });
            this.archiveForm.controls.status.setValue(true);
          });
        }
      });
    } catch (err) {
      console.error(err);
      this._snackBar.open('hata.', 'OK', {
        duration: 2000
      });
    }
  }

  async onSubmit() {
    try {
      if (this.archiveForm.valid) {
        const formValue = this.archiveForm.value as IArchive;

        const archiveEntity = Object.assign(new ArchiveEntity(), formValue);

        if (!this.id.value) {
          delete archiveEntity.id;
        }

        await this._databaseService.connection.then(async () => {
          const saveResult = await archiveEntity.save();
          this.id.patchValue(saveResult.id);
          this._snackBar.open('ok.', 'OK', {
            duration: 2000
          });
        });
      }
    } catch (err) {
      console.error(err);
      this._snackBar.open('hata.', 'OK', {
        duration: 2000
      });
    }
  }
}
