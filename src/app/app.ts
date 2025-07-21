import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  display = signal('0');
  operator = signal('');
  previousValue = signal('');
  waitingForOperand = signal(false);

  inputNumber(num: string) {
    if (this.waitingForOperand()) {
      this.display.set(num);
      this.waitingForOperand.set(false);
    } else {
      this.display.set(this.display() === '0' ? num : this.display() + num);
    }
  }

  inputOperator(nextOperator: string) {
    const inputValue = parseFloat(this.display());

    if (this.previousValue() === '') {
      this.previousValue.set(String(inputValue));
    } else if (this.operator()) {
      const currentValue = parseFloat(this.previousValue()) || 0;
      const newValue = this.calculate(currentValue, inputValue, this.operator());

      this.display.set(String(newValue));
      this.previousValue.set(String(newValue));
    }

    this.waitingForOperand.set(true);
    this.operator.set(nextOperator);
  }

  calculate(firstValue: number, secondValue: number, operator: string): number {
    switch (operator) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '*':
        return firstValue * secondValue;
      case '/':
        return firstValue / secondValue;
      case '=':
        return secondValue;
      default:
        return secondValue;
    }
  }

  performCalculation() {
    const inputValue = parseFloat(this.display());

    if (this.previousValue() && this.operator()) {
      const currentValue = parseFloat(this.previousValue()) || 0;
      const newValue = this.calculate(currentValue, inputValue, this.operator());

      this.display.set(String(newValue));
      this.previousValue.set('');
      this.operator.set('');
      this.waitingForOperand.set(true);
    }
  }

  clear() {
    this.display.set('0');
    this.previousValue.set('');
    this.operator.set('');
    this.waitingForOperand.set(false);
  }

  clearEntry() {
    this.display.set('0');
  }

  inputDecimal() {
    if (this.waitingForOperand()) {
      this.display.set('0.');
      this.waitingForOperand.set(false);
    } else if (this.display().indexOf('.') === -1) {
      this.display.set(this.display() + '.');
    }
  }

  backspace() {
    if (!this.waitingForOperand()) {
      const newDisplay = this.display().slice(0, -1);
      this.display.set(newDisplay || '0');
    }
  }
}
