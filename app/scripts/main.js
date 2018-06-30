// A library for customizing browser alerts
import swal from "sweetalert2";
import idb from "idb";

let dbPromise;

window.addEventListener("load", () => {
  // populate the `select` elements
  const selectElements = document.getElementsByTagName("select");
  // Fetch all the currencies from currencyconverterapi
  fetch("https://free.currencyconverterapi.com/api/v5/currencies")
    .then(currennciesResp => currennciesResp.json())
    .then(currencies => {
      // a helper function to compare currencies' Id, for the purpose of sorting
      function compareCurrencyId(a, b) {
        return a.id < b.id ? -1 : 1;
      }
      let currencyName;
      let currencyCode;
      let option; // `option` node to hold new currencies' options being added

      // I put all the objects representing each currency in an array
      // in order to apply .sort() to it
      for (const currency of Object.values(currencies.results).sort(
        compareCurrencyId
      )) {
        // currencies are sorted alphabetically by their id's
        currencyName = currency.currencyName;
        currencyCode = currency.id;
        option = document.createElement("option");
        option.innerText = `${currencyCode} | ${currencyName}`;
        option.id = currencyCode;
        // You can't append a node in two points of the document
        // .cloneNode() makes a copy of the node
        // with an option of `true` to clone the node's content as well
        selectElements[0].appendChild(option.cloneNode(true));
        selectElements[1].appendChild(option);
      }
    });
  // Register Service Worker
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("./sw.js")
      .then(reg => console.log("Registration successful"))
      .catch(() => console.log("Registration failed"));
  }
  // open an idb
  dbPromise = idb.open("currenciesDB", 1, upgradeDB => {
    upgradeDB.createObjectStore("rates", { keyPath: "id" });
  });
});

const convertBtn = document.getElementById("js_convertBtn");
let inputAmount = document.getElementById("js_inputAmount");
let resultingAmount = document.getElementById("js_resultingAmount");
const srcSelect = document.getElementsByTagName("select")[0];
const destSelect = document.getElementsByTagName("select")[1];

convertBtn.addEventListener("click", () => {
  const src_selected_opt = srcSelect.options[srcSelect.selectedIndex];
  const dest_selected_opt = destSelect.options[destSelect.selectedIndex];
  const src_currency = src_selected_opt.id;
  const dest_currency = dest_selected_opt.id;

  const fetchRate = function(isRateFound) {
    return fetch(
      `https://free.currencyconverterapi.com/api/v5/convert?q=${src_currency}_${dest_currency}&compact=ultra`
    )
      .then(rateResp => {
        return rateResp.json();
      })
      .then(rate => {
        const rate_value = rate[`${src_currency}_${dest_currency}`];
        // convert using the fetched rate
        //resultingAmount.textContent = `${dest_currency} ${(rate_value * inputAmount.value).toFixed(2)}`;
        // Add the fetched rate to IndexedDB
        dbPromise.then(db => {
          const tx = db.transaction("rates", "readwrite");
          const ratesStore = tx.objectStore("rates");

          // add it if it doesn't exist, or update it if it already exists
          ratesStore.put({
            rate: rate_value,
            id: `${src_currency}_${dest_currency}`
          });
          return tx.complete;
        });
        return rate_value;
      })
      .catch(() => {
        if (!isRateFound)
          // if rateStored is true do nothing
          // (because the resulting amount was already shown to the user)
          // otherwise show alert (that says, you're offline, and that rate isn't stored)
          swal({
            type: "error",
            title: "Oops...",
            text: "I cannot convert this while offline"
          });
      });
  };

  if (inputAmount.value === "") {
    // show an alert message if amount field is empty
    swal({
      type: "error",
      title: "Oops...",
      text: "This field cannot be empty"
    });
    return;
  }
  // look for the rate in IDB, if it's not there, fetch it and add it to IDB
  // ALSO update the rates if they've changed
  dbPromise.then(db => {
    const ratesStore = db.transaction("rates").objectStore("rates");
    let storedRate;
    ratesStore
      .openCursor()
      .then(function cursorIterate(cursor) {
        if (!cursor) return;
        storedRate = cursor.value;
        // Once we find the wanted rate, the cursor stops iterating
        return (
          cursor.value.id === `${src_currency}_${dest_currency}` ||
          cursor.continue().then(cursorIterate)
        );
      })
      .then(isRateFound => {
        // returns undefined if not found, and returns the storedRate if found

        if (isRateFound && storedRate)
          // rate already stored
          resultingAmount.textContent = `${dest_currency} ${(
            storedRate.rate * inputAmount.value
          ).toFixed(2)}`;
        /*
        rate not found in IDB
        if the client is online the rate will be fetched and added to idb
        if offline the client will be shown an alert
        */ else
          return fetchRate(isRateFound).then(
            fetchedRate =>
              (resultingAmount.textContent = `${dest_currency} ${(
                fetchedRate * inputAmount.value
              ).toFixed(2)}`)
          );
      });
  });

  inputAmount.focus();
});
