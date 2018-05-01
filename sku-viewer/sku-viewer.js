const sku = document.getElementById('sku');
const priceInput = document.querySelector('input.price');
const priceDisplay = document.querySelector('h2.price');
const img = document.getElementsByTagName('img')[0];
const name = document.getElementById('name');
const dimensions = document.getElementById('dimensions');

function takeWhile(xs, f) {
  const result = [];
  for (x of xs) {
    if (!f(x)) break;
    result.push(x);
  }
  return result;
}

priceInput.addEventListener('input', event => {
  priceDisplay.innerHTML = priceInput.value;
});

sku.addEventListener('input', event => {
  fetch(`https://cors.now.sh/${`https://www.potterybarn.com/products/${sku.value}`}`)
    .then(response => response.text() )
    .then(text => {
      const doc = (new DOMParser()).parseFromString(text, 'text/html');
      img.src = doc.querySelector('[property="og:image"]').content;
      name.innerHTML = doc.getElementsByClassName('breadcrumb-list-current-item')[0].textContent;
      dimensions.innerHTML = '';
      takeWhile(doc.querySelector('#tab1 .accordion-tab-copy').children, node => !node.textContent.startsWith('CARE AND MAINTENANCE'))
        .forEach(node => dimensions.appendChild(node));
    })
    .catch(error => {
      console.log(error);
      img.src = '';
      name.innerHTML = '';
      dimensions.innerHTML = '';
      priceInput.value = '';
      priceDisplay.innerHTML = '';
    });
});