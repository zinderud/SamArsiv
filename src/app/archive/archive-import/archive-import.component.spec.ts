import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchiveImportComponent } from './archive-import.component';

describe('ArchiveImportComponent', () => {
  let component: ArchiveImportComponent;
  let fixture: ComponentFixture<ArchiveImportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArchiveImportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchiveImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
