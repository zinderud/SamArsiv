import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { ArchiveEntity } from '../../../shared/entities/archive.entitiy';
import CArchive from '../../../shared/interfaces/archive.interface';
import { DatabaseService } from '../../../shared/services/database/database.service';
import { ExportXlsService } from '../../../shared/services/export.xls.service';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-archive-import',
  templateUrl: './archive-import.component.html',
  styleUrls: ['./archive-import.component.scss']
})
export class ArchiveImportComponent implements OnInit {
  excelimport = false;
  excelsave = false;
  saveFinish = false;
  ArchiveImportList: CArchive[] = [];
  constructor(private excelservice: ExportXlsService,
    private snackBar: MatSnackBar, private _databaseService: DatabaseService,) { }

  ngOnInit() {



  }

  exceltoJson = {};

  onFileChange(event: any) {
    this.exceltoJson = {};
    let headerJson = {};
    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>(event.target);
    // if (target.files.length !== 1) {
    //   throw new Error('Cannot use multiple files');
    // }
    const reader: FileReader = new FileReader();
    reader.readAsBinaryString(target.files[0]);
    console.log("filename", target.files[0].name);
    this.exceltoJson['filename'] = target.files[0].name;
    reader.onload = (e: any) => {
      /* create workbook */
      const binarystr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(binarystr, { type: 'binary' });
      for (var i = 0; i < wb.SheetNames.length; ++i) {
        const wsname: string = wb.SheetNames[i];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws); // to get 2d array pass 2nd parameter as object {header: 1}
        this.exceltoJson[`sheet${i + 1}`] = data;
        const headers = "this.get_header_row(ws);"
        headerJson[`header${i + 1}`] = headers;
        //  console.log("json",headers)
      }
      this.exceltoJson['headers'] = headerJson;
      console.log(this.exceltoJson);
    };
  }

  fileUploadExcel(files) {
    console.log("sade" + files);
    this.excelservice.xlsBlobToJSON(files).then(x => {
      x.forEach(cc => {
        console.log("sadecc" + cc);
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
    console.log("ArchiveImportList" + this.ArchiveImportList);
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
