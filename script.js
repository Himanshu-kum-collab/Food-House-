// Food data
const foodData = [
    {
        id: 1,
        name: "Margherita Pizza",
        price: 6.9,
        category: "pizza",
        image: "img/food/p1.jpg",
        description: "Classic pizza with tomato sauce, mozzarella, and basil"
    },
    {
        id: 2,
        name: "Cheese Pepperoni Pizza",
        price: 7.99,
        category: "pizza",
        image: "img/category/pizza.jpg",
        description: "Pizza topped with pepperoni and mozzarella cheese"
    },
    {
        id: 3,
        name: "Cheeseburger",
        price: 4.99,
        category: "burger",
        image: "img/food/b1.jpg",
        description: "Juicy  burger with cheese, lettuce, and tomato with special sauce"
    },
    {
        id: 4,
        name: "Paneer Burger",
        price: 3.99,
        category: "burger",
        image: "img/category/burger.jpg",
        description: "Grilled paneer with special sauce and vegetables"
    },
    {
        id: 5,
        name: "Grilled Sandwich",
        price: 4.99,
        category: "sandwich",
        image: "img/food/s1.jpg",
        description: "Triple-decker sandwich with turkey, and vegetables"
    },
    {
        id: 6,
        name: "Veggie Sandwich",
        price: 3.99,
        category: "sandwich",
        image: "img/category/sandwich.jpg",
        description: "Fresh vegetables with hummus and sprouts"
    }
    
];

// Cart array
let cart = [];

// DOM Elements
const cartLink = document.getElementById('cartLink');
const cartModal = document.getElementById('cartModal');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.querySelector('.cart-count');
const featuredFoods = document.getElementById('featuredFoods');
const checkoutBtn = document.getElementById('checkoutBtn');

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    loadCartFromLocalStorage();
    displayFeaturedFoods();
    updateCartUI();
    
    // Event Listeners
    if (cartLink) {
        cartLink.addEventListener('click', function(e) {
            e.preventDefault();
            openCart();
        });
    }
    if (closeCart) {
    closeCart.addEventListener('click', closeCartModal);
   }

    document.addEventListener('click', function(e) {
    if (e.target && e.target.id === 'checkoutBtn') {
        checkout();
    }
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === cartModal) {
            closeCartModal();
        }
    });
});

// function updateCartUI() {
//     if (!cartItems || !cartTotal || !cartCount) return;
// }

// Display featured foods
function displayFeaturedFoods() {
    if (!featuredFoods) return;

    featuredFoods.innerHTML = '';
    
    // Get first 3 items as featured
    const featuredItems = foodData.slice(0, 3);
    
    featuredItems.forEach(food => {
        const foodCard = document.createElement('div');
        foodCard.className = 'food-card';
        foodCard.innerHTML = `
            <img src="${food.image}" alt="${food.name}">
            <div class="food-info">
                <h3>${food.name}</h3>
                <p>${food.description}</p>
                <span class="price">$${food.price.toFixed(2)}</span>
                <button class="add-to-cart" data-id="${food.id}">Add to cart</button>
            </div>
        `;
        featuredFoods.appendChild(foodCard);
    });
    
    // Add event listeners to add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const foodId = parseInt(this.getAttribute('data-id'));
            addToCart(foodId);
        });
    });
}

// Add item to cart
function addToCart(foodId) {
    const food = foodData.find(item => item.id === foodId);
    
    if (food) {
        // Check if item already in cart
        const existingItem = cart.find(item => item.id === foodId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: food.id,
                name: food.name,
                price: food.price,
                image: food.image,
                quantity: 1
            });
        }
        
        saveCartToLocalStorage();
        updateCartUI();
        
        // Show confirmation
        alert(`${food.name} added to cart!`);
    }
}

// Remove item from cart
function removeFromCart(foodId) {
    cart = cart.filter(item => item.id !== foodId);
    saveCartToLocalStorage();
    updateCartUI();
}

// Update item quantity
function updateQuantity(foodId, change) {
    const item = cart.find(item => item.id === foodId);
    
    if (item) {
        item.quantity += change;
        
        if (item.quantity <= 0) {
            removeFromCart(foodId);
        } else {
            saveCartToLocalStorage();
            updateCartUI();
        }
    }
}

