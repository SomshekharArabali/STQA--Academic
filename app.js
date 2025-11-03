document.addEventListener("DOMContentLoaded", () => {
  // --- DATABASE ---

  // Hard-coded user data
  const hardcodedUser = {
    username: "testuser",
    password: "password123",
  };

  // Hard-coded book data
  const books = [
    {
      id: 1,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      price: 10.99,
    },
    {
      id: 2,
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      price: 12.5,
    },
    { id: 3, title: "1984", author: "George Orwell", price: 9.75 },
    { id: 4, title: "Pride and Prejudice", author: "Jane Austen", price: 8.99 },
  ];

  // --- CART LOGIC ---

  // Initialize cart from localStorage
  let cart = JSON.parse(sessionStorage.getItem("cart")) || [];

  function updateCartCount() {
    const cartCount = document.getElementById("cart-count");
    if (cartCount) {
      cartCount.textContent = cart.length;
    }
  }

  function saveCart() {
    sessionStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
  }

  function addToCart(bookId) {
    const book = books.find((b) => b.id === bookId);
    if (book) {
      cart.push(book);
      saveCart();
      console.log(`${book.title} added to cart!`);
    }
  }

  function removeFromCart(bookId) {
    cart = cart.filter((book) => book.id !== bookId);
    saveCart();
    displayCartItems(); // Re-render cart page
  }

  // --- PAGE-SPECIFIC LOGIC ---

  // Get the current page's filename
  const currentPage = window.location.pathname.split("/").pop();

  // --- HOME PAGE (`index.html`) ---
  if (currentPage === "index.html" || currentPage === "") {
    const bookList = document.getElementById("book-list");
    if (bookList) {
      books.forEach((book) => {
        const bookItem = document.createElement("div");
        bookItem.className = "book-item";
        bookItem.innerHTML = `
                    <h3>${book.title}</h3>
                    <p>by ${book.author}</p>
                    <p><b>$${book.price.toFixed(2)}</b></p>
                    <button class="add-to-cart" data-id="${
                      book.id
                    }">Add to Cart</button>
                `;
        bookList.appendChild(bookItem);
      });

      // Add event listeners to "Add to Cart" buttons
      document.querySelectorAll(".add-to-cart").forEach((button) => {
        button.addEventListener("click", (e) => {
          const bookId = parseInt(e.target.getAttribute("data-id"));
          addToCart(bookId);
        });
      });
    }
  }

  // --- LOGIN PAGE (`login.html`) ---
  if (currentPage === "login.html") {
    const loginForm = document.getElementById("login-form");
    const errorMessage = document.getElementById("error-message");

    if (loginForm) {
      loginForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        // --- THIS IS THE NEW LOGIC ---

        // 1. Check for empty fields FIRST
        if (username === "" || password === "") {
          errorMessage.textContent = "Username and Password are required";
        }
        // 2. Check for correct credentials
        else if (
          username === hardcodedUser.username &&
          password === hardcodedUser.password
        ) {
          // Login successful
          errorMessage.textContent = ""; // Clear error on success
          sessionStorage.setItem("isLoggedIn", "true");
          sessionStorage.setItem("username", username);
          window.location.href = "dashboard.html";
        }
        // 3. If neither, credentials must be wrong
        else {
          errorMessage.textContent = "Invalid username or password";
        }
      });
    }
  }

  // --- DASHBOARD PAGE (`dashboard.html`) ---
  if (currentPage === "dashboard.html") {
    const isLoggedIn = sessionStorage.getItem("isLoggedIn");
    const username = sessionStorage.getItem("username");

    // Protect the page
    if (isLoggedIn !== "true") {
      window.location.href = "login.html";
    }

    const welcomeMessage = document.getElementById("welcome-message");
    if (welcomeMessage) {
      welcomeMessage.textContent = `Welcome, ${username}!`;
    }

    const logoutButton = document.getElementById("logout-button");
    if (logoutButton) {
      logoutButton.addEventListener("click", (e) => {
        e.preventDefault();
        sessionStorage.removeItem("isLoggedIn");
        sessionStorage.removeItem("username");
        window.location.href = "login.html";
      });
    }
  }

  // --- CART PAGE (`cart.html`) ---
  if (currentPage === "cart.html") {
    displayCartItems();
  }

  function displayCartItems() {
    const cartItemsContainer = document.getElementById("cart-items");
    const totalPriceEl = document.getElementById("total-price");

    if (cartItemsContainer) {
      cartItemsContainer.innerHTML = ""; // Clear existing items
      let total = 0;

      if (cart.length === 0) {
        cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
        totalPriceEl.textContent = "0.00";
        return;
      }

      cart.forEach((book) => {
        const cartItem = document.createElement("div");
        cartItem.className = "cart-item";
        cartItem.innerHTML = `
                    <div class="cart-item-details">
                        <h3>${book.title}</h3>
                        <p>$${book.price.toFixed(2)}</p>
                    </div>
                    <button class="remove-from-cart" data-id="${
                      book.id
                    }">Remove</button>
                `;
        cartItemsContainer.appendChild(cartItem);
        total += book.price;
      });

      totalPriceEl.textContent = total.toFixed(2);

      // Add event listeners to "Remove" buttons
      document.querySelectorAll(".remove-from-cart").forEach((button) => {
        button.addEventListener("click", (e) => {
          const bookId = parseInt(e.target.getAttribute("data-id"));
          removeFromCart(bookId);
        });
      });
    }
  }

  // --- GLOBAL ---

  // Update cart count on all pages
  updateCartCount();
});
