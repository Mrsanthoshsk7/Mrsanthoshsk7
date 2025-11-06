// Store subscribers in localStorage
let subscribers = JSON.parse(localStorage.getItem('subscribers')) || [];

// Function to display subscribers in a table
function displaySubscribers() {
    const container = document.getElementById('subscribers-list');
    if (!container) return;

    // Create table if it doesn't exist
    if (!document.getElementById('subscribers-table')) {
        container.innerHTML = `
            <table class="table table-dark table-striped mt-4" id="subscribers-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        `;
    }

    const tbody = document.querySelector('#subscribers-table tbody');
    tbody.innerHTML = '';

    subscribers.forEach((subscriber, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${subscriber.name}</td>
            <td>${subscriber.email}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editSubscriber(${index})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-danger btn-sm" onclick="deleteSubscriber(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Create - Add new subscriber
function addSubscriber(event) {
    event.preventDefault();

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    // Validate inputs
    if (!nameInput.value || !emailInput.value || !passwordInput.value) {
        showAlert('Please fill in all fields', 'danger');
        return;
    }

    // Check if email already exists
    if (subscribers.some(sub => sub.email === emailInput.value)) {
        showAlert('Email already registered', 'warning');
        return;
    }

    // Add new subscriber
    const newSubscriber = {
        name: nameInput.value,
        email: emailInput.value,
        password: passwordInput.value, // In a real app, this should be hashed
        dateAdded: new Date().toISOString()
    };

    subscribers.push(newSubscriber);
    saveSubscribers();

    // Clear form
    event.target.reset();
    showAlert('Successfully subscribed!', 'success');
}

// Read - Get subscriber by index
function getSubscriber(index) {
    return subscribers[index];
}

// Update - Edit subscriber
function editSubscriber(index) {
    const subscriber = getSubscriber(index);
    if (!subscriber) return;

    // Create edit modal if it doesn't exist
    if (!document.getElementById('editModal')) {
        const modalHTML = `
            <div class="modal fade" id="editModal" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content bg-dark text-white">
                        <div class="modal-header border-warning">
                            <h5 class="modal-title text-warning">Edit Subscriber</h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <form id="editForm">
                                <input type="hidden" id="editIndex">
                                <div class="mb-3">
                                    <label for="editName" class="form-label">Name</label>
                                    <input type="text" class="form-control bg-dark text-white" id="editName" required>
                                </div>
                                <div class="mb-3">
                                    <label for="editEmail" class="form-label">Email</label>
                                    <input type="email" class="form-control bg-dark text-white" id="editEmail" required>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer border-warning">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" class="btn btn-warning" onclick="updateSubscriber()">Save Changes</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    // Fill form with subscriber data
    document.getElementById('editIndex').value = index;
    document.getElementById('editName').value = subscriber.name;
    document.getElementById('editEmail').value = subscriber.email;

    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('editModal'));
    modal.show();
}

// Update - Save subscriber changes
function updateSubscriber() {
    const index = document.getElementById('editIndex').value;
    const name = document.getElementById('editName').value;
    const email = document.getElementById('editEmail').value;

    // Validate inputs
    if (!name || !email) {
        showAlert('Please fill in all fields', 'danger');
        return;
    }

    // Check if email exists with other subscribers
    const emailExists = subscribers.some((sub, i) => sub.email === email && i !== parseInt(index));
    if (emailExists) {
        showAlert('Email already registered', 'warning');
        return;
    }

    // Update subscriber
    subscribers[index] = {
        ...subscribers[index],
        name: name,
        email: email,
        dateUpdated: new Date().toISOString()
    };

    saveSubscribers();
    bootstrap.Modal.getInstance(document.getElementById('editModal')).hide();
    showAlert('Subscriber updated successfully', 'success');
}

// Delete - Remove subscriber
function deleteSubscriber(index) {
    if (confirm('Are you sure you want to delete this subscriber?')) {
        subscribers.splice(index, 1);
        saveSubscribers();
        showAlert('Subscriber deleted successfully', 'success');
    }
}

// Save subscribers to localStorage
function saveSubscribers() {
    localStorage.setItem('subscribers', JSON.stringify(subscribers));
    displaySubscribers();
}

// Show alert message
function showAlert(message, type = 'info') {
    const alertHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;

    const alertContainer = document.getElementById('alert-container');
    if (!alertContainer) {
        const container = document.createElement('div');
        container.id = 'alert-container';
        container.style.position = 'fixed';
        container.style.top = '20px';
        container.style.right = '20px';
        container.style.zIndex = '1050';
        document.body.appendChild(container);
    }

    document.getElementById('alert-container').insertAdjacentHTML('beforeend', alertHTML);

    // Remove alert after 3 seconds
    setTimeout(() => {
        const alerts = document.querySelectorAll('.alert');
        alerts.forEach(alert => {
            if (alert) {
                bootstrap.Alert.getInstance(alert)?.close();
            }
        });
    }, 3000);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Initialize cards
    createCards();

    // Setup form submission
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', addSubscriber);
    }

    // Create subscribers list container
    const footer = document.querySelector('footer');
    if (footer) {
        const container = document.createElement('div');
        container.id = 'subscribers-list';
        container.className = 'container mt-4';
        footer.appendChild(container);
        displaySubscribers();
    }
});

// Cards functionality
async function createCards() {
    const container = document.getElementById('cards-container');
    const spinner = document.getElementById('loading-spinner');

    try {
        // Show loading spinner
        spinner.style.display = 'inline-block';
        container.innerHTML = '';

        // Fetch user data
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        const users = await response.json();

        // Get only first 3 users
        const selectedUsers = users.slice(0, 3);

        // Create cards for each user
        selectedUsers.forEach((user, index) => {
            container.innerHTML += `
                <div class="col-md-4">
                    <div class="card bg-dark text-white h-100">
                        <img src="https://robohash.org/${user.id}?size=400x400&set=set2" 
                             class="card-img-top" 
                             alt="${user.name}"
                             style="height: 300px; object-fit: cover;">
                        <div class="card-body text-center">
                            <h5 class="card-title text-warning mb-0">${user.name}</h5>
                        </div>
                    </div>
                </div>
            `;
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        container.innerHTML = `
            <div class="col-12 text-center">
                <p class="text-danger">Error loading content. Please try again later.</p>
            </div>`;
    } finally {
        // Hide loading spinner
        spinner.style.display = 'none';
    }
}