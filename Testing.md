# Project Testing Documentation

This document outlines the testing strategy, tools, and expected outcomes for the Online Coffee Store application.

## 1. Testing Framework and Tools

The project uses a combination of popular JavaScript testing tools for end-to-end (E2E) browser automation:

*   **Selenium WebDriver**: This is the core tool for automating browser interactions. It allows us to simulate user actions like navigating pages, clicking buttons, and entering text.
*   **Mocha**: A flexible and feature-rich JavaScript test framework. It provides the structure for organizing tests into suites (`describe`) and individual test cases (`it`).
*   **Chai**: An assertion library that pairs well with Mocha. It provides a readable way to express what you expect from your tests (e.g., `expect(actual).to.equal(expected)`).

## 2. How to Run Tests

To execute the test suite, follow these steps:

1.  **Ensure Dependencies are Installed**: If you haven't already, install the project's dependencies:
    ```bash
    npm install
    ```
2.  **Start the Application**: The tests require the application to be running. Open `index.html` (or any other HTML file) using a Live Server extension in your IDE (e.g., VS Code's Live Server). Note the port number (e.g., `http://127.0.0.1:5500`).
    *   **Important**: If your Live Server uses a different port than `5500`, you will need to update the `BASE_URL` constant in `coffeestore.test.js` to match your server's port.
3.  **Run Tests**: Open your terminal in the project's root directory and run the test command:
    ```bash
    npm test
    ```

## 3. Test File: `coffeestore.test.js`

This file contains all the end-to-end tests for the Online Coffee Store. It uses Selenium WebDriver to interact with the browser and Mocha/Chai to define and assert test outcomes.

### Test Suite Structure

The tests are organized within a `describe("Online Coffee Store Tests", ...)` block.
*   `before`: This hook runs once before all tests, setting up the Selenium WebDriver instance and maximizing the browser window.
*   `after`: This hook runs once after all tests are complete, quitting the browser instance.

### Individual Test Cases

Each `it("should do something", ...)` block represents a specific test scenario.

#### Test Case 1: Successful Login
*   **What it tests**: Verifies that a user can successfully log in with valid credentials.
*   **Code Flow**:
    1.  Navigates to `login.html`.
    2.  Enters "testuser" into the username field.
    3.  Enters "password123" into the password field.
    4.  Clicks the "Login" button.
    5.  Waits for the URL to change to `dashboard.html`.
*   **Expected Output/Assertion**: The current URL should include "dashboard.html".

#### Test Case 2: Failed Login
*   **What it tests**: Verifies that an error message is displayed when a user attempts to log in with invalid credentials.
*   **Code Flow**:
    1.  Navigates to `login.html`.
    2.  Enters "wronguser" into the username field.
    3.  Enters "wrongpass" into the password field.
    4.  Clicks the "Login" button.
*   **Expected Output/Assertion**: The text content of the element with `id="error-message"` should be "Invalid username or password".

#### Test Case 3: Login with Empty Credentials
*   **What it tests**: Verifies that an error message is displayed when a user attempts to log in with empty username and password fields.
*   **Code Flow**:
    1.  Navigates to `login.html`.
    2.  Leaves username and password fields empty.
    3.  Clicks the "Login" button.
*   **Expected Output/Assertion**: The text content of the element with `id="error-message"` should be "Username and Password are required".

#### Test Case 4: Add to Cart
*   **What it tests**: Verifies that a coffee item can be added to the cart and the cart count updates correctly.
*   **Code Flow**:
    1.  Navigates to `index.html`.
    2.  Finds and clicks the "Add to Cart" button for the first coffee item.
*   **Expected Output/Assertion**: The text content of the element with `id="cart-count"` (in the navigation bar) should be "1".

#### Test Case 5: Remove from Cart
*   **What it tests**: Verifies that an item can be removed from the cart, resulting in an empty cart message and updated cart count.
*   **Code Flow**:
    1.  Navigates to `index.html` and adds an item to the cart.
    2.  Navigates to `cart.html`.
    3.  Finds and clicks the "Remove" button for the item in the cart.
*   **Expected Output/Assertion**:
    *   The text content of the paragraph inside `#cart-items` should be "Your cart is empty.".
    *   The text content of the element with `id="cart-count"` should be "0".

#### Test Case 6: Logout
*   **What it tests**: Verifies that a logged-in user can successfully log out and be redirected to the login page.
*   **Code Flow**:
    1.  Performs a successful login (steps from Test Case 1).
    2.  Waits for the URL to be `dashboard.html`.
    3.  Finds and clicks the "Logout" button.
    4.  Waits for the URL to change to `login.html`.
*   **Expected Output/Assertion**: The current URL should include "login.html".

## 4. Expected Test Output

When you run `npm test`, a Chrome browser window will automatically open, and you will see the tests being executed. In your terminal, Mocha will report the results.

**Example of successful output:**

```
  Online Coffee Store Tests
    ✓ should allow a user to log in with valid credentials (1234ms)
    ✓ should show an error message with invalid credentials (567ms)
    ✓ should show an error message for empty credentials (456ms)
    ✓ should add a coffee to the cart and update the cart count (789ms)
    ✓ should allow removing an item from the cart (1011ms)
    ✓ should log the user out and redirect to the login page (1314ms)


  6 passing (5s)
```

If any tests fail, Mocha will provide details about which test failed and why (e.g., expected value vs. actual value), helping you to debug the issue.