import { TestBed } from '@angular/core/testing';

import { StickyWallService } from './sticky-wall.service';

describe('StickyWallService', () => {
  let service: StickyWallService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StickyWallService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
