const page = document.querySelector('.page');

const weatherApp = () => {
  const contents = document.createElement('div');
  contents.className = 'contents';

  function timeConvert(timeUnix) {
    const time = new Date(timeUnix * 1000);
    const currentTime = {
      year: time.getFullYear(),
      month: time.getMonth(),
      date: time.getDate(),
      hour: time.getHours(),
      min: time.getMinutes(),
      sec: time.getSeconds(),
    };
    return currentTime;
  }

  // Function with search
  async function findLocation() {  
    try {
      const city = document.querySelector('input[type="text"]').value;
      const response = await fetch(
        'http://api.openweathermap.org/geo/1.0/direct?q='+city+'&limit=5&appid=5aa4e1699ee7002055d2a7a0688ad761', 
        {mode:'cors'});
      const info = await response.json();
      const geolocation = {
        country: info[0].country,
        lat: info[0].lat,
        long: info[0].lon,
        name: info[0].name,
        state: info[0].state,
      };
      return geolocation;
    } catch (error) {
      // If STATUS != OK...
      console.log('FindLocation WASTED: '+ error);
    }
  }

  function refreshCurrentWeather(currentWeather) {
    return;
  }

  function refreshTime(time) {
    document.querySelector('.current.time .month').textContent = time.month;
    document.querySelector('.current.time .day').textContent = time.day;
    document.querySelector('.current.time .year').textContent = time.year;

    document.querySelector('.current.time .hour').textContent = time.hour;
    document.querySelector('.current.time .min').textContent = time.min;
    document.querySelector('.current.time .sec').textContent = time.sec;
  }

  // Load Weather by Geolocation
  async function loadWeather() {
    try {
      const location = await findLocation();
      const response = await fetch(
        'https://api.openweathermap.org/data/2.5/onecall?lat='+location.lat.toString()+'&lon='+location.long.toString()+'&appid=5aa4e1699ee7002055d2a7a0688ad761', 
        {mode:'cors'});
      const info = await response.json();

      const time = timeConvert(info.current.dt);
      const timeSunrise = timeConvert(info.current.sunrise);
      const timeSunset = timeConvert(info.current.sunset);

      const currentWeather = {
        temp: info.current.temp,
        feelsLike: info.current.feels_like,
        pressure: info.current.pressure,
        humidity: info.current.humidity,
        dewPoint: info.current.dew_point,
        uvi: info.current.uvi,
        clouds: info.current.clouds,
        visibility: info.current.visibility,
        wind: {
          windSpeed: info.current.wind_speed,
          windDegree: info.current.wind_deg,
          windGust: info.current.wind_gust,
        },
        weather: {
          id: info.current.weather.id,
          main: info.current.weather.main,
          description: info.current.weather.description,
          icon: info.current.weather.icon,
        }
      };

      // Populate divs with currentWeather info...
      refreshCurrentWeather(currentWeather);

      // Refresh time, sunrise, sunset
      refreshTime(time);


    } catch(error) {
      console.log('LoadWeather by Geolocation WASTED: '+ error);
    }

  }

  const initPage = () => {
    // Format Time
    const timeBlock = document.createElement('div');
    timeBlock.className = 'current time';

    const currDate = document.createElement('div');
    currDate.className = 'date';
    const currYear = document.createElement('div');
    currYear.className = 'year';
    currYear.textContent = '';
    const currMonth = document.createElement('div');
    currMonth.className = 'month';
    currMonth.textContent = '';
    const currDay = document.createElement('div');
    currDay.className = 'day';
    currDay.textContent = '';

    currDate.appendChild(currMonth);
    currDate.appendChild(currDay);
    currDate.appendChild(currYear);

    const currClock = document.createElement('div');
    currClock.className = 'clock';
    const currHour = document.createElement('div');
    currHour.className = 'hour';
    currHour.textContent = '';
    const currMin = document.createElement('div');
    currMin.className = 'min';
    currMin.textContent = '';
    const currSec = document.createElement('div');
    currSec.className = 'sec';
    currSec.textContent = '';

    currClock.appendChild(currHour);
    currClock.appendChild(currMin);
    currClock.appendChild(currSec);

    timeBlock.appendChild(currClock);
    timeBlock.appendChild(currDate);



    //****************************** */
    
    // Format Sunrise
    const sunriseBlock = document.createElement('div');
    sunriseBlock.className = 'sunrise';
    const sunriseHour = document.createElement('div');
    sunriseHour.className = 'hour';
    const sunriseMin = document.createElement('div');
    sunriseMin.className = 'min';

    sunriseBlock.appendChild(sunriseHour);
    sunriseBlock.appendChild(sunriseMin);
    //******************************** */

    // Format Sunset
    const sunsetBlock = document.createElement('div');
    sunsetBlock.className = 'sunset';
    const sunsetHour = document.createElement('div');
    sunsetHour.className = 'hour';
    const sunsetMin = document.createElement('div');
    sunsetMin.className = 'min';

    sunsetBlock.appendChild(sunsetHour);
    sunsetBlock.appendChild(sunsetMin);
    //********************************* */

    // Format Current Temp
    const currentTempBlock = document.createElement('div');

    // *******************************


    // Format Search 
    const search = document.createElement('div');
    search.className = 'search';
    
    const searchBox = document.createElement('input');
    searchBox.type = 'text';
    searchBox.className = 'search input';
    searchBox.value = 'New York';
    searchBox.addEventListener('focus', () => {
      searchBox.value = '';
    });
    searchBox.addEventListener('blur', () => {
      setTimeout(() => { //Timeout to allow search to take input before clearing input
        searchBox.value = 'Search City...';
      }, 500);
      
    })

    const searchBtn = document.createElement('button');
    searchBtn.className = 'search btn';
    searchBtn.innerHTML = '<img src="./src/searchIcon.png">';
    searchBtn.addEventListener('click', loadWeather);

    search.appendChild(searchBox);
    search.appendChild(searchBtn);
    //*************************** */

    contents.appendChild(search);
    contents.appendChild(timeBlock);

    page.appendChild(contents);
  }

  return {contents, 
          initPage,
          loadWeather,
          };
}

const weather = weatherApp();

weather.initPage();

