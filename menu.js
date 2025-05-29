import supabase from '../supabase.js';

let menuData = [];

// Load menu data from Supabase
async function loadMenuData() {
    try {
        const { data, error } = await supabase
            .from('menu_items')
            .select('*')
            .order('id', { ascending: true });
        
        if (error) {
            console.error('Error fetching menu data:', error);
            return [];
        }
        
        return data;
    } catch (error) {
        console.error('Error loading menu data:', error);
        return [];
    }
}

// Desktop menu display function
function displayDesktopMenuItems(items, category) {
    const menuItems = document.querySelector('.desktop-menu .menu-content .menu-items');
    const menuIntro = document.querySelector('.menu-intro');
    menuItems.innerHTML = '';
    
    if (menuIntro) {
        menuIntro.style.display = 'none';
    }

    // Group and display items as before
    const groupedItems = groupItemsByCategory(items);
    displayGroupedItems(groupedItems, menuItems);
}

// Mobile menu display function
function displayMobileMenuItems(items, categoryId) {
    const menuItems = document.getElementById(categoryId);
    if (!menuItems) return;
    
    menuItems.innerHTML = '';
    
    // Group and display items
    const groupedItems = groupItemsByCategory(items);
    
    Object.entries(groupedItems).forEach(([subcategory, subcategoryItems]) => {
        const heading = document.createElement('h2');
        heading.className = 'category-heading';
        heading.textContent = subcategory;
        menuItems.appendChild(heading);

        subcategoryItems.forEach(item => {
            const menuItem = document.createElement('div');
            menuItem.className = 'menu-item';
            
            // Add has-image class if the item has an image
            if (item.image_url) {
                menuItem.classList.add('has-image');
            }

            const contentContainer = document.createElement('div');
            contentContainer.className = 'item-content';

            const header = document.createElement('div');
            header.className = 'item-header';

            const name = document.createElement('h3');
            name.textContent = item.name;

            const price = document.createElement('span');
            price.className = 'price';
            price.textContent = item.price;

            header.appendChild(name);
            header.appendChild(price);
            contentContainer.appendChild(header);

            if (item.description) {
                const description = document.createElement('p');
                description.className = 'description';
                description.textContent = item.description;
                contentContainer.appendChild(description);
            }

            // Create image container but keep it hidden initially
            if (item.image_url) {
                const imageContainer = document.createElement('div');
                imageContainer.className = 'item-image-container';
                const image = document.createElement('img');
                image.src = item.image_url;
                image.alt = item.name;
                image.className = 'item-image';
                imageContainer.appendChild(image);
                contentContainer.appendChild(imageContainer);

                // Add click handler to toggle image
                menuItem.addEventListener('click', function(e) {
                    // Don't toggle if clicking on the image itself
                    if (e.target.classList.contains('item-image')) {
                        return;
                    }
                    
                    const allImages = menuItems.querySelectorAll('.item-image-container');
                    allImages.forEach(img => {
                        if (img !== imageContainer) {
                            img.classList.remove('active');
                            img.closest('.menu-item')?.classList.remove('expanded');
                        }
                    });
                    
                    imageContainer.classList.toggle('active');
                    menuItem.classList.toggle('expanded');
                });
            }

            menuItem.appendChild(contentContainer);
            menuItems.appendChild(menuItem);
        });
    });
}

// Helper function to group items by category
function groupItemsByCategory(items) {
    const categoryTitles = {
        'appetizer': 'Appetizers',
        'vegetarian appetizer': 'Vegetarian Appetizers',
        'soup': 'Soup',
        'vegetarian soup': 'Vegetarian Soup',
        'poultry': 'Poultry (Chicken and Duck)',
        'fish': 'Fish',
        'lobster': 'Lobster',
        'scallop': 'Scallop',
        'shrimp': 'Shrimp',
        'lambie': 'Lambie',
        'squid': 'Squid',
        'beef': 'Beef',
        'pork': 'Pork',
        'lapchong': 'Lap Chong',
        'chow mein': 'Chow Mein',
        'vegetables': 'Vegetable Dishes',
        'veg for vegetarians': 'Vegetarian Specialties',
        'black mushroom': 'Black Mushroom',
        'special noodles': 'Special Noodles',
        'lo mein': 'Lo Mein',
        'rice': 'Rice',
        'combination': 'Combinations',
        'veg combination': 'Vegetarian Combinations',
        'seafood combination': 'Seafood Combinations',
        'meat seafood combination': 'Meat & Seafood Combinations',
    };

    const groupedItems = {};
    items.forEach(item => {
        const type = item.category.toLowerCase();
        const categoryTitle = categoryTitles[type] || type.charAt(0).toUpperCase() + type.slice(1);
        if (!groupedItems[categoryTitle]) {
            groupedItems[categoryTitle] = [];
        }
        groupedItems[categoryTitle].push(item);
    });
    
    return groupedItems;
}

