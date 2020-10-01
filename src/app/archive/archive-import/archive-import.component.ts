import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { ArchiveEntity } from '../../../shared/entities/archive.entitiy';
import CArchive from '../../../shared/interfaces/archive.interface';
import { DatabaseService } from '../../../shared/services/database/database.service';
import { ExportXlsService } from '../../../shared/services/export.xls.service';

@Component({
  selector: 'app-archive-import',
  templateUrl: './archive-import.component.html',
  styleUrls: ['./archive-import.component.scss']
})
export class ArchiveImportComponent implements OnInit {
  excelimport = false;
  excelsave = false;
  saveFinish = false;
  ArchiveImportList: CArchive[];
  constructor(private excelservice: ExportXlsService,
    private snackBar: MatSnackBar, private _databaseService: DatabaseService,) { }

  ngOnInit() {



  }


  fileUploadExcel(files) {
    this.excelservice.xlsBlobToJSON(files).then(x => {
      x.forEach(cc => {
        const aa = new CArchive();

        aa.id = cc[0];
        aa.d_no = cc[1];
        aa.s_no = cc[2];
        aa.name = cc[3];
        aa.tc = cc[4];
        this.ArchiveImportList.push(aa);


      });
      this.snackBar.open(`Excel Yükleme Tamamlandı`, 'X', { duration: 3000 });

    });

  }

  async importData() {
    this.excelsave = true;
    this.ArchiveImportList.forEach(async x => {

      const archiveEntity = Object.assign(new ArchiveEntity(), x);
      await this._databaseService.connection.then(async () => {
        const saveResult = await archiveEntity.save();

        this.snackBar.open('ok.', 'OK', {
          duration: 2000
        });
      });



    });

  }

}
