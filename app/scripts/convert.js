// A library for customizing browser alerts
//import swal from 'sweetalert2/src/sweetalert2.js';

const convertBtn = document.getElementById('js_convertBtn');
let inputAmount = document.getElementById('js_inputAmount');
let resultingAmount = document.getElementById('resultingAmount');
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
    swal(
      'The Internet?',
      'That thing is still around?',
      'question'
    )
    // convert using the fetched rate
    if(inputAmount.value === '') {
    }
    /* try {
      if(inputAmount.value === "") throw new Error("some error");
      
      console.log(rate_value);
      //resultingAmount.textContent = rateJSON[`${src_currency}_${dest_currency}`];
    }
    catch (ex) {
      console.log(ex.message);
    } */
  });
});
