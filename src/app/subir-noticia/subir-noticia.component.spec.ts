import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubirNoticiaComponent } from './subir-noticia.component';

describe('SubirNoticiaComponent', () => {
  let component: SubirNoticiaComponent;
  let fixture: ComponentFixture<SubirNoticiaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubirNoticiaComponent]
    });
    fixture = TestBed.createComponent(SubirNoticiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
