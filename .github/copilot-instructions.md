<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Angular Calculator Project Instructions

This is an Angular 20 calculator application with the following specifications:

## Project Context
- **Framework**: Angular 20 (latest version with zoneless architecture)
- **Language**: TypeScript with strict mode
- **Styling**: Pure CSS3 (no external libraries)
- **Architecture**: Standalone components using Angular signals

## Code Style Guidelines
- Use Angular signals for reactive state management
- Follow Angular style guide conventions
- Use TypeScript strict mode
- Implement proper error handling
- Write clean, readable code with meaningful variable names
- Use CSS Grid for layout and Flexbox for component alignment

## Component Structure
- Main calculator logic is in `src/app/app.ts`
- UI template in `src/app/app.html`
- Styling in `src/app/app.css`
- Use signal-based reactive patterns

## Calculator Features
- Basic arithmetic operations (+, -, ×, ÷)
- Decimal number support
- Clear functions (C, CE)
- Backspace functionality
- Keyboard accessibility
- Responsive design

## Styling Preferences
- Dark theme with blue-gray background (#2c3e50)
- Gradient buttons with hover effects
- Smooth animations and transitions
- Mobile-responsive design
- Focus states for accessibility

## Best Practices
- Use semantic HTML elements
- Implement proper ARIA labels for accessibility
- Handle edge cases (division by zero, invalid input)
- Write unit tests for calculator functions
- Follow Angular security best practices
- Optimize for performance

## File Organization
- Keep components small and focused
- Separate concerns (logic, styling, templates)
- Use Angular CLI conventions
- Maintain clean folder structure

When suggesting code changes:
1. Maintain the existing signal-based architecture
2. Follow Angular 20 best practices
3. Keep styling consistent with the current design
4. Ensure accessibility standards are met
5. Write TypeScript with proper type definitions
