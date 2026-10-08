// ==========================================
// UPDATE CURRENT WEATHER
// ==========================================

function updateWeatherUI(weather) {

    if (!weather) {
        showError();
        return;
    }

    const setElText = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.textContent = val;
    };

    setElText("locationName", weather.country ? `${weather.city}, ${weather.country}` : weather.city);
    setElText("temperature", weather.temperature);
    setElText("feelsLike", weather.feelsLike);
    setElText("weatherCondition", capitalize(weather.condition));
    setElText("weatherIcon", weather.icon);
    setElText("humidity", weather.humidity);
    setElText("windSpeed", weather.windSpeed);
    setElText("rainChance", weather.rainChance);
    setElText("visibility", weather.visibility);
    setElText("pressure", weather.pressure);
    setElText("uvIndex", weather.uvIndex);

    const msgSpan = document.querySelector(".weather-message span");
    if (msgSpan) {
        msgSpan.textContent = weather.message;
    }
}


// ==========================================
// UPDATE DATE
// ==========================================

function updateDate() {

    const date = new Date();

    const options = {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric"
    };

    const dateEl = document.getElementById("currentDate");
    if (dateEl) {
        dateEl.textContent =
            date.toLocaleDateString(
                "en-IN",
                options
            );
    }
}


// ==========================================
// CAPITALIZE
// ==========================================

function capitalize(text) {

    if (!text) return "";

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
// ERROR
// ==========================================

function showError() {

    const input =
        document.getElementById("cityInput");

    if (input) {
        input.value = "";

        input.placeholder =
            "City not found. Try again...";
    }
}