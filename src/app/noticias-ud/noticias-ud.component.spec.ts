import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticiasUdComponent } from './noticias-ud.component';

describe('NoticiasUdComponent', () => {
  let component: NoticiasUdComponent;
  let fixture: ComponentFixture<NoticiasUdComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NoticiasUdComponent]
    });
    fixture = TestBed.createComponent(NoticiasUdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
