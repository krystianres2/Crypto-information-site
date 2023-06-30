let listOfId = [];
let listOfSupply = [];
let listOfCoins = [];
let checkedValues = [];
let displayList = [];

const checkBoxes = document.getElementById("checkboxes");
const boxesButton = document.getElementById("boxesButton");
const coinsTableDataElement = document.getElementById("coinsTableData");
const nameButton = document.getElementById("nameButton");
const maxButton = document.getElementById("maxButton");
const totalButton = document.getElementById("totalButton");
const circulatingButton = document.getElementById("circulatingButton");

let nameButtonState = -1;
let maxButtonState = -1;
let totalButtonState = -1;
let circulatingButtonState = -1;

nameButton.addEventListener("click", function () {
  nameButtonState = (nameButtonState + 1) % 2;
  maxButtonState = -1;
  totalButtonState = -1;
  circulatingButtonState = -1;
  displaySortedByName(displayList);
});
maxButton.addEventListener("click", function () {
  maxButtonState = (maxButtonState + 1) % 2;
  nameButtonState = -1;
  totalButtonState = -1;
  circulatingButtonState = -1;
  displaySortedByMax(displayList);
});
totalButton.addEventListener("click", function () {
  totalButtonState = (totalButtonState + 1) % 2;
  maxButtonState = -1;
  nameButtonState = -1;
  circulatingButtonState = -1;
  displaySortedByTotal(displayList);
});
circulatingButton.addEventListener("click", function () {
  circulatingButtonState = (circulatingButtonState + 1) % 2;
  maxButtonState = -1;
  totalButtonState = -1;
  nameButtonState = -1;
  displaySortedByCirculating(displayList);
});
function displaySortedByName(list) {
  list = sortByElement(list, "name");
  if (nameButtonState === 1) {
    list.reverse();
  }
  displayTable(list);
}
function displaySortedByMax(list) {
  list = sortByElementNum(list, "maxAmount");
  if (maxButtonState === 1) {
    list.reverse();
  }
  displayTable(list);
}
function displaySortedByTotal(list) {
  list = sortByElementNum(list, "totalAmount");
  if (totalButtonState === 1) {
    list.reverse();
  }
  displayTable(list);
}
function displaySortedByCirculating(list) {
  list = sortByElementNum(list, "circulatingAmount");
  if (circulatingButtonState === 1) {
    list.reverse();
  }
  displayTable(list);
}
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

fetchId();
class Coin {
  constructor(
    uuid,
    rank,
    iconUrl,
    name,
    maxAmount,
    totalAmount,
    circulatingAmount
  ) {
    this.uuid = uuid;
    this.rank = rank;
    this.iconUrl = iconUrl;
    this.name = name;
    this.maxAmount = maxAmount;
    this.totalAmount = totalAmount;
    this.circulatingAmount = circulatingAmount;
  }
}

async function fetchId() {
  const url =
    "https://coinranking1.p.rapidapi.com/coins?referenceCurrencyUuid=yhjMzLPhuIDl&timePeriod=24h&tiers%5B0%5D=1&orderBy=marketCap&orderDirection=desc&limit=50&offset=0";
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "92cafd2032msh75252a91a66893ap1128bdjsn75fcdc8c70ba",
      "X-RapidAPI-Host": "coinranking1.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);
    const result = await response.text();
    saveIdData(result);
    createCheckBoxes(listOfCoins);
    displayInfoBar(result);
    boxesButton.addEventListener("click", async function () {
      listOfCoins.length = 0;
      displayList.length = 0;
      saveIdData(result);
      let i = 0;
      listOfSupply.length = 0;
      getCheckedCheckboxValues();
      if (checkedValues.length > 15) {
        alert(
          "Due to optimization, it is recommended to choose no more than 15 cryptocurrencies"
        );
      }
      for (const id of checkedValues) {
        await fetchSupply(id);
      }
      for (i = 0; i < listOfSupply.length; i++) {
        for (let k = 0; k < listOfCoins.length; k++) {
          if (listOfCoins[k].uuid == listOfSupply[i].uuid) {
            listOfCoins[k].maxAmount = listOfSupply[i].maxAmount;
            listOfCoins[k].totalAmount = listOfSupply[i].totalAmount;
            listOfCoins[k].circulatingAmount =
              listOfSupply[i].circulatingAmount;
          }
        }
      }
      prepareData(listOfCoins, i);
      displayTable(displayList);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }); //endListener
  } catch (error) {
    console.error(error);
  }
}
function saveIdData(result) {
  JSON.parse(result).data.coins.forEach((coin) => {
    const coinObj = new Coin(
      coin.uuid,
      coin.rank,
      coin.iconUrl,
      coin.name,
      " ",
      " ",
      " "
    );
    listOfCoins.push(coinObj);
  });
}

