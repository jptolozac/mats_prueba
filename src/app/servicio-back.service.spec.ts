import { TestBed } from '@angular/core/testing';

import { ServicioBackService } from './servicio-back.service';

describe('ServicioBackService', () => {
  let service: ServicioBackService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicioBackService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
