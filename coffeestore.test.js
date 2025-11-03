// Import necessary libraries
const { Builder, By, until } = require("selenium-webdriver");
const { expect } = require("chai");

// Base URL for the running application
// !!IMPORTANT!! Update this port (5500) if your Live Server uses a different one.
const BASE_URL = "http://127.0.0.1:5500";

// Test Suite for the Online Coffee Store
describe("Online Coffee Store Tests", function () {
  // Set a longer timeout for browser actions
  this.timeout(60000);
  let driver;

  // --- Test Setup ---
  // This runs ONCE before any tests start
  before(async function () {
    driver = await new Builder().forBrowser("chrome").build();
    await driver.manage().window().maximize();
  });

  // --- Test Teardown ---
  // This runs ONCE after all tests are finished
  after(async function () {
    await driver.quit();
  });

  // --- Test Cases ---

  // Test Case 1: Successful Login
  it("should allow a user to log in with valid credentials", async function () {
    // 1. Navigate to the login page
    await driver.get(`${BASE_URL}/login.html`);

    // 2. Enter valid username
    await driver.findElement(By.id("username")).sendKeys("testuser");

    // 3. Enter valid password
    await driver.findElement(By.id("password")).sendKeys("password123");

    // 4. Click the 'Login' button
    // We find the button by its text
    await driver.findElement(By.xpath("//button[text()='Login']")).click();

    // 5. Verification: Wait until the URL is the dashboard
    await driver.wait(until.urlContains("dashboard.html"), 10000);

    const actualUrl = await driver.getCurrentUrl();
    expect(actualUrl).to.include("dashboard.html");
  });

  // Test Case 2: Failed Login
  it("should show an error message with invalid credentials", async function () {
    // 1. Navigate to the login page
    await driver.get(`${BASE_URL}/login.html`);

    // 2. Enter invalid username
    await driver.findElement(By.id("username")).sendKeys("wronguser");

    // 3. Enter invalid password
    await driver.findElement(By.id("password")).sendKeys("wrongpass");

    // 4. Click the 'Login' button
    await driver.findElement(By.xpath("//button[text()='Login']")).click();

    // 5. Verification: Check for the error message
    const errorMessage = await driver
      .findElement(By.id("error-message"))
      .getText();
    expect(errorMessage).to.equal("Invalid username or password");
  });

  // Test Case 3: Login with empty credentials
  it("should show an error message for empty credentials", async function () {
    // 1. Navigate to the login page
    await driver.get(`${BASE_URL}/login.html`);

    // 2. & 3. Leave username and password fields empty
    // We just find the elements but don't call sendKeys()

    // 4. Click the 'Login' button
    await driver.findElement(By.xpath("//button[text()='Login']")).click();

    // 5. Verification: Check for the specific validation message
    const errorMessage = await driver
      .findElement(By.id("error-message"))
      .getText();
    expect(errorMessage).to.equal("Username and Password are required");
  });

  // Test Case 4: Add to Cart
  it("should add a coffee to the cart and update the cart count", async function () {
    // 1. Navigate to the home page
    await driver.get(`${BASE_URL}/index.html`);

    // 2. Find the first 'Add to Cart' button and click it
    // Using .coffee-item button is a good CSS selector
    await driver.findElement(By.css(".coffee-item button")).click();

    // 3. Verification: Check if the cart count text is '1'
    const cartCount = await driver.findElement(By.id("cart-count")).getText();
    expect(cartCount).to.equal("1");
  });

  // Test Case 5: Remove from Cart
  it("should allow removing an item from the cart", async function () {
    // 1. Navigate to home and add an item (to ensure cart is not empty)
    await driver.get(`${BASE_URL}/index.html`);
    await driver.findElement(By.css(".coffee-item button")).click();

    // 2. Go to the cart page
    await driver.get(`${BASE_URL}/cart.html`);

    // 3. Find and click the 'Remove' button
    await driver.findElement(By.css(".remove-from-cart")).click();

    // 4. Verification 1: Check for the "empty cart" message
    const emptyMessage = await driver
      .findElement(By.css("#cart-items p"))
      .getText();
    expect(emptyMessage).to.equal("Your cart is empty.");

    // 5. Verification 2: Check that the cart count in the nav is '0'
    const cartCount = await driver.findElement(By.id("cart-count")).getText();
    expect(cartCount).to.equal("0");
  });

  // Test Case 6: Logout
  it("should log the user out and redirect to the login page", async function () {
    // 1. First, log in
    await driver.get(`${BASE_URL}/login.html`);
    await driver.findElement(By.id("username")).sendKeys("testuser");
    await driver.findElement(By.id("password")).sendKeys("password123");
    await driver.findElement(By.xpath("//button[text()='Login']")).click();

    // 2. Wait to land on the dashboard
    await driver.wait(until.urlContains("dashboard.html"), 10000);

    // 3. Find and click the 'Logout' button
    await driver.findElement(By.id("logout-button")).click();

    // 4. Verification: Wait to be redirected back to login.html
    await driver.wait(until.urlContains("login.html"), 10000);
    const actualUrl = await driver.getCurrentUrl();
    expect(actualUrl).to.include("login.html");
  });
});