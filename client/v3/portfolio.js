// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

/*
Description of the available api
GET https://menuvictorapi-464afckjj-victormenu-devincifr.vercel.app/
Search for specific products
This endpoint accepts the following optional query string parameters:
- `page` - page of products to return
- `size` - number of products to return
GET https://menuvictorapi-464afckjj-victormenu-devincifr.vercel.app/brands
Search for available brands list
*/

let currentProducts = [];
let show = 12;
let page = 1;
let brand = 'All';
let price = 'All';
let sort = 'Cheapest';
let favorite_products = [];
const current_date = Date.now();

const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const selectBrand = document.querySelector('#brand-select');
const selectPrice = document.querySelector('#price-select');
const selectSort = document.querySelector('#sort-select');
const spanNbProducts = document.querySelector('#nbProducts');
const spanNbBrands = document.querySelector('#nbBrands');
const spanPercentile50 = document.querySelector('#percentile50');
const spanPercentile90 = document.querySelector('#percentile90');
const spanPercentile95 = document.querySelector('#percentile95');
const spanNbSearchProducts = document.querySelector('#nbSearchProducts');
const sectionSearchProducts = document.querySelector('#searchProducts');
const spanNbFavoriteProducts = document.querySelector('#nbFavoriteProducts');
const sectionFavoriteProducts = document.querySelector('#favoriteProducts');

const fetchProducts = async (show=12, page=1, brand="",price="") => {
  try {
    let url = `https://menuvictorapi-464afckjj-victormenu-devincifr.vercel.app/products/search?limit=12&brand=${brand}&price=${price}`;
    console.log(url);
    const response = await fetch(url);
    const body = await response.json();

    const currentPage = body.currentPage;
    const totalPages = body.totalPages;
    spanNbSearchProducts.innerHTML = body.totalCount + ' products found';
    const options = Array.from(
        {'length': totalPages},
        (value, index) => `<option value="${index + 1}">${index + 1}</option>`
    ).join('');
    selectPage.innerHTML = options;
    selectPage.selectedIndex = currentPage - 1;
    return body.data;
  } catch (error) {
    console.error(error);
    return currentProducts;
  }
};

const fetchAllProducts = async () => {
  try {
    const response = await fetch(
        'https://menuvictorapi-464afckjj-victormenu-devincifr.vercel.app/products'
    );
    const body = await response.json();
    return body;
  } catch (error) {
    console.error(error);
    return currentProducts;
  }
};

const fetchBrands = async () => {
  try {
    const response = await fetch(
        'https://menuvictorapi-464afckjj-victormenu-devincifr.vercel.app/brands'
    );
    const body = await response.json();
    return body;
  } catch (error) {
    console.error(error);
    return currentProducts;
  }
};

const fetchSortProducts = async (sort=-1) => {
  try {
    const response = await fetch(
        `https://menuvictorapi-464afckjj-victormenu-devincifr.vercel.app/sort?sort=${sort}`
    );
    const body = await response.json();
    return body;
  } catch (error) {
    console.error(error);
    return currentProducts;
  }
};

async function changeFavorite(id) {
  if (favorite_products.find(element => element._id === id)) {
    favorite_products = favorite_products.filter(item => item._id !== id);
  }
  else {
    favorite_products.push(currentProducts.find(element => element._id === id));
  }
  document.getElementById(id).getElementsByTagName('button')[0].innerText = textFavorite(id);
  renderFavoriteProducts();
}

function textFavorite(id) {
  let text = "";
  if (favorite_products.find(element => element._id === id)) {
    text = "Delete from favorite";
  }
  else {
    text = "Add to favorite";
  }
  return text;
}

const renderSearchProducts = products => {
  currentProducts = products;
  const template = products
      .map(product => {
        return `
      <div class="product" id=${product._id}>
        <span>${product.brand}</span>
        <a href="${product.link}" target="_blank">${product.name}</a>
        <span>${product.price}€</span>
        <span>${product.caracteristique}</span>
        <button onclick="changeFavorite('${product._id}')">${textFavorite(product._id)}</button>
      </div>
    `;
      })
      .join('');

  sectionSearchProducts.innerHTML = template;
};

const renderFavoriteProducts = products => {
  const template = favorite_products
      .map(product => {
        return `
      <div class="product" id=${product._id}>
        <span>${product.brand}</span>
        <a href="${product.link}" target="_blank">${product.name}</a>
        <span>${product.price}€</span>
        <span>${product.caracteristique}</span>
        <button onclick="changeFavorite('${product._id}')">${textFavorite(product._id)}</button>
      </div>
    `;
      })
      .join('');

  spanNbFavoriteProducts.innerHTML = favorite_products.length + (favorite_products.length > 1 ? ' favorite products' : ' favorite product');
  sectionFavoriteProducts.innerHTML = template;
};

selectShow.addEventListener('change', async (event) => {
  show = event.target.value;
  page = 1;
  let products = await fetchProducts(show=show, page=1, brand="", price="")
  renderSearchProducts(products);
});

selectPage.addEventListener('change', async (event) => {
  page = event.target.value;
  let products = await fetchProducts(show=12, page=page, brand="", price="")
  renderSearchProducts(products);
});

selectBrand.addEventListener('change', async (event) => {
  brand = event.target.value;
  if(brand=='All'){
    brand="";
  }
  page = 1;
  let products = await fetchProducts(show=show, page=page, brand=brand, price="")
  renderSearchProducts(products);
});

selectPrice.addEventListener('change', async (event) => {
  price = event.target.value;
  if(price=='All'){
    price="";
  }
  page = 1;
  let products = await fetchProducts(show=show, page=page, brand="", price=price)
  renderSearchProducts(products);
});

selectSort.addEventListener('change', async (event) => {
  sort = event.target.value;
  page = 1;
  let products = await fetchSortProducts();

  let listeOfPdts=[];

  if(sort!='Default'){

    if(sort=='Cheapest'){
      listeOfPdts = await fetchSortProducts(1);
    }
    else if(sort=='Most expensive'){
      listeOfPdts = await fetchSortProducts(-1);
    }

  }
  else{
    listeOfPdts = products
  }

  products=listeOfPdts;

  renderSearchProducts(products);
});


const quantile = (arr, q) => {
  const sorted = arr.sort((a, b) => a - b);
  const pos = (sorted.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;
  if (sorted[base + 1] !== undefined) {
    return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
  } else {
    return sorted[base];
  }
};

document.addEventListener('DOMContentLoaded', async () => {
  const brand_names = await fetchBrands();
  spanNbBrands.innerHTML = brand_names.length;

  brand_names.unshift("All");
  const brands = Array.from(
      brand_names,
      value => <option value="${value}">${value}</option>
  ).join('');

  selectBrand.innerHTML = brands;

  let products = await fetchProducts();
  renderSearchProducts(products);

  const all_products = await fetchAllProducts();
  spanNbProducts.innerHTML = all_products.length;

  let prices = [];
  for (let product_id in all_products) {
    prices.push(all_products[product_id].price);
  }
  spanPercentile50.innerHTML = Math.round(quantile(prices, 0.50));
  spanPercentile90.innerHTML = Math.round(quantile(prices, 0.90));
  spanPercentile95.innerHTML = Math.round(quantile(prices, 0.95));
});