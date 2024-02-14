"use strict";

const menuLinks = document.querySelectorAll(".nav__link");
const linkDaily = document.querySelector("a[data-timeframe='daily']");
const linkWeekly = document.querySelector("a[data-timeframe='weekly']");
const linkMonthly = document.querySelector("a[data-timeframe='monthly']");

const cardDisplay = document.querySelector(".card__display");

// Fetch data from json file
const getData = async () => {
    
    let response;
    
    try {
        response = await fetch("../data.json");
    } catch (error) {
        if (error instanceof SyntaxError) {
            console.log("There was a SyntaxError", error);
        } else {
            console.log("There was an error", error);
        }
    }

    if(response?.ok) {
        const data = await response.json();
    } else {
        console.log(`HTTP Response Code: ${response?.status}`);
    }

    return data;
}

// Display cards based on timeframe
const displayCardsByTimeframe = async (timeframe) => {

    let query = timeframe;

    const payload = await getData();

    // Map over data from json file
    let dataDisplay = payload.map((card) => {

        let title = card.title;
        let captures = {};
        let unit = "";

        if (query === "daily") {
            const { timeframes: { daily } } = card;
            captures = daily;
            unit = "day";
        } if (query === "weekly") {
            const { timeframes: { weekly } } = card;
            captures = weekly;
            unit = "week";
        } if (query === "monthly") {
            const { timeframes: { monthly } } = card;
            captures = monthly;
            unit = "month";
        }

        let cssClass = card.title.replace(/\s+/g, "-").toLowerCase();

        return `
            <div class="card__wrapper ${cssClass}">
                <div class="card__content">
                    <div class="card__header">
                        <h2 class="card__title">${title}</h2>
                        <a class="card__menu" href="#">
                            <svg class="card__menu-image" width="21" height="5" xmlns="http://www.w3.org/2000/svg">
                            <path 
                                d="M2.5 0a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Zm8 0a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Zm8 0a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Z"
                                fill="#BBC0FF"
                                fill-rule="evenodd"
                            />
                            </svg>
                        </a>
                    </div>
                    <div class="time__spend">
                        <span class="time__current">${captures.current}${(captures.current > 1) ? "hrs" : "hr"}</span>
                        <span class="time__previous">Last ${unit} - ${captures.previous}${(captures.previous > 1) ? "hrs" : "hr"}</span>
                    </div>
                </div>
            </div>
            `
    }).join("");

    cardDisplay.innerHTML = dataDisplay;

}

// Helper Function to remove all active classes from Nav Links
const removeActive = () => {
    menuLinks.forEach((link) => {
        link.classList.remove("active");
    });
};

// EventListener for Nav Links
linkDaily.addEventListener("click", () => {
    removeActive();
    linkDaily.classList.add("active");
    displayCardsByTimeframe("daily");
});
linkWeekly.addEventListener("click", () => {
    removeActive();
    linkWeekly.classList.add("active");
    displayCardsByTimeframe("weekly");
});
linkMonthly.addEventListener("click", () => {
    removeActive();
    linkMonthly.classList.add("active");
    displayCardsByTimeframe("monthly");
});