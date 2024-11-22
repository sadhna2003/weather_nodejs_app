require('dotenv').config();
const http = require('http');
const fs = require('fs');

const htmlFile = fs.readFileSync('./home.html', 'utf-8');

const replaceVal = (tempVal, orgVal) => {
    const tempCelsius = (kelvin) => (kelvin - 273.15).toFixed(2);
    let temperature = tempVal.replace("{%tempVal%}", tempCelsius(orgVal.main.temp));
    temperature = temperature.replace("{%tempLocation%}", orgVal.name);
    temperature = temperature.replace("{%tempCon%}", orgVal.sys.country);
    temperature = temperature.replace("{%tempMin%}", tempCelsius(orgVal.main.temp_min));
    temperature = temperature.replace("{%tempMax%}", tempCelsius(orgVal.main.temp_max));
    return temperature;
}
const server = http.createServer(async (req, res) => {
    if (req.url === '/') {
        // console.log('request received');
        try {
            const apiKey = process.env.OPENWEATHER_API_KEY;
            // Fetch weather data from the OpenWeatherMap API
            const apiResponse = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=Ahmedabad,in&APPID=${apiKey}`
            );
            const weatherData = await apiResponse.json();
            const finalData = replaceVal(htmlFile, weatherData);
            // console.log(finalData);
            res.write(finalData);
            res.end();
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
        }
    }
    else {
        res.end("Page Not Found");
    }
})

server.listen(8000, () => {
    console.log('server is running in port 8000');
})
