// Pirate Weather API Key
const API_KEY = "vaEoORd8XJMYYVcBYAB52yFRHVXUkgN2";
const LAT = "40.443556";
const LON = "-79.951500";

// DOM Elements
const statusText = document.getElementById("status-text");
const conditionText = document.getElementById("condition-text");
const tempText = document.getElementById("temp-text");
const dippyImage = document.getElementById("dippy-image");
const imageFrame = document.querySelector(".image-frame");

async function fetchWeather() {
    const url = `https://api.pirateweather.net/forecast/${API_KEY}/${LAT},${LON}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        updateUI(data.currently);
    } catch (error) {
        console.error("Error fetching weather:", error);
        statusText.innerText = "Dippy is Confused (API Error)";
        conditionText.innerText = "Unknown";
    }
}

function updateUI(current) {
    const temp = current.temperature;
    const precipType = current.precipType; // "rain", "snow", "sleet"
    const precipProb = current.precipProbability;

    // Update Temperature
    tempText.innerText = Math.round(temp);

    // Determine State
    let isSlippy = false;
    let message = "NO, DIPPY IS DRY";
    let condition = current.summary || "Clear";

    if (precipProb > 0.3 && precipType) {
        isSlippy = true;
        if (precipType === "snow") {
            message = "YES, IT'S SNOWING! DIPPY IS FROSTY!";
            dippyImage.src = "assets/dippy_snow.jpg";
            condition = "Snowing";
        } else if (precipType === "rain" || precipType === "sleet") {
            message = "YES, IT'S RAINING! DIPPY IS SLIPPY!";
            // We use the normal image but maybe we could add a rain class if we had a rain gif overlay
            // For now, let's stick to the normal image unless we find a rain one,
            // OR we can use the snow one for all precipitation if we lack a rain one?
            // No, rain usually means wet normal dippy.
            dippyImage.src = "assets/dippy_normal.jpg";
            imageFrame.classList.add("rain-overlay"); // We will add this class to CSS
            condition = "Raining";
        }
    } else {
        // Dry
        dippyImage.src = "assets/dippy_normal.jpg";
        imageFrame.classList.remove("rain-overlay");
    }

    // Update Text
    statusText.innerText = message;
    conditionText.innerText = condition;

    // Blink effect for slippy
    if (isSlippy) {
        statusText.style.animation = "blinker 0.5s linear infinite";
        statusText.style.color = "red";
    } else {
        statusText.style.animation = "none";
        statusText.style.color = "green";
    }
}

// Initial Fetch
fetchWeather();

// Refresh every 10 minutes
setInterval(fetchWeather, 600000);
