//Capture locate of user

function getCoordintes() {
    var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };
  
    function success(pos) {
        var crd = pos.coords;
        var lat = crd.latitude.toString();
        var lng = crd.longitude.toString();
        var coordinates = [lat, lng];
        getCity(coordinates);
        return;
  
    }
  
    function error(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
    }
  
    navigator.geolocation.getCurrentPosition(success, error, options);
}
  
//Get city name
function getCity(coordinates) {
    var xhr = new XMLHttpRequest();
    var lat = coordinates[0];
    var lng = coordinates[1];
    localStorage.setItem('lat', lat)
    localStorage.setItem('long', lng)
    // Paste LocationIQ token below.
    xhr.open('GET', "https://us1.locationiq.com/v1/reverse.php?key=pk.6975875337f676aa938455e729fe386e&lat=" +
    lat + "&lon=" + lng + "&format=json", true);
    xhr.send();
    xhr.onreadystatechange = processRequest;
    xhr.addEventListener("readystatechange", processRequest, false);
  
    function processRequest(e) {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var response = JSON.parse(xhr.responseText);
            var city = response.address.city;
            localStorage.setItem('city', city)
            return;
        }
    }
}
  
getCoordintes();


//get temp
const getWeather = async() => {
    const weatherApi = {
        key: "14adfc7e6c4a47ce8621134fa5767b14",
        base: "",
        lang: "pt_br",
        units: "metric"
    }

    const apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + localStorage.getItem('city') + '&units=metric&APPID=14adfc7e6c4a47ce8621134fa5767b14&lang=pt_br'

    const resq = await fetch(apiUrl)

    const data = await resq.json()

    return data;
}

setInterval(getWeather, 1000*10)

//get and set time and data

document.addEventListener('DOMContentLoaded', ()=>{
    
    
    setInterval(()=>{
        const clock = document.getElementById('time')
        const dataText = document.getElementById('data')
        const data = new Date().toLocaleDateString()
        const hour = new Date().toLocaleTimeString()

        clock.innerText = hour
        dataText.innerText = data
    }, 1000*1)

    
})

    //show date in display

    const viewWeather = async() => {
        const data = await getWeather();
        const city = document.getElementById('city')
        const temp = document.getElementById('temp')
        const desc = document.getElementById('description')
        const icon = document.getElementById('icon')

        icon.style.backgroundImage = 'url(' + 'https://openweathermap.org/img/wn/' + data.weather[0].icon + '@2x.png)'
        city.innerHTML = localStorage.getItem("city") + " - " + data.sys.country
        temp.innerText = parseInt(data.main.temp) + "°C"
        desc.innerText = data.weather[0].description

        return data.main.temp;
    }
    setInterval(viewWeather, 1000*11)
    setTimeout(viewWeather, 1000*1)

    //loading image of your locate

    async function searchImage(){

        const imageUrl = 'https://pixabay.com/api/?key=31983115-d97d5a6a0252325048edde80f&q='+ localStorage.getItem('city').replaceAll(" ", "+") + '&image_type=photo'
        const imageSelector = await fetch(imageUrl)
        
        const result =  await imageSelector.json()

        return result;
    }


    const fillBackground = async() => {
        const dataImg = await searchImage()
        const bckgrd = document.getElementById('background')
        bckgrd.style.backgroundImage = 'url(' + dataImg.hits[0].largeImageURL + ')'
    }
setInterval(searchImage, 1000*1)
setInterval(fillBackground, 1000*1)

