(function () {
  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        getData(posToURL(position), populateData, showError, {
          code: "SCRIPT_FAILURE"
        }, validateData, position);
      }, showError, {
        maximumAge: 60000,
        timeout: 20000,
        enableHighAccuracy: false
      });
    } else {
      document.getElementById("notSupported").style.visibility = "visible";
      clearLoadScreen();
    }
  }

  function clearLoadScreen() {
    let loadScreen = document.getElementById("loading").style;
    let container = document.getElementById("container").style;
    loadScreen.opacity = "0";
    container.opacity = "1";
    setTimeout(() => loadScreen.display = "none", 1100);
  }

  function posToURL(position) {
    let lat = parseFloat(position.coords.latitude.toFixed(2));
    let longitude = parseFloat(position.coords.longitude.toFixed(2));
    return `https://fcc-weather-api.glitch.me/api/current?lat=${lat}&lon=${longitude}`;
  }

  function showError(error) {
    let errorDiv = document.getElementById("notSupported");
    let errorP = errorDiv.getElementsByTagName("p")[0];
    console.log(error);
    switch (error.code) {
      case error.PERMISSION_DENIED:
        errorP.textContent = "Without your location, we cannot provide you with the weather.";
        break;
      case error.TIMEOUT:
        errorP.textContent = "The request to get user location timed out.";
        break;
      case error.UNKNOWN_ERROR:
        errorP.textContent = "An unknown error occurred. We are sorry.";
        break;
      default:
        errorP.textContent = "Location information is unavailable at this time.";
    }
    errorDiv.style.visibility = "visible";
    clearLoadScreen();
  }
  //check if API returned a valid response (correct location's data)
  function validateData(position, response) {
    let geoLat = parseInt(position.coords.latitude, 10);
    let geoLon = parseInt(position.coords.longitude, 10);
    let resLat = parseInt(response.coord.lat, 10);
    let resLon = parseInt(response.coord.lon, 10);
    console.log(geoLat === resLat && geoLon === resLon);
    console.log(`${geoLat}  ${resLat}`);
    console.log(`${geoLon}  ${resLon}`);
    return geoLat === resLat && geoLon === resLon;
  }

  function getData(url, callback, errorCallback, errorArgs, validationCallback, validationArgs) {
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        let myObj = JSON.parse(this.responseText);
        let isValid = true;
        if (typeof validationCallback === "function")
          isValid = validationCallback(validationArgs, myObj);
        if (isValid) {
          if (typeof callback === "function")
            callback(myObj);
        } else
          setTimeout(() => getData(url, callback, errorCallback, errorArgs, validationCallback, validationArgs), 100);
      }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.onerror = function () {
      if (typeof errorCallback === "function") errorCallback(errorArgs);
    };
    xmlhttp.send();
  }

  function populateData(myObj) {
    let tempNum = myObj.main.temp;
    let city = myObj.name;
    let country = myObj.sys.country;
    let desc = myObj.weather[0].description.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
    let imgSrc = myObj.weather[0].icon;
    clearLoadScreen();
    setBg(tempNum);
    setTemp(tempNum);
    setLoc(city, country);
    setDesc(desc);
    setIcon(imgSrc);
  }

  function setTemp(temperature) {
    let temp = document.getElementById("temperature");
    let numSpan = document.getElementById("num");
    let degText = document.createTextNode("\xB0");
    let tLink = document.createElement("a");
    numSpan.textContent = temperature;
    tLink.href = "#~";
    tLink.textContent = "C";
    tLink.onclick = function () {
      convertT(temperature);
    };
    temp.appendChild(numSpan);
    temp.appendChild(degText);
    temp.appendChild(tLink);
  }

  function convertT(temperature) {
    let tempDiv = document.getElementById("temperature");
    let tempNum = tempDiv.getElementsByTagName("span")[0];
    let tempUnit = tempDiv.getElementsByTagName("a")[0];
    let tF = Math.floor(temperature * (9 / 5) + 32);

    if (tempUnit.textContent == "C") {
      tempUnit.textContent = "F";
      tempNum.textContent = tF;
    } else {
      tempUnit.textContent = "C";
      tempNum.textContent = temperature;
    }
  }

  function setLoc(city, country) {
    let location = document.getElementById("location");
    location.textContent = city + ", " + country;
  }

  function setDesc(desc) {
    let description = document.getElementById("description");
    description.textContent = desc;
  }

  function setIcon(imgSrc) {
    if (imgSrc) {
      let wIcon = document.getElementById("wIcon");
      let imgIcon = document.createElement("img");
      imgIcon.src = imgSrc;
      imgIcon.alt = "Today's weather icon";
      wIcon.appendChild(imgIcon);
    }
  }

  function setBg(tempNum) {
    let bodyStyle = document.body.style;
    if (tempNum <= 0)
      bodyStyle.backgroundColor = "#1E28EE";
    else if (tempNum > 0 && tempNum < 10)
      bodyStyle.backgroundColor = "#A5EDED";
    else if (tempNum >= 10 && tempNum < 25)
      bodyStyle.backgroundColor = "#F9DC2D";
    else if (tempNum >= 25 && tempNum < 32)
      bodyStyle.backgroundColor = "#ED7217";
    else bodyStyle.backgroundColor = "#D83420";
  }

  getLocation();

})();