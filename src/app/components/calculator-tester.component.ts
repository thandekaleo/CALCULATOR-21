import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockCalculatorService, MockTestScenario } from '../services/mock-calculator.service';
import { CalculatorService } from '../services/calculator.service';

@Component({
  selector: 'app-calculator-tester',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="tester-container">
      <div class="tester-header">
        <h3>🧪 Calculator Test Suite</h3>
        <button 
          (click)="toggleTester()" 
          class="btn btn-toggle"
          [class.active]="showTester"
        >
          {{ showTester ? 'Hide Tests' : 'Show Tests' }}
        </button>
      </div>

      @if (showTester) {
        <div class="test-panel">
          <div class="test-controls">
            <select [(ngModel)]="selectedScenarioIndex" class="scenario-select">
              @for (scenario of scenarios; track $index) {
                <option [value]="$index">{{ scenario.name }}</option>
              }
            </select>
            <button 
              (click)="runSelectedTest()" 
              [disabled]="isRunning"
              class="btn btn-run"
            >
              {{ isRunning ? 'Running...' : 'Run Test' }}
            </button>
            <button (click)="runAllTests()" [disabled]="isRunning" class="btn btn-run-all">
              Run All
            </button>
          </div>

          @if (currentTest) {
            <div class="current-test">
              <h4>{{ currentTest.name }}</h4>
              <p>{{ currentTest.description }}</p>
              <div class="test-sequence">
                <span class="sequence-label">Input Sequence:</span>
                <code>{{ currentTest.inputs.join(' → ') }}</code>
              </div>
              <div class="expected-result">
                <span class="result-label">Expected:</span>
                <code>{{ currentTest.expectedResult }}</code>
              </div>
            </div>
          }

          @if (testOutput) {
            <div class="test-output">
              <h4>Test Output</h4>
              <div class="output-log" [class.error]="hasError">
                {{ testOutput }}
              </div>
            </div>
          }

          @if (testResults.length > 0) {
            <div class="test-summary">
              <h4>Results Summary</h4>
              <div class="summary-stats">
                <span class="stat">Total: {{ testResults.length }}</span>
                <span class="stat passed">Passed: {{ passedCount }}</span>
                <span class="stat failed">Failed: {{ failedCount }}</span>
                <span class="stat rate">Success: {{ successRate }}%</span>
              </div>
              
              <div class="results-list">
                @for (result of testResults; track $index) {
                  <div class="result-item" [class.passed]="result.passed" [class.failed]="!result.passed">
                    <span class="result-name">{{ result.name }}</span>
                    <span class="result-status">{{ result.passed ? '✅' : '❌' }}</span>
                    @if (!result.passed) {
                      <div class="error-detail">{{ result.error }}</div>
                    }
                  </div>
                }
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .tester-container {
      background: #f8f9fa;
      border-radius: 8px;
      margin: 20px 0;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .tester-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px 20px;
      border-bottom: 1px solid #dee2e6;
    }

    .tester-header h3 {
      margin: 0;
      color: #495057;
      font-size: 1.2rem;
    }

    .btn {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.2s;
    }

    .btn-toggle {
      background: #6c757d;
      color: white;
    }

    .btn-toggle:hover {
      background: #5a6268;
    }

    .btn-toggle.active {
      background: #007bff;
    }

    .test-panel {
      padding: 20px;
    }

    .test-controls {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
      align-items: center;
      flex-wrap: wrap;
    }

    .scenario-select {
      padding: 8px 12px;
      border: 1px solid #ced4da;
      border-radius: 4px;
      background: white;
      min-width: 200px;
    }

    .btn-run {
      background: #28a745;
      color: white;
    }

    .btn-run:hover:not(:disabled) {
      background: #218838;
    }

    .btn-run-all {
      background: #17a2b8;
      color: white;
    }

    .btn-run-all:hover:not(:disabled) {
      background: #138496;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .current-test {
      background: white;
      padding: 15px;
      border-radius: 6px;
      margin-bottom: 15px;
      border-left: 4px solid #007bff;
    }

    .current-test h4 {
      margin: 0 0 8px 0;
      color: #007bff;
    }

    .current-test p {
      margin: 0 0 10px 0;
      color: #6c757d;
    }

    .test-sequence, .expected-result {
      margin: 8px 0;
    }

    .sequence-label, .result-label {
      font-weight: 600;
      color: #495057;
      margin-right: 8px;
    }

    code {
      background: #f8f9fa;
      padding: 4px 8px;
      border-radius: 3px;
      font-family: 'Courier New', monospace;
      border: 1px solid #e9ecef;
    }

    .test-output {
      background: white;
      padding: 15px;
      border-radius: 6px;
      margin-bottom: 15px;
    }

    .test-output h4 {
      margin: 0 0 10px 0;
      color: #495057;
    }

    .output-log {
      background: #f8f9fa;
      padding: 12px;
      border-radius: 4px;
      font-family: monospace;
      white-space: pre-wrap;
      border: 1px solid #e9ecef;
      max-height: 200px;
      overflow-y: auto;
    }

    .output-log.error {
      background: #f8d7da;
      border-color: #f5c6cb;
      color: #721c24;
    }

    .test-summary {
      background: white;
      padding: 15px;
      border-radius: 6px;
    }

    .test-summary h4 {
      margin: 0 0 15px 0;
      color: #495057;
    }

    .summary-stats {
      display: flex;
      gap: 20px;
      margin-bottom: 15px;
      flex-wrap: wrap;
    }

    .stat {
      font-weight: 600;
      padding: 4px 8px;
      border-radius: 4px;
    }

    .stat.passed {
      background: #d4edda;
      color: #155724;
    }

    .stat.failed {
      background: #f8d7da;
      color: #721c24;
    }

    .stat.rate {
      background: #d1ecf1;
      color: #0c5460;
    }

    .results-list {
      display: grid;
      gap: 8px;
    }

    .result-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 12px;
      border-radius: 4px;
      border: 1px solid #e9ecef;
    }

    .result-item.passed {
      background: #d4edda;
      border-color: #c3e6cb;
    }

    .result-item.failed {
      background: #f8d7da;
      border-color: #f5c6cb;
    }

    .result-name {
      font-weight: 500;
    }

    .result-status {
      font-size: 1.2rem;
    }

    .error-detail {
      color: #721c24;
      font-size: 0.9rem;
      margin-top: 4px;
      font-style: italic;
    }

    @media (max-width: 768px) {
      .tester-header {
        flex-direction: column;
        gap: 10px;
        align-items: stretch;
      }

      .test-controls {
        flex-direction: column;
        align-items: stretch;
      }

      .scenario-select {
        min-width: auto;
      }

      .summary-stats {
        flex-direction: column;
        gap: 8px;
      }
    }
  `]
})
export class CalculatorTesterComponent {
  private mockService = inject(MockCalculatorService);
  private calculatorService = inject(CalculatorService);

  showTester = false;
  scenarios = this.mockService.testScenarios;
  selectedScenarioIndex = 0;
  currentTest: MockTestScenario | null = null;
  isRunning = false;
  testOutput = '';
  hasError = false;
  testResults: Array<{name: string, passed: boolean, error?: string}> = [];

  get passedCount() {
    return this.testResults.filter(r => r.passed).length;
  }

  get failedCount() {
    return this.testResults.filter(r => !r.passed).length;
  }

  get successRate() {
    if (this.testResults.length === 0) return 0;
    return Math.round((this.passedCount / this.testResults.length) * 100);
  }

  toggleTester() {
    this.showTester = !this.showTester;
    if (this.showTester && !this.currentTest) {
      this.currentTest = this.scenarios[0];
    }
  }

  runSelectedTest() {
    const scenario = this.scenarios[this.selectedScenarioIndex];
    this.currentTest = scenario;
    this.runTest(scenario);
  }

  async runAllTests() {
    this.isRunning = true;
    this.testResults = [];
    this.testOutput = 'Running all test scenarios...\n\n';
    this.hasError = false;

    for (const scenario of this.scenarios) {
      this.currentTest = scenario;
      await this.runTest(scenario, false);
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    this.testOutput += `\n✅ Test suite completed!\nPassed: ${this.passedCount}, Failed: ${this.failedCount}`;
    this.isRunning = false;
  }

  private async runTest(scenario: MockTestScenario, updateOutput = true) {
    if (updateOutput) {
      this.isRunning = true;
      this.testOutput = `Running test: ${scenario.name}\n\n`;
      this.hasError = false;
    }

    try {
      const result = await this.simulateTest(scenario);
      
      if (updateOutput) {
        this.testOutput += result.log;
        this.hasError = !result.passed;
        this.isRunning = false;
      } else {
        this.testOutput += `${scenario.name}: ${result.passed ? 'PASSED' : 'FAILED'}\n`;
      }

      this.testResults.push({
        name: scenario.name,
        passed: result.passed,
        error: result.error
      });

    } catch (error) {
      const errorMsg = `Test execution failed: ${error}`;
      
      if (updateOutput) {
        this.testOutput += errorMsg;
        this.hasError = true;
        this.isRunning = false;
      } else {
        this.testOutput += `${scenario.name}: ERROR\n`;
      }

      this.testResults.push({
        name: scenario.name,
        passed: false,
        error: errorMsg
      });
    }
  }

  private async simulateTest(scenario: MockTestScenario): Promise<{passed: boolean, log: string, error?: string}> {
    let log = `Input sequence: ${scenario.inputs.join(' → ')}\n`;
    log += `Expected result: ${scenario.expectedResult}\n\n`;

    // Simulate the calculation
    let firstValue = 0;
    let operator = '';
    let currentValue = 0;
    let actualResult = '';

    try {
      for (let i = 0; i < scenario.inputs.length; i++) {
        const input = scenario.inputs[i];
        log += `Step ${i + 1}: ${input}\n`;

        if (['+', '-', '*', '/'].includes(input)) {
          firstValue = currentValue;
          operator = input;
        } else if (input === '=') {
          if (operator) {
            const calcResult = this.calculatorService.calculate(firstValue, currentValue, operator);
            
            if (calcResult.hasError) {
              if (scenario.shouldError) {
                actualResult = 'Error';
                log += `  → Error: ${calcResult.errorMessage} (Expected)\n`;
              } else {
                throw new Error(calcResult.errorMessage || 'Unexpected error');
              }
            } else {
              actualResult = calcResult.result.toString();
              log += `  → Result: ${actualResult}\n`;
            }
          }
        } else {
          currentValue = parseFloat(input);
          log += `  → Current value: ${currentValue}\n`;
        }
      }

      const passed = actualResult === scenario.expectedResult;
      log += `\n${passed ? '✅ TEST PASSED' : '❌ TEST FAILED'}\n`;
      
      if (!passed) {
        log += `Expected: ${scenario.expectedResult}, Got: ${actualResult}\n`;
        return { passed: false, log, error: `Expected ${scenario.expectedResult}, got ${actualResult}` };
      }

      return { passed: true, log };

    } catch (error) {
      log += `\n❌ TEST ERROR: ${error}\n`;
      return { passed: false, log, error: String(error) };
    }
  }
}
