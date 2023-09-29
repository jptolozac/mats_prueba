import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticiasInteresComponent } from './noticias-interes.component';

describe('NoticiasInteresComponent', () => {
  let component: NoticiasInteresComponent;
  let fixture: ComponentFixture<NoticiasInteresComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NoticiasInteresComponent]
    });
    fixture = TestBed.createComponent(NoticiasInteresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
