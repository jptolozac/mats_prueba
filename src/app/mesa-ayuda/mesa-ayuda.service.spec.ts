import { TestBed } from '@angular/core/testing';

import { MesaAyudaService } from './mesa-ayuda.service';

describe('MesaAyudaService', () => {
  let service: MesaAyudaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MesaAyudaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
