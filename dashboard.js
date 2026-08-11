// State Management
let booksData = [];
let salesData = [];
let notificationsData = [];

document.addEventListener('DOMContentLoaded', () => {
    initUI();
    fetchDashboardData();
    setupFormListeners();
});

// Navigation / View Switcher
function switchTab(viewId, event) {
    if (event) event.preventDefault();

    // Hide all section views
    document.querySelectorAll('.view-section').forEach(sec => sec.classList.add('hidden'));
    
    // Show selected view
    const targetView = document.getElementById(viewId);
    if (targetView) targetView.classList.remove('hidden');

    // Update menu state
    document.querySelectorAll('.side-menu .menu-item').forEach(item => item.classList.remove('active'));
    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
    }

    // Dynamic Title Update
    const titleMap = {
        'dashboard-view': 'My Books',
        'creator-view': 'Publish New Book',
        'studio-view': 'Web Studio',
        'sales-view': 'Sales & Royalties',
        'profile-view': 'Author Profile'
    };
    document.getElementById('page-heading').innerText = titleMap[viewId] || 'Author Studio';
}

// UI & Event Handlers Setup
function initUI() {
    // Quick Create Button on Dashboard
    const quickCreateBtn = document.getElementById('quick-create-trigger');
    if (quickCreateBtn) {
        quickCreateBtn.addEventListener('click', (e) => {
            switchTab('creator-view', e);
            const menuCreate = document.getElementById('menu-create');
            if (menuCreate) {
                document.querySelectorAll('.side-menu .menu-item').forEach(i => i.classList.remove('active'));
                menuCreate.classList.add('active');
            }
        });
    }

    // Toggle PDF / Web Book Inputs in Creator
    const uploadModeRadios = document.querySelectorAll('input[name="upload-mode"]');
    uploadModeRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            const isPdf = e.target.value === 'pdf';
            document.getElementById('pdf-input-group').classList.toggle('hidden', !isPdf);
            document.getElementById('html-input-group').classList.toggle('hidden', isPdf);
        });
    });

    // Close Modal Handler
    const closeModalBtn = document.getElementById('close-modal-btn');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            document.getElementById('edit-book-modal').classList.add('hidden');
        });
    }
}

// Notification Dropdown Toggle
function toggleNotifDropdown() {
    const dropdown = document.getElementById('notif-dropdown');
    dropdown.classList.toggle('hidden');
}

// Data Fetching (Simulated / API Bridge)
async function fetchDashboardData() {
    // Example local state populating standard UI
    renderBooksList();
    renderSalesView();
    renderNotifications();
}

// Render Dashboard Book Cards
function renderBooksList() {
    const container = document.getElementById('author-books-container');
    if (!container) return;

    if (booksData.length === 0) {
        container.innerHTML = `<p style="color: var(--text-muted); font-size: 14px;">No books published yet. Use the button below to get started!</p>`;
        return;
    }

    container.innerHTML = booksData.map(book => `
        <div class="author-book-card">
            <div class="cover-thumb yellow-theme">
                ${book.title}
            </div>
            <div class="book-meta">
                <h3>${book.title}</h3>
                <p><strong>Category:</strong> ${book.category}</p>
                <p><strong>Price:</strong> $${parseFloat(book.price).toFixed(2)}</p>
                <p><span class="badge status-pub">${book.format ? book.format.toUpperCase() : 'PDF'}</span></p>
                <button onclick="openEditModal('${book.id}')" style="margin-top: 8px; font-size: 12px; padding: 4px 8px; cursor: pointer;">Edit Info</button>
            </div>
        </div>
    `).join('');
}

// Render Sales & Earnings
function renderSalesView() {
    const totalEarningsEl = document.getElementById('stats-total-earnings');
    const totalSalesEl = document.getElementById('stats-total-sales');
    const ecocashBalEl = document.getElementById('dashboard-ecocash-balance');

    let totalEarnings = 0;
    let totalSales = 0;

    salesData.forEach(item => {
        totalEarnings += item.revenue || 0;
        totalSales += item.units || 0;
    });

    if (totalEarningsEl) totalEarningsEl.innerText = `$${totalEarnings.toFixed(2)}`;
    if (totalSalesEl) totalSalesEl.innerText = totalSales;
    if (ecocashBalEl) ecocashBalEl.innerText = `$${totalEarnings.toFixed(2)} USD`;
}

// Render Notifications
function renderNotifications() {
    const badge = document.getElementById('notif-badge');
    const list = document.getElementById('notif-list-container');
    
    if (notificationsData.length > 0) {
        badge.innerText = notificationsData.length;
        badge.classList.remove('hidden');
        list.innerHTML = notificationsData.map(n => `
            <div class="notif-card unread">
                <span class="notif-card-title">${n.title}</span>
                <p class="notif-card-body">${n.message}</p>
                <span class="notif-card-date">${n.date}</span>
            </div>
        `).join('');
    } else {
        badge.classList.add('hidden');
        list.innerHTML = `<p style="text-align: center; color: var(--text-muted); font-size: 13px; padding: 10px 0;">No new notifications</p>`;
    }
}

// Form Handlers
function setupFormListeners() {
    // Publishing Form Submit
    const publishForm = document.getElementById('publish-master-form');
    if (publishForm) {
        publishForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const newBook = {
                id: Date.now().toString(),
                author: document.getElementById('book-author-name').value,
                title: document.getElementById('book-title').value,
                category: document.getElementById('book-category').value,
                description: document.getElementById('book-description').value,
                price: parseFloat(document.getElementById('book-price').value) || 0,
                format: document.querySelector('input[name="upload-mode"]:checked').value
            };

            booksData.push(newBook);
            renderBooksList();
            publishForm.reset();
            alert('Book successfully published!');
            switchTab('dashboard-view');
        });
    }

    // Profile Form Submit
    const profileForm = document.getElementById('author-profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Profile and payout details updated successfully!');
        });
    }
}

// Edit Book Modal Action
function openEditModal(bookId) {
    const book = booksData.find(b => b.id === bookId);
    if (!book) return;

    document.getElementById('edit-book-id').value = book.id;
    document.getElementById('edit-book-description').value = book.description || '';
    document.getElementById('edit-book-price').value = book.price || 0;

    document.getElementById('edit-book-modal').classList.remove('hidden');
}

