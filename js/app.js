// ==========================================
// APP.JS
// MAIN APPLICATION
// ==========================================


// ==========================================
// START APPLICATION
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadComponents();

    }
);


// ==========================================
// LOAD COMPONENTS
// ==========================================

async function loadComponents() {

    const components = {

        header:
            "components/header.html",

        search:
            "components/search.html",

        "current-weather":
            "components/current-weather.html",

        "weather-details":
            "components/weather-details.html",

    };

    const containerIds = Object.keys(components);
    const hasContainers = containerIds.some(id => document.getElementById(id));

    // If components are already present in index.html, initialize directly
    if (!hasContainers) {
        initializeApp();
        return;
    }

    try {

        for (
            const [id, file]
            of Object.entries(components)
        ) {

            const container =
                document.getElementById(id);


            if (!container) {
                continue;
            }


            const response =
                await fetch(file);


            if (!response.ok) {

                throw new Error(
                    `Unable to load ${file}`
                );
            }


            container.innerHTML =
                await response.text();
        }


        console.log(
            "All components loaded successfully."
        );


        initializeApp();


    } catch (error) {

        console.error(
            "Error loading components:",
            error
        );

        initializeApp();
    }
}


// ==========================================
// INITIALIZE APPLICATION
// ==========================================

function initializeApp() {

    updateDate();

    loadDefaultWeather();

    setupSearch();

    setupLocation();

    setupTheme();
}


// ==========================================
// DATE
// ==========================================

function updateDate() {

    const dateElement =
        document.getElementById(
            "currentDate"
        );


    if (!dateElement) {
        return;
    }


    const today =
        new Date();


    dateElement.textContent =
        today.toLocaleDateString(
            "en-IN",
            {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric"
            }
        );
}


// ==========================================
// DEFAULT WEATHER
// ==========================================
// ==========================================
// DEFAULT WEATHER
// ==========================================

async function loadDefaultWeather() {

    try {

        // Visakhapatnam coordinates
        const latitude = 17.6868;
        const longitude = 83.2185;


        console.log(
            "Loading default weather: Visakhapatnam"
        );


        // Get weather directly using coordinates
        const data =
            await getWeatherByCoordinates(
                latitude,
                longitude
            );


        if (!data) {

            console.error(
                "Unable to load Visakhapatnam weather."
            );

            return;
        }


        console.log(
            "Default weather:",
            data
        );


        // Format API data
        const weather =
            formatAPIWeather(data);


        // Update website
        updateWeatherUI(
            weather
        );


        // Update background
        updateWeatherAnimation(
            weather.weatherType
        );


    } catch (error) {

        console.error(
            "Default weather error:",
            error
        );
    }
}
// ==========================================
// SEARCH SETUP
// ==========================================

function setupSearch() {

    const searchBtn =
        document.getElementById(
            "searchBtn"
        );


    const cityInput =
        document.getElementById(
            "cityInput"
        );


    if (!searchBtn || !cityInput) {

        console.error(
            "Search elements not found."
        );

        return;
    }


    // --------------------------------------
    // Search button
    // --------------------------------------

    searchBtn.addEventListener(
        "click",
        searchWeather
    );


    // --------------------------------------
    // Enter key
    // --------------------------------------

    cityInput.addEventListener(
        "keydown",
        event => {

            if (event.key === "Enter") {

                event.preventDefault();

                searchWeather();
            }
        }
    );
}


// ==========================================
// SEARCH WEATHER
// ==========================================

// ==========================================
// SEARCH WEATHER
// ==========================================

