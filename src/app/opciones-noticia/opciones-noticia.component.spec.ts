import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpcionesNoticiaComponent } from './opciones-noticia.component';

describe('OpcionesNoticiaComponent', () => {
  let component: OpcionesNoticiaComponent;
  let fixture: ComponentFixture<OpcionesNoticiaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OpcionesNoticiaComponent]
    });
    fixture = TestBed.createComponent(OpcionesNoticiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
