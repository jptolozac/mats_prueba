import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministrarItemsComponent } from './administrar-items.component';

describe('AdministrarItemsComponent', () => {
  let component: AdministrarItemsComponent;
  let fixture: ComponentFixture<AdministrarItemsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdministrarItemsComponent]
    });
    fixture = TestBed.createComponent(AdministrarItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
