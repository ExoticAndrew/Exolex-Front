import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessosList } from './processos-list';

describe('ProcessosList', () => {
  let component: ProcessosList;
  let fixture: ComponentFixture<ProcessosList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProcessosList],
    }).compileComponents();

    fixture = TestBed.createComponent(ProcessosList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
