const input = document.getElementsByTagName('input')[0];
const img = document.getElementsByTagName('img')[0];
const div = document.getElementsByTagName('div')[0];

function takeWhile(xs, f) {
  const result = [];
  for (x of xs) {
    if (!f(x)) break;
    result.push(x);
  }
  return result;
}

input.addEventListener('input', event => {
  fetch(`https://cors.now.sh/${`https://www.potterybarn.com/products/${input.value}`}`)
    .then(response => response.text() )
    .then(text => {
      const doc = (new DOMParser()).parseFromString(text, 'text/html');
      img.src = doc.querySelector('[property="og:image"]').content;
      div.innerHTML = '';
      takeWhile(doc.querySelector('#tab1 .accordion-tab-copy').children, node => !node.textContent.startsWith('CARE AND MAINTENANCE'))
        .forEach(node => div.appendChild(node));
    })
    .catch(error => {
      console.log(error);
      img.src = '';
      div.innerHTML = '';
    });
});