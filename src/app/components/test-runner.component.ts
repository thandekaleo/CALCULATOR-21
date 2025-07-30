import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalculatorService } from '../services/calculator.service';
import { MockCalculatorService } from '../services/mock-calculator.service';

@Component({
  selector: 'app-test-runner',
  imports: [CommonModule],
  template: `
    <div class="test-runner">
      <div class="test-header">
        <h2>Calculator UI Test Runner</h2>
        <div class="test-controls">
          <button (click)="runAllTests()" [disabled]="isRunning" class="btn btn-primary">
            {{ isRunning ? 'Running...' : 'Run All Tests' }}
          </button>
          <button (click)="runSingleTest()" [disabled]="isRunning" class="btn btn-secondary">
            Run Single Test
          </button>
          <button (click)="clearResults()" class="btn btn-secondary">Clear Results</button>
        </div>
      </div>

      <div class="test-scenarios">
        <h3>Available Test Scenarios</h3>
        <div class="scenario-list">
          <div 
            *ngFor="let scenario of testScenarios; let i = index" 
            class="scenario-item"
            [class.selected]="selectedScenario === i"
            (click)="selectScenario(i)"
          >
            <div class="scenario-header">
              <span class="scenario-name">{{ scenario.name }}</span>
              <span class="scenario-status" [class]="getScenarioStatus(i)">
                {{ getScenarioStatusText(i) }}
              </span>
            </div>
            <div class="scenario-description">{{ scenario.description }}</div>
            <div class="scenario-inputs">
              <span class="input-sequence">{{ scenario.inputs.join(' ') }}</span>
              <span class="expected-result">→ {{ scenario.expectedResult }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="test-results" *ngIf="testResults.length > 0">
        <h3>Test Results</h3>
        <div class="results-summary">
          <span class="total">Total: {{ testResults.length }}</span>
          <span class="passed">Passed: {{ getPassedCount() }}</span>
          <span class="failed">Failed: {{ getFailedCount() }}</span>
          <span class="success-rate">Success Rate: {{ getSuccessRate() }}%</span>
        </div>
        
        <div class="result-list">
          <div 
            *ngFor="let result of testResults" 
            class="result-item"
            [class.passed]="result.passed"
            [class.failed]="!result.passed"
          >
            <div class="result-header">
              <span class="result-name">{{ result.scenarioName }}</span>
              <span class="result-status">{{ result.passed ? 'PASSED' : 'FAILED' }}</span>
              <span class="result-duration">{{ result.duration }}ms</span>
            </div>
            
            <div class="result-details" *ngIf="!result.passed">
              <div class="error-message">{{ result.errorMessage }}</div>
              <div class="expected-vs-actual">
                <div>Expected: {{ result.expected }}</div>
                <div>Actual: {{ result.actual }}</div>
              </div>
            </div>
            
            <div class="result-steps" *ngIf="result.steps">
              <div class="step" *ngFor="let step of result.steps">
                Step {{ step.step }}: {{ step.input }} → {{ step.currentDisplay }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="test-output" *ngIf="currentTestOutput">
        <h3>Current Test Output</h3>
        <div class="output-content">
          <pre>{{ currentTestOutput }}</pre>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .test-runner {
      padding: 20px;
      max-width: 1000px;
      margin: 0 auto;
      font-family: 'Arial', sans-serif;
    }

    .test-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 2px solid #ecf0f1;
    }

    .test-controls {
      display: flex;
      gap: 10px;
    }

    .btn {
      padding: 10px 20px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.2s ease;
    }

    .btn-primary {
      background: #3498db;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background: #2980b9;
    }

    .btn-secondary {
      background: #95a5a6;
      color: white;
    }

    .btn-secondary:hover:not(:disabled) {
      background: #7f8c8d;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .scenario-list {
      display: grid;
      gap: 15px;
    }

    .scenario-item {
      border: 2px solid #ecf0f1;
      border-radius: 8px;
      padding: 15px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .scenario-item:hover {
      border-color: #3498db;
      background: #f8f9fa;
    }

    .scenario-item.selected {
      border-color: #3498db;
      background: #e3f2fd;
    }

    .scenario-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .scenario-name {
      font-weight: 600;
      color: #2c3e50;
    }

    .scenario-status {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.8rem;
      font-weight: 600;
    }

    .scenario-status.pending {
      background: #f39c12;
      color: white;
    }

    .scenario-status.passed {
      background: #27ae60;
      color: white;
    }

    .scenario-status.failed {
      background: #e74c3c;
      color: white;
    }

    .scenario-description {
      color: #7f8c8d;
      margin-bottom: 8px;
    }

    .scenario-inputs {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .input-sequence {
      font-family: monospace;
      background: #ecf0f1;
      padding: 4px 8px;
      border-radius: 4px;
    }

    .expected-result {
      font-weight: 600;
      color: #27ae60;
    }

    .test-results {
      margin-top: 30px;
    }

    .results-summary {
      display: flex;
      gap: 20px;
      margin-bottom: 20px;
      padding: 15px;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .results-summary span {
      font-weight: 600;
    }

    .total { color: #2c3e50; }
    .passed { color: #27ae60; }
    .failed { color: #e74c3c; }
    .success-rate { color: #3498db; }

    .result-list {
      display: grid;
      gap: 15px;
    }

    .result-item {
      border: 2px solid #ecf0f1;
      border-radius: 8px;
      padding: 15px;
    }

    .result-item.passed {
      border-color: #27ae60;
      background: #d5f4e6;
    }

    .result-item.failed {
      border-color: #e74c3c;
      background: #fdf2f2;
    }

    .result-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }

    .result-name {
      font-weight: 600;
    }

    .result-status {
      font-weight: 600;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.8rem;
    }

    .result-item.passed .result-status {
      background: #27ae60;
      color: white;
    }

    .result-item.failed .result-status {
      background: #e74c3c;
      color: white;
    }

    .result-duration {
      color: #7f8c8d;
      font-size: 0.9rem;
    }

    .result-details {
      margin-top: 10px;
      padding: 10px;
      background: rgba(231, 76, 60, 0.1);
      border-radius: 4px;
    }

    .error-message {
      color: #e74c3c;
      font-weight: 600;
      margin-bottom: 8px;
    }

    .expected-vs-actual div {
      margin: 4px 0;
      font-family: monospace;
    }

    .result-steps {
      margin-top: 10px;
      font-family: monospace;
      font-size: 0.9rem;
    }

    .step {
      margin: 2px 0;
      color: #7f8c8d;
    }

    .test-output {
      margin-top: 30px;
    }

    .output-content {
      background: #2c3e50;
      color: #ecf0f1;
      padding: 15px;
      border-radius: 8px;
      font-family: monospace;
      max-height: 300px;
      overflow-y: auto;
    }
  `]
})
export class TestRunnerComponent {
  testScenarios: any[] = [];
  selectedScenario = 0;
  isRunning = false;
  testResults: any[] = [];
  currentTestOutput = '';
  scenarioResults: Map<number, boolean> = new Map();

