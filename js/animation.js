// ==========================================
// CHANGE WEATHER THEME
// ==========================================
// ==========================================
// WEATHER ANIMATIONS
// ==========================================

function updateWeatherAnimation(weatherType) {

    console.log(
        "Updating weather animation:",
        weatherType
    );

    // Remove previous weather classes
    document.body.classList.remove(
        "weather-sunny",
        "weather-rain",
        "weather-cloudy",
        "weather-storm",
        "weather-night",
        "weather-snow"
    );


    // Add new weather class
    switch (weatherType) {

        case "sunny":

            document.body.classList.add(
                "weather-sunny"
            );

            break;


        case "rain":

            document.body.classList.add(
                "weather-rain"
            );

            break;


        case "storm":

            document.body.classList.add(
                "weather-storm"
            );

            break;


        case "snow":

            document.body.classList.add(
                "weather-snow"
            );

            break;


        case "cloudy":

            document.body.classList.add(
                "weather-cloudy"
            );

            break;


        case "night":

            document.body.classList.add(
                "weather-night"
            );

            break;


        default:

            document.body.classList.add(
                "weather-cloudy"
            );

            break;
    }

    createWeatherParticles(weatherType);
}


// ==========================================
// WEATHER PARTICLES
// ==========================================

function createWeatherParticles(type) {

    const container =
        document.getElementById(
            "backgroundAnimation"
        );

    if (!container) {
        return;
    }

    container.innerHTML = "";

    if (type === "rain") {

        createRain(container);

    } else if (type === "snow") {

        createSnow(container);

    } else if (type === "cloudy") {

        createClouds(container);

    } else if (type === "storm") {

        createRain(container);
        createLightning(container);
    }
}


// ==========================================
// RAIN
// ==========================================

function createRain(container) {

    for (let i = 0; i < 60; i++) {

        const drop =
            document.createElement("div");

        drop.style.position = "absolute";

        drop.style.left =
            Math.random() * 100 + "%";

        drop.style.top =
            Math.random() * -100 + "px";

        drop.style.width = "2px";
        drop.style.height = "25px";

        drop.style.background =
            "rgba(255,255,255,0.5)";

        drop.style.animation =
            `rainFall ${0.5 + Math.random()}s linear infinite`;

        drop.style.animationDelay =
            Math.random() * 2 + "s";

        container.appendChild(drop);
    }
}


// ==========================================
// SNOW
// ==========================================

function createSnow(container) {

    for (let i = 0; i < 40; i++) {

        const snow =
            document.createElement("div");

        snow.textContent = "❄";

        snow.style.position = "absolute";

        snow.style.left =
            Math.random() * 100 + "%";

        snow.style.top = "-30px";

        snow.style.fontSize =
            Math.random() * 15 + 10 + "px";

        snow.style.opacity =
            Math.random();

        snow.style.animation =
            `rainFall ${3 + Math.random() * 5}s linear infinite`;

        snow.style.animationDelay =
            Math.random() * 5 + "s";

        container.appendChild(snow);
    }
}


// ==========================================
// CLOUDS
// ==========================================

function createClouds(container) {

    for (let i = 0; i < 5; i++) {

        const cloud =
            document.createElement("div");

        cloud.textContent = "☁️";

        cloud.style.position = "absolute";

        cloud.style.left =
            Math.random() * 100 + "%";

        cloud.style.top =
            Math.random() * 60 + "%";

        cloud.style.fontSize =
            Math.random() * 40 + 40 + "px";

        cloud.style.opacity = "0.25";

        cloud.style.animation =
            `cloudMove ${8 + Math.random() * 8}s ease-in-out infinite`;

        container.appendChild(cloud);
    }
}


// ==========================================
// LIGHTNING
// ==========================================

function createLightning(container) {

    const lightning =
        document.createElement("div");

    lightning.textContent = "⚡";

    lightning.style.position =
        "absolute";

    lightning.style.left = "50%";
    lightning.style.top = "20%";

    lightning.style.fontSize = "100px";

    lightning.style.animation =
        "lightning 4s infinite";

    container.appendChild(lightning);
}
