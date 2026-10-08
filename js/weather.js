// ==========================================
// WEATHER.JS
// OpenWeather API + Location Search
// ==========================================


// ==========================================
// GET WEATHER BY CITY / TOWN / VILLAGE
// ==========================================

async function getWeather(city) {

    try {

        const searchName = city.trim();

        if (!searchName) {
            throw new Error("Please enter a location");
        }


        // --------------------------------------
        // Known alternate names
        // --------------------------------------

        const aliases = {

            "bheemili":
                "Bheemunipatnam,IN",

            "bheemunipatnam":
                "Bheemunipatnam,IN",

            "veeraghattam":
                "Veeraghattam,IN",

            "veeraghatam":
                "Veeraghattam,IN"

        };


        const locationName =
            aliases[
                searchName.toLowerCase()
            ] || searchName;


        console.log(
            "Searching location:",
            locationName
        );


        // --------------------------------------
        // GEOCODING API
        // --------------------------------------

        const geoURL =
            `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(locationName)}&limit=5&appid=${API_KEY}`;


        const geoResponse =
            await fetch(geoURL);


        const locations =
            await geoResponse.json();


        console.log(
            "Geocoding results:",
            locations
        );


        if (!geoResponse.ok) {

            throw new Error(
                locations.message ||
                "Location search failed"
            );
        }


        if (
            !locations ||
            locations.length === 0
        ) {

            throw new Error(
                "Location not found"
            );
        }


        // --------------------------------------
        // SELECT LOCATION
        // --------------------------------------

        // ==========================================
// SELECT BEST LOCATION MATCH
// ==========================================

const searchLower =
    searchName.toLowerCase();

let location =
    locations.find(
        item =>
            item.name &&
            item.name.toLowerCase() ===
            searchLower
    );


// If exact match is not found,
// use the first result

if (!location) {

    location =
        locations[0];
}

        const latitude =
            location.lat;

        const longitude =
            location.lon;


        console.log(
            "Location found:",
            location.name
        );

        console.log(
            "Latitude:",
            latitude
        );

        console.log(
            "Longitude:",
            longitude
        );


        // --------------------------------------
        // GET WEATHER USING COORDINATES
        // --------------------------------------

        return await getWeatherByCoordinates(
            latitude,
            longitude
        );

    } catch (error) {

        console.error(
            "Weather error:",
            error
        );

        return null;
    }
}


// ==========================================
// GET WEATHER BY LATITUDE / LONGITUDE
// ==========================================

async function getWeatherByCoordinates(
    latitude,
    longitude
) {

    try {

        const weatherURL =
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;


        const response =
            await fetch(weatherURL);


        const data =
            await response.json();


        console.log(
            "Weather API response:",
            data
        );


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Weather information not found"
            );
        }


        return data;

    } catch (error) {

        console.error(
            "Weather API error:",
            error
        );

        return null;
    }
}


// ==========================================
// GET WEATHER BY PIN CODE
// ==========================================

async function getWeatherByPIN(pinCode) {

    try {

        const pin = pinCode.trim();


        // Indian PIN code
        if (!/^\d{6}$/.test(pin)) {

            throw new Error(
                "Please enter a valid 6-digit Indian PIN code"
            );
        }


        console.log(
            "Searching PIN code:",
            pin
        );


        // --------------------------------------
        // OpenWeather ZIP CODE API
        // --------------------------------------

        const url =
            `https://api.openweathermap.org/geo/1.0/zip?zip=${pin},IN&appid=${API_KEY}`;


        const response =
            await fetch(url);


        const location =
            await response.json();


        console.log(
            "PIN location:",
            location
        );


        if (!response.ok) {

            throw new Error(
                location.message ||
                "PIN code not found"
            );
        }


        const latitude =
            location.lat;

        const longitude =
            location.lon;


        // --------------------------------------
        // Get weather
        // --------------------------------------

        return await getWeatherByCoordinates(
            latitude,
            longitude
        );


    } catch (error) {

        console.error(
            "PIN weather error:",
            error
        );

        return null;
    }
}


// ==========================================
// GET WEATHER USING BROWSER LOCATION
// ==========================================

