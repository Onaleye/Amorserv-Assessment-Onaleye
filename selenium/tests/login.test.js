// selenium/tests/login.test.js
const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');
const fs = require('fs');
const LoginPage = require('../pageObjects/LoginPage');

describe('SauceDemo Login Functionality - Selenium', function () {
  this.timeout(45000);
  this.retries(1);

  let driver;
  let loginPage;

  before(async function () {
    const options = new chrome.Options()
      .addArguments(
        '--headless=new',
        '--no-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--disable-notifications',
        '--window-size=1366,768'
      )
      .setPageLoadStrategy('eager'); // <-- key: don’t wait for all assets

    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();

    // Turn off implicit waits; rely on explicit waits
    await driver.manage().setTimeouts({ implicit: 0, pageLoad: 30000, script: 5000 });

    loginPage = new LoginPage(driver);
  });

  after(async function () {
    if (driver) await driver.quit();
  });

  beforeEach(async function () {
    // Start clean & visit with retry
    await driver.manage().deleteAllCookies();
    await loginPage.visit(); // uses robust visit below
    await driver.executeScript('window.localStorage.clear(); window.sessionStorage.clear();');
  });

  afterEach(async function () {
    if (this.currentTest.state === 'failed') {
      const img = await driver.takeScreenshot();
      fs.mkdirSync('selenium/screenshots', { recursive: true });
      fs.writeFileSync(`selenium/screenshots/${this.currentTest.title}.png`, img, 'base64');
      const html = await driver.getPageSource();
      fs.writeFileSync(`selenium/screenshots/${this.currentTest.title}.html`, html);
    }
  });

  it('Validate that the user can successfully login with valid credentials', async function () {
    await loginPage.login('standard_user', 'secret_sauce');
    assert.strictEqual(await loginPage.verifySuccessfulLogin(), true, 'Login should be successful');
    const currentUrl = await loginPage.getCurrentUrl();
    assert.ok(currentUrl.includes('/inventory.html'), 'Should redirect to inventory page');
  });

  it('Validate that the user cannot login with invalid credentials', async function () {
    await loginPage.login('invalid_user', 'wrong_password');
    await loginPage.waitForErrorVisible();
    const errorText = await loginPage.getErrorMessageText();
    // Sauce Demo: "Epic sadface: Username and password do not match any user in this service"
    assert.match(errorText || '', /username and password do not match/i, 'Error message should be visible');
  });

  it('Validate that the system can display error message when login fails', async function () {
    await loginPage.login('locked_out_user', 'secret_sauce');
    await loginPage.waitForErrorVisible();
    const errorText = await loginPage.getErrorMessageText();
    // Sauce Demo: "Epic sadface: Sorry, this user has been locked out."
    assert.match(errorText || '', /locked out|sorry/i, 'Locked out message should be displayed');
  });

  it('Validate that the system can deny user to login with empty username', async function () {
await loginPage.enterUsername('');           // ensure blank
await loginPage.enterPassword('secret_sauce');
await loginPage.clickLoginButton();
await loginPage.waitForErrorVisible();
const err1 = await loginPage.getErrorMessageText();
assert.match(err1 || '', /username is required/i);
  
  });

  it('Validate that the system can deny user to login with empty password', async function () {
    await loginPage.enterUsername('standard_user');
await loginPage.enterPassword('');           // ensure blank
await loginPage.clickLoginButton();
await loginPage.waitForErrorVisible();
const err2 = await loginPage.getErrorMessageText();
assert.match(err2 || '', /password is required/i);
  });
});
