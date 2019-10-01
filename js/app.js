
const productsDOM = document.querySelector(".products-center");
const cartIcon = document.querySelector(".cart-btn");
const closeCart = document.querySelector(".close-cart");
const cartOverlay = document.querySelector(".cart-overlay");
const cartDOM = document.querySelector(".cart");
const clearCartBtn = document.querySelector(".clear-cart");
const cartContent = document.querySelector(".cart-content");
const displayCategory = document.querySelector(".displayType");
const searchResults = document.querySelector(".results");



var cart = [];
var buttonsDOM = [];
var am = 0;
class Products{
  async getProducts(){
      let result = await fetch("products.json");
      let data = await result.json();
      let products = data.items;

      products = products.map(pro =>{
        const { title, price , category} = pro.fields;
        const { id } = pro.sys;
        const image = pro.fields.image.fields.file.url;
        return { title, price, category, id, image};
      })
      return products;
  }
  getProductsId(id){
    return pro.find(product => product.id === id);
  }
}//End class Products

class UI {
  displayProducts(products){
    let result = '';
    products.forEach(product =>{
      am += 1;
      result +=`          
          <li class="product">
            <div class="img-container">
              <img src=${product.image} alt="product" class="product-img"/>
            </div>
            <div class="productPrice"><h4>THB ${product.price.toLocaleString()}.-</h4></div>         
            <button class="bag-btn" data-id=${product.id}>
              <i class="fas fa-shopping-cart"></i>Add to cart
            </button>
            <div class="productText ${product.category}"><h3>${product.title}</h3></div>
          </li> 
    `;
    });
    productsDOM.innerHTML = result;
    displayCategory.innerText = "All Products";
    searchResults.innerText = " (" + am + " results)";
  } // End displayProducts
  Zoom() {
    const modal = document.querySelector("#myModal");
    const modalImg = document.querySelector("#img01");
    const img = document.querySelectorAll(".product-img");
    const closeBtn = document.querySelector(".close");
    for (var i = 0; i < img.length; i++){
      img[i].onclick = function(){
        modal.style.display = "block";
        modalImg.src = this.src;
      }
    }
    closeBtn.onclick = function() { 
      modal.style.display = "none";
    }
    window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    }
  } // End Zoom 
  Searching(){
    const form = document.querySelector("#searchForm");
    form.onsubmit = (e)=>{
      e.preventDefault();
      var input, filter, ul, li, product, i, txtValue;
      input = document.getElementById("productInput");
      filter = input.value.toUpperCase();
      ul = document.getElementById("myProduct");
      li = ul.getElementsByTagName("li");
      am = 0;
      for (i = 0; i < li.length; i++) {
          product = li[i].getElementsByTagName("h3")[0];
          txtValue = product.textContent || product.innerText;
          if ((li[i].style.display == "") && txtValue.toUpperCase().indexOf(filter) > -1) {
              li[i].style.display = "";
              am += 1;
              searchResults.innerText = " (" + am + " results)";
          } else {
              li[i].style.display = "none";
              searchResults.innerText = " (" + am + " results)";
          }
      }
    }
  }// End Searching  
  categorySort(){
  const categoryBtn = document.querySelectorAll(".category-btn");
  const productText = [...document.querySelectorAll(".productText")];
    categoryBtn.forEach(item =>{
      item.addEventListener("click", (e)=>{
        for (var i = 0; i < categoryBtn.length; i++){
          categoryBtn[i].classList.remove("categorySelect");
        }
        am = 0;
        item.classList.add("categorySelect");
        productText.forEach(product =>{          
          if (e.target.innerText == "ALL"){
            product.parentElement.style.display = '';
            am += 1;
            displayCategory.innerText = "All Products";            
            searchResults.innerText = " (" + am + " results)";
          }else{
            if (product.classList.contains(e.target.innerText.toLowerCase())){
              am += 1;
              product.parentElement.style.display = '';          
            }else{
              product.parentElement.style.display = 'none'; 
            }            
            displayCategory.innerText = e.target.innerText;
            searchResults.innerText = " (" + am + " results)";
          }
        })          
    });
    })
  }
  openCart(){
    cartIcon.addEventListener("click", function(){
      cartOverlay.classList.add("transparentBcg");
      cartDOM.classList.add("showCart");
    });
  }// End openCart
  closeCart(){
    closeCart.addEventListener("click", function(){
      cartOverlay.classList.remove("transparentBcg");
      cartDOM.classList.remove("showCart");
    });
  }//End closeCart
  buttonClick(){
    const buttons = [...document.querySelectorAll(".bag-btn")];
    buttonsDOM = buttons;
    buttons.forEach(button =>{
      let id = button.dataset.id;
      let incart = cart.find(item => item.id === id);
      if (incart){
        button.innerHTML = '<i class="fas fa-shopping-cart"></i>In The cart';
        button.disabled = true;
      }
        button.addEventListener('click', (e) =>{
          e.target.innerHTML = '<i class="fas fa-shopping-cart"></i>In The cart';
          e.target.disabled = true;
          let incartItem = {...Storage.getProduct(id),amount:1};
          cart = [...cart, incartItem];
          Storage.saveCart(cart);
          this.SetCartItem(cart);
          this.AddCartItem(incartItem);
        });
    });
  }// End buttonClick
  SetCartItem(cart){
    const cartTotal = document.querySelector(".cart-total");
    const cartAmount = document.querySelector(".cart-items");
    let cartTotalPrice = 0;
    let cartDisplayAmount = 0;
    cart.map(item =>{
      cartTotalPrice += item.price * item.amount;
      cartDisplayAmount += item.amount;
    });
    var amount = cartTotalPrice.toLocaleString();
    cartTotal.innerText = amount;
    cartAmount.innerText = cartDisplayAmount;
  }//End SetCartItem
  AddCartItem(item){
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML =`             
            <img src=${item.image} alt="product" />
            <div>
              <h4>${item.title}</h4>
              <h5>THB ${item.price.toLocaleString()}.-</h5>
              <span class="remove-item" data-id=${item.id}>Remove</span>
            </div>
            <div>
              <i class="fas fa-chevron-up" data-id=${item.id}></i>
              <p class="item-amount">
                ${item.amount}
              </p>
              <i class="fas fa-chevron-down" data-id=${item.id}></i>
            </div>`;
    cartContent.appendChild(div);
  }//End AddCartItem
  setupCart(){
    cart = Storage.getCart();
    this.openCart();
    this.closeCart();
    this.SetCartItem(cart);
    cart.forEach(item => this.AddCartItem(item));
  }
  cartManage(){
    clearCartBtn.addEventListener("click", ()=>{
      let items = cart.map(item => item.id);
      items.forEach(id => this.removeItem(id));
      while (cartContent.children.length > 0) {
        cartContent.removeChild(cartContent.children[0]);
      }
    })
    cartContent.addEventListener("click", e =>{
      if (e.target.classList.contains("remove-item")){
        let id = e.target.dataset.id;
        cartContent.removeChild(e.target.parentElement.parentElement);
        this.removeItem(id);

      }else if (e.target.classList.contains("fa-chevron-up")) {
        let id = e.target.dataset.id;
        let tempItem = cart.find(item => item.id === id);
        tempItem.amount = tempItem.amount + 1;
        Storage.saveCart(cart);
        this.SetCartItem(cart);
        e.target.nextElementSibling.innerText = tempItem.amount;

      }else if (e.target.classList.contains("fa-chevron-down")) {
        let id = e.target.dataset.id;
        let tempItem = cart.find(item => item.id === id);
        tempItem.amount = tempItem.amount - 1;
        if (tempItem.amount > 0) {
          Storage.saveCart(cart);
          this.SetCartItem(cart);
          e.target.previousElementSibling.innerText = tempItem.amount;
        }else {
          cartContent.removeChild(e.target.parentElement.parentElement);
          this.removeItem(id);
          }
        }
    })
  }//End cartManage
  removeItem(id){
    cart = cart.filter(item => item.id !== id);
    this.SetCartItem(cart);
    Storage.saveCart(cart);
    let button = this.getButton(id);
    button.disabled = false;
    button.innerHTML = '<i class="fas fa-shopping-cart"></i>Add to cart';
  }
  getButton(id){
    return buttonsDOM.find(button => button.dataset.id === id);
  }
}//End Class UI
class Storage {
  static saveProducts(products){
    localStorage.setItem("products", JSON.stringify(products));
  }
  static getProduct(id) {
    let products = JSON.parse(localStorage.getItem("products"));
    return products.find(product => product.id === id);
  }
  static saveCart(cart){
    localStorage.setItem("cart",JSON.stringify(cart));
  }
  static getCart(){
      return localStorage.getItem("cart")?JSON.parse(localStorage.getItem("cart")):[];
  }
}//End Class Storage

document.addEventListener("DOMContentLoaded", ()=>{
  const ui = new UI();
  const products = new Products();
  ui.setupCart();
  products.getProducts().then(products => {
    ui.displayProducts(products);
    Storage.saveProducts(products);
  }).then(()=>{
    ui.Zoom();
    ui.Searching();
    ui.buttonClick();
    ui.categorySort();
    ui.cartManage();
  });
});