// Update cart UI
function updateCartUI() {
    // Update cart count
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Update cart modal
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart-message">Your cart is empty</p>';
        cartTotal.textContent = '0.00';
        return;
    }
    
    cartItems.innerHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="item-info">
                <h4>${item.name}</h4>
                <p class="item-price">$${item.price.toFixed(2)} each</p>
            </div>
            <div class="item-quantity">
                <button class="quantity-btn minus" data-id="${item.id}">-</button>
                <span class="quantity">${item.quantity}</span>
                <button class="quantity-btn plus" data-id="${item.id}">+</button>
            </div>
            <p class="item-total">$${itemTotal.toFixed(2)}</p>
            <button class="remove-item" data-id="${item.id}">×</button>
        `;
        
        cartItems.appendChild(cartItem);
    });
    
    cartTotal.textContent = total.toFixed(2);
    
    // Add event listeners to cart buttons
    document.querySelectorAll('.quantity-btn.minus').forEach(button => {
        button.addEventListener('click', function() {
            const foodId = parseInt(this.getAttribute('data-id'));
            updateQuantity(foodId, -1);
        });
    });
    
    document.querySelectorAll('.quantity-btn.plus').forEach(button => {
        button.addEventListener('click', function() {
            const foodId = parseInt(this.getAttribute('data-id'));
            updateQuantity(foodId, 1);
        });
    });
    
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', function() {
            const foodId = parseInt(this.getAttribute('data-id'));
            removeFromCart(foodId);
        });
    });
}

// Open cart modal
function openCart() {
    cartModal.style.display = 'flex';
}

// Close cart modal
function closeCartModal() {
    cartModal.style.display = 'none';
}

// Checkout function
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    // Save order to localStorage
    const order = {
        items: [...cart],
        total: parseFloat(cartTotal.textContent),
        timestamp: new Date().toISOString()
    };
    
    // Get existing orders or initialize empty array
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // place order confirmation
    alert("🎉 Order Placed Successfully! Thank you for ordering from Food House! ");
    
    // Clear cart
    cart = [];
    saveCartToLocalStorage();
    updateCartUI();
    closeCartModal();
}



// Save cart to localStorage
function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Load cart from localStorage
function loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

// Menu page functions
function displayMenuFoods(category = 'all') {
    const menuFoods = document.getElementById('menuFoods');
    if (!menuFoods) return;
    
    menuFoods.innerHTML = '';
    
    const filteredFoods = category === 'all' 
        ? foodData 
        : foodData.filter(food => food.category === category);
    
    filteredFoods.forEach(food => {
        const foodCard = document.createElement('div');
        foodCard.className = 'food-card';
        foodCard.innerHTML = `
            <img src="${food.image}" alt="${food.name}">
            <div class="food-info">
                <h3>${food.name}</h3>
                <p>${food.description}</p>
                <span class="price">$${food.price.toFixed(2)}</span>
                <button class="add-to-cart" data-id="${food.id}">Add to cart</button>
            </div>
        `;
        menuFoods.appendChild(foodCard);
    });
    
    // Add event listeners to add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const foodId = parseInt(this.getAttribute('data-id'));
            addToCart(foodId);
        });
    });
}

// Filter functionality for menu page
function setupFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get category and display foods
            const category = this.getAttribute('data-category');
            displayMenuFoods(category);
        });
    });
}

// Initialize menu page if on menu page
if (document.querySelector('.menu-page')) {
    document.addEventListener('DOMContentLoaded', function() {
        loadCartFromLocalStorage();
        updateCartUI();
        displayMenuFoods();
        setupFilterButtons();
        
        // Event Listeners
        const cartLink = document.getElementById('cartLink');
        if (cartLink) {
            cartLink.addEventListener('click', function(e) {
                e.preventDefault();
                openCart();
            });
        }
        closeCart.addEventListener('click', closeCartModal);
        
        // Close modal when clicking outside
        window.addEventListener('click', function(event) {
            if (event.target === cartModal) {
                closeCartModal();
            }
        });
    });
}

// Initialize about page if on about page
if (document.querySelector('.about-page')) {
    document.addEventListener('DOMContentLoaded', function() {
        loadCartFromLocalStorage();
        updateCartUI();
        
        // Event Listeners
        const cartLink = document.getElementById('cartLink');
        if (cartLink) {
            cartLink.addEventListener('click', function(e) {
                e.preventDefault();
                openCart();
            });
        }
        closeCart.addEventListener('click', closeCartModal);
        
        // Close modal when clicking outside
        window.addEventListener('click', function(event) {
            if (event.target === cartModal) {
                closeCartModal();
            }
        });
    });
}

// Initialize contact page if on contact page
if (document.querySelector('.contact-page')) {
    document.addEventListener('DOMContentLoaded', function() {
        loadCartFromLocalStorage();
        updateCartUI();
        
        // Event Listeners
        const cartLink = document.getElementById('cartLink');
        if (cartLink) {
            cartLink.addEventListener('click', function(e) {
                e.preventDefault();
                openCart();
            });
        }
        closeCart.addEventListener('click', closeCartModal);
        
        // Close modal when clicking outside
        window.addEventListener('click', function(event) {
            if (event.target === cartModal) {
                closeCartModal();
            }
        });
        
        // Form submission
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Get form data
                const name = document.getElementById('name').value;
                const email = document.getElementById('email').value;
                const message = document.getElementById('message').value;
                
                // Create contact message object
                const contactMessage = {
                    name: name,
                    email: email,
                    message: message,
                    timestamp: new Date().toISOString()
                };
                
                // Save to localStorage
                const messages = JSON.parse(localStorage.getItem('contactMessages')) || [];
                messages.push(contactMessage);
                localStorage.setItem('contactMessages', JSON.stringify(messages));
                
                // Reset form
                contactForm.reset();
                
                // Show confirmation
                alert('Thank you for your message! We will get back to you soon.');
            });
        }
    });
}