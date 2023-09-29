import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticiasGeneralesComponent } from './noticias-generales.component';

describe('NoticiasGeneralesComponent', () => {
  let component: NoticiasGeneralesComponent;
  let fixture: ComponentFixture<NoticiasGeneralesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NoticiasGeneralesComponent]
    });
    fixture = TestBed.createComponent(NoticiasGeneralesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
