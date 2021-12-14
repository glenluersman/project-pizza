var searchBtnEl = document.querySelector("#search-btn");
var addressEl = document.querySelector("#address");
var cityEl = document.querySelector("#city");
var stateEl = document.querySelector("#state");
var zipCodeEl = document.querySelector("#zip-code");
var radiusEl = document.querySelector("#search-radius");
var historyEl = document.querySelector("#search-history");
var searchResultsEl = document.querySelector("#search-results");
var cardData = [];
var searchHistory = JSON.parse(localStorage.getItem("search-history"));
console.log(searchHistory);
if (searchHistory === null || searchHistory === "undefined") {
  searchHistory = [];
};

var locationApi = function(street, city, state, zipCode) {
  var apiUrl = "https://us1.locationiq.com/v1/search.php?key=pk.ba9a631a2a6a1d6a180f349a092cf72b&street=" + street + "&city=" + city + "&state=" + state + "&postalcode=" + zipCode + "&format=json";
  fetch(apiUrl).then(function(response) {
    if (response.ok) {
      console.log(response);
      response.json().then(function(data) {
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

searchBtnEl.addEventListener("click", function(event) {
  event.preventDefault();
    var street = addressEl.value;
    var city = cityEl.value;
    var state = stateEl.value;
    var zipCode = zipCodeEl.value;
    searchHistory.push(street + " " + city + " " + state + " " + zipCode);
    locationApi(street, city, state, zipCode);
    displaySearchHistory(street, city, state, zipCode);
    setLocalStorage();
    pizzaSearchEl();
})

var setLocalStorage = function() {
  localStorage.setItem("search-history", JSON.stringify(searchHistory));
  if (searchHistory !== "undefined") {
    return;
  }
  displaySearchHistory();
};

var displaySearchHistory = function(street, city, state, zipCode) {
  var historyBtn = document.createElement("button");
  historyBtn.innerHTML = street + " " + city + " " + state + " " + zipCode;
  historyBtn.setAttribute("class", "button is-warning is-rounded history");
  historyEl.appendChild(historyBtn);
  historyBtn.addEventListener("click", function(event) {
    event.preventDefault();
    console.log(event.target);
    locationApi(street, city, state, zipCode);
  });
};

searchHistory.forEach(function(searchHistory) {
  displaySearchHistory(searchHistory);
});


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

            for (i = 0; i < data.results.length; i++) {
              var card = document.createElement("div");
              card.setAttribute("class", "card");
              var cardContent = document.createElement("div");
              cardContent.setAttribute("class", "content");
              var name = document.createElement("h2");
              name.setAttribute("class", "title");
              name.innerHTML = data.results[i].name;
              var address = document.createElement("p");
              address.innerHTML = data.results[i].location.address + " " +  data.results[i].location.locality + " " + data.results[i].location.region + " " + data.results[i].location.postcode;
              var cardBtn = document.createElement("button");
              cardBtn.setAttribute("class", "button is-link");
              cardBtn.innerHTML = "Directions";
              cardContent.appendChild(cardBtn);
              cardContent.appendChild(name);
              cardContent.appendChild(address);
              card.appendChild(cardContent);
              searchResultsEl.appendChild(card);
              var cardResult = {
                "name" : data.results[i].name,
                "address" : data.results[i].location.address,
                "city" : data.results[i].location.locality,
                "state" : data.results[i].location.region,
                "zipCode" : data.results[i].location.postcode
              }           
            cardData.push(cardResult); 
            }    
   
        });
    });
  }
};
