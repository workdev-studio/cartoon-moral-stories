// ==========================================
// Cartoon Moral Stories - Main JavaScript
// ==========================================

let allStories = [];
let currentPage = 1;

const storiesPerPage = 12;


// ==========================================
// Load Stories From JSON
// ==========================================

async function loadStories() {

    const storyContainer = document.getElementById("story-container");

    if (!storyContainer) {
        return;
    }

    try {

        const response = await fetch("stories.json");

        if (!response.ok) {
            throw new Error("Unable to load stories.json");
        }

        allStories = await response.json();

        renderStories();

    } catch (error) {

        console.error("Story loading error:", error);

        storyContainer.innerHTML = `
            <div class="col-span-full rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
                <h3 class="text-lg font-bold text-red-700">
                    Stories load nahi ho paayi.
                </h3>

                <p class="mt-2 text-sm text-red-600">
                    Please try again later.
                </p>
            </div>
        `;

    }

}


// ==========================================
// Render Stories
// ==========================================

function renderStories() {

    const storyContainer = document.getElementById("story-container");

    if (!storyContainer) {
        return;
    }


    // Calculate pagination

    const startIndex =
        (currentPage - 1) * storiesPerPage;

    const endIndex =
        startIndex + storiesPerPage;


    const pageStories =
        allStories.slice(startIndex, endIndex);


    // Clear old cards

    storyContainer.innerHTML = "";


    // No stories

    if (pageStories.length === 0) {

        storyContainer.innerHTML = `
            <div class="col-span-full py-12 text-center">
                <div class="text-5xl">📚</div>

                <h3 class="mt-4 text-xl font-bold text-slate-800">
                    No stories found
                </h3>
            </div>
        `;

        return;
    }


    // Create story cards

    pageStories.forEach(function (story) {

        const card = document.createElement("article");

        card.className =
            "group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl";


        card.innerHTML = `

            <div class="flex h-48 items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-100 text-8xl">

                ${story.emoji || "📖"}

            </div>


            <div class="p-6">

                <span class="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">

                    ${escapeHTML(story.category)}

                </span>


                <h3 class="mt-4 text-xl font-bold text-slate-900">

                    ${escapeHTML(story.title)}

                </h3>


                <p class="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">

                    ${escapeHTML(story.description)}

                </p>


                <a
                    href="story.html?id=${story.id}"
                    class="mt-5 inline-flex font-bold text-indigo-600 hover:text-indigo-800"
                >

                    Read Story →

                </a>

            </div>

        `;


        storyContainer.appendChild(card);

    });


    renderPagination();

}


// ==========================================
// Pagination
// ==========================================

function renderPagination() {

    const existingPagination =
        document.getElementById("pagination");


    // If pagination container doesn't exist,
    // create it automatically.

    let pagination = existingPagination;


    if (!pagination) {

        pagination = document.createElement("nav");

        pagination.id = "pagination";

        pagination.setAttribute(
            "aria-label",
            "Story pagination"
        );

        pagination.className =
            "mt-12 flex flex-wrap items-center justify-center gap-2";


        const storyContainer =
            document.getElementById("story-container");


        if (storyContainer) {

            storyContainer.parentNode.appendChild(
                pagination
            );

        }

    }


    pagination.innerHTML = "";


    const totalPages =
        Math.ceil(
            allStories.length / storiesPerPage
        );


    if (totalPages <= 1) {
        return;
    }


    // Previous button

    if (currentPage > 1) {

        const previousButton =
            createPaginationButton(
                "← Previous",
                function () {

                    currentPage--;

                    renderStories();

                    scrollToStories();

                }
            );

        pagination.appendChild(
            previousButton
        );

    }


    // Page numbers

    for (
        let page = 1;
        page <= totalPages;
        page++
    ) {

        const pageButton =
            createPaginationButton(
                page,
                function () {

                    currentPage = page;

                    renderStories();

                    scrollToStories();

                }
            );


        if (page === currentPage) {

            pageButton.className =
                "rounded-lg bg-indigo-600 px-4 py-2 font-bold text-white";

        }


        pagination.appendChild(
            pageButton
        );

    }


    // Next button

    if (currentPage < totalPages) {

        const nextButton =
            createPaginationButton(
                "Next →",
                function () {

                    currentPage++;

                    renderStories();

                    scrollToStories();

                }
            );


        pagination.appendChild(
            nextButton
        );

    }

}


// ==========================================
// Create Pagination Button
// ==========================================

function createPaginationButton(
    text,
    clickFunction
) {

    const button =
        document.createElement("button");


    button.type = "button";

    button.textContent = text;


    button.className =
        "rounded-lg border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50";


    button.addEventListener(
        "click",
        clickFunction
    );


    return button;

}


// ==========================================
// Scroll To Stories
// ==========================================

function scrollToStories() {

    const section =
        document.getElementById(
            "latest-stories"
        );


    if (section) {

        section.scrollIntoView({
            behavior: "smooth"
        });

    }

}


// ==========================================
// Basic HTML Escape
// ==========================================

function escapeHTML(value) {

    if (value === null || value === undefined) {
        return "";
    }


    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// ==========================================
// Start Application
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadStories();

    }
);
