import LoginPage from '../pageObjects/LoginPage';

describe('SauceDemo Login Functionality', () => {
  const loginPage = new LoginPage();

  beforeEach(() => {
    // Clear all state before each test
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.window().then((win) => {
      win.sessionStorage.clear();
    });
    
    // Visit login page
    loginPage.visit();
    
    // Ensure login page elements are ready
    cy.get('#user-name', { timeout: 30000 }).should('be.visible');
    cy.get('#password', { timeout: 30000 }).should('be.visible');
  });

  afterEach(() => {
    // Clear state after each test to ensure clean start for next test
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.window().then((win) => {
      win.sessionStorage.clear();
    });
  });

  it('should successfully login with valid credentials', () => {
    // Valid credentials for SauceDemo
    loginPage.login('standard_user', 'secret_sauce');
    
    // Verify successful login by checking URL and inventory page elements
    loginPage.verifySuccessfulLogin();
  });

  it('should fail login with invalid credentials', () => {
    // Invalid credentials
    loginPage.login('invalid_user', 'wrong_password');
    
    // Verify error message is displayed
    loginPage.verifyErrorMessageVisible();
    loginPage.verifyErrorMessageText('Username and password do not match');
  });

  it('should display error message when login fails', () => {
    // Test with locked out user to get specific error
    loginPage.login('locked_out_user', 'secret_sauce');
    
    // Verify error message appears
    loginPage.verifyErrorMessageVisible();
    loginPage.verifyErrorMessageText('Sorry, this user has been locked out');
  });

  it('should handle empty username', () => {
    loginPage.fillPassword('secret_sauce').clickLoginButton();
    
    loginPage.verifyErrorMessageVisible();
    loginPage.verifyErrorMessageText('Username is required');
  });

  it('should handle empty password', () => {
    loginPage.fillUsername('standard_user').clickLoginButton();
    
    loginPage.verifyErrorMessageVisible();
    loginPage.verifyErrorMessageText('Password is required');
  });
});

