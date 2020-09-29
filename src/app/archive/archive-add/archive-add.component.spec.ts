import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchiveAddComponent } from './archive-add.component';

describe('ArchiveAddComponent', () => {
  let component: ArchiveAddComponent;
  let fixture: ComponentFixture<ArchiveAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArchiveAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchiveAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
