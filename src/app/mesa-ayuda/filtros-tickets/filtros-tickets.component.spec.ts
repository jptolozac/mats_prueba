import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltrosTicketsComponent } from './filtros-tickets.component';

describe('FiltrosTicketsComponent', () => {
  let component: FiltrosTicketsComponent;
  let fixture: ComponentFixture<FiltrosTicketsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FiltrosTicketsComponent]
    });
    fixture = TestBed.createComponent(FiltrosTicketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