async function fetchSupply(id) {
  const url = `https://coinranking1.p.rapidapi.com/coin/${id}/supply`;
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "d2f437d3ffmsh2d6fc063ae7a7fbp1b1a83jsn708210271d98",
      "X-RapidAPI-Host": "coinranking1.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);
    const result = await response.text();
    saveToSupplyList(result, id);
  } catch (error) {
    console.error(error);
  }
}

function saveToSupplyList(result, id) {
  const coinObj = new Coin(
    id,
    " ",
    " ",
    " ",
    JSON.parse(result).data.supply.maxAmount,
    JSON.parse(result).data.supply.totalAmount,
    JSON.parse(result).data.supply.circulatingAmount
  );
  listOfSupply.push(coinObj);
}
function createCheckBoxes(list) {
  list = sortByElement(list, "name");
  checkBoxes.innerHTML = "";
  list.forEach((coin) => {
    checkBoxes.innerHTML += `
    <div class="checkbox-wrapper">
    <input type="checkbox" id="${coin.uuid}" value="${coin.uuid}">
    <label for="${coin.uuid}">${coin.name}</label>
  </div>
    `;
  });
}

function getCheckedCheckboxValues() {
  const checkboxes = document.querySelectorAll(
    '#checkboxes input[type="checkbox"]'
  );
  checkedValues.length = 0;

  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      checkedValues.push(checkbox.value);
    }
  });
}
function prepareData(list, num) {
  let j = 0;
  while (j < 50) {
    if (list[j].totalAmount !== " ") {
      displayList.push(list[j]);
    }
    j++;
  }
}

function displayTable(list) {
  coinsTableDataElement.innerHTML = "";
  list.forEach((coin) => {
    coinsTableDataElement.innerHTML += `<tr>
  <td>${coin.rank}</td>
  <td><img width="25px" src="${coin.iconUrl}">${coin.name}</td>
  <td>${displayMaxAmount(coin.maxAmount)}</td>
  <td>${formatNumber(coin.totalAmount)}</td>
  <td>${formatNumber(coin.circulatingAmount)}</td>
</tr>`;
  });
}

function displayMaxAmount(maxAmount) {
  if (maxAmount == null) {
    return "infinity";
  } else {
    return formatNumber(maxAmount);
  }
}

function formatNumber(number) {
  return new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number);
}

function sortByElement(list, element) {
  function compare(a, b) {
    if (a[element] < b[element]) {
      return -1;
    }
    if (a[element] > b[element]) {
      return 1;
    }
    return 0;
  }

  const sortedList = list.slice().sort(compare);
  return sortedList;
}

function sortByElementNum(list, element) {
  function compare(a, b) {
    const valueA =
      a[element] === null
        ? Number.POSITIVE_INFINITY
        : parseFloat(a[element].replace(/,/g, ""));
    const valueB =
      b[element] === null
        ? Number.POSITIVE_INFINITY
        : parseFloat(b[element].replace(/,/g, ""));

    if (valueA < valueB) {
      return -1;
    }
    if (valueA > valueB) {
      return 1;
    }
    return 0;
  }

  const sortedList = list.slice().sort(compare);
  return sortedList;
}

function showAlert(message) {
  alert(message);
}
function displayInfoBar(result) {
  const infoBarElement = document.getElementById("infoBar");
  const stats = JSON.parse(result).data.stats;
  infoBarElement.innerHTML += `
  <span>Cryptos <a href="#">${stats.totalCoins}</a></span>
  <span>Markets <a href="#">${stats.totalMarkets}</a></span>
  <span>Total Market Cap <a href="#">${stats.totalMarketCap}</a></span>
  `;
}
