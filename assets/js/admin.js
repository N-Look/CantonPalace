// --- SUPABASE CONFIGURATION ---
const SUPABASE_URL = 'https://lqajpfjaygbmhtamcbsy.supabase.co'; 
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxYWpwZmpheWdibWh0YW1jYnN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5MzU5MzIsImV4cCI6MjA2MzUxMTkzMn0.-GMQcBo0HkjSFV0cHFL1wXFVeHX6qAIxSaN-0npddZ0';

if (SUPABASE_URL === 'YOUR_SUPABASE_URL' || SUPABASE_ANON_KEY === 'YOUR_SUPABASE_ANON_KEY') {
    alert('Please configure your Supabase URL and Anon Key in admin.html');
}

const { createClient } = supabase;
const _supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const loginSection = document.getElementById('loginSection');
const adminSection = document.getElementById('adminSection');
const loginButton = document.getElementById('loginButton');
const logoutButton = document.getElementById('logoutButton');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const authError = document.getElementById('authError');

const addMenuItemForm = document.getElementById('addMenuItemForm');
const itemNameInput = document.getElementById('itemName');
const itemDescriptionInput = document.getElementById('itemDescription');
const itemPriceInput = document.getElementById('itemPrice');
const itemQuantityInput = document.getElementById('itemQuantity');
const itemCategoryInput = document.getElementById('itemCategory');
const menuItemsTableBody = document.getElementById('menuItemsTableBody');
const statusMessage = document.getElementById('statusMessage');
const submitButton = document.getElementById('submitButton');
const cancelButton = document.getElementById('cancelButton');
const searchInput = document.getElementById('searchInput');
const addItemButton = document.getElementById('addItemButton');
const addItemModal = document.getElementById('addItemModal');
const closeAddModal = document.getElementById('closeAddModal');
const categoryFilterSelect = document.getElementById('categoryFilter');

let currentEditItemId = null;
let allMenuItems = []; // Store all menu items for search functionality
let uniqueCategories = new Set(); // Store unique categories for filter
let currentImageFile = null;

// --- AUTHENTICATION LOGIC ---

// Check initial auth state
async function checkUserSession() {
    const { data: { session } } = await _supabase.auth.getSession();
    if (session) {
        // User is logged in. Now, verify if they are an admin.
        // For simplicity, we'll assume any logged-in user is an admin for now.
        // In a real app, you'd check a role or custom claim.
        console.log('User session found:', session.user);
        showAdminPanel(session.user);
    } else {
        showLoginPanel();
    }
}

loginButton.addEventListener('click', async () => {
    authError.textContent = '';
    const email = emailInput.value;
    const password = passwordInput.value;

    if (!email || !password) {
        authError.textContent = 'Email and password are required.';
        return;
    }

    try {
        const { data, error } = await _supabase.auth.signInWithPassword({ email, password });

        if (error) {
            authError.textContent = 'Login failed: ' + error.message;
            console.error('Login error:', error);
        } else if (data && data.user) { // Check data and data.user
            // For now, assume logged-in user is admin.
            // TODO: Implement proper admin role checking.
            console.log('Login successful:', data.user);
            showAdminPanel(data.user);
        } else {
            // This case handles if 'error' is null but 'data.user' is null.
            // This can happen for example if MFA is required or other flows where login isn't fully complete.
            authError.textContent = 'Login process initiated, but a user session was not established. This might be due to an incomplete multi-step login (like MFA) or other reasons. Please check for any prompts or console messages.';
            console.warn('Login status: No error, but no user session established. Data:', data);
        }
    } catch (e) {
        authError.textContent = 'An unexpected error occurred during the login attempt. Please check the console.';
        console.error('Unexpected exception during signInWithPassword call:', e);
    }
});

logoutButton.addEventListener('click', async () => {
    const { error } = await _supabase.auth.signOut();
    if (error) {
        console.error('Logout error:', error);
        alert('Logout failed: ' + error.message);
    } else {
        showLoginPanel();
        console.log('Logged out');
    }
});

function showAdminPanel(user) {
    loginSection.style.display = 'none';
    adminSection.style.display = 'block';
    loadMenuItems();
}

function showLoginPanel() {
    loginSection.style.display = 'block';
    adminSection.style.display = 'none';
    menuItemsTableBody.innerHTML = ''; // Clear items when logged out
}

// --- MODAL HANDLING ---

// Open the add item modal
addItemButton.addEventListener('click', () => {
    resetForm();
    addItemModal.style.display = 'block';
});

// Close modal when clicking close button
closeAddModal.addEventListener('click', () => {
    addItemModal.style.display = 'none';
});

