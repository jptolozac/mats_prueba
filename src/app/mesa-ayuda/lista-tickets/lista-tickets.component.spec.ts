import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaTicketsComponent } from './lista-tickets.component';

describe('ListaTicketsComponent', () => {
  let component: ListaTicketsComponent;
  let fixture: ComponentFixture<ListaTicketsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListaTicketsComponent]
    });
    fixture = TestBed.createComponent(ListaTicketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
