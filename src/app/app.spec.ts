import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideZonelessChangeDetection()]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render calculator title', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Angular Calculator');
  });

  it('should initialize with display showing 0', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app.display()).toBe('0');
  });

  it('should handle number input', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    
    app.inputNumber('5');
    expect(app.display()).toBe('5');
    
    app.inputNumber('3');
    expect(app.display()).toBe('53');
  });

  it('should handle basic addition', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    
    app.inputNumber('5');
    app.inputOperator('+');
    app.inputNumber('3');
    app.performCalculation();
    
    expect(app.display()).toBe('8');
  });

  it('should handle clear function', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    
    app.inputNumber('123');
    app.clear();
    
    expect(app.display()).toBe('0');
    expect(app.equation()).toBe('');
  });

  it('should handle decimal input', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    
    app.inputNumber('3');
    app.inputDecimal();
    app.inputNumber('14');
    
    expect(app.display()).toBe('3.14');
  });

  it('should display equation while calculating', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    
    app.inputNumber('10');
    app.inputOperator('+');
    app.inputNumber('5');
    
    expect(app.equation()).toContain('10 + 5');
  });
});