async function getWeatherByCurrentLocation() {

    return new Promise(
        (resolve, reject) => {

            if (!navigator.geolocation) {

                reject(
                    new Error(
                        "Geolocation is not supported by your browser."
                    )
                );

                return;
            }


            navigator.geolocation.getCurrentPosition(

                async (position) => {

                    try {

                        const latitude =
                            position.coords.latitude;

                        const longitude =
                            position.coords.longitude;


                        console.log(
                            "Current latitude:",
                            latitude
                        );


                        console.log(
                            "Current longitude:",
                            longitude
                        );


                        const weather =
                            await getWeatherByCoordinates(
                                latitude,
                                longitude
                            );


                        if (!weather) {

                            reject(
                                new Error(
                                    "Unable to get weather for your location"
                                )
                            );

                            return;
                        }


                        resolve(weather);


                    } catch (error) {

                        reject(error);
                    }

                },


                (error) => {

                    let message =
                        "Unable to detect your location.";


                    if (error.code === 1) {

                        message =
                            "Location permission was denied. Please allow location access.";

                    } else if (error.code === 2) {

                        message =
                            "Your location could not be determined.";

                    } else if (error.code === 3) {

                        message =
                            "Location request timed out. Please try again.";
                    }


                    reject(
                        new Error(message)
                    );
                },


                {
                    enableHighAccuracy: true,
                    timeout: 15000,
                    maximumAge: 0
                }
            );
        }
    );
}


// ==========================================
// FORMAT OPENWEATHER DATA
// ==========================================

function formatAPIWeather(data, displayName=""
) {

    if (!data) {
        return null;
    }


    const condition =
        data.weather[0].main.toLowerCase();


    let weatherType =
        "cloudy";

    let icon =
        "☁️";


    // --------------------------------------
    // WEATHER TYPE
    // --------------------------------------

    if (condition.includes("clear")) {

        weatherType =
            "sunny";

        icon =
            "☀️";

    }

    else if (
        condition.includes("rain") ||
        condition.includes("drizzle")
    ) {

        weatherType =
            "rain";

        icon =
            "🌧️";

    }

    else if (
        condition.includes("thunderstorm")
    ) {

        weatherType =
            "storm";

        icon =
            "⛈️";

    }

    else if (
        condition.includes("snow")
    ) {

        weatherType =
            "snow";

        icon =
            "❄️";

    }

    else if (
        condition.includes("mist") ||
        condition.includes("fog") ||
        condition.includes("haze")
    ) {

        weatherType =
            "cloudy";

        icon =
            "🌫️";
    }


    // --------------------------------------
    // RETURN FORMATTED DATA
    // --------------------------------------

   return {

    city: displayName || data.name,

    country: data.sys && data.sys.country ? data.sys.country : "",

    temperature:
        Math.round(data.main.temp),

    feelsLike:
        Math.round(data.main.feels_like),

    condition:
        data.weather && data.weather[0] ? data.weather[0].description : "",

    weatherType,

    humidity:
        data.main ? data.main.humidity : 0,

    windSpeed:
        data.wind ? Math.round(data.wind.speed * 3.6) : 0,

    visibility:
        typeof data.visibility === "number" ? Math.round(data.visibility / 1000) : "--",

    pressure:
        data.main ? data.main.pressure : "--",

    rainChance: 0,

    uvIndex: "--",

    icon,

    message:
        getWeatherMessage(weatherType)
};
}

// ==========================================
// WEATHER MESSAGE
// ==========================================

function getWeatherMessage(type) {

    const messages = {

        sunny:
            "It's a beautiful day! Perfect for outdoor activities.",

        cloudy:
            "The sky is cloudy. A pleasant day overall.",

        rain:
            "Rain is expected. Don't forget your umbrella!",

        storm:
            "Thunderstorms are possible. Stay indoors if necessary.",

        snow:
            "Cold weather with snowfall. Stay warm!"
    };


    return (
        messages[type] ||
        "Have a great day!"
    );
}


// ==========================================
// CAPITALIZE WEATHER DESCRIPTION
// ==========================================

function capitalizeWords(text) {

    if (!text) {
        return "";
    }


    return text
        .split(" ")
        .map(
            word =>
                word.charAt(0).toUpperCase() +
                word.slice(1)
        )
        .join(" ");
}
// ==========================================
// NORMALIZE LOCATION NAME
// ==========================================

function normalizeCityName(name) {

    const names = {

        "Razam": "Rajam",
        "razam": "Rajam",

        "Bheemunipatnam": "Bheemili",
        "bheemunipatnam": "Bheemili"
    };


    return names[name] || name;
}