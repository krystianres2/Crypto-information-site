class Coin {
  constructor(uuid, rank, symbol, iconUrl, name, price, change, marketCap) {
    this.uuid = uuid;
    this.rank = rank;
    this.symbol = symbol;
    this.iconUrl = iconUrl;
    this.name = name;
    this.price = parseFloat(price);
    this.change = parseFloat(change);
    this.marketCap = parseFloat(marketCap);
  }
  displayPrice() {
    return this.price.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  }
  displayMarketCap() {
    return this.marketCap.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  }
  displayColorClass() {
    if (this.change > 0) {
      return "greenText";
    }
    if (this.change < 0) {
      return "redText";
    }
    return "";
  }
}

// Get reference to HTML elements
const rankButton = document.getElementById("rankButton");
const nameButton = document.getElementById("nameButton");
const priceButton = document.getElementById("priceButton");
const changeButton = document.getElementById("changeButton");
const marketCapButton = document.getElementById("marketCapButton");

// Set initial button states
let nameButtonState = -1;
let priceButtonState = -1;
let changeButtonState = -1;
let marketCapButtonState = -1;

// Event listeners for sorting buttons
nameButton.addEventListener("click", function () {
  nameButtonState = (nameButtonState + 1) % 2;
  priceButtonState = -1;
  changeButtonState = -1;
  marketCapButtonState = -1;
  displaySortedByName(listOfCoins);
});

priceButton.addEventListener("click", function () {
  priceButtonState = (priceButtonState + 1) % 2;
  nameButtonState = -1;
  changeButtonState = -1;
  marketCapButtonState = -1;
  displaySortedByPrice(listOfCoins);
});

changeButton.addEventListener("click", function () {
  changeButtonState = (changeButtonState + 1) % 2;
  nameButtonState = -1;
  priceButtonState = -1;
  marketCapButtonState = -1;
  displaySortedByChange(listOfCoins);
});

marketCapButton.addEventListener("click", function () {
  marketCapButtonState = (marketCapButtonState + 1) % 2;
  nameButtonState = -1;
  priceButtonState = -1;
  changeButtonState = -1;
  displaySortedByMarketCap(listOfCoins);
});

// Sort and display functions based on different criteria
function displaySortedByName(list) {
  list = sortByElement(list, "name");
  if (nameButtonState === 1) {
    list.reverse();
  }
  if (watchListStateNum === 1) {
    displayWatchList(list);
  } else {
    displayTableData(list);
  }
}

function displaySortedByPrice(list) {
  list = sortByElement(list, "price");
  if (priceButtonState === 1) {
    list.reverse();
  }
  if (watchListStateNum === 1) {
    displayWatchList(list);
  } else {
    displayTableData(list);
  }
}

function displaySortedByChange(list) {
  list = sortByElement(list, "change");
  if (changeButtonState === 1) {
    list.reverse();
  }
  if (watchListStateNum === 1) {
    displayWatchList(list);
  } else {
    displayTableData(list);
  }
}

function displaySortedByMarketCap(list) {
  list = sortByElement(list, "marketCap");
  if (marketCapButtonState === 1) {
    list.reverse();
  }
  if (watchListStateNum === 1) {
    displayWatchList(list);
  } else {
    displayTableData(list);
  }
}

// Display table data
function displayTableData(CoinsList) {
  coinsTableDataElement.innerHTML = "";
  CoinsList.forEach((coin) => {
    coinsTableDataElement.innerHTML += `
      <tr>
      <td><button id="id-${
        coin.uuid
      }" onclick="addToFav(this.id)"><i class="fa-star fa-regular"></button></td>
            <td>${coin.rank}</td>
            <td><img onclick="fetchDataInfo('${
              coin.uuid
            }')" width="25px" src="${coin.iconUrl}"> ${coin.name}</td>
            <td class="${coin.displayColorClass()}">${coin.displayPrice()}</td>
            <td class="${coin.displayColorClass()}">${coin.change}</td>
            <td>${coin.displayMarketCap()}</td>
            </tr>
            `;
  });
  displayFav();
}

// Display watchlist
function displayWatchList(CoinsList) {
  coinsTableDataElement.innerHTML = "";
  CoinsList.forEach((coin) => {
    if (listOfFavCoins.includes(`id-${coin.uuid}`)) {
      coinsTableDataElement.innerHTML += `
            <tr>
            <td><button id="id-${
              coin.uuid
            }" onclick="addToFav(this.id)"><i class="fa-star fa-solid goldText"></button></td>
            <td>${coin.rank}</td>
            <td><img onclick="fetchDataInfo('${
              coin.uuid
            }')" width="25px" src="${coin.iconUrl}"> ${coin.name}</td>
            <td class="${coin.displayColorClass()}">${coin.displayPrice()}</td>
            <td class="${coin.displayColorClass()}">${coin.change}</td>
            <td>${coin.displayMarketCap()}</td>
            </tr>
            `;
    }
  });
}

// Display favorites
function displayFav() {
  if (localStorage.listOfFavCoins) {
    const favList = JSON.parse(localStorage.listOfFavCoins);

    favList.forEach((id) => {
      const element = document.querySelector(`#${id}`);
      if (element !== null) {
        element.querySelector("i").classList = ["fa-star fa-solid goldText"];
      }
    });

    listOfFavCoins = favList;
  }
}

// Display info bar
function displayInfoBar(result) {
  const infoBarElement = document.getElementById("infoBar");
  const stats = JSON.parse(result).data.stats;
  infoBarElement.innerHTML += `
  <span>Cryptos <a href="#">${stats.totalCoins}</a></span>
  <span>Markets <a href="#">${stats.totalMarkets}</a></span>
  <span>Total Market Cap <a href="#">${stats.totalMarketCap}</a></span>
  `;
}

// Sort array by element
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
