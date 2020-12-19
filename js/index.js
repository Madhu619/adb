var cartItems = [];
var totalItems = {items: 0, price : 0, discount : 0, orderTotal : 0};
const createCard = (card, index) => {
  let currentCard = JSON.stringify({item: index, price:card.price.actual,discount : card.price.display - card.price.actual, initialDiscount: card.price.display - card.price.actual, image: card.image, value:1, startPrice:card.price.actual});
  
  return `<div class="card" id="Item`+index+`"> 
    <img src='`+card.image+`' alt='Item `+index+`' />
    <span class='item-offer'>`+card.discount+`% off</span>
    <div class='card-footer'>
      <div class='col-1'>
        <div> Item `+index+` </div>
        <div class='actual-price'> `+card.price.display+` </div>
      </div>
      <div class='display-price'> <strong> $`+card.price.actual+` </strong> </div>
      <button class='add-to-cart' data-item='`+currentCard+`'> Add to cart </button>
    </div>
  </div>`;
}

const getCartItem = (itemsList) => {
  
  return `<div class="items-container" id ="items-container">
            <div class="item-action">
							<img src="`+itemsList.image+`" alt="">
							<div>Item `+itemsList.item+`</div>
							<div class='remove-button' data-item="`+itemsList.item+`"><i class="fa fa-times"></i></div>
						</div>
						<div class="quantity">
							<i class="fa fa-minus" data-target='`+itemsList.item+`'></i>
							<input type="text" disabled="disabled" value="`+itemsList.value+`" />
							<i class="fa fa-plus" data-target='`+itemsList.item+`'></i>
						</div>
            <div class="price">$`+itemsList.price+`</div>
          </div>`;
}

const getTotal = () => {
  document.querySelector('#total-block').innerHTML = '';
  let total = totalItems.price + totalItems.discount;
  let totalDiscount = total - totalItems.discount;
  let discount = totalItems.discount === 0 ? totalItems.discount : '-'+totalItems.discount;
  let totalTemplate=  `<div class='header'> 
            <div> Items (`+totalItems.items+`)</div>
            <div> Discount </div>
            <div> Type Discount </div>
            <div> Order Total </div>
          </div>
          <div class='divider'> 
            <div> : </div>
            <div> : </div>
            <div> : </div>
            <div> : </div>
          </div>
          <div class='total-value'>
          <div> $`+total+` </div>
          <div> $ `+discount+` </div>
          <div> $0 </div>
          <div> $`+ totalDiscount+` </div>
          </div>`;
          document.querySelector('#total-block').insertAdjacentHTML('afterbegin', totalTemplate);
}
const getData = () => {
  fetch('./js/sample.json')
  .then(res => res.json())
  .then((cards) => {
    let cardTemplate = '';
    cards.items.forEach((element, index) => {
      cardTemplate += createCard(element, index+1);
    });
    document.querySelector('#items').insertAdjacentHTML('afterbegin', cardTemplate);
    initialiseActions();
  })
  .catch(err => { throw err });
}

 const initialiseActions = () => {
  let cartButtons = document.getElementsByClassName('add-to-cart');
  for (let i = 0; i < cartButtons.length; i++) {
    cartButtons[i].addEventListener('click', (e) => {

      let currentObj = JSON.parse(e.currentTarget.dataset.item);
      if (cartItems.filter(e => e.item === currentObj.item).length !== 1)
        {
          cartItems.push(currentObj);
          totalItems.items++;
          totalItems.price= cartItems.length === 1 ? cartItems[0].price : cartItems.reduce(function (r, a) { return r + a.price; }, 0)
          totalItems.discount= cartItems.length === 1 ? cartItems[0].discount : cartItems.reduce(function (r, a) { return r + a.discount; }, 0)
          e.currentTarget.parentElement.parentElement.hidden = true;
          getCartItems();
          getTotal();
          document.querySelector('#item-action').innerHTML = 'Item'+currentObj.item + ' is added to cart';
        }
        removeItem();
    })
  }
}

const getCartItems = () => {
  let cartItemsTemplate = '';
  document.querySelector('#items-container-wrapper').innerHTML = '';
  cartItems.forEach((element) => {
    cartItemsTemplate += getCartItem(element);
  })
  document.querySelector('#items-container-wrapper').insertAdjacentHTML('afterbegin', cartItemsTemplate);
  removeItem();
  increment();
  decrement();
}
const removeItem = () => {
  let removeButtons = document.getElementsByClassName('remove-button');
  for (let i = 0; i < removeButtons.length; i++) {
    removeButtons[i].addEventListener('click', (e) => {
      cartItems = cartItems.filter(ele => ele.item != e.currentTarget.dataset.item);
      if(cartItems.length > 0) {
        totalItems.price= cartItems.length === 1 ? cartItems[0].price : cartItems.reduce(function (r, a) { return r + a.price; }, 0)
        totalItems.discount= cartItems.length === 1 ? cartItems[0].discount : cartItems.reduce(function (r, a) { return r + a.discount; }, 0)
        document.querySelector('#item-action').innerHTML = 'Item'+e.currentTarget.dataset.item+ ' is removed from cart';
      } else {
        totalItems = {items: 0, price : 0, discount : 0, orderTotal : 0}
        document.querySelector('#item-action').innerHTML = 'Cart is Empty';
      }
      getCartItems();
      getTotal();
      document.getElementById('Item'+e.currentTarget.dataset.item).hidden = false;
    })
  }
}

const increment = () => {
  let incrementButtons = document.getElementsByClassName('fa-plus');
  for (let i = 0; i < incrementButtons.length; i++) {
    incrementButtons[i].addEventListener('click', (e) => {
      cartItems.forEach((ele) => {
        if (ele.item == e.currentTarget.dataset.target)
         {
           ele.value ++ ;
           totalItems.items++;
           ele.price = ele.startPrice * ele.value;
          ele.discount = ele.initialDiscount * ele.value;

           totalItems.price= cartItems.length === 1 ? cartItems[0].price : cartItems.reduce(function (r, a) { return r + a.price; }, 0)

           totalItems.discount= cartItems.length === 1 ? cartItems[0].discount : cartItems.reduce(function (r, a) { return r + a.discount; }, 0)          
         }
      })
      getCartItems();
      getTotal();
    })
  }
}

const decrement = () => {
  let incrementButtons = document.getElementsByClassName('fa-minus');
  for (let i = 0; i < incrementButtons.length; i++) {
    incrementButtons[i].addEventListener('click', (e) => {
      var indexVal = e.currentTarget.dataset.target;
      if (e.currentTarget.parentElement.children[1].value != 1) {
        cartItems.forEach((ele) => {
          if (ele.item == indexVal ){
            ele.value -- ;
            totalItems.items--;
            ele.price = ele.startPrice * ele.value;
            ele.discount = ele.initialDiscount * ele.value;
            totalItems.price= cartItems.length === 1 ? cartItems[0].price : cartItems.reduce(function (r, a) { return r + a.price; }, 0)
            totalItems.discount= cartItems.length === 1 ? cartItems[0].discount : cartItems.reduce(function (r, a) { return r + a.discount; }, 0)

          }
        })
        getCartItems();
        getTotal();
      } else {
        if (window.confirm('Really go to another page?'))
          {
            cartItems = cartItems.filter(ele => ele.item != indexVal);
            getCartItems();
            getTotal();
            document.getElementById('Item'+indexVal).hidden = false;
          }
          else
          {
            // Do nothing , keep quantity = 1
          }
      }
      
    })
  }
}

getData();
 


