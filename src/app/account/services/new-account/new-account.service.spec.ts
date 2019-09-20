import {TestBed} from '@angular/core/testing';

import {NewAccountService} from './new-account.service';

describe('NewAccountService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: NewAccountService = TestBed.get(NewAccountService);
        expect(service).toBeTruthy();
    });
});
