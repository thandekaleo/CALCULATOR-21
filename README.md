# Angular Calculator 🧮

A modern, responsive calculator application built with Angular 20 (latest version) featuring a clean interface and smooth animations.

![Calculator Preview](https://img.shields.io/badge/Angular-20-red?style=for-the-badge&logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![CSS3](https://img.shields.io/badge/CSS3-Styled-blue?style=for-the-badge&logo=css3)

## 🚀 Features

- ✅ **Basic Arithmetic Operations**: Addition, Subtraction, Multiplication, Division
- ✅ **Decimal Support**: Handle decimal numbers and calculations
- ✅ **Clear Functions**: Full clear (C) and clear entry (CE)
- ✅ **Backspace**: Remove last entered digit
- ✅ **Equation Display**: Shows the full calculation as you type
- ✅ **Click Sound Effects**: Auditory feedback for button presses
- ✅ **Responsive Design**: Works on desktop and mobile devices
- ✅ **Modern UI**: Gradient buttons with hover effects and animations
- ✅ **Keyboard Support**: Accessible design with focus states
- ✅ **Error Handling**: Proper input validation and error management
- ✅ **Built-in Test Suite**: Comprehensive testing interface for UI validation
- ✅ **Mock Services**: Advanced testing scenarios including edge cases

## 🛠️ Technology Stack

- **Framework**: Angular 20 (Latest)
- **Language**: TypeScript
- **Styling**: Pure CSS3 with gradients and animations
- **Build Tool**: Angular CLI
- **Package Manager**: npm

## 📁 Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── calculator-tester.component.ts  # Built-in test runner
│   │   └── test-runner.component.ts        # Advanced test interface
│   ├── services/
│   │   ├── calculator.service.ts           # Core calculation logic
│   │   └── mock-calculator.service.ts      # Mock service for testing
│   ├── app.ts              # Main component with calculator logic
│   ├── app.html            # Calculator template
│   ├── app.css             # Component styling
│   ├── app.config.ts       # App configuration
│   └── app.spec.ts         # Unit tests
├── index.html              # Main HTML file
├── main.ts                 # Application bootstrap
└── styles.css              # Global styles
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- Angular CLI (v20 or higher)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd CALCULATOR-21
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   ng serve
   ```

4. **Open your browser**
   Navigate to `http://localhost:4200`

### Alternative Ports

If port 4200 is in use, you can specify a different port:
```bash
ng serve --port 4201
```

## 🎮 Usage

### Basic Operations

1. **Number Input**: Click number buttons (0-9) to input numbers
2. **Operators**: Click +, -, ×, ÷ for arithmetic operations
3. **Decimal**: Click the decimal point (.) for decimal numbers
4. **Calculate**: Click equals (=) to perform the calculation
5. **Clear**: 
   - **C**: Clear all (reset calculator)
   - **CE**: Clear current entry
   - **⌫**: Backspace (remove last digit)

### Example Calculations

- **Addition**: `25 + 17 = 42`
- **Subtraction**: `100 - 23 = 77`
- **Multiplication**: `12 × 8 = 96`
- **Division**: `144 ÷ 12 = 12`
- **Decimals**: `3.14 + 2.86 = 6`

## 🎨 Design Features

### Color Scheme
- **Background**: Dark blue-gray (#2c3e50)
- **Numbers**: Blue gradient (#3498db to #2980b9)
- **Operators**: Red gradient (#e74c3c to #c0392b)
- **Equals**: Green gradient (#27ae60 to #229954)
- **Secondary**: Gray gradient (#95a5a6 to #7f8c8d)

### Animations
- Button hover effects with elevation
- Press animations with scale transform
- Smooth transitions for all interactions
- **Click sound effects** with Web Audio API for tactile feedback

### Responsive Design
- Mobile-friendly layout
- Adjustable button sizes
- Optimized for touch interactions

## 🧪 Testing

### Built-in Test Suite

The calculator includes a comprehensive test suite that you can access directly in the browser:

1. **Open the application** at `http://localhost:4201`
2. **Click "Show Tests"** to reveal the test panel
3. **Run individual tests** or the complete test suite
4. **View real-time results** and detailed test output

### Test Scenarios Include:
- **Basic Operations**: Addition, subtraction, multiplication, division
- **Decimal Calculations**: Floating-point arithmetic
- **Error Handling**: Division by zero, invalid inputs
- **Edge Cases**: Large numbers, negative results, precision issues
- **Chain Operations**: Sequential calculations

### Manual Testing
Run the unit tests:
```bash
ng test
```

Run end-to-end tests:
```bash
ng e2e
```

## 🏗️ Building for Production

Create a production build:
```bash
ng build --prod
```

The build artifacts will be stored in the `dist/` directory.

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Angular team for the excellent framework
- CSS Grid for the responsive layout system
- Modern web standards for accessibility features

## 📞 Support

If you have any questions or issues, please open an issue on GitHub or contact the development team.

---

**Built with ❤️ using Angular 20**