async function searchWeather() {

    try {

        const cityInput =
            document.getElementById("cityInput");

        const searchName =
            cityInput.value.trim();


        if (!searchName) {

            alert("Please enter a location.");

            return;
        }


        console.log(
            "Searching location name..."
        );

        console.log(
            "Searching location:",
            searchName
        );


        // Get weather from API (supports 6-digit PIN or city/town name)
        const isPin = /^\d{6}$/.test(searchName);
        const data = isPin
            ? await getWeatherByPIN(searchName)
            : await getWeather(searchName);


        console.log(
            "Weather received:",
            data
        );


        if (!data) {

            showSearchError(
                "Location not found. Try another spelling."
            );

            return;
        }


        // IMPORTANT:
        // Display the name entered by the user, or resolved location for PIN
        const displayName = isPin ? data.name : searchName;
        const weather =
            formatAPIWeather(
                data,
                displayName
            );


        console.log(
            "Formatted weather:",
            weather
        );


        // Update website
        updateWeatherUI(
            weather
        );


        // Update weather background
        updateWeatherAnimation(
            weather.weatherType
        );


        // Clear error
        clearSearchError();


    } catch (error) {

        console.error(
            "Search error:",
            error
        );

        showSearchError(
            "Unable to find this location."
        );
    }
}

// ==========================================
// USE MY LOCATION
// ==========================================

function setupLocation() {

    const locationBtn =
        document.getElementById(
            "locationBtn"
        );


    if (!locationBtn) {

        console.error(
            "Location button not found."
        );

        return;
    }


    locationBtn.addEventListener(
        "click",
        useCurrentLocation
    );
}


// ==========================================
// GET CURRENT LOCATION WEATHER
// ==========================================

async function useCurrentLocation() {

    const locationBtn =
        document.getElementById(
            "locationBtn"
        );


    try {

        // --------------------------------------
        // Loading
        // --------------------------------------

        locationBtn.disabled = true;


        locationBtn.innerHTML =
            '<i class="fa-solid fa-spinner fa-spin"></i> Detecting...';


        clearSearchError();


        // --------------------------------------
        // Get weather
        // --------------------------------------

        const data =
            await getWeatherByCurrentLocation();


        if (!data) {

            throw new Error(
                "Unable to get weather"
            );
        }


        console.log(
            "Current location weather:",
            data
        );


        // --------------------------------------
        // Format
        // --------------------------------------

        const weather =
            formatAPIWeather(
                data
            );


        // --------------------------------------
        // Update UI
        // --------------------------------------

        updateWeatherUI(
            weather
        );


        updateWeatherAnimation(
            weather.weatherType
        );


        // --------------------------------------
        // Update search box
        // --------------------------------------

        const cityInput =
            document.getElementById(
                "cityInput"
            );


        if (cityInput) {

            cityInput.value =
                weather.city;
        }


    } catch (error) {

        console.error(
            "Location error:",
            error
        );


        showSearchError(
            error.message ||
            "Unable to detect your location."
        );


    } finally {

        locationBtn.disabled =
            false;


        locationBtn.innerHTML =
            '<i class="fa-solid fa-location-crosshairs"></i> <span>Use My Location</span>';
    }
}


// ==========================================
// DARK MODE
// ==========================================

function setupTheme() {

    const themeBtn =
        document.getElementById(
            "themeBtn"
        );


    if (!themeBtn) {

        console.error(
            "Theme button not found."
        );

        return;
    }


    themeBtn.addEventListener(
        "click",
        () => {

            document.body.classList.toggle(
                "dark-mode"
            );


            const icon =
                themeBtn.querySelector(
                    "i"
                );


            if (
                document.body.classList.contains(
                    "dark-mode"
                )
            ) {

                icon.className =
                    "fa-solid fa-sun";

            } else {

                icon.className =
                    "fa-solid fa-moon";
            }


            console.log(
                "Dark mode:",
                document.body.classList.contains(
                    "dark-mode"
                )
            );
        }
    );
}


// ==========================================
// SEARCH ERROR
// ==========================================

function showSearchError(message) {

    const errorElement =
        document.getElementById(
            "searchError"
        );


    if (errorElement) {

        errorElement.textContent =
            message;

        errorElement.style.display =
            "block";
    }
}


// ==========================================
// CLEAR SEARCH ERROR
// ==========================================

function clearSearchError() {

    const errorElement =
        document.getElementById(
            "searchError"
        );


    if (errorElement) {

        errorElement.textContent =
            "";

        errorElement.style.display =
            "none";
    }
}