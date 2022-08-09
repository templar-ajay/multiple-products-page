let productHandles = [
  // "a-product-for-via",
  "women-jacketsingle-product-1",
  "shoes",
  "apple-iphone-11-128gb-white-includes-earpods-power-adapter",
  "arista-variant-images-test",
  "leather-cover",
  "the-hoxton-clutch-in-plastic-4",
];
const baseUrl = "https://afzal-test-shop.myshopify.com/products/";

const objectFromAPIs = await foo();
console.log("objectFromAPIs", objectFromAPIs);

const allProductsDiv = document.getElementById("all-products");

const selectedOptions = {};

for (let [index, [key, [js, json]]] of Object.entries(
  Object.entries(objectFromAPIs)
)) {
  const card = document.createElement("div");
  card.className = "p-2";
  card.id = js.title;
  card.handle = js.handle;

  const bigImageDiv = document.createElement("div");
  bigImageDiv.className = "d-flex align-self-center";
  const bigImage = document.createElement("img");
  bigImage.width = "150";
  bigImage.src = js.featured_image;
  bigImageDiv.appendChild(bigImage);

  const productDetailsDiv = document.createElement("div");
  productDetailsDiv.className = "d-block";

  const title = document.createElement("h2");
  title.innerHTML = js.title;
  productDetailsDiv.appendChild(title);

  const price = document.createElement("h4");
  price.innerHTML = js.price / 100 + " INR";
  productDetailsDiv.appendChild(price);
  const comparedPrice = document.createElement("h5");
  comparedPrice.innerHTML = js.compare_at_price / 100 + " INR";
  comparedPrice.style.textDecoration = "line-through";
  productDetailsDiv.appendChild(comparedPrice);

  // display btns
  js.options.forEach((option) => {
    productDetailsDiv.appendChild(createRows(option));
    function createRows(option) {
      const row = document.createElement("div");
      row.className = "my-2";
      row.style.width = "400px";
      const label = document.createElement("label");
      label.innerHTML = option.name;
      row.appendChild(label);
      option.values.forEach((value) => {
        const btn = createBtn(value);
        row.appendChild(btn);
      });
      return row;
    }
  });

  // description
  const description = document.createElement("p");
  description.className = "text-primary ";
  description.style.width = "400px";
  description.innerHTML = js.description;
  productDetailsDiv.appendChild(description);
  // update selectedOptions
  updateSelectedOptions(js);

  card.appendChild(bigImageDiv);
  card.appendChild(productDetailsDiv);
  allProductsDiv.appendChild(card);
}
console.log(`selectedoptions`, selectedOptions);
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// -- FUNCTIONS BELOW -- ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

async function getApi(givenUrl) {
  const response = await fetch(givenUrl);
  const data = await response.json();
  return data;
}

async function foo() {
  const obj = {};
  for (let i = 0; i < productHandles.length; i++) {
    const js = await getApi(`${baseUrl + productHandles[i]}.js`);
    const json = await getApi(`${baseUrl + productHandles[i]}.json`);
    console.log(js, json);

    obj[productHandles[i]] = [js, json];
  }
  return obj;
}
function createBtn(value) {
  const btn = document.createElement("btn");
  btn.className = "btn btn-outline-primary mx-2";
  btn.innerText = value;
  btn.addEventListener("click", onBtnClick);
  return btn;
}

function onBtnClick(e) {
  const productName = e.target.parentElement.parentElement.parentElement.id;
  const prdctHandle = e.target.parentElement.parentElement.parentElement.handle;
  const btnVariantType = e.target.parentElement.childNodes[0].innerHTML;
  const price = e.target.parentElement.parentElement.childNodes[1];
  const comparedPrice = e.target.parentElement.parentElement.childNodes[2];

  const btnValue = e.target.innerHTML;
  const bigImage =
    e.target.parentElement.parentElement.parentElement.childNodes[0]
      .childNodes[0];

  selectedOptions[productName][btnVariantType] = btnValue;

  const theVariant = f();

  function f() {
    let theVariant = {};
    objectFromAPIs[prdctHandle][0].variants.forEach((variant) => {
      if (
        arraysEqual(
          variant.options,
          arrayFromObject(selectedOptions[productName])
        )
      ) {
        theVariant = variant;
      }
    });

    return theVariant;
  }

  theVariant.featured_image
    ? (bigImage.src = theVariant.featured_image.src)
    : null;

  price.innerHTML = theVariant.price / 100 + " INR";
  comparedPrice.innerHTML = theVariant.compare_at_price / 100 + " INR";
}

function updateSelectedOptions(js) {
  const obj = {};
  js.options.forEach((option) => {
    obj[option.name] = option.values[0];
  });
  selectedOptions[js.title] = obj;
}

function arraysEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) return false;
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) return false;
  }
  return true;
}
function arrayFromObject(theObj) {
  const arr = [];
  for (const [index, [key, value]] of Object.entries(Object.entries(theObj))) {
    arr[index] = value;
  }
  return arr;
}
