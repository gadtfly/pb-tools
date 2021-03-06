function span(xs, f) {
  const prefix = [];
  const suffix = [... xs];
  while (suffix.length > 0) {
    if (!f(suffix[0])) { break };
    prefix.push(suffix.shift());
  }
  return [prefix, suffix];
}

function keepChildrenWhile(parent, f) {
  const [prefix, suffix] = span(parent.children, f);
  Array.from(suffix).forEach(node => parent.removeChild(node));
  return parent;
}

function extractData(html) {
  const doc = (new DOMParser()).parseFromString(html, 'text/html');
  return {
    image: doc.querySelector('[property="og:image"]').content,
    name:  doc.querySelector('.breadcrumb-list-current-item').textContent,
    dimensions: keepChildrenWhile(
      doc.querySelector('dd:nth-child(4) .accordion-tab-copy, .product-info-tab:nth-child(2) .product-info-tab-content-padding-container'),
      node => !node.textContent.startsWith('CARE AND MAINTENANCE')
    ).outerHTML
  };
}

function displayProduct({sku, image, name, dimensions}) {
  document.querySelector('h3.sku').innerHTML      = `Item #${sku}`;
  document.querySelector('img').src               = image;
  document.querySelector('#name').innerHTML       = name;
  document.querySelector('#dimensions').innerHTML = dimensions;
}

function fetchAndDisplaySKU(sku) {
  fetch(`https://cors.now.sh/${`https://www.potterybarn.com/products/${sku}`}`)
    .then( response => response.text() )
    .then( text => displayProduct({sku, ... extractData(text)}) )
    .catch( error => {
      console.log(sku);
      console.log(error);
    });
}

document.querySelector('input.price').addEventListener('input', event => {
  document.querySelector('h2.price').innerHTML = event.target.value;
});

document.querySelector('input.sku').addEventListener('input', event => {
  fetchAndDisplaySKU(event.target.value)
});
