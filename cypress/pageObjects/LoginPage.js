class LoginPage {
  visit() {
    // Clear cookies and session before visiting to ensure clean state
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.window().then((win) => {
      win.sessionStorage.clear();
    });
    // Visit with increased timeout and failOnStatusCode disabled for CI/CD
    cy.visit('/', {
      timeout: 120000,
      failOnStatusCode: false
    });
    // Wait for login page to be ready before proceeding
    cy.get('#user-name', { timeout: 30000 }).should('be.visible');
  }

  getUsernameInput() {
    // SauceDemo uses #user-name instead of #username
    return cy.get('#user-name');
  }

  getPasswordInput() {
    return cy.get('#password');
  }

  getLoginButton() {
    // SauceDemo uses #login-button instead of #loginButton
    return cy.get('#login-button');
  }

  getErrorMessage() {
    // SauceDemo uses data-test="error" instead of #errorMessage
    return cy.get('[data-test="error"]');
  }

  fillUsername(username) {
    this.getUsernameInput().clear().type(username);
    return this;
  }

  fillPassword(password) {
    this.getPasswordInput().clear().type(password);
    return this;
  }

  clickLoginButton() {
    this.getLoginButton().click();
    return this;
  }

  login(username, password) {
    this.fillUsername(username);
    this.fillPassword(password);
    this.clickLoginButton();
    return this;
  }

  verifySuccessfulLogin() {
    // Verify redirect to inventory page
    cy.url().should('include', '/inventory.html');
    // Verify presence of products/inventory elements
    cy.get('.inventory_list').should('exist');
    return this;
  }

  verifyErrorMessageVisible() {
    this.getErrorMessage().should('be.visible');
    return this;
  }

  verifyErrorMessageText(expectedText) {
    this.getErrorMessage().should('contain.text', expectedText);
    return this;
  }
}

export default LoginPage;

