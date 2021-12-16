var searchBtnEl = document.querySelector("#search-btn");
var addressEl = document.querySelector("#address");
var cityEl = document.querySelector("#city");
var stateEl = document.querySelector("#state");
var zipCodeEl = document.querySelector("#zip-code");
var radiusEl = document.querySelector("#search-radius");
var historyEl = document.querySelector("#search-history");
var searchResultsEl = document.querySelector("#search-results");
var pageEl = document.querySelector("#page");
var modal = null;
var closeBtn = null;
var foodish = [];
var cardData = [];
var searchAddress = [];
var searchHistory = JSON.parse(localStorage.getItem("search-history"));


console.log(searchHistory);
if (searchHistory === null || searchHistory === "undefined") {
  searchHistory = [];
};

var locationApi = function (street, city, state, zipCode) {
  var apiUrl = "https://us1.locationiq.com/v1/search.php?key=pk.ba9a631a2a6a1d6a180f349a092cf72b&street=" + street + "&city=" + city + "&state=" + state + "&postalcode=" + zipCode + "&format=json";
  fetch(apiUrl).then(function (response) {
    if (response.ok) {
      console.log(response);
      response.json().then(function (data) {
        console.log(data);
        var lat = parseFloat(data[0].lat).toFixed(4);
        var lon = parseFloat(data[0].lon).toFixed(4);
        console.log(lat);
        console.log(lon);
        pizzaSearchEl(lat, lon);
      });
    } else {
      alert("Error: City not found");
    }
  })
};

searchBtnEl.addEventListener("click", function (event) {
  event.preventDefault();
  var street = addressEl.value;
  var city = cityEl.value;
  var state = stateEl.value;
  var zipCode = zipCodeEl.value;
  var searchHistoryObject = {
    "street": street,
    "city": city,
    "state": state,
    "zipCode": zipCode
  }
  searchAddress.push(searchHistoryObject);
  searchHistory.push(searchHistoryObject);
  locationApi(street, city, state, zipCode);
  displaySearchHistory(street, city, state, zipCode);
  setLocalStorage();
  pizzaSearchEl();
})

var setLocalStorage = function () {
  localStorage.setItem("search-history", JSON.stringify(searchHistory));
  if (searchHistory !== "undefined") {
    return;
  }

  displaySearchHistory();
};

var displaySearchHistory = function (street, city, state, zipCode) {
  var historyBtn = document.createElement("button");
  historyBtn.innerHTML = street + " " + city + " " + state + " " + zipCode;
  historyBtn.setAttribute("class", "button is-warning is-rounded history");
  historyEl.appendChild(historyBtn);
  historyBtn.addEventListener("click", function (event) {
    event.preventDefault();
    console.log(event.target);
    var searchHistoryObject = {
      "street": street,
      "city": city,
      "state": state,
      "zipCode": zipCode
    }
    searchAddress.pop();
    searchAddress.push(searchHistoryObject);
    console.log(searchAddress);
    locationApi(street, city, state, zipCode);
  });
};

window.addEventListener('load', (function () {
  var searchHistory = JSON.parse(localStorage.getItem("search-history"));
  console.log(searchHistory);
  if (!searchHistory) {
    return;
  } else {
    for (i = 0; i < searchHistory.length; i++) {
      displaySearchHistory(searchHistory[i].street, searchHistory[i].city, searchHistory[i].state, searchHistory[i].zipCode);
    }
  }
}));


for (i = 0; i < 10; i++) {
  fetch("https://foodish-api.herokuapp.com/api/images/pizza/").then(function (response) {
    if (response.ok) {
      console.log(response);
      response.json().then(function (data) {
        foodish.push(data.image);
        console.log(foodish);
      })
    }
  })
}

