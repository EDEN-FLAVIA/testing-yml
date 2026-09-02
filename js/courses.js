// ========================================
// LearnSphere - Courses Page
// Member 2
// ========================================


// ---------- DOM ELEMENTS ----------

const courseGrid = document.getElementById("courseGrid");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const difficultyFilter = document.getElementById("difficultyFilter");

const noResults = document.getElementById("noResults");
const resultsCount = document.getElementById("resultsCount");
const loadingMessage = document.getElementById("loadingMessage");
const resetFiltersButton = document.getElementById("resetFilters");


// ---------- COURSE DATA ----------

let courses = [];


// ========================================
// LOAD COURSES FROM JSON
// ========================================

async function loadCourses() {

    try {

        const response = await fetch("data/courses.json");

        // Check whether the file was loaded successfully
        if (!response.ok) {
            throw new Error(
                `Failed to load courses. Status: ${response.status}`
            );
        }


        // Convert JSON response into JavaScript data
        courses = await response.json();


        // Hide loading message
        loadingMessage.style.display = "none";


        // Display all courses initially
        filterCourses();

    } catch (error) {

        console.error("Error loading courses:", error);

        loadingMessage.textContent =
            "Unable to load courses. Please try again later.";

        resultsCount.textContent = "";

    }

}


// ========================================
// FILTER COURSES
// Search + Category + Difficulty
// ========================================

function filterCourses() {

    const searchTerm =
        searchInput.value
            .trim()
            .toLowerCase();

    const selectedCategory =
        categoryFilter.value;

    const selectedDifficulty =
        difficultyFilter.value;


    const filteredCourses = courses.filter(course => {

        // --------------------------------
        // SEARCH CHECK
        // --------------------------------

        const searchableText = [
            course.title,
            course.category,
            course.platform,
            course.description
        ]
            .join(" ")
            .toLowerCase();


        const matchesSearch =
            searchableText.includes(searchTerm);


        // --------------------------------
        // CATEGORY CHECK
        // --------------------------------

        const matchesCategory =
            selectedCategory === "All" ||
            course.category === selectedCategory;


        // --------------------------------
        // DIFFICULTY CHECK
        // --------------------------------

        const matchesDifficulty =
            selectedDifficulty === "All" ||
            course.difficulty === selectedDifficulty;


        // --------------------------------
        // ALL CONDITIONS MUST MATCH
        // --------------------------------

        return (
            matchesSearch &&
            matchesCategory &&
            matchesDifficulty
        );

    });


    renderCourses(filteredCourses);

}


// ========================================
// RENDER COURSE CARDS
// ========================================

function renderCourses(courseList) {

    // Clear old cards
    courseGrid.innerHTML = "";


    // No courses found
    if (courseList.length === 0) {

        courseGrid.style.display = "none";

        noResults.hidden = false;

        resultsCount.textContent =
            "0 courses found.";

        return;

    }


    // Show course grid
    courseGrid.style.display = "grid";

    noResults.hidden = true;


    // Results count
    resultsCount.textContent =
        `${courseList.length} course${courseList.length !== 1 ? "s" : ""} found.`;


    // Create a card for every course
    courseList.forEach(course => {

        const courseCard =
            document.createElement("article");

        courseCard.className =
            "course-card";


        // Navigation URL uses the exact ID
        const courseURL =
            `course-details.html?course=${encodeURIComponent(course.id)}`;


        courseCard.innerHTML = `

            <div class="course-card-top">

                <div class="course-icon">
                    ${getCourseIcon(course.category)}
                </div>

                <span class="difficulty-badge">
                    ${escapeHTML(course.difficulty)}
                </span>

            </div>


            <h2 class="course-title">
                ${escapeHTML(course.title)}
            </h2>


            <p class="course-category">
                ${escapeHTML(course.category)}
            </p>


            <p class="course-description">
                ${escapeHTML(course.description)}
            </p>


            <div class="course-meta">

                <div class="meta-item">
                    <span class="meta-icon">◷</span>
                    <span>
                        ${escapeHTML(course.duration)}
                    </span>
                </div>


                <div class="meta-item">
                    <span class="meta-icon">◉</span>
                    <span>
                        ${escapeHTML(course.platform)}
                    </span>
                </div>


                <div class="meta-item">
                    <span class="meta-icon">▣</span>
                    <span>
                        ${escapeHTML(course.difficulty)}
                    </span>
                </div>

            </div>


            <a
                href="${courseURL}"
                class="view-course-btn">

                View Course →

            </a>

        `;


        courseGrid.appendChild(courseCard);

    });

}


// ========================================
// COURSE CATEGORY ICON
// This does NOT duplicate course data.
// It only provides a visual icon.
// ========================================

function getCourseIcon(category) {

    const icons = {

        "Programming": "⌘",
        "Web Development": "◈",
        "Data Science": "▦",
        "Artificial Intelligence": "✦",
        "Database": "▤",
        "Developer Tools": "⚙",
        "Cybersecurity": "◉"

    };


    return icons[category] || "◌";

}


// ========================================
// ESCAPE HTML
// Helps safely display JSON text
// ========================================

function escapeHTML(value) {

    const text =
        String(value ?? "");


    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// ========================================
// EVENT LISTENERS
// ========================================


// Dynamic case-insensitive search
searchInput.addEventListener(
    "input",
    filterCourses
);


// Category filtering
categoryFilter.addEventListener(
    "change",
    filterCourses
);


// Difficulty filtering
difficultyFilter.addEventListener(
    "change",
    filterCourses
);


// Reset all filters
resetFiltersButton.addEventListener(
    "click",
    () => {

        searchInput.value = "";

        categoryFilter.value = "All";

        difficultyFilter.value = "All";

        filterCourses();

    }
);


// ========================================
// LOAD DATA WHEN PAGE STARTS
// ========================================

loadCourses();