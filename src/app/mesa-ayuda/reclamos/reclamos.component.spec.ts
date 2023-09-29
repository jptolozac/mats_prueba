import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReclamosComponent } from './reclamos.component';

describe('ReclamosComponent', () => {
  let component: ReclamosComponent;
  let fixture: ComponentFixture<ReclamosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReclamosComponent]
    });
    fixture = TestBed.createComponent(ReclamosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
