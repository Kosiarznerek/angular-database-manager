import {TestBed} from '@angular/core/testing';

import {RemindPasswordService} from './remind-password.service';

describe('RemindPasswordService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: RemindPasswordService = TestBed.get(RemindPasswordService);
        expect(service).toBeTruthy();
    });
});