// Close modal when clicking outside
window.addEventListener('click', (event) => {
    if (event.target === addItemModal) {
        addItemModal.style.display = 'none';
    }
});

// Cancel button in modal
cancelButton.addEventListener('click', () => {
    addItemModal.style.display = 'none';
    resetForm();
});

// --- CRUD OPERATIONS FOR MENU ITEMS ---

// Load and display menu items
async function loadMenuItems() {
    menuItemsTableBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">Loading...</td></tr>';
    statusMessage.style.display = 'none';

    const { data: items, error } = await _supabase
        .from('menu_items')
        .select('*')
        .order('category', { ascending: true });

    if (error) {
        console.error('Error loading menu items:', error);
        menuItemsTableBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">Error loading items. Check console for details.</td></tr>';
        showStatusMessage('Error loading items: ' + (error.message || 'See console for full error object.'), 'error');
        return;
    }

    if (!items || items.length === 0) {
        menuItemsTableBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No menu items found. Add some!</td></tr>';
        return;
    }

    allMenuItems = items; // Store all items for searching
    
    // Extract unique categories for the filter dropdown
    uniqueCategories = new Set();
    items.forEach(item => {
        if (item.category) {
            uniqueCategories.add(item.category);
        }
    });
    
    // Populate category filter
    populateCategoryFilter();
    
    // Display all items initially
    displayMenuItems(items);
}

// Populate category filter dropdown
function populateCategoryFilter() {
    // Clear existing options except the first one (All Categories)
    while (categoryFilterSelect.options.length > 1) {
        categoryFilterSelect.remove(1);
    }
    
    // Add sorted categories to the dropdown
    [...uniqueCategories].sort().forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilterSelect.appendChild(option);
    });
    
    // Add event listener for category filter changes
    categoryFilterSelect.addEventListener('change', filterByCategory);
}

// Filter items by selected category
function filterByCategory() {
    const selectedCategory = categoryFilterSelect.value;
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    // If "All Categories" is selected and no search term
    if (selectedCategory === 'all' && !searchTerm) {
        displayMenuItems(allMenuItems);
        return;
    }
    
    // Filter by category and search term if applicable
    let filteredItems = allMenuItems;
    
    if (selectedCategory !== 'all') {
        filteredItems = filteredItems.filter(item => 
            item.category === selectedCategory
        );
    }
    
    if (searchTerm) {
        filteredItems = filteredItems.filter(item => 
            item.name.toLowerCase().includes(searchTerm) || 
            (item.description && item.description.toLowerCase().includes(searchTerm)) ||
            (item.category && item.category.toLowerCase().includes(searchTerm)) ||
            (item.quantity && item.quantity.toLowerCase().includes(searchTerm)) ||
            (item.price && item.price.toLowerCase().includes(searchTerm))
        );
    }
    
    if (filteredItems.length === 0) {
        menuItemsTableBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No items found matching your criteria.</td></tr>';
    } else {
        displayMenuItems(filteredItems);
    }
}

function displayMenuItems(items) {
    menuItemsTableBody.innerHTML = '';
    
    const sortedItems = [...items].sort((a, b) => {
        if (a.category !== b.category) {
            return (a.category || '').localeCompare(b.category || '');
        }
        return a.name.localeCompare(b.name);
    });
    
    let currentCategory = null;
    
    sortedItems.forEach(item => {
        if (item.category !== currentCategory) {
            currentCategory = item.category;
        }
        
        const tableRow = document.createElement('tr');
        
        // Image cell with remove button
        const imageCell = document.createElement('td');
        imageCell.className = 'image-cell';
        if (item.image_url) {
            const imageContainer = document.createElement('div');
            imageContainer.style.position = 'relative';
            
            const image = document.createElement('img');
            image.className = 'item-preview-image';
            image.src = item.image_url;
            image.alt = item.name;
            
            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-image-btn';
            removeBtn.innerHTML = '<i class="fas fa-trash"></i>';
            removeBtn.title = 'Remove Image';
            removeBtn.onclick = (e) => {
                e.stopPropagation();
                if (confirm('Are you sure you want to remove this image?')) {
                    removeImage(item.id, item.image_url);
                }
            };
            
            imageContainer.appendChild(image);
            imageContainer.appendChild(removeBtn);
            imageCell.appendChild(imageContainer);
        }
        
        // Rest of the cells
        const nameCell = document.createElement('td');
        nameCell.textContent = item.name;
        
        const categoryCell = document.createElement('td');
        if (item.category) {
            const categoryBadge = document.createElement('span');
            categoryBadge.className = 'category-badge';
            categoryBadge.textContent = item.category;
            categoryCell.appendChild(categoryBadge);
        } else {
            categoryCell.textContent = 'N/A';
        }
        
        const quantityCell = document.createElement('td');
        quantityCell.textContent = item.quantity || 'N/A';
        
        const priceCell = document.createElement('td');
        priceCell.textContent = item.price || 'N/A';
        
        const actionsCell = document.createElement('td');
        actionsCell.className = 'admin-actions';
        
        const editButton = document.createElement('button');
        editButton.className = 'action-btn edit-btn';
        editButton.innerHTML = '<i class="fas fa-edit"></i>';
        editButton.title = 'Edit';
        editButton.onclick = () => editItem(item.id);
        
        const viewButton = document.createElement('button');
        viewButton.className = 'action-btn view-btn';
        viewButton.innerHTML = '<i class="fas fa-eye"></i>';
        viewButton.title = 'View';
        viewButton.onclick = () => viewItem(item.id);
        
        const moreButton = document.createElement('button');
        moreButton.className = 'action-btn options-btn';
        moreButton.innerHTML = '<i class="fas fa-ellipsis-v"></i>';
        moreButton.title = 'More Options';
        moreButton.onclick = () => showOptions(item.id, item.name);
        
        actionsCell.appendChild(editButton);
        actionsCell.appendChild(viewButton);
        actionsCell.appendChild(moreButton);
        
        tableRow.appendChild(imageCell);
        tableRow.appendChild(nameCell);
        tableRow.appendChild(categoryCell);
        tableRow.appendChild(quantityCell);
        tableRow.appendChild(priceCell);
        tableRow.appendChild(actionsCell);
        
        menuItemsTableBody.appendChild(tableRow);
    });
}

