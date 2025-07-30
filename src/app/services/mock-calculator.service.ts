import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, delay, of, throwError } from 'rxjs';
import { CalculationResult, CalculationHistory } from './calculator.service';

export interface MockTestScenario {
  name: string;
  description: string;
  inputs: string[];
  expectedResult: string;
  expectedEquation: string;
  shouldError?: boolean;
  errorMessage?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MockCalculatorService {
  private isLoading$ = new BehaviorSubject<boolean>(false);
  private currentScenario$ = new BehaviorSubject<MockTestScenario | null>(null);

  /**
   * Predefined test scenarios for UI testing
   */
  readonly testScenarios: MockTestScenario[] = [
    {
      name: 'Basic Addition',
      description: 'Simple addition of two positive numbers',
      inputs: ['5', '+', '3', '='],
      expectedResult: '8',
      expectedEquation: '5 + 3 = 8'
    },
    {
      name: 'Basic Subtraction',
      description: 'Simple subtraction with positive result',
      inputs: ['10', '-', '4', '='],
      expectedResult: '6',
      expectedEquation: '10 − 4 = 6'
    },
    {
      name: 'Basic Multiplication',
      description: 'Simple multiplication',
      inputs: ['7', '*', '6', '='],
      expectedResult: '42',
      expectedEquation: '7 × 6 = 42'
    },
    {
      name: 'Basic Division',
      description: 'Simple division with whole number result',
      inputs: ['15', '/', '3', '='],
      expectedResult: '5',
      expectedEquation: '15 ÷ 3 = 5'
    },
    {
      name: 'Decimal Addition',
      description: 'Addition with decimal numbers',
      inputs: ['3.14', '+', '2.86', '='],
      expectedResult: '6',
      expectedEquation: '3.14 + 2.86 = 6'
    },
    {
      name: 'Division by Zero',
      description: 'Error case: division by zero',
      inputs: ['5', '/', '0', '='],
      expectedResult: 'Error',
      expectedEquation: '5 ÷ 0',
      shouldError: true,
      errorMessage: 'Cannot divide by zero'
    },
    {
      name: 'Large Numbers',
      description: 'Calculation with very large numbers',
      inputs: ['999999999', '+', '1', '='],
      expectedResult: '1000000000',
      expectedEquation: '999999999 + 1 = 1000000000'
    },
    {
      name: 'Negative Result',
      description: 'Subtraction resulting in negative number',
      inputs: ['3', '-', '8', '='],
      expectedResult: '-5',
      expectedEquation: '3 − 8 = -5'
    },
    {
      name: 'Chain Operations',
      description: 'Multiple operations in sequence',
      inputs: ['2', '+', '3', '*', '4', '='],
      expectedResult: '20',
      expectedEquation: '5 × 4 = 20'
    },
    {
      name: 'Floating Point Precision',
      description: 'Test floating point precision issues',
      inputs: ['0.1', '+', '0.2', '='],
      expectedResult: '0.3',
      expectedEquation: '0.1 + 0.2 = 0.3'
    }
  ];

  /**
   * Simulates async calculation with loading state
   */
  performCalculationAsync(
    firstValue: number, 
    secondValue: number, 
    operator: string
  ): Observable<CalculationResult> {
    this.isLoading$.next(true);
    
    return of(this.calculateMock(firstValue, secondValue, operator)).pipe(
      delay(Math.random() * 1000 + 500), // Simulate network delay
      delay(0) // Ensure loading state is visible
    ).pipe(
      delay(0),
      // Complete the loading state
      delay(0)
    );
  }

  /**
   * Mock calculation with various scenarios
   */
  private calculateMock(firstValue: number, secondValue: number, operator: string): CalculationResult {
    this.isLoading$.next(false);
    
    // Simulate division by zero error
    if (operator === '/' && secondValue === 0) {
      return {
        result: 0,
        equation: `${firstValue} ÷ ${secondValue}`,
        hasError: true,
        errorMessage: 'Cannot divide by zero'
      };
    }

    // Simulate overflow error
    if (firstValue > 1e15 || secondValue > 1e15) {
      return {
        result: 0,
        equation: `${firstValue} ${this.getOperatorSymbol(operator)} ${secondValue}`,
        hasError: true,
        errorMessage: 'Number too large'
      };
    }

    // Normal calculation
    let result: number;
    switch (operator) {
      case '+':
        result = firstValue + secondValue;
        break;
      case '-':
        result = firstValue - secondValue;
        break;
      case '*':
        result = firstValue * secondValue;
        break;
      case '/':
        result = firstValue / secondValue;
        break;
      default:
        return {
          result: 0,
          equation: '',
          hasError: true,
          errorMessage: 'Invalid operator'
        };
    }

    return {
      result: Math.round(result * 1000000000) / 1000000000,
      equation: `${firstValue} ${this.getOperatorSymbol(operator)} ${secondValue} = ${result}`,
      hasError: false
    };
  }

  /**
   * Simulates random calculation errors for testing
   */
  performUnreliableCalculation(
    firstValue: number, 
    secondValue: number, 
    operator: string
  ): Observable<CalculationResult> {
    // 20% chance of error
    if (Math.random() < 0.2) {
      return throwError(() => new Error('Network calculation service unavailable'));
    }
    
    return this.performCalculationAsync(firstValue, secondValue, operator);
  }

  /**
   * Generates mock calculation history
   */
  generateMockHistory(): CalculationHistory[] {
    const mockHistory: CalculationHistory[] = [
      {
        id: '1',
        equation: '15 + 25 = 40',
        result: 40,
        timestamp: new Date(Date.now() - 3600000) // 1 hour ago
      },
      {
        id: '2',
        equation: '100 − 23 = 77',
        result: 77,
        timestamp: new Date(Date.now() - 7200000) // 2 hours ago
      },
      {
        id: '3',
        equation: '12 × 8 = 96',
        result: 96,
        timestamp: new Date(Date.now() - 10800000) // 3 hours ago
      },
      {
        id: '4',
        equation: '144 ÷ 12 = 12',
        result: 12,
        timestamp: new Date(Date.now() - 14400000) // 4 hours ago
      },
      {
        id: '5',
        equation: '3.14 + 2.86 = 6',
        result: 6,
        timestamp: new Date(Date.now() - 18000000) // 5 hours ago
      }
    ];

    return mockHistory;
  }

  /**
   * Simulates running a test scenario
   */
  runTestScenario(scenario: MockTestScenario): Observable<{
    step: number;
    input: string;
    currentDisplay: string;
    currentEquation: string;
    isComplete: boolean;
    result?: CalculationResult;
  }> {
    this.currentScenario$.next(scenario);
    
    return new Observable(observer => {
      let step = 0;
      let currentDisplay = '0';
      let currentEquation = '';
      
      const processStep = () => {
        if (step >= scenario.inputs.length) {
          observer.complete();
          return;
        }
        
        const input = scenario.inputs[step];
        
        // Simulate user input processing
        if (input === '=') {
          // Final calculation
          const result: CalculationResult = {
            result: parseFloat(scenario.expectedResult),
            equation: scenario.expectedEquation,
            hasError: scenario.shouldError || false,
            errorMessage: scenario.errorMessage
          };
          
          observer.next({
            step: step + 1,
            input,
            currentDisplay: scenario.expectedResult,
            currentEquation: scenario.expectedEquation,
            isComplete: true,
            result
          });
        } else {
          // Update display and equation based on input
          if (['+', '-', '*', '/'].includes(input)) {
            currentEquation += ` ${this.getOperatorSymbol(input)} `;
            currentDisplay = input;
          } else {
            currentDisplay = input;
            currentEquation += input;
          }
          
          observer.next({
            step: step + 1,
            input,
            currentDisplay,
            currentEquation,
            isComplete: false
          });
        }
        
        step++;
        setTimeout(processStep, 500); // Simulate user input delay
      };
      
      setTimeout(processStep, 100);
    });
  }

  /**
   * Get loading state observable
   */
  getLoadingState(): Observable<boolean> {
    return this.isLoading$.asObservable();
  }

  /**
   * Get current test scenario
   */
  getCurrentScenario(): Observable<MockTestScenario | null> {
    return this.currentScenario$.asObservable();
  }

  /**
   * Validates input and provides mock validation results
   */
  validateInput(input: string): { isValid: boolean; errorMessage?: string; suggestion?: string } {
    if (input === '') {
      return { 
        isValid: false, 
        errorMessage: 'Input cannot be empty',
        suggestion: 'Enter a number'
      };
    }

    if (input.length > 15) {
      return { 
        isValid: false, 
        errorMessage: 'Number too long',
        suggestion: 'Maximum 15 digits allowed'
      };
    }

    const num = parseFloat(input);
    if (isNaN(num)) {
      return { 
        isValid: false, 
        errorMessage: 'Invalid number format',
        suggestion: 'Enter a valid number'
      };
    }

    return { isValid: true };
  }

  private getOperatorSymbol(operator: string): string {
    switch (operator) {
      case '+': return '+';
      case '-': return '−';
      case '*': return '×';
      case '/': return '÷';
      default: return operator;
    }
  }
}
