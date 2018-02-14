(function() {
    getLocation();

    function getLocation() {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(showPosition, showError);
        } else {
          document.getElementById("notSupported").style.visibility = "visible";
        }
      }
  
    function showPosition(position) {
      var lat = position.coords.latitude;
      var longitude = position.coords.longitude;
      getData(lat, longitude);
    }
  
    function showError(error) {
      var errorDiv = document.getElementById("notSupported");
      var errorP = errorDiv.getElementsByTagName("p")[0];
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorP.innerHTML =
            "Without your location, we cannot provide you with the weather.";
          errorDiv.style.visibility = "visible";
          break;
        case error.POSITION_UNAVAILABLE:
          errorP.innerHTML = "Location information is unavailable at this time.";
          errorDiv.style.visibility = "visible";
          break;
        case error.TIMEOUT:
          errorP.innerHTML = "The request to get user location timed out.";
          errorDiv.style.visibility = "visible";
          break;
        case error.UNKNOWN_ERROR:
          errorP.innerHTML = "An unknown error occurred. We are sorry.";
          errorDiv.style.visibility = "visible";
          break;
      }
    }
  
    function getData(latitude, longitude) {
        var url = "https://fcc-weather-api.glitch.me/api/current?lat=" +
          latitude + "&lon=" + longitude;
  
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
            var myObj = JSON.parse(this.responseText);
            populateData(myObj);
          }
       };
        xmlhttp.open("GET", url, true);
        xmlhttp.onerror = function () {
          var errorDiv = document.getElementById("notSupported");
          var errorP = errorDiv.getElementsByTagName("p")[0];
          errorP.innerHTML = "Location information is unavailable at this time.";
          errorDiv.style.visibility = "visible";
        };
        xmlhttp.send();
  }

  function populateData(myObj) {
    var tempNum = myObj.main.temp;
    var city = myObj.name;
    var country = myObj.sys.country;
    var desc = myObj.weather[0].description.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
    var imgSrc = myObj.weather[0].icon;
    setBg(tempNum);
    setTemp(tempNum);
    setLoc(city, country);
    setDesc(desc);
    setIcon(imgSrc);
  }

  function setTemp(temperature) {
    var temp = document.getElementById("temperature");
    var numSpan = document.getElementById("num");
    var degText = document.createTextNode("\xB0");
    var tLink = document.createElement("a");
    numSpan.textContent = temperature;
    tLink.href = "#~";
    tLink.textContent = "C";
    tLink.onclick = function() { convertT(temperature);};
    temp.appendChild(numSpan);
    temp.appendChild(degText);
    temp.appendChild(tLink);
  }

    function convertT(temperature) {
      var tempDiv = document.getElementById("temperature");
      var tempNum = tempDiv.getElementsByTagName("span")[0];
      var tempUnit = tempDiv.getElementsByTagName("a")[0];
      var tF = Math.floor(temperature * (9 / 5) + 32);
  
      if (tempUnit.textContent == "C") {
        tempUnit.textContent = "F";
        tempNum.textContent = tF;
      } else {
        tempUnit.textContent = "C";
        tempNum.textContent = temperature;
      }
    }

    function setLoc(city, country) {
        var location = document.getElementById("location");
        location.textContent = city + ", " + country;
    }

    function setDesc(desc) {
        var description = document.getElementById("description");
        description.textContent = desc;
    }

    function setIcon(imgSrc) {
        var wIcon = document.getElementById("wIcon");
        var imgIcon = document.createElement("img");
        imgIcon.src = imgSrc;
        imgIcon.alt = "Today's weather icon";
        wIcon.appendChild(imgIcon);
    }

    function setBg(tempNum) {
        var bodyStyle = document.body.style;
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
  })();
  