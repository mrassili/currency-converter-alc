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