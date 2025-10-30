# Test Automation Assessment - Login Functionality

This repository contains automated tests for web application login functionality using both **Cypress** and **Selenium** frameworks, integrated with GitHub Actions CI/CD.

## Test Application

- **URL**: https://www.saucedemo.com/
- **Note**: SauceDemo uses slightly different element IDs than specified in the assessment requirements:
  - Username field: `#user-name` (instead of `#username`)
  - Password field: `#password` ✓
  - Login button: `#login-button` (instead of `#loginButton`)
  - Error message: `[data-test="error"]` (instead of `#errorMessage`)

## Test Credentials

**Valid Users:**
- `standard_user` / `secret_sauce`
- `problem_user` / `secret_sauce`
- `performance_glitch_user` / `secret_sauce`

**Locked User (for error testing):**
- `locked_out_user` / `secret_sauce`

## Project Structure

```
assessment/
├── cypress/
│   ├── e2e/              # Test specifications
│   ├── pageObjects/      # Page Object Model classes
│   └── support/          # Support files and commands
├── selenium/
│   ├── tests/            # Test files
│   └── pageObjects/      # Page Object Model classes
├── .github/
│   └── workflows/        # CI/CD configuration
└── package.json
```

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Chrome browser installed

## Installation

```bash
npm install
```

## Running Tests

### Cypress Tests

**Run in interactive mode:**
```bash
npm run cypress:open
```

**Run in headless mode:**
```bash
npm run cypress:run
```

### Selenium Tests

```bash
npm run selenium:test
```

## Test Scenarios Covered

1. ✅ **Successful login with valid credentials**
   - Inputs username and password
   - Clicks login button
   - Verifies redirect to inventory page

2. ✅ **Failed login with invalid credentials**
   - Attempts login with wrong credentials
   - Verifies error message is displayed

3. ✅ **Error message display when login fails**
   - Multiple failure scenarios tested
   - Validates error message visibility and content

## CI/CD Pipeline

GitHub Actions workflows are configured to:
- Run tests automatically on push to `main`/`dev` branches
- Run tests on pull requests
- Upload test artifacts (screenshots, videos) on failure

### Workflows

- **Cypress**: `.github/workflows/cypress.yml`
- **Selenium**: `.github/workflows/selenium.yml`

## Page Object Model (POM)

Both test suites use the Page Object Model pattern for:
- Better code maintainability
- Reusability of page interactions
- Separation of test logic from page structure

## Technologies Used

- **Cypress**: JavaScript-based E2E testing framework
- **Selenium WebDriver**: Cross-browser automation
- **Mocha**: Test runner for Selenium tests
- **Chai**: Assertion library
- **GitHub Actions**: CI/CD automation

## Repository Status

This repository is public for assessment purposes.

## License

MIT