// Helper function to display grouped items
function displayGroupedItems(groupedItems, container) {
    Object.entries(groupedItems).forEach(([subcategory, subcategoryItems]) => {
        const heading = document.createElement('h2');
        heading.className = 'category-heading';
        heading.textContent = subcategory;
        container.appendChild(heading);

        subcategoryItems.forEach(item => {
            const menuItem = document.createElement('div');
            menuItem.className = 'menu-item';

            // Only create image container if there's an image URL
            if (item.image_url) {
                const imageContainer = document.createElement('div');
                imageContainer.className = 'item-image-container';
                const image = document.createElement('img');
                image.src = item.image_url;
                image.alt = item.name;
                image.className = 'item-image';
                imageContainer.appendChild(image);
                menuItem.appendChild(imageContainer);
            }

            const contentContainer = document.createElement('div');
            contentContainer.className = 'item-content';

            const header = document.createElement('div');
            header.className = 'item-header';

            const name = document.createElement('h3');
            name.textContent = item.name;

            const price = document.createElement('span');
            price.className = 'price';
            price.textContent = item.price;

            header.appendChild(name);
            header.appendChild(price);
            contentContainer.appendChild(header);

            if (item.description) {
                const description = document.createElement('p');
                description.className = 'description';
                description.textContent = item.description;
                contentContainer.appendChild(description);
            }

            menuItem.appendChild(contentContainer);
            container.appendChild(menuItem);
        });
    });
}

// Update category title in desktop view
function updateCategoryTitle(category) {
    const categoryTitleMap = {
        'appetizers': 'APPETIZERS & SOUPS',
        'poultry': 'POULTRY DISHES',
        'seafood': 'SEAFOOD DISHES',
        'beef': 'BEEF DISHES',
        'pork': 'PORK DISHES',
        'noodlesrice': 'NOODLES & RICE',
        'vegetables': 'VEGETABLE DISHES',
        'combinations': 'COMBINATION PLATTERS',
    };
    
    const selectedCategory = document.querySelector('.selected-category');
    if (selectedCategory) {
        selectedCategory.textContent = categoryTitleMap[category] || 'OUR MENU';
    }
}

// Show category for desktop view
async function showDesktopCategory(category) {
    if (menuData.length === 0) {
        menuData = await loadMenuData();
    }

    const categoryMap = {
        'appetizers': ['appetizer', 'vegetarian appetizer', 'soup', 'vegetarian soup'],
        'poultry': ['poultry'],
        'seafood': ['fish', 'lobster', 'scallop', 'shrimp', 'lambie', 'squid'],
        'beef': ['beef'],
        'pork': ['pork', 'lapchong'],
        'noodlesrice': ['chow mein', 'special noodles', 'lo mein', 'rice'],
        'vegetables': ['vegetables', 'veg for vegetarians', 'black mushroom'],
        'combinations': ['combination', 'veg combination', 'seafood combination', 'meat seafood combination'],
    };

    const types = categoryMap[category] || [];
    const filteredItems = menuData.filter(item => types.includes(item.category.toLowerCase()));
    
    displayDesktopMenuItems(filteredItems, category);
    updateCategoryTitle(category);

    // Update active state
    document.querySelectorAll('.desktop-menu .category-link').forEach(link => {
        link.classList.remove('active');
    });
    document.getElementById(`${category}-btn-desktop`).classList.add('active');
}

// Initialize mobile accordion
function initMobileAccordion() {
    const mobileLinks = document.querySelectorAll('.mobile-menu .category-link');
    
    mobileLinks.forEach(link => {
        link.addEventListener('click', async function(e) {
            e.preventDefault();
            
            const categoryId = this.id;
            const category = categoryId.replace('-btn-mobile', '');
            const menuItems = document.getElementById(`${category}-items`);
            
            // Toggle active states
            this.classList.toggle('active');
            if (menuItems) {
                menuItems.classList.toggle('active');
                
                // Load items if not already loaded
                if (!menuItems.hasChildNodes() && menuData.length > 0) {
                    const categoryMap = {
                        'appetizers': ['appetizer', 'vegetarian appetizer', 'soup', 'vegetarian soup'],
                        'poultry': ['poultry'],
                        'seafood': ['fish', 'lobster', 'scallop', 'shrimp', 'lambie', 'squid'],
                        'beef': ['beef'],
                        'pork': ['pork', 'lapchong'],
                        'noodlesrice': ['chow mein', 'special noodles', 'lo mein', 'rice'],
                        'vegetables': ['vegetables', 'veg for vegetarians', 'black mushroom'],
                        'combinations': ['combination', 'veg combination', 'seafood combination', 'meat seafood combination'],
                    };

                    const types = categoryMap[category] || [];
                    const filteredItems = menuData.filter(item => types.includes(item.category.toLowerCase()));
                    displayMobileMenuItems(filteredItems, `${category}-items`);
                }
            }
        });
    });
}

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', async () => {
    menuData = await loadMenuData();
    
    // Initialize desktop menu
    const desktopLinks = document.querySelectorAll('.desktop-menu .category-link');
    desktopLinks.forEach(link => {
        const category = link.id.replace('-btn-desktop', '');
        link.addEventListener('click', () => showDesktopCategory(category));
    });
    
    // Initialize mobile menu
    initMobileAccordion();
});

// Handle window resize
window.addEventListener('resize', () => {
    const isMobile = window.innerWidth < 768;
    const mobileMenu = document.querySelector('.mobile-menu');
    const desktopMenu = document.querySelector('.desktop-menu');
    
    if (isMobile) {
        mobileMenu.style.display = 'block';
        desktopMenu.style.display = 'none';
    } else {
        mobileMenu.style.display = 'none';
        desktopMenu.style.display = 'flex';
    }
});