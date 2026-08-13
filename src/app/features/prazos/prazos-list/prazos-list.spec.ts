import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrazosList } from './prazos-list';

describe('PrazosList', () => {
  let component: PrazosList;
  let fixture: ComponentFixture<PrazosList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrazosList],
    }).compileComponents();

    fixture = TestBed.createComponent(PrazosList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
