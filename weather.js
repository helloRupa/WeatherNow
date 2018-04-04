(function() {
    function getLocation() {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            getData(posToURL(position), populateData, showError, {code: "SCRIPT_FAILURE"});
          }, showError);
        } else {
          document.getElementById("notSupported").style.visibility = "visible";
        }
      }
  
    function posToURL(position) {
      //round #s to prevent API glitch where it provides wrong location
      let lat = parseFloat(position.coords.latitude.toFixed(2));
      let longitude = parseFloat(position.coords.longitude.toFixed(2));
      return url = `https://fcc-weather-api.glitch.me/api/current?lat=${lat}&lon=${longitude}`;
    }
  
    function showError(error) {
      let errorDiv = document.getElementById("notSupported");
      let errorP = errorDiv.getElementsByTagName("p")[0];
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorP.innerHTML = "Without your location, we cannot provide you with the weather.";
          break;
        case error.TIMEOUT:
          errorP.innerHTML = "The request to get user location timed out.";
          break;
        case error.UNKNOWN_ERROR:
          errorP.innerHTML = "An unknown error occurred. We are sorry.";
          break;
        default:
          errorP.innerHTML = "Location information is unavailable at this time.";
      }
      errorDiv.style.visibility = "visible";
    }
  
    function getData(url, callback, errorCallback, errorArgs) {
        let xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
            let myObj = JSON.parse(this.responseText);
            if (typeof callback === "function") callback(myObj);
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
    let desc = myObj.weather[0].description.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
    let imgSrc = myObj.weather[0].icon;
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
    tLink.onclick = function() { convertT(temperature);};
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
        let wIcon = document.getElementById("wIcon");
        let imgIcon = document.createElement("img");
        imgIcon.src = imgSrc;
        imgIcon.alt = "Today's weather icon";
        wIcon.appendChild(imgIcon);
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
  