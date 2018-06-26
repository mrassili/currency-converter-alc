// A library for customizing browser alerts
import swal from 'sweetalert2';

window.addEventListener('load',() => {
  // populate the `select` elements
  const selectElements = document.getElementsByTagName('select');
  // Fetch all the currencies from currencyconverterapi
  fetch('https://free.currencyconverterapi.com/api/v5/currencies')
  .then(currennciesResp => currennciesResp.json())
  .then(currencies => {
      let currencyName;
      let currencyCode;
      let option; // `option` node to hold new currencies options being added
    for (const currency in currencies.results) {
      currencyName = currencies.results[currency].currencyName;
      currencyCode = currencies.results[currency].id;
      option = document.createElement('option');
      option.innerText = `${currencyCode} | ${currencyName}`;
      option.id = currencyCode;
      // You can't append a node in two points of the document
      // .cloneNode() makes a copy of the node
      // with an option of `true` to clone the node's content as well
      selectElements[0].appendChild(option.cloneNode(true));
      selectElements[1].appendChild(option);
    }
  });
})


const convertBtn = document.getElementById('js_convertBtn');
let inputAmount = document.getElementById('js_inputAmount');
let resultingAmount = document.getElementById('js_resultingAmount');
const srcSelect = document.getElementsByTagName('select')[0];
const destSelect = document.getElementsByTagName('select')[1];

convertBtn.addEventListener('click', () => {
  const src_selected_opt = srcSelect.options[srcSelect.selectedIndex];
  const dest_selected_opt = destSelect.options[destSelect.selectedIndex];
  const src_currency = src_selected_opt.id;
  const dest_currency = dest_selected_opt.id;
  fetch(`https://free.currencyconverterapi.com/api/v5/convert?q=${src_currency}_${dest_currency}&compact=ultra`)
  .then(rateResp => rateResp.json())
  .then(rate => {
    const rate_value = rate[`${src_currency}_${dest_currency}`];
    
    // convert using the fetched rate
    if(inputAmount.value === '') {
      // show an alert message if amount field is empty
      swal({
        type: 'error',
        title: 'Oops...',
        text: 'This field cannot be empty',
      })
    }
    else {
      resultingAmount.textContent = `${dest_currency} ${(rate_value * inputAmount.value).toFixed(2)}`;
    }
  });
  inputAmount.focus();
});