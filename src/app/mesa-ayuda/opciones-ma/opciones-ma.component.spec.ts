import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpcionesMAComponent } from './opciones-ma.component';

describe('OpcionesMAComponent', () => {
  let component: OpcionesMAComponent;
  let fixture: ComponentFixture<OpcionesMAComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OpcionesMAComponent]
    });
    fixture = TestBed.createComponent(OpcionesMAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
