fetchData();

const submitButton = document.getElementById("Submit");
const radioButtons = document.getElementsByName("infoRadio");
const valueTableDataElement = document.getElementById("valueTableData");

let listOfValues = [];
let checkedValue;
let listOfCoins = [];

function DisplayPrice(price) {
  return price.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

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
    console.log(result);
    fetchData2(
      "Qwsogvtv82FCd",
      "3h",
      "1",
      "https://cdn.coinranking.com/bOabBYkcX/bitcoin_btc.svg",
      "Bitcoin"
    );
    displayData(result);
    displayInfoBar(result);

    // console.log(await fetchDataInfo("Qwsogvtv82FCd"));
  } catch (error) {
    console.error(error);
  }
}
function displayData(result) {
  // const coinsTableDataElement = document.getElementById("coinsTableData");
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
    console.log(coinObj);
    listOfCoins.push(coinObj);
  });
}

function checkValue() {
  for (const radioButton of radioButtons) {
    if (radioButton.checked) {
      checkedValue = radioButton.value;
      break;
    }
  }
}
submitButton.addEventListener("click", function () {
  valueTableDataElement.innerHTML = "";
  submitValue();
});

function submitValue() {
  checkValue();
  listOfCoins.forEach((coin) => {
    fetchData2(coin.uuid, checkedValue, coin.rank, coin.iconUrl, coin.name);
  });

  // fetchData("Qwsogvtv82FCd", checkedValue)
}
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
async function fetchData2(id, timePeriod, rank, iconUrl, name) {
  const url = `https://coinranking1.p.rapidapi.com/coin/${id}/history?referenceCurrencyUuid=yhjMzLPhuIDl&timePeriod=${timePeriod}`;
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "d2f437d3ffmsh2d6fc063ae7a7fbp1b1a83jsn708210271d98",
      "X-RapidAPI-Host": "coinranking1.p.rapidapi.com",
    },
  };

  try {
    await delay(1000);
    const response = await fetch(url, options);
    const result = await response.text();
    displayData2(result, rank, iconUrl, name);
  } catch (error) {
    console.error(error);
  }
}

function displayData2(result, rank, iconUrl, name) {
  listOfValues.length = 0;
  JSON.parse(result).data.history.forEach((value) => {
    value.price = parseFloat(value.price);
    listOfValues.push(value.price);
  });
  //   console.log(listOfValues);
  displayTableData(listOfValues, rank, iconUrl, name);
}

function displayTableData(valueList, rank, iconUrl, name) {
  valueTableDataElement.innerHTML += `
    <tr>
            <td>${rank}</td>
            <td><img width="25px" src="${iconUrl}">${name}</td>
            <td>${DisplayPrice(findMinValue(valueList))}</td>
            <td>${DisplayPrice(findMaxValue(valueList))}</td>
            <td>${DisplayPrice(calculateAverage(valueList))}</td>
            </tr>
    `;
}
function findMinValue(list) {
  if (list.length === 0) {
    return null; // Return null if the list is empty
  }

  return Math.min(...list);
}

function findMaxValue(list) {
  if (list.length === 0) {
    return null; // Return null if the list is empty
  }

  return Math.max(...list);
}
function calculateAverage(list) {
  if (list.length === 0) {
    return null; // Return null if the list is empty
  }

  let sum = 0;
  for (let i = 0; i < list.length; i++) {
    sum += list[i];
  }

  return sum / list.length;
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
