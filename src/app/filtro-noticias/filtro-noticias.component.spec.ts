import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltroNoticiasComponent } from './filtro-noticias.component';

describe('FiltroNoticiasComponent', () => {
  let component: FiltroNoticiasComponent;
  let fixture: ComponentFixture<FiltroNoticiasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FiltroNoticiasComponent]
    });
    fixture = TestBed.createComponent(FiltroNoticiasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
