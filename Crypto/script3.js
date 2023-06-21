fetchBoxes();
let listOfCoins = [];
let listOfDataForBoxes = [];
let checkedValues = [];
const coinDescriptions = document.getElementById("coinDescriptions");
const checkBoxes = document.getElementById("checkboxes");
const boxesButton = document.getElementById("boxesButton");
class Coin {
  constructor(uuid, name, iconUrl, description) {
    this.uuid = uuid;
    this.name = name;
    this.iconUrl = iconUrl;
    this.description = description;
  }
}
class Boxes {
  constructor(uuid, name) {
    this.uuid = uuid;
    this.name = name;
  }
}
async function fetchBoxes() {
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
    listOfCoins.length=0;
    listOfDataForBoxes.length=0;
    displayInfoBar(result);
    saveBoxesListData(result);
    createCheckBoxes(listOfDataForBoxes);

    boxesButton.addEventListener("click", async function () {
      checkedValues.length=0;
      console.log("Przed" + checkedValues.length);
      getCheckedCheckboxValues();
      for (const id of checkedValues) {
        await fetchCoins(id);
      }
      displayData(listOfCoins);
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  } catch (error) {
    console.error(error);
  }
}

async function fetchCoins(id) {
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
    const result = await response.text();
    console.log(result);
    saveToCoinsList(result);
  } catch (error) {
    console.error(error);
  }
}

// function saveToCoinsList(result) {
//   JSON.parse(result).data.coin.forEach((coin) => {
//     const coinObj = new Coin(
//       coin.uuid,
//       coin.name,
//       coin.iconUrl,
//       coin.description
//     );
//     listOfCoins.push(coinObj);
//   });
// }

function saveToCoinsList(result){
  const coinObj = new Coin(
    JSON.parse(result).data.coin.uuid,
    JSON.parse(result).data.coin.name,
    JSON.parse(result).data.coin.iconUrl,
    JSON.parse(result).data.coin.description
  )
  listOfCoins.push(coinObj);
}

function saveBoxesListData(result) {
  JSON.parse(result).data.coins.forEach((coin) => {
    const BoxObj = new Boxes(coin.uuid, coin.name);
    listOfDataForBoxes.push(BoxObj);
  });
}
function displayData(list){
  console.log(list);
  coinDescriptions.innerHTML = "";
  list.forEach((coin)=>{
  coinDescriptions.innerHTML+=`
  <div class="coinCard">
                <div class="coinLogo">
                    <img src="${coin.iconUrl}" alt="Coin Logo">
                </div>
                <div class="coinInfo">
                    <h3 class="coinName">${coin.name}</h3>
                    <p class="coinDescription">${displayDescription(coin.description)}</p>
                </div>
            </div> 
  `
  })
}
function displayDescription(description){
  if(description==null){
    return "Nie posiada opisu";
  }else{
    return description;
  }
}

function createCheckBoxes(list) {
  list = sortByElement(list, "name");
  checkBoxes.innerHTML = "";
  list.forEach((coin) => {
    checkBoxes.innerHTML += `
    <label><input type="checkbox" value="${coin.uuid}">${coin.name}</label>
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

  // console.log(checkedValues);
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
function sortByElement(list, element) {
  // console.log(element);

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
  console.log(sortedList);
  return sortedList;
}
