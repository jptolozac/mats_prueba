import { TestBed } from '@angular/core/testing';

import { PreguntasFrecuentesService } from './preguntas-frecuentes.service';

describe('PreguntasFrecuentesService', () => {
  let service: PreguntasFrecuentesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PreguntasFrecuentesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
