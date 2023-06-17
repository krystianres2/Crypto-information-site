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

function displayTableData(CoinsList) {
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
function displayWatchList(CoinsList) {
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

function displayFav() {
  if (localStorage.listOfFavCoins) {
    const favList = JSON.parse(localStorage.listOfFavCoins);

    favList.forEach((id) => {
      document.querySelector(`#${id} i`).classList = [
        "fa-star fa-solid goldText",
      ];
    });
    listOfFavCoins = favList;
  }
}
