// selenium/pageObjects/LoginPage.js
const { By, until } = require('selenium-webdriver');

class LoginPage {
  constructor(driver, options = {}) {
    this.driver = driver;

    this.URL = options.baseUrl || process.env.BASE_URL || 'https://www.saucedemo.com/';
    this.TIMEOUT = options.timeout || 20000;

    this.sel = {
      username: By.css('#user-name'),
      password: By.css('#password'),
      loginBtn: By.css('#login-button'),
      error: By.css('h3[data-test="error"], [data-test="error"]'), // handles both forms
      inventoryList: By.css('.inventory_list'),
    };
  }

  /* ---------------- util waits ---------------- */
  async waitForLocated(locator, timeout = this.TIMEOUT) {
    return this.driver.wait(until.elementLocated(locator), timeout);
  }

  async waitForVisible(locator, timeout = this.TIMEOUT) {
    const el = await this.waitForLocated(locator, timeout);
    await this.driver.wait(until.elementIsVisible(el), timeout);
    return el;
  }

  /* ---------------- navigation ---------------- */
  async _gotoOnce() {
    await this.driver.get(this.URL);
    await this.driver.wait(async () => {
      const rs = await this.driver.executeScript('return document.readyState');
      return rs === 'interactive' || rs === 'complete';
    }, this.TIMEOUT);
  }

  async getCurrentUrl() {
  return this.driver.getCurrentUrl();
}

  async visit() {
    // retry once if navigation stalls
    try { await this._gotoOnce(); } catch { await this._gotoOnce(); }
    await this.waitForVisible(this.sel.username);
  }

  /* ---------------- actions ---------------- */
  async enterUsername(value) {
    const el = await this.waitForVisible(this.sel.username);
    await el.clear();
    if (value !== '') await el.sendKeys(value);
  }

  async enterPassword(value) {
    const el = await this.waitForVisible(this.sel.password);
    await el.clear();
    if (value !== '') await el.sendKeys(value);
  }

  async clickLogin() {
    const el = await this.waitForVisible(this.sel.loginBtn);
    try {
      await el.click();
    } catch {
      // fallback if element is not interactable immediately
      await this.driver.executeScript('arguments[0].click();', el);
    }
  }

  async waitForLoginResponse() {
    // Wait for either error message OR successful redirect
    // This prevents premature error checking and handles CI/CD timing
    try {
      await Promise.race([
        this.driver.wait(until.elementLocated(this.sel.error), 25000),
        this.driver.wait(until.urlContains('/inventory'), 25000)
      ]);
      // Small delay to ensure DOM is stable
      await this.driver.sleep(500);
    } catch {
      // If neither happens quickly, continue anyway (errors will be caught in test)
      await this.driver.sleep(1000);
    }
  }

  async login(username, password) {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLogin();
    // Wait for page to process login attempt (error or success)
    await this.waitForLoginResponse();
  }

  /* ---------------- assertions/helpers ---------------- */
  async waitForErrorVisible(timeout = 25000) {
    // Wait a bit for the page to process the login attempt
    await this.driver.sleep(500); // Small delay for form submission
    // Wait for error element with longer timeout for CI/CD
    return this.waitForVisible(this.sel.error, timeout);
  }

  async errorText() {
    try {
      const el = await this.waitForErrorVisible();
      return el.getText();
    } catch {
      return null;
    }
  }

  async isErrorVisible() {
    try {
      const el = await this.waitForErrorVisible();
      return el.isDisplayed();
    } catch {
      return false;
    }
  }

  async isLoggedIn(timeout = 20000) {
    try {
      await this.driver.wait(until.urlContains('/inventory'), timeout);
      await this.driver.wait(until.elementLocated(this.sel.inventoryList), timeout);
      return true;
    } catch {
      return false;
    }
  }

  async currentUrl() {
    return this.driver.getCurrentUrl();
  }

  async clearClientState() {
    try {
      await this.driver.manage().deleteAllCookies();
      await this.driver.executeScript('window.localStorage.clear(); window.sessionStorage.clear();');
    } catch { /* ignore */ }
  }

  /* ---------------- aliases to keep your tests working ---------------- */
  async verifySuccessfulLogin() { return this.isLoggedIn(); }
  async getErrorMessageText() { return this.errorText(); }
  async clickLoginButton() { return this.clickLogin(); }
  async isErrorMessageVisible() { return this.isErrorVisible(); }
  async getCurrentUrl() { return this.currentUrl(); }
}




module.exports = LoginPage;
