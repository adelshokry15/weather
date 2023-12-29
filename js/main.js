if (window.location.pathname == "/contact.html") {
  navigator.geolocation.getCurrentPosition((position) => {
    let { latitude, longitude } = position.coords;
    var map = L.map("map").setView([latitude, longitude], 19);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      minZoom: 1,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);
    L.marker([latitude, longitude]).addTo(map);
  });
}
if (window.location.pathname != "/contact.html") {
  async function search(loc) {
    let data = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=0fed607f5ba14c2593e140011232712&q=${loc}&days=3`
    );

    if (data.ok && data.status != 400) {
      let locData = await data.json();
      displayToday(locData.location, locData.current);
      displayAnother(locData.forecast.forecastday);
    }
  }

  document.getElementById("search").addEventListener("keyup", (e) => {
    search(e.target.value);
  });
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  function displayToday(location, today) {
    if (today != null) {
      let e = new Date(today.last_updated.replace(" ", "T"));
      let todayWeather = `<div class="weather-item">
          <div class="weather-date d-flex justify-content-between px-4 py-2">
            <span>${days[e.getDay()]}</span>
            <span>${e.getDate()}${monthNames[e.getMonth()]}</span>
          </div>
          <div class="weather-body pt-4 px-4">
            <h3>${location.name}</h3>
            <div
              class="weather-deg d-sm-flex d-md-block d-xl-flex align-items-center"
            >
              <h1 class="degree fw-bold me-5 text-white">${today.temp_c}</h1>
              <div class="align-middle d-inline-block">
                <img src="https:${today.condition.icon}" alt="" />
              </div>
            </div>
            <span class="text-primary small mb-3 d-block">${
              today.condition.text
            }</span>
            <ul class="weather-info d-flex list-unstyled mb-5">
              <li class="small me-3">
                <img class="me-1" src="/img/icon-umberella.png" alt="" /> 20%
              </li>
              <li class="small me-3">
                <img class="me-1" src="/img/icon-wind.png" alt="" /> 18km/h
              </li>
              <li class="small me-3">
                <img class="me-1" src="/img/icon-compass.png" alt="" /> East
              </li>
            </ul>
          </div>
        </div>`;
      document.getElementById("used").innerHTML = todayWeather;
    }
  }
  function displayAnother(forecastday) {
    let comingWeather = "";
    for (let i = 1; i < forecastday.length; i++) {
      comingWeather += `<div class="weather-item text-center">
          <div class="weather-date px-4 py-2">${
            days[new Date(forecastday[i].date).getDay()]
          }</div>
          <div class="weather-body pt-4 px-4">
            <img class="mb-3" src="https:${
              forecastday[i].day.condition.icon
            }" alt="" />
            <h2 class="text-white">${forecastday[i].day.maxtemp_c}</h2>
            <h6 class="mb-3">${forecastday[i].day.mintemp_c}</h6>
            <span class="text-primary small m-4 d-block">${
              forecastday[i].day.condition.text
            }</span>
          </div>
        </div>`;
    }
    document.getElementById("used").innerHTML += comingWeather;
  }
  navigator.geolocation.getCurrentPosition((position) => {
    let { latitude, longitude } = position.coords;
    let url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        search(data.address.city);
      });
  });
}