  constructor(
    private mockService: MockCalculatorService,
    private calculatorService: CalculatorService
  ) {
    this.testScenarios = this.mockService.testScenarios;
  }

  selectScenario(index: number) {
    this.selectedScenario = index;
  }

  getScenarioStatus(index: number): string {
    if (this.scenarioResults.has(index)) {
      return this.scenarioResults.get(index) ? 'passed' : 'failed';
    }
    return 'pending';
  }

  getScenarioStatusText(index: number): string {
    if (this.scenarioResults.has(index)) {
      return this.scenarioResults.get(index) ? 'PASSED' : 'FAILED';
    }
    return 'PENDING';
  }

  async runAllTests() {
    this.isRunning = true;
    this.testResults = [];
    this.scenarioResults.clear();
    this.currentTestOutput = 'Starting test suite...\n';

    for (let i = 0; i < this.testScenarios.length; i++) {
      await this.runScenarioTest(this.testScenarios[i], i);
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    this.isRunning = false;
    this.currentTestOutput += '\nTest suite completed!';
  }

  async runSingleTest() {
    if (this.selectedScenario < this.testScenarios.length) {
      this.isRunning = true;
      const scenario = this.testScenarios[this.selectedScenario];
      await this.runScenarioTest(scenario, this.selectedScenario);
      this.isRunning = false;
    }
  }

  private async runScenarioTest(scenario: any, index: number): Promise<void> {
    const startTime = Date.now();
    this.currentTestOutput += `\nRunning: ${scenario.name}...\n`;

    try {
      // Simulate running the test scenario
      const testResult = await this.simulateScenarioExecution(scenario);
      const duration = Date.now() - startTime;
      const passed = testResult.success;

      this.scenarioResults.set(index, passed);
      
      const result = {
        scenarioName: scenario.name,
        passed,
        duration,
        expected: scenario.expectedResult,
        actual: testResult.actualResult,
        errorMessage: testResult.errorMessage,
        steps: testResult.steps
      };

      this.testResults.push(result);
      
      this.currentTestOutput += `${passed ? 'PASSED' : 'FAILED'} (${duration}ms)\n`;
      if (!passed) {
        this.currentTestOutput += `Error: ${testResult.errorMessage}\n`;
      }

    } catch (error) {
      const duration = Date.now() - startTime;
      this.scenarioResults.set(index, false);
      
      this.testResults.push({
        scenarioName: scenario.name,
        passed: false,
        duration,
        expected: scenario.expectedResult,
        actual: 'Error',
        errorMessage: `Test execution failed: ${error}`,
        steps: []
      });
      
      this.currentTestOutput += `FAILED (${duration}ms) - Execution Error\n`;
    }
  }

  private async simulateScenarioExecution(scenario: any): Promise<any> {
    // Simulate the scenario execution
    const steps: any[] = [];
    let currentValue = 0;
    let operator = '';
    let firstValue = 0;
    let actualResult = '';

    try {
      for (let i = 0; i < scenario.inputs.length; i++) {
        const input = scenario.inputs[i];
        
        if (['+', '-', '*', '/'].includes(input)) {
          firstValue = currentValue;
          operator = input;
        } else if (input === '=') {
          if (operator && firstValue !== undefined) {
            const calcResult = this.calculatorService.calculate(firstValue, currentValue, operator);
            if (calcResult.hasError && scenario.shouldError) {
              actualResult = 'Error';
              steps.push({ step: i + 1, input, currentDisplay: 'Error' });
            } else if (calcResult.hasError && !scenario.shouldError) {
              throw new Error(calcResult.errorMessage);
            } else {
              actualResult = calcResult.result.toString();
              steps.push({ step: i + 1, input, currentDisplay: actualResult });
            }
          }
        } else {
          currentValue = parseFloat(input);
          steps.push({ step: i + 1, input, currentDisplay: input });
        }
      }

      const success = actualResult === scenario.expectedResult;
      
      return {
        success,
        actualResult,
        steps,
        errorMessage: success ? '' : `Expected "${scenario.expectedResult}" but got "${actualResult}"`
      };

    } catch (error) {
      return {
        success: false,
        actualResult: 'Error',
        steps,
        errorMessage: `Execution error: ${error}`
      };
    }
  }

  clearResults() {
    this.testResults = [];
    this.scenarioResults.clear();
    this.currentTestOutput = '';
  }

  getPassedCount(): number {
    return this.testResults.filter(r => r.passed).length;
  }

  getFailedCount(): number {
    return this.testResults.filter(r => !r.passed).length;
  }

  getSuccessRate(): number {
    if (this.testResults.length === 0) return 0;
    return Math.round((this.getPassedCount() / this.testResults.length) * 100);
  }
}
