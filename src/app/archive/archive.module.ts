import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArchiveListComponent } from './archive-list/archive-list.component';
import { ArchiveAddComponent } from './archive-add/archive-add.component';

@NgModule({
  declarations: [ArchiveListComponent, ArchiveAddComponent],
  imports: [
    CommonModule
  ]
})
export class ArchiveModule { }
