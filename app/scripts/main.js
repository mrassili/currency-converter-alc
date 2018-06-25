window.addEventListener("load",() => {
  // populate the `select` elements
  const selectElements = document.getElementsByTagName("select");
  // Fetch all the currencies from currencyconverterapi
  fetch('https://free.currencyconverterapi.com/api/v5/currencies')
  .then(function(currenciesResp) {
    return currenciesResp.json();
  })
  .then(function(currenciesJSON) {
      let currencyName;
      let currencyCode;
      let option; // `option` node to hold new currencies options being added
    for (const currency in currenciesJSON.results) {
      currencyName = currenciesJSON.results[currency].currencyName;
      currencyCode = currenciesJSON.results[currency].id;
      currencySymbol = currenciesJSON.results[currency].currencySymbol;
      option = document.createElement("option",{id: currencyCode});
      option.innerText = `${currencyCode} | ${currencyName}`;
      // You can't append a node in two points of the document
      // .cloneNode() makes a copy of the node
      // with an option of `true` to clone the node's content as well
      selectElements[0].appendChild(option.cloneNode(true));
      selectElements[1].appendChild(option);
    }
  });
})