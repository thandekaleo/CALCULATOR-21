import { Component, signal } from '@angular/core';
import { CalculatorTesterComponent } from './components/calculator-tester.component';

@Component({
  selector: 'app-root',
  imports: [CalculatorTesterComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  display = signal('0');
  operator = signal('');
  previousValue = signal('');
  waitingForOperand = signal(false);
  equation = signal('');
  
  // Audio context for click sounds
  private audioContext: AudioContext | null = null;

  /**
   * Play a click sound when buttons are pressed
   */
  private playClickSound() {
    try {
      if (!this.audioContext) {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      // Configure the sound (short, pleasant click)
      oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(400, this.audioContext.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.1);
    } catch (error) {
      // Silently fail if audio context is not supported
      console.warn('Audio context not supported:', error);
    }
  }

  inputNumber(num: string) {
    this.playClickSound();
    if (this.waitingForOperand()) {
      this.display.set(num);
      this.equation.set(this.equation() + num);
      this.waitingForOperand.set(false);
    } else {
      const newDisplay = this.display() === '0' ? num : this.display() + num;
      this.display.set(newDisplay);
      
      // Update equation - replace the last number part
      const eq = this.equation();
      const lastOperatorIndex = Math.max(eq.lastIndexOf('+'), eq.lastIndexOf('-'), eq.lastIndexOf('×'), eq.lastIndexOf('÷'));
      if (lastOperatorIndex >= 0) {
        this.equation.set(eq.substring(0, lastOperatorIndex + 2) + newDisplay);
      } else {
        this.equation.set(newDisplay);
      }
    }
  }

  inputOperator(nextOperator: string) {
    this.playClickSound();
    const inputValue = parseFloat(this.display());
    const operatorSymbol = this.getOperatorSymbol(nextOperator);

    if (this.previousValue() === '') {
      this.previousValue.set(String(inputValue));
      this.equation.set(this.display() + ' ' + operatorSymbol + ' ');
    } else if (this.operator()) {
      const currentValue = parseFloat(this.previousValue()) || 0;
      const newValue = this.calculate(currentValue, inputValue, this.operator());

      this.display.set(String(newValue));
      this.previousValue.set(String(newValue));
      this.equation.set(String(newValue) + ' ' + operatorSymbol + ' ');
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

  getOperatorSymbol(operator: string): string {
    switch (operator) {
      case '+':
        return '+';
      case '-':
        return '−';
      case '*':
        return '×';
      case '/':
        return '÷';
      default:
        return operator;
    }
  }

  performCalculation() {
    this.playClickSound();
    const inputValue = parseFloat(this.display());

    if (this.previousValue() && this.operator()) {
      const currentValue = parseFloat(this.previousValue()) || 0;
      const newValue = this.calculate(currentValue, inputValue, this.operator());

      this.display.set(String(newValue));
      this.equation.set(this.equation() + ' = ' + String(newValue));
      this.previousValue.set('');
      this.operator.set('');
      this.waitingForOperand.set(true);
    }
  }

  clear() {
    this.playClickSound();
    this.display.set('0');
    this.previousValue.set('');
    this.operator.set('');
    this.equation.set('');
    this.waitingForOperand.set(false);
  }

  clearEntry() {
    this.playClickSound();
    this.display.set('0');
    this.equation.set('');
  }

  inputDecimal() {
    this.playClickSound();
    if (this.waitingForOperand()) {
      this.display.set('0.');
      this.equation.set(this.equation() + '0.');
      this.waitingForOperand.set(false);
    } else if (this.display().indexOf('.') === -1) {
      const newDisplay = this.display() + '.';
      this.display.set(newDisplay);
      
      // Update equation
      const eq = this.equation();
      const lastOperatorIndex = Math.max(eq.lastIndexOf('+'), eq.lastIndexOf('-'), eq.lastIndexOf('×'), eq.lastIndexOf('÷'));
      if (lastOperatorIndex >= 0) {
        this.equation.set(eq.substring(0, lastOperatorIndex + 2) + newDisplay);
      } else {
        this.equation.set(newDisplay);
      }
    }
  }

  backspace() {
    this.playClickSound();
    if (!this.waitingForOperand()) {
      const newDisplay = this.display().slice(0, -1);
      this.display.set(newDisplay || '0');
    }
  }
}