var pizzaSearchEl = function (lat, lon) {
  const options = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: 'fsq3qsYn7YLzG3qpDo0M38r99P7w7IKfqk5K5aPX9rbTkok='
    }
  };
  console.log(lat, lon);
  if (lat && lon) {
    fetch('https://api.foursquare.com/v3/places/search?ll=' + lat + ',' + lon + '&radius=40233&categories=13064', options).then(function (response) {
      response.json().then(function (data) {
        console.log(data);
        searchResultsEl.innerHTML = "";
        if (!cardData) { } else {
          for (i = 0; cardData.length; i++) {
            cardData.pop(0);
          }
        }
        for (i = 0; i < data.results.length; i++) {

          var card = document.createElement("div");
          card.setAttribute("class", "card column is-2 m-3");
          var cardContent = document.createElement("div");
          cardContent.setAttribute("class", "content");

          var cardImg = document.createElement("img");
          cardImg.setAttribute("class", "img");
          cardImg.setAttribute("src", foodish[i]);

          cardContent.appendChild(cardImg);


          var name = document.createElement("h2");
          name.setAttribute("class", "title");
          name.innerHTML = data.results[i].name;
          var address = document.createElement("p");
          address.innerHTML = data.results[i].location.address + " " + data.results[i].location.locality + " " + data.results[i].location.region + " " + data.results[i].location.postcode;

          var cardBtn = document.createElement("button");
          cardBtn.setAttribute("class", "button is-link");
          cardBtn.setAttribute("id", i);
          cardBtn.innerHTML = "Directions";
          cardBtn.addEventListener("click", function (event) {
            event.preventDefault();
            console.log(searchAddress);
            var startAddress = searchAddress[0].street + "," + searchAddress[0].city + "," + searchAddress[0].state + "+" + searchAddress[0].zipCode;
            startAddress = startAddress.replaceAll(" ", "+");
            console.log(startAddress);
            console.log(cardData);
            var endAddress = cardData[this.id].address + "," + cardData[this.id].city + "," + cardData[this.id].state + "+" + cardData[this.id].zipCode;
            endAddress = endAddress.replaceAll(" ", "+");
            console.log(endAddress);
            var directionString = "https://www.mapquestapi.com/staticmap/v5/map?start=" + startAddress + "&end=" + endAddress + "&size=600,400@2x&key=AqHArcuZKcSvXv0Y65s22KEGc8W1GaLo"
            console.log(directionString);
            fetch(directionString)
              .then(function (response) {
                console.log(response);
                var directionModal = document.createElement("div");
                directionModal.setAttribute("class", "modal");
                var modalBackground = document.createElement("div");
                modalBackground.setAttribute("class", "modal-background");
                var modalContent = document.createElement("div");
                modalContent.setAttribute("class", "modal-content");
                var modalP = document.createElement("p");
                modalP.setAttribute("class", "image is-4by3");
                var modalImg = document.createElement("img");
                modalImg.setAttribute("src", response.url);
                modalImg.setAttribute("alt", "Map giving direction from starting address to location of restaurant");
                var modalClose = document.createElement("button");
                modalClose.setAttribute("class", "modal-close is-large");
                modalClose.setAttribute("aria-label", "close");
                modalP.appendChild(modalImg);
                modalContent.appendChild(modalP);
                directionModal.appendChild(modalBackground);
                directionModal.appendChild(modalContent);
                directionModal.appendChild(modalClose);
                pageEl.appendChild(directionModal);
                modal = document.querySelector(".modal");
                modal.style.display = 'block';

                closeBtn = document.querySelector(".modal-close");

                closeBtn.addEventListener('click', function () {
                  modal.style.display = 'none';
                  var deleteModal = document.querySelector(".modal");
                  deleteModal.parentNode.removeChild(deleteModal);
                })

                window.addEventListener('click', function (event) {
                  if (event.target.className === 'modal-background') {
                    modal.style.display = 'none';
                    var deleteModal = document.querySelector(".modal");
                    deleteModal.parentNode.removeChild(deleteModal);
                  }
                })



              })
          })
          cardContent.appendChild(name);
          cardContent.appendChild(address);
          cardContent.appendChild(cardBtn);
          card.appendChild(cardContent);
          searchResultsEl.appendChild(card);
          var cardResult = {
            "name": data.results[i].name,
            "address": data.results[i].location.address,
            "city": data.results[i].location.locality,
            "state": data.results[i].location.region,
            "zipCode": data.results[i].location.postcode
          }
          cardData.push(cardResult);
        }
        console.log(cardData);
      });
    });
  }
};
