// DOM Elements
const time = document.querySelector('.time'),
  greeting = document.querySelector('.greeting'),
  name = document.querySelector('.name'),
  focus = document.querySelector('.focus'),
  dayInfo = document.querySelector('.today'),
  quote = document.querySelector('.quote'),
  blockquote = document.querySelector('blockquote'),
  figcaption = document.querySelector('figcaption'),
  weatherIcon = document.querySelector('.weather-icon'),
  temperature = document.querySelector('.temperature'),
  weatherDescription = document.querySelector('.weather-description'),
  city = document.querySelector('.city'),
  weatherHumidity = document.querySelector('.weather-humidity'),
  windSpeed = document.querySelector('.wind-speed');

//localStorage.clear();

let prevName = '[Enter Name]';
let prevCity = '[Enter City]';
let prevFocus = '[Enter Focus]';

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
// Show Time
function showTime() {
  let today = new Date()

  time.innerHTML = today.toLocaleString("ru", {hour: 'numeric', minute: 'numeric', second: 'numeric'});
  dayInfo.innerHTML = today.toLocaleString("en", {month: 'long', day: 'numeric', weekday: 'long', timezone: 'UTC'});

  setTimeout(showTime, 1000);
}

// Add Zeros
function addZero(n) {
  return (parseInt(n, 10) < 10 ? '0' : '') + n;
}
// Set Background and Greeting
let today = new Date();

function setBgGreet() {
  let hour = today.getHours();
  
  if(hour < 6){
    // Night
    document.body.style.backgroundImage = `url('./assets/images/night/${getRandomInt(10)}.jpg')`;
    greeting.textContent = 'Good Night, ';
  } else if (hour < 12) {
    // Morning
    document.body.style.backgroundImage = `url('./assets/images/morning/${getRandomInt(10)}.jpg')`;
    greeting.textContent = 'Good Morning, ';
  } else if (hour < 18) {
    // Afternoon
    document.body.style.backgroundImage = `url('./assets/images/afternoon/${getRandomInt(10)}.jpg')`;
    greeting.textContent = 'Good Afternoon, ';
  } else {
    // Evening
    document.body.style.backgroundImage = `url('./assets/images/evening/${getRandomInt(10)}.jpg')`;     
    greeting.textContent = 'Good Evening, ';
    document.body.style.color = 'white';
  }
}

let i = today.getHours();
function viewBgImage(data) {
  const body = document.querySelector('body');
  const src = data;
  const img = document.createElement('img');
  img.src = src;
  img.onload = () => {      
    body.style.backgroundImage = `url(${src})`;
  }; 
}

function getImage() {
  let path = '';
  let index = (i+1) % 24;
  if(index < 6){
    // Night
    path = `./assets/images/night/`;    
  } else if (index < 12) {
    // Morning
    path = `./assets/images/morning/`;    
  } else if (index < 18) {
    // Afternoon
    path = `./assets/images/afternoon/`;    
  } else {
    // Evening
    path = `./assets/images/evening/`;     
  }
  const imageSrc = path + `${getRandomInt(10)}.jpg`;
  viewBgImage(imageSrc);
  i++;
}  

const changeBackgroundBtn = document.querySelector('.changeBackgroundBtn');
changeBackgroundBtn.addEventListener('click', getImage);
changeBackgroundBtn.addEventListener('click', getQuote);

// Get Name
function getName() {
  if (localStorage.getItem('name') === null) {
    name.textContent = '[Enter Name]';
  } else {
    name.textContent = localStorage.getItem('name');
  }
}

// Set Name
function setName(e) {
  if (e.type === 'keypress') {
    // Make sure enter is pressed
    if (e.which == 13 || e.keyCode == 13) {
      if(name.innerHTML === '') name.innerHTML = prevName;
      localStorage.setItem('name', e.target.innerText);
      name.blur();
    }
  } else {
    if(name.innerHTML === '') name.innerHTML = prevName;
    localStorage.setItem('name', e.target.innerText);
  }
}

// Get Focus
function getFocus() {
  if (localStorage.getItem('focus') === null) {
    focus.textContent = '[Enter Focus]';
  } else {
    focus.textContent = localStorage.getItem('focus');
  }
}
// Set Focus
function setFocus(e) {
  if (e.type === 'keypress') {
    // Make sure enter is pressed
    if (e.which == 13 || e.keyCode == 13) {
      if(focus.innerHTML === '') focus.innerHTML = prevFocus;
      localStorage.setItem('focus', e.target.innerText);
      focus.blur();
    }
  } else {
    if(focus.innerHTML === '') focus.innerHTML = prevFocus;
    localStorage.setItem('focus', e.target.innerText);
  }
}

async function getQuote() {  
  const url = `https://favqs.com/api/qotd`;
  const res = await fetch(url);
  const data = await res.json(); 
  blockquote.textContent = data.quote.body;
  figcaption.textContent = data.quote.author;
}

// get weather 
function getCity() {
  if (localStorage.getItem('city') === null) {
      city.textContent = '[Enter City]';
  } else {
      city.textContent = localStorage.getItem('city');
  }
}

function setCity(e) {
  if(e.type === 'keypress') {
      if (e.which == 13 || e.keyCode == 13) {
          if(city.innerHTML === '') city.textContent = prevCity;
          localStorage.setItem('city', e.target.innerText);
          getWeather();
          city.blur();
      }
  } else {
      if(city.innerHTML === '') city.innerHTML = prevCity;
      localStorage.setItem('city', e.target.innerText);
  }
}

async function getWeather() {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.textContent}&lang=ea&appid=83377b627705bd25dff85ae1fa17aa07&units=metric`;
  const res = await fetch(url);
  const data = await res.json();
  if(data.cod === "404" && city.innerHTML !== "[Enter City]"){
    alert(data.message);
    city.innerHTML = "[Enter City]";
    weatherIcon.className = '';
    temperature.textContent = ``;
    weatherHumidity.textContent = ``;
    windSpeed.textContent = ``;
    weatherDescription.textContent = "";
  }
  else{
    weatherIcon.className = 'weather-icon owf';
    weatherIcon.classList.add(`owf-${data.weather[0].id}`);
    temperature.textContent = `${data.main.temp}°C`;
    weatherHumidity.textContent = `humidity: ${data.main.humidity}%`;
    windSpeed.textContent = `wind: ${data.wind.speed} m/s`;
    weatherDescription.textContent = data.weather[0].description;
  }  
}

function timeUbeiteMenya(){
  let nowTime = new Date();
  return 3600000 - nowTime.getMinutes() * 60000 - nowTime.getSeconds() * 1000;
}

document.addEventListener('DOMContentLoaded', getQuote);

city.addEventListener('click', e => {
  prevCity = city.innerHTML;
  city.innerText = ''});
city.addEventListener('keypress', setCity);
city.addEventListener('blur', setCity);

name.addEventListener('click', e => {
  prevName = name.innerHTML;
  name.innerText = ''});
name.addEventListener('keypress', setName);
name.addEventListener('blur', setName);

focus.addEventListener('click', e => {
  prevFocus = focus.innerHTML;
  focus.innerText = ''});
focus.addEventListener('keypress', setFocus);
focus.addEventListener('blur', setFocus);

// Run
showTime();
setBgGreet();
getName();
getFocus();
getCity();
if(city.innerHTML !== "" || city.innerHTML !== "[Enter City]") getWeather();
setTimeout(() => {
  setBgGreet();
  setInterval(() => setBgGreet(), 3600000);
 }, timeUbeiteMenya() );