// Show options menu (for more actions like delete)
function showOptions(itemId, itemName) {
    if (confirm(`Do you want to delete "${itemName}"?`)) {
        deleteItem(itemId, itemName);
    }
}

// View item details (placeholder for future functionality)
function viewItem(itemId) {
    // For now, just do the same as edit but could be expanded with a view-only modal
    editItem(itemId);
}

// Image preview handler
document.getElementById('itemImage').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        currentImageFile = file;
        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.getElementById('imagePreview');
            preview.style.display = 'block';
            preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
        };
        reader.readAsDataURL(file);
    }
});

// Function to upload image to Supabase Storage
async function uploadImage(file) {
    if (!file) return null;
    
    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `food-images/${fileName}`;
        
        const { data, error } = await _supabase.storage
            .from('menu-images')
            .upload(filePath, file);
            
        if (error) throw error;
        
        // Get the public URL for the uploaded image
        const { data: { publicUrl } } = _supabase.storage
            .from('menu-images')
            .getPublicUrl(filePath);
            
        return publicUrl;
    } catch (error) {
        console.error('Error uploading image:', error);
        showStatusMessage('Error uploading image: ' + error.message, 'error');
        return null;
    }
}

// Modify the form submission handler to include image upload
submitButton.addEventListener('click', async () => {
    if (!addMenuItemForm.reportValidity()) {
        return;
    }
    
    statusMessage.style.display = 'none';

    const name = itemNameInput.value;
    const description = itemDescriptionInput.value;
    const quantity = itemQuantityInput.value;
    const category = itemCategoryInput.value;
    const priceValue = parseFloat(itemPriceInput.value);

    if (!name || isNaN(priceValue) || !category) {
        showStatusMessage('Item name, category, and a valid price are required.', 'error');
        return;
    }

    // Format price as "$XX.YY" for Supabase varchar column
    const formattedPrice = `$${priceValue.toFixed(2)}`;

    // Handle image upload first if there's a new image
    let imageUrl = null;
    if (currentImageFile) {
        imageUrl = await uploadImage(currentImageFile);
        if (!imageUrl && !confirm('Failed to upload image. Continue without image?')) {
            return;
        }
    }

    const itemData = {
        name: name,
        description: description,
        quantity: quantity,
        price: formattedPrice,
        category: category
    };

    // Only add image_url if we have a new image
    if (imageUrl) {
        itemData.image_url = imageUrl;
    }

    if (currentEditItemId) {
        // Update item
        const { data, error } = await _supabase
            .from('menu_items')
            .update(itemData)
            .eq('id', currentEditItemId)
            .select();

        if (error) {
            console.error('Error updating item:', error);
            showStatusMessage('Error updating item: ' + error.message, 'error');
        } else {
            console.log('Item updated:', data);
            addItemModal.style.display = 'none';
            resetForm();
            loadMenuItems();
            showStatusMessage('Item updated successfully!', 'success');
        }
    } else {
        // Add new item
        const { data, error } = await _supabase
            .from('menu_items')
            .insert([itemData])
            .select();

        if (error) {
            console.error('Error adding item:', error);
            showStatusMessage('Error adding item: ' + error.message, 'error');
        } else {
            console.log('Item added:', data);
            addItemModal.style.display = 'none';
            resetForm();
            loadMenuItems();
            showStatusMessage('Item added successfully!', 'success');
        }
    }
});

