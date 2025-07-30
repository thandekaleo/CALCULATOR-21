import { Injectable } from '@angular/core';

export interface CalculationResult {
  result: number;
  equation: string;
  hasError: boolean;
  errorMessage?: string;
}

export interface CalculationHistory {
  id: string;
  equation: string;
  result: number;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class CalculatorService {
  private history: CalculationHistory[] = [];

  /**
   * Performs a calculation with enhanced error handling
   */
  calculate(firstValue: number, secondValue: number, operator: string): CalculationResult {
    let result: number;
    let hasError = false;
    let errorMessage: string | undefined;
    const equation = `${firstValue} ${this.getOperatorSymbol(operator)} ${secondValue}`;

    try {
      switch (operator) {
        case '+':
          result = this.add(firstValue, secondValue);
          break;
        case '-':
          result = this.subtract(firstValue, secondValue);
          break;
        case '*':
          result = this.multiply(firstValue, secondValue);
          break;
        case '/':
          if (secondValue === 0) {
            hasError = true;
            errorMessage = 'Cannot divide by zero';
            result = 0;
          } else {
            result = this.divide(firstValue, secondValue);
          }
          break;
        default:
          hasError = true;
          errorMessage = 'Invalid operator';
          result = 0;
      }

      // Handle overflow and underflow
      if (!hasError) {
        if (!isFinite(result)) {
          hasError = true;
          errorMessage = 'Result is too large';
          result = 0;
        } else if (isNaN(result)) {
          hasError = true;
          errorMessage = 'Invalid calculation';
          result = 0;
        }
      }

      // Store in history if no error
      if (!hasError) {
        this.addToHistory(equation, result);
      }

    } catch (error) {
      hasError = true;
      errorMessage = 'Calculation error occurred';
      result = 0;
    }

    return {
      result: this.roundResult(result),
      equation: hasError ? equation : `${equation} = ${this.roundResult(result)}`,
      hasError,
      errorMessage
    };
  }

  /**
   * Addition operation
   */
  private add(a: number, b: number): number {
    return a + b;
  }

  /**
   * Subtraction operation
   */
  private subtract(a: number, b: number): number {
    return a - b;
  }

  /**
   * Multiplication operation
   */
  private multiply(a: number, b: number): number {
    return a * b;
  }

  /**
   * Division operation
   */
  private divide(a: number, b: number): number {
    return a / b;
  }

  /**
   * Rounds result to avoid floating point precision issues
   */
  private roundResult(value: number): number {
    return Math.round(value * 1000000000) / 1000000000;
  }

  /**
   * Converts operator to display symbol
   */
  private getOperatorSymbol(operator: string): string {
    switch (operator) {
      case '+': return '+';
      case '-': return '−';
      case '*': return '×';
      case '/': return '÷';
      default: return operator;
    }
  }

  /**
   * Adds calculation to history
   */
  private addToHistory(equation: string, result: number): void {
    const historyItem: CalculationHistory = {
      id: this.generateId(),
      equation,
      result,
      timestamp: new Date()
    };
    
    this.history.unshift(historyItem);
    
    // Keep only last 50 calculations
    if (this.history.length > 50) {
      this.history = this.history.slice(0, 50);
    }
  }

  /**
   * Gets calculation history
   */
  getHistory(): CalculationHistory[] {
    return [...this.history];
  }

  /**
   * Clears calculation history
   */
  clearHistory(): void {
    this.history = [];
  }

  /**
   * Validates input number
   */
  validateNumber(input: string): { isValid: boolean; errorMessage?: string } {
    if (input === '') {
      return { isValid: false, errorMessage: 'Input cannot be empty' };
    }

    const num = parseFloat(input);
    if (isNaN(num)) {
      return { isValid: false, errorMessage: 'Invalid number format' };
    }

    if (!isFinite(num)) {
      return { isValid: false, errorMessage: 'Number is too large' };
    }

    return { isValid: true };
  }

  /**
   * Generates unique ID for history items
   */
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  /**
   * Formats number for display
   */
  formatNumber(value: number): string {
    if (value === 0) return '0';
    
    // Handle very large or very small numbers
    if (Math.abs(value) >= 1e15 || (Math.abs(value) < 1e-6 && value !== 0)) {
      return value.toExponential(6);
    }
    
    // Remove trailing zeros
    return parseFloat(value.toPrecision(12)).toString();
  }
}
