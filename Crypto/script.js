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

fetchData();

// Tworzymy tablice, w ktorych przechowywac bedziemy liste wszystkich coinow oraz liste ulubionych(przechowujemy id).
let listOfCoins = [];
let listOfFavCoins = [];

async function fetchData() {
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
    displayData(result);

    const watchListButton = document.getElementById("watchList");
    watchListButton.addEventListener("click", displayFavoriteCoins);
    console.log(await fetchDataInfo("Qwsogvtv82FCd"))
  } catch (error) {
    console.error(error);
  }
}
let coinInfo=document.getElementById("coinDescription")
function displayData(result) {
  const coinsTableDataElement = document.getElementById("coinsTableData");
  JSON.parse(result).data.coins.forEach((coin) => {
    const coinObj = new Coin(
      coin.uuid,
      coin.rank,
      coin.symbol,
      coin.iconUrl,
      coin.name,
      coin.price,
      coin.change,
      coin.marketCap
    );

    listOfCoins.push(coinObj);

    coinsTableDataElement.innerHTML += `
            <tr>
                <td><button id="id-${
                  coinObj.uuid
                }" onclick="addToFav(this.id)"><i class="fa-star fa-regular"></button></td>
                <td>${coinObj.rank}</td>
                <td><img onclick="fetchDataInfo('${coinObj.uuid}')" width="25px" src="${coinObj.iconUrl}"> ${
      coinObj.name
    }</td>
                <td class="${coinObj.displayColorClass()}">${coinObj.displayPrice()}</td>
                <td class="${coinObj.displayColorClass()}">${
      coinObj.change
    }</td>
                <td>${coinObj.displayMarketCap()}</td>
            </tr>
        `;
      });
      
  displayFav();
  
  const infoBarElement = document.getElementById("infoBar");
  const stats = JSON.parse(result).data.stats;
  infoBarElement.innerHTML += `
  <span>Cryptos <a href="#">${stats.totalCoins}</a></span>
  <span>Markets <a href="#">${stats.totalMarkets}</a></span>
  <span>Total Market Cap <a href="#">${stats.totalMarketCap}</a></span>
  `;
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

function addToFav(id) {
  const isIdInFav = listOfFavCoins.includes(id);
  
  // sprawdzamy czy lista ulubionych zawiera id naszego coina, jezeli tak, to usuwamy z listy i przywracamy domyślny wygląd gwiazdki.
  if (isIdInFav) {
    const indexToDelete = listOfFavCoins.indexOf(id);
    listOfFavCoins.splice(indexToDelete, 1);
    document.querySelector(`#${id} i`).classList = ["fa-star fa-regular"];
  }
  // w przeciwnym wypadku dodajemy do listy i ustawiamy wygląd gwiazdki na kolorowy i pogrubiony.
  else {
    listOfFavCoins.push(id);
    document.querySelector(`#${id} i`).classList = [
      "fa-star fa-solid goldText",
    ];
  }
  
  localStorage.listOfFavCoins = JSON.stringify(listOfFavCoins);
}

let watchListState = false;
function displayFavoriteCoins() {
  const coinsTableDataElement = document.getElementById("coinsTableData");
  coinsTableDataElement.innerHTML = "";
  
  if (watchListState) {
    // wyśwwietla wszystkie coiny
    listOfCoins.forEach((coin) => {
      coinsTableDataElement.innerHTML += `
      <tr>
      <td><button id="id-${
        coin.uuid
            }" onclick="addToFav(this.id)"><i class="fa-star fa-regular"></button></td>
            <td>${coin.rank}</td>
            <td><img width="25px" src="${coin.iconUrl}"> ${coin.name}</td>
            <td class="${coin.displayColorClass()}">${coin.displayPrice()}</td>
            <td class="${coin.displayColorClass()}">${coin.change}</td>
            <td>${coin.displayMarketCap()}</td>
            </tr>
            `;
          });
          displayFav();
          watchListState = false;
        } else {
          // wyświetla ulubione coiny
          listOfCoins.forEach((coin) => {
            if (listOfFavCoins.includes(`id-${coin.uuid}`)) {
              coinsTableDataElement.innerHTML += `
              <tr>
              <td><button id="id-${
                coin.uuid
              }" onclick="addToFav(this.id)"><i class="fa-star fa-solid goldText"></button></td>
              <td>${coin.rank}</td>
              <td><img width="25px" src="${coin.iconUrl}"> ${coin.name}</td>
              <td class="${coin.displayColorClass()}">${coin.displayPrice()}</td>
              <td class="${coin.displayColorClass()}">${coin.change}</td>
              <td>${coin.displayMarketCap()}</td>
              </tr>
              `;
            }
          });
          watchListState = true;
        }
      }
      
      
      async function fetchDataInfo(id) {
        const url =
        `https://coinranking1.p.rapidapi.com/coin/${id}?referenceCurrencyUuid=yhjMzLPhuIDl&timePeriod=24h`;
        const options = {
          method: "GET",
          headers: {
      'X-RapidAPI-Key': 'd2f437d3ffmsh2d6fc063ae7a7fbp1b1a83jsn708210271d98',
		'X-RapidAPI-Host': 'coinranking1.p.rapidapi.com',
    },
  };
  
  try {
    const response = await fetch(url, options);
    const result = await response.json();
    console.log(result.data.coin.description)
    coinInfo.innerHTML= result.data.coin.description;
    
  } catch (error) {
    console.error(error);
  }
}
