import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CRUDTicketsComponent } from './crud-tickets.component';

describe('CRUDTicketsComponent', () => {
  let component: CRUDTicketsComponent;
  let fixture: ComponentFixture<CRUDTicketsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CRUDTicketsComponent]
    });
    fixture = TestBed.createComponent(CRUDTicketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
