import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfNoticiaComponent } from './pdf-noticia.component';

describe('PdfNoticiaComponent', () => {
  let component: PdfNoticiaComponent;
  let fixture: ComponentFixture<PdfNoticiaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PdfNoticiaComponent]
    });
    fixture = TestBed.createComponent(PdfNoticiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
