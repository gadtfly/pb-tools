const input = document.getElementsByTagName('input')[0];
const img = document.getElementsByTagName('img')[0];

input.addEventListener('input', event => {
  fetch(`https://cors-anywhere.herokuapp.com/${`https://www.potterybarn.com/products/${input.value}`}`)
    .then(response => response.text() )
    .then(text => {
      img.src = (new DOMParser).parseFromString(text, 'text/html').querySelector('[property="og:image"]').content;
    })
    .catch(error => {
      img.src = '';
    });
});