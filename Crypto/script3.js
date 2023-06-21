fetchBoxes(); // Fetch boxes data and perform related operations

let listOfCoins = []; // Array to store coin objects
let listOfDataForBoxes = []; // Array to store box objects
let checkedValues = []; // Array to store checked checkbox values

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

    // Clear the arrays before populating them with new data
    listOfCoins.length = 0;
    listOfDataForBoxes.length = 0;

    displayInfoBar(result); // Display information bar with stats
    saveBoxesListData(result); // Save box data to the list
    createCheckBoxes(listOfDataForBoxes); // Create checkboxes based on box data

    // Event listener for the "Boxes" button
    boxesButton.addEventListener("click", async function () {
      checkedValues.length = 0; // Clear the array before adding new values
      listOfCoins.length = 0; // Clear the array before fetching new coin data

      getCheckedCheckboxValues(); // Get the values of checked checkboxes

      if (checkedValues.length > 15) {
        alert(
          "Due to optimization, it is recommended to choose no more than 15 cryptocurrencies"
        );
      }

      // Fetch coin data for the checked checkboxes
      for (const id of checkedValues) {
        await fetchCoins(id);
      }

      displayData(listOfCoins); // Display the fetched coin data
      window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to the top of the page
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
    saveToCoinsList(result); // Save the fetched coin data to the list
  } catch (error) {
    console.error(error);
  }
}

// Save the fetched coin data to the list of coins
function saveToCoinsList(result) {
  const coinObj = new Coin(
    JSON.parse(result).data.coin.uuid,
    JSON.parse(result).data.coin.name,
    JSON.parse(result).data.coin.iconUrl,
    JSON.parse(result).data.coin.description
  );
  listOfCoins.push(coinObj);
}

// Save the box data to the list of boxes
function saveBoxesListData(result) {
  JSON.parse(result).data.coins.forEach((coin) => {
    const BoxObj = new Boxes(coin.uuid, coin.name);
    listOfDataForBoxes.push(BoxObj);
  });
}

// Display the fetched coin data
function displayData(list) {
  coinDescriptions.innerHTML = "";

  list.forEach((coin) => {
    coinDescriptions.innerHTML += `
      <div class="coinCard">
        <div class="coinLogo">
          <img src="${coin.iconUrl}" alt="Coin Logo">
        </div>
        <div class="coinInfo">
          <h3 class="coinName">${coin.name}</h3>
          <p class="coinDescription">${displayDescription(coin.description)}</p>
        </div>
      </div> 
    `;
  });
}

// Display the coin description, handling the case when it is null
function displayDescription(description) {
  if (description == null) {
    return "Doesn't have a description.";
  } else {
    return description;
  }
}

// Create checkboxes based on the list of boxes
function createCheckBoxes(list) {
  list = sortByElement(list, "name"); // Sort the list by name

  checkBoxes.innerHTML = "";

  list.forEach((coin) => {
    checkBoxes.innerHTML += `
      <label><input type="checkbox" value="${coin.uuid}">${coin.name}</label>
    `;
  });
}

// Get the values of checked checkboxes and store them in the checkedValues array
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

function showAlert(message) {
  alert(message);
}

// Display the information bar with stats
function displayInfoBar(result) {
  const infoBarElement = document.getElementById("infoBar");
  const stats = JSON.parse(result).data.stats;

  infoBarElement.innerHTML += `
    <span>Cryptos <a href="#">${stats.totalCoins}</a></span>
    <span>Markets <a href="#">${stats.totalMarkets}</a></span>
    <span>Total Market Cap <a href="#">${stats.totalMarketCap}</a></span>
  `;
}

// Sort the list of objects by the specified element
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
