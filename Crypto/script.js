fetchData();

// Tworzymy tablice, w ktorych przechowywac bedziemy liste wszystkich coinow oraz liste ulubionych(przechowujemy id).
let listOfCoins = [];
let listOfFavCoins = [];
const watchListButton = document.getElementById("watchList");
const coinsTableDataElement = document.getElementById("coinsTableData");

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

    watchListButton.addEventListener("click", displayFavoriteCoins);
  } catch (error) {
    console.error(error);
  }
}
const coinInfo = document.getElementById("coinDescription");
function displayData(result) {
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
  });
  displayTableData(listOfCoins);
  displayInfoBar(result);
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

let watchListStateNum = -1;
let watchListState = false;
function displayFavoriteCoins() {
  coinsTableDataElement.innerHTML = "";

  if (watchListState) {
    // wyświetla wszystkie coiny
    displayTableData(listOfCoins);
    watchListState = false;
    watchListStateNum = 0;
  } else {
    // wyświetla ulubione coiny
    displayWatchList(listOfCoins);
    watchListState = true;
    watchListStateNum = 1;
  }
}

async function fetchDataInfo(id) {
  const url = `https://coinranking1.p.rapidapi.com/coin/${id}?referenceCurrencyUuid=yhjMzLPhuIDl&timePeriod=24h`;
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "d2f437d3ffmsh2d6fc063ae7a7fbp1b1a83jsn708210271d98",
      "X-RapidAPI-Host": "coinranking1.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    const coinDescription = result.data.coin.description;
    if (coinDescription.trim() === "") {
      coinInfo.style.display = "none";
    } else {
      coinInfo.textContent = coinDescription;
      coinInfo.style.display = "block";
      window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to the top of the page
    }
  } catch (error) {
    console.error(error);
  }
}

function showAlert(message) {
  alert(message);
}
