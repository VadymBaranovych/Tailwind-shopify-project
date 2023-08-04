const apiUrlProducts = 'https://voodoo-sandbox.myshopify.com/products.json';
const apiUrlPagination = 'https://voodoo-sandbox.myshopify.com/collections/all';

const itemsPerPage = 12; 
let currentPage = 1;
let currentProducts = [];

async function fetchProducts(pageNumber) {
  try {
    const response = await axios.get(`${apiUrlProducts}?limit=${itemsPerPage}&page=${pageNumber}`);
    const products = response.data.products;
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}
// Функція для рендерингу карти продукту
function renderProductCard(product) {
  const productCard = document.createElement('div');
  productCard.classList.add('product-card');

  return productCard;
}

function renderProducts(products) {
  const container = document.querySelector('.products-container');
  container.innerHTML = ''; 

  products.forEach((product) => {
    const productCard = document.createElement('div');
    productCard.classList.add('product-card');

    // Перевірка чи існує властивість "src" зображення в об'єкті продукту
    if (product['images'] && product['images'].length > 0 && product['images'][0]['src']) {
      // Створення елемента продуктової карти
      const productCard = document.createElement('div');
      productCard.classList.add('product-card');

    // Create the product image container
    const productImageContainer = document.createElement('div');
    productImageContainer.classList.add('product-image-container');

    // Create the "USED" button
    const useButton = document.createElement('button');
    useButton.classList.add('use-button');
    useButton.innerText = 'USED';

    // Створення елемента зображення продукту
    const productImage = document.createElement('img');
    productImage.classList.add('product-image');
    productImage.src = product['images'][0]['src']; // Використання першого URL зображення з масиву "images"
    productImage.alt = product['title']; // Використання назви продукту як альтернативного тексту зображення

    // Create the product details section
    const productDetails = document.createElement('div');
    productDetails.classList.add('product-details');

    // Create the product title
    const productTitle = document.createElement('h3');
    productTitle.classList.add('product-title');
    productTitle.innerText = product.title;

    // Create the product price
    const productPrice = document.createElement('p');
    productPrice.classList.add('product-price');
    productPrice.innerText = `${product.variants[0].price} KR.`;

    // Create the product condition section
    const productCondition = document.createElement('div');
    productCondition.classList.add('product-condition');

    // Replace the "Condition" label and the "Little used" text
    const condition = document.createElement('p');
    condition.classList.add('condition');
    condition.innerText = 'Condition: Little used';

    // Create the "Add to Cart" button
    const addToCartBtn = document.createElement('button');
    addToCartBtn.classList.add('add-to-cart-btn');
    addToCartBtn.innerText = 'ADD TO CART';

    // Append elements to their respective containers
    productImageContainer.appendChild(useButton);
    productImageContainer.appendChild(productImage);

    productDetails.appendChild(productTitle);
    productDetails.appendChild(productPrice);
    productDetails.appendChild(condition);
    productDetails.appendChild(addToCartBtn);

    productCard.appendChild(productImageContainer);
    productCard.appendChild(productDetails);

    // Add the product card to the container
    container.appendChild(productCard);
    }
  });
}

// Функція для обробки події натискання на кастомний елемент
// Отримання посилань на кастомний елемент та додаткову інформацію
const customElement = document.querySelector('.grid-custom');
const additionalInfo = document.getElementById('hiddenInfo');
const chevronIcon = document.getElementById('chevron-icon'); 

// Додавання обробника події на клік по стрілці
customElement.addEventListener('click', () => {
    // Зміна стану приховано/відображено для додаткової інформації
    additionalInfo.classList.toggle('hidden');
    chevronIcon.classList.toggle('rotate-180');
});

// Функція для роботи з кошиком (додавання, видалення, зміна кількості товарів)
function handleCartActions() {
}

  // Функція для рендерингу пагінації
  function renderPagination(totalPages) {
    const paginationContainer = document.querySelector('.pagination-container');
    paginationContainer.innerHTML = '';
    // Додавання посилань на сторінки до пагінації
    for (let i = 1; i <= totalPages; i++) {
      const pageLink = createPaginationLink(i);
      paginationContainer.appendChild(pageLink);
    }
  }

  // Функція для створення посилань пагінації
  function createPaginationLink(pageNumber) {
    const link = document.createElement('a');
    link.classList.add('pagination-link');
    link.href = '#';
    link.textContent = pageNumber;
    link.addEventListener('click', async (event) => {
      event.preventDefault();

      // Перевірка, чи не вибрана вже поточна сторінка
      if (pageNumber !== currentPage) {
        currentPage = pageNumber;
        const products = await fetchProducts(currentPage);
        renderProducts(products);
      }
    });
    return link;
  }

  // Функція для обробки пагінації
  async function handlePagination() {
    try {
      const response = await axios.get(apiUrlPagination);
      const totalProducts = response.data.products.length;
      const totalPages = Math.ceil(totalProducts / itemsPerPage);

      // Рендеринг пагінації
      renderPagination(totalPages);
    } catch (error) {
      console.error('Error handling pagination:', error);
    }
  }
  document.addEventListener('DOMContentLoaded', () => {
    // Отримуємо посилання на контейнер пагінації
    const paginationContainer = document.querySelector('.pagination-container');
    // Додаємо обробник події "click" на посиланнях з класом "pagination-link"
    paginationContainer.addEventListener('click', async (event) => {
      event.preventDefault();
      // Перевіряємо, чи клік був здійснений на елементі з класом "pagination-link"
      if (event.target.classList.contains('pagination-link')) {
        // Отримуємо текст з посилання (сторінку)
        const pageNumber = event.target.textContent;
        // Викликаємо функцію fetchProducts() для отримання продуктів на обраній сторінці
        const products = await fetchProducts(pageNumber);
        // Викликаємо функцію renderProducts() для відображення продуктів
        renderProducts(products);
      }
    });
  });

// Головна функція, що виконується при завантаженні сторінки
async function main() {
  try {
    currentProducts = await fetchProducts(currentPage); // Зберігаємо продукти у змінну
    await handlePagination(); // Викликаємо пагінацію
    renderProducts(currentProducts); // Рендеримо продукти
  } catch (error) {
    console.error('Error:', error);
  }
}

// Call the main function when the page is loaded
document.addEventListener('DOMContentLoaded', main);
