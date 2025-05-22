import supabase from '../supabase.js';

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

function displayMenuItems(items) {
    const menuItems = document.querySelector('.menu-items');
    const menuIntro = document.querySelector('.menu-intro');
    const menuTitle = document.querySelector('.menu-section h2');
    menuItems.innerHTML = '';

    // Update the intro text
    menuIntro.style.display = 'none';
    menuTitle.style.display = 'none';

    // Create category heading based on the selected category
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
        'seafood combination': 'Seadfood Combinations',
        'meat seafood combination': 'Meat & Seafood Combinations',
    };

    // Group items by their specific subcategory
    const groupedItems = {};
    items.forEach(item => {
        const type = item.category.toLowerCase();
        const categoryTitle = categoryTitles[type] || type.charAt(0).toUpperCase() + type.slice(1);
        if (!groupedItems[categoryTitle]) {
            groupedItems[categoryTitle] = [];
        }
        groupedItems[categoryTitle].push(item);
    });

    // Display items by subcategory
    Object.entries(groupedItems).forEach(([subcategory, subcategoryItems]) => {
        // Create subcategory heading
        const heading = document.createElement('h2');
        heading.className = 'category-heading';
        heading.textContent = subcategory;
        menuItems.appendChild(heading);

        // Display items in this subcategory
        subcategoryItems.forEach(item => {
            const menuItem = document.createElement('div');
            menuItem.className = 'menu-item';

            const header = document.createElement('div');
            header.className = 'item-header';

            const name = document.createElement('h3');
            name.textContent = item.name;

            const price = document.createElement('span');
            price.className = 'price';
            price.textContent = item.price;

            header.appendChild(name);
            header.appendChild(price);
            menuItem.appendChild(header);

            if (item.description) {
                const description = document.createElement('p');
                description.className = 'description';
                description.textContent = item.description;
                menuItem.appendChild(description);
            }

            menuItems.appendChild(menuItem);
        });
    });
}

let menuData = [];

function updateMenuImage(category) {
    const imageMap = {
        'appetizers': '/images/appetizers.png',
        'poultry': '/images/poultry.png',
        'seafood': '/images/seafood.png',
        'beef': '/images/beef.png',
        'pork': '/images/pork.png',
        'noodlesrice': '/images/noodles.png',
        'vegetables': '/images/vegetables.png',
        'combinations': '/images/combinations.png',
    };

    const menuImage = document.querySelector('#category-image');
    if (menuImage) {
        menuImage.src = imageMap[category] || '/images/food.jpg';
        menuImage.alt = `${category.charAt(0).toUpperCase() + category.slice(1)} Dishes`;
    }
}

async function showCategory(category) {
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
    displayMenuItems(filteredItems, category);

    // Update active button
    document.querySelectorAll('.menu-nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(`${category}-btn`).classList.add('active');
    updateMenuImage(category);
}

// Initialize when the page loads - but don't show any category
document.addEventListener('DOMContentLoaded', async () => {
    menuData = await loadMenuData(); // Pre-load the data
    
    // Add event listeners to category buttons
    document.getElementById('appetizers-btn').addEventListener('click', () => showCategory('appetizers'));
    document.getElementById('poultry-btn').addEventListener('click', () => showCategory('poultry'));
    document.getElementById('seafood-btn').addEventListener('click', () => showCategory('seafood'));
    document.getElementById('beef-btn').addEventListener('click', () => showCategory('beef'));
    document.getElementById('pork-btn').addEventListener('click', () => showCategory('pork'));
    document.getElementById('noodlesrice-btn').addEventListener('click', () => showCategory('noodlesrice'));
    document.getElementById('vegetables-btn').addEventListener('click', () => showCategory('vegetables'));
    document.getElementById('combinations-btn').addEventListener('click', () => showCategory('combinations'));
}); 