// Modify the resetForm function to clear image preview
function resetForm() {
    addMenuItemForm.reset();
    currentEditItemId = null;
    currentImageFile = null;
    document.getElementById('imagePreview').style.display = 'none';
    document.querySelector('.modal-title').textContent = 'Add New Menu Item';
    submitButton.textContent = 'Add Item';
}

// Modify the editItem function to show existing image
async function editItem(itemId) {
    statusMessage.style.display = 'none';
    try {
        const { data: item, error } = await _supabase
            .from('menu_items')
            .select('*')
            .eq('id', itemId)
            .single();

        if (error) {
            throw error;
        }

        if (item) {
            // Fill the form with item data
            itemNameInput.value = item.name;
            itemDescriptionInput.value = item.description || '';
            itemQuantityInput.value = item.quantity || '';
            itemCategoryInput.value = item.category || '';
            itemPriceInput.value = item.price ? parseFloat(item.price.replace('$', '')) : '';
            
            // Show existing image if available
            const preview = document.getElementById('imagePreview');
            if (item.image_url) {
                preview.style.display = 'block';
                preview.innerHTML = `
                    <img src="${item.image_url}" alt="${item.name}">
                    <button type="button" class="remove-image-btn" onclick="removeImage(${item.id}, '${item.image_url}')">
                        <i class="fas fa-trash"></i> Remove Image
                    </button>
                `;
            } else {
                preview.style.display = 'none';
            }
            
            // Update form state and show modal
            currentEditItemId = item.id;
            document.querySelector('.modal-title').textContent = 'Edit Menu Item';
            submitButton.textContent = 'Update Item';
            addItemModal.style.display = 'block';
        }
    } catch (error) {
        console.error('Error fetching item for edit:', error);
        showStatusMessage('Error fetching item details: ' + error.message, 'error');
    }
}

// --- SEARCH FUNCTIONALITY ---

// Real-time search as user types
searchInput.addEventListener('input', performSearch);

function performSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const selectedCategory = categoryFilterSelect.value;
    
    let filteredItems = allMenuItems;
    
    // Apply category filter if not "all"
    if (selectedCategory !== 'all') {
        filteredItems = filteredItems.filter(item => 
            item.category === selectedCategory
        );
    }
    
    // Apply search term filter if there is one
    if (searchTerm) {
        filteredItems = filteredItems.filter(item => 
            item.name.toLowerCase().includes(searchTerm) || 
            (item.description && item.description.toLowerCase().includes(searchTerm)) ||
            (item.category && item.category.toLowerCase().includes(searchTerm)) ||
            (item.quantity && item.quantity.toLowerCase().includes(searchTerm)) ||
            (item.price && item.price.toLowerCase().includes(searchTerm))
        );
    }
    
    if (filteredItems.length === 0) {
        menuItemsTableBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No items found matching your criteria.</td></tr>';
    } else {
        displayMenuItems(filteredItems);
    }
}

// --- HELPER FUNCTIONS ---

function showStatusMessage(message, type) {
    statusMessage.textContent = message;
    statusMessage.className = `status ${type}`;
    statusMessage.style.display = 'block';
    
    // Auto-hide the message after 3 seconds
    setTimeout(() => {
        statusMessage.style.display = 'none';
    }, 3000);
}

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    // Check user session on page load
    checkUserSession();
});

// Add the removeImage function
async function removeImage(itemId, imageUrl) {
    try {
        // Extract the file path from the URL
        const urlParts = imageUrl.split('/');
        const filePath = 'food-images/' + urlParts[urlParts.length - 1];
        
        // Delete the file from storage
        const { error: storageError } = await _supabase.storage
            .from('menu-images')
            .remove([filePath]);

        if (storageError) {
            throw storageError;
        }

        // Update the menu item to remove the image_url
        const { error: updateError } = await _supabase
            .from('menu_items')
            .update({ image_url: null })
            .eq('id', itemId);

        if (updateError) {
            throw updateError;
        }

        // Update the UI
        document.getElementById('imagePreview').style.display = 'none';
        showStatusMessage('Image removed successfully!', 'success');
        
        // Refresh the menu items display
        loadMenuItems();
        
    } catch (error) {
        console.error('Error removing image:', error);
        showStatusMessage('Error removing image: ' + error.message, 'error');
    }
}
