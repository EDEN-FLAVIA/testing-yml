/* =========================================================
   LEARNSPHERE
   COURSE DETAILS
   MEMBER 3
   ========================================================= */


/* =========================================================
   DOM ELEMENTS 
   ========================================================= */

const detailsStatus =
    document.getElementById("details-status");

const detailsContainer =
    document.getElementById("course-details");


/* =========================================================
   INITIALIZATION
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        setupNavigation();

        loadCourseDetails();

    }
);


/* =========================================================
   LOAD COURSE DETAILS
   ========================================================= */

async function loadCourseDetails() {

    /*
     * Make sure the required HTML elements exist.
     * This prevents the page from crashing if the HTML
     * structure is changed accidentally.
     */

    if (!detailsStatus || !detailsContainer) {

        console.error(
            "LearnSphere: Required course-details elements are missing."
        );

        return;
    }


    try {

        /*
         * Read the URL.
         *
         * Example:
         *
         * course-details.html?course=python
         */

        const params =
            new URLSearchParams(
                window.location.search
            );


        /*
         * Get the course ID.
         */

        const courseId =
            params.get("course");


        /*
         * If there is no course parameter,
         * show the professional error state.
         */

        if (!courseId) {

            showNotFound();

            return;
        }


        /*
         * Load the CENTRAL course database.
         */

        const response =
            await fetch(
                "data/courses.json",
                {
                    cache: "no-cache"
                }
            );


        /*
         * Check HTTP response.
         */

        if (!response.ok) {

            throw new Error(
                `Unable to load courses.json. HTTP status: ${response.status}`
            );
        }


        /*
         * Convert JSON response into JavaScript data.
         */

        const courses =
            await response.json();


        /*
         * Make sure courses.json contains an array.
         */

        if (!Array.isArray(courses)) {

            throw new Error(
                "courses.json must contain an array of courses."
            );
        }


        /*
         * Find the course using its EXACT ID.
         */

        const course =
            courses.find(
                item =>
                    item &&
                    String(item.id) === courseId
            );


        /*
         * Invalid course ID.
         */

        if (!course) {

            showNotFound();

            return;
        }


        /*
         * Render the selected course.
         */

        renderCourse(course);

    }

    catch (error) {

        console.error(
            "LearnSphere course details error:",
            error
        );

        showLoadError();

    }

}


/* =========================================================
   RENDER COURSE
   ========================================================= */

function renderCourse(course) {

    /*
     * Update browser tab title.
     */

    document.title =
        `${course.title} | LearnSphere`;


    /*
     * Hide loading message immediately.
     */

    hideStatus();


    /*
     * Normalize arrays so missing values never
     * cause JavaScript errors.
     */

    const learningItems =
        Array.isArray(course.whatYouWillLearn)
            ? course.whatYouWillLearn
            : [];


    const prerequisites =
        Array.isArray(course.prerequisites)
            ? course.prerequisites
            : course.prerequisites
                ? [course.prerequisites]
                : [];


    /*
     * Only keep resources that contain
     * the minimum required information.
     */

    const resources =
        Array.isArray(course.resources)
            ? course.resources.filter(
                resource =>
                    resource &&
                    resource.platform &&
                    resource.url
            )
            : [];


    /*
     * Create the learning resources HTML.
     */

    const resourcesHTML =
        resources.length > 0

            ? resources
                .map(
                    (resource, index) =>
                        createResourceCard(
                            resource,
                            index
                        )
                )
                .join("")

            : `
                <div class="not-found">
                    <div class="not-found-icon">
                        📚
                    </div>

                    <h2>
                        Learning resources unavailable
                    </h2>

                    <p>
                        No valid learning resources are currently
                        available for this course.
                    </p>
                </div>
            `;


    /*
     * Create What You'll Learn list.
     */

    const learningHTML =
        learningItems.length > 0

            ? learningItems
                .map(
                    item =>
                        `
                        <li>
                            ${escapeHTML(item)}
                        </li>
                        `
                )
                .join("")

            : `
                <li>
                    Course learning outcomes will be updated soon.
                </li>
            `;


    /*
     * Create prerequisites list.
     */

    const prerequisitesHTML =
        prerequisites.length > 0

            ? prerequisites
                .filter(Boolean)
                .map(
                    item =>
                        `
                        <li>
                            ${escapeHTML(item)}
                        </li>
                        `
                )
                .join("")

            : `
                <li>
                    No specific prerequisites required.
                </li>
            `;


    /*
     * Free status.
     */

    const freeBadge =
        course.free === true
            ? `
                <span class="details-badge free-badge">
                    FREE
                </span>
              `
            : `
                <span class="details-badge">
                    PAID / CHECK PLATFORM
                </span>
              `;


    /*
     * Primary Start Learning button.
     *
     * IMPORTANT:
     * The URL comes from courses.json.
     *
     * No external URL is hardcoded here.
     */

    const primaryLink =
        isSafeExternalURL(course.link)
            ? course.link
            : "";


    const primaryActionHTML =
        primaryLink

            ? `
                <div class="primary-course-action">

                    <a
                        href="${escapeAttribute(primaryLink)}"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="btn btn-primary"
                    >
                        Start Learning ↗
                    </a>

                    <span class="course-free-note">
                        Opens the selected learning platform in a new tab.
                    </span>

                </div>
              `

            : "";


    /*
     * Render complete course page.
     */

    detailsContainer.innerHTML = `

        <!-- =================================================
             COURSE HERO
             ================================================= -->

        <section class="details-hero">

            <div class="details-badges">

                <span class="details-badge">
                    ${escapeHTML(course.category)}
                </span>

                <span class="details-badge">
                    ${escapeHTML(course.difficulty)}
                </span>

                ${freeBadge}

            </div>


            <h1>
                ${escapeHTML(course.title)}
            </h1>


            <p class="details-description">
                ${escapeHTML(course.description)}
            </p>


            <div class="details-meta">

                <div class="meta-item">

                    <small>
                        Category
                    </small>

                    <strong>
                        ${escapeHTML(course.category)}
                    </strong>

                </div>


                <div class="meta-item">

                    <small>
                        Difficulty
                    </small>

                    <strong>
                        ${escapeHTML(course.difficulty)}
                    </strong>

                </div>


                <div class="meta-item">

                    <small>
                        Duration
                    </small>

                    <strong>
                        ${escapeHTML(course.duration)}
                    </strong>

                </div>


                <div class="meta-item">

                    <small>
                        Platform
                    </small>

                    <strong>
                        ${escapeHTML(course.platform)}
                    </strong>

                </div>

            </div>


            ${primaryActionHTML}

        </section>


        <!-- =================================================
             COURSE INFORMATION
             ================================================= -->

        <section class="details-section">

            <div class="section-heading">

                <span class="section-eyebrow">
                    COURSE INFORMATION
                </span>

                <h2>
                    About This Course
                </h2>

            </div>


            <div class="details-meta">

                <div class="meta-item">

                    <small>
                        Instructor
                    </small>

                    <strong>
                        ${escapeHTML(course.instructor)}
                    </strong>

                </div>


                <div class="meta-item">

                    <small>
                        Free Status
                    </small>

                    <strong>
                        ${
                            course.free === true
                                ? "Free"
                                : "Check Platform"
                        }
                    </strong>

                </div>


                <div class="meta-item">

                    <small>
                        Learning Options
                    </small>

                    <strong>
                        ${resources.length}
                        resource${resources.length === 1 ? "" : "s"}
                    </strong>

                </div>


                <div class="meta-item">

                    <small>
                        Course ID
                    </small>

                    <strong>
                        ${escapeHTML(course.id)}
                    </strong>

                </div>

            </div>

        </section>


        <!-- =================================================
             WHAT YOU WILL LEARN
             ================================================= -->

        <section class="details-section">

            <div class="section-heading">

                <span class="section-eyebrow">
                    LEARNING OUTCOMES
                </span>

                <h2>
                    What You'll Learn
                </h2>

            </div>


            <ul class="details-list">

                ${learningHTML}

            </ul>

        </section>


        <!-- =================================================
             LEARNING RESOURCES
             ================================================= -->

        <section class="details-section learning-options">

            <div class="section-heading">

                <span class="section-eyebrow">
                    YOUR CHOICE
                </span>

                <h2>
                    Choose How You Want to Learn
                </h2>

                <p>
                    Explore this course through multiple learning
                    resources and choose the platform that suits
                    your learning style.
                </p>

            </div>


            <div class="resources-grid">

                ${resourcesHTML}

            </div>

        </section>


        <!-- =================================================
             PREREQUISITES
             ================================================= -->

        <section class="details-section">

            <div class="section-heading">

                <span class="section-eyebrow">
                    BEFORE YOU START
                </span>

                <h2>
                    Prerequisites
                </h2>

            </div>


            <ul class="details-list">

                ${prerequisitesHTML}

            </ul>

        </section>


        <!-- =================================================
             BACK TO COURSES
             ================================================= -->

        <div class="details-actions">

            <a
                href="courses.html"
                class="details-button"
            >
                ← Back to Courses
            </a>

        </div>

    `;


    /*
     * Make the content visible.
     */

    detailsContainer.hidden = false;

}


/* =========================================================
   RESOURCE CARD
   ========================================================= */

function createResourceCard(
    resource,
    index
) {

    const type =
        String(
            resource.type || ""
        ).toLowerCase();


    const buttonText =
        getButtonText(type);


    const icon =
        getResourceIcon(type);


    const safeURL =
        isSafeExternalURL(resource.url)
            ? resource.url
            : "";


    /*
     * Do not render an unsafe/invalid URL.
     */

    if (!safeURL) {

        return `
            <article class="resource-card">

                <div
                    class="resource-icon"
                    aria-hidden="true"
                >
                    ⚠
                </div>

                <div class="resource-content">

                    <span class="resource-type">
                        Resource ${index + 1}
                    </span>

                    <h3>
                        ${escapeHTML(resource.platform)}
                    </h3>

                    <p>
                        This learning resource does not contain
                        a valid external URL.
                    </p>

                </div>

            </article>
        `;
    }


    return `

        <article class="resource-card">

            <div
                class="resource-icon"
                aria-hidden="true"
            >
                ${icon}
            </div>


            <div class="resource-content">

                <span class="resource-type">
                    ${escapeHTML(
                        resource.type || "Learning Resource"
                    )}
                </span>


                <h3>
                    ${escapeHTML(
                        resource.platform
                    )}
                </h3>


                <p>
                    ${escapeHTML(
                        resource.description ||
                        "Explore this learning resource."
                    )}
                </p>

            </div>


            <a
                href="${escapeAttribute(safeURL)}"
                target="_blank"
                rel="noopener noreferrer"
                class="resource-button"
            >
                ${buttonText}
            </a>

        </article>

    `;

}


/* =========================================================
   BUTTON TEXT
   ========================================================= */

function getButtonText(type) {

    if (type.includes("video")) {
        return "Watch Course ↗";
    }


    if (
        type.includes("documentation") ||
        type.includes("docs")
    ) {
        return "Read Docs ↗";
    }


    if (
        type.includes("interactive") ||
        type.includes("course")
    ) {
        return "Start Learning ↗";
    }


    if (
        type.includes("hands-on") ||
        type.includes("project")
    ) {
        return "Start Course ↗";
    }


    if (type.includes("tutorial")) {
        return "Open Tutorial ↗";
    }


    return "Explore Resource ↗";

}


/* =========================================================
   RESOURCE ICON
   ========================================================= */

function getResourceIcon(type) {

    if (type.includes("video")) {
        return "▶";
    }


    if (
        type.includes("documentation") ||
        type.includes("docs")
    ) {
        return "📖";
    }


    if (type.includes("interactive")) {
        return "⚡";
    }


    if (type.includes("hands-on")) {
        return "⌨";
    }


    if (
        type.includes("project")
    ) {
        return "🛠";
    }


    if (type.includes("tutorial")) {
        return "📚";
    }


    return "↗";

}


/* =========================================================
   INVALID COURSE
   ========================================================= */

function showNotFound() {

    hideStatus();


    if (!detailsContainer) {
        return;
    }


    detailsContainer.hidden = false;


    detailsContainer.innerHTML = `

        <div class="not-found">

            <div
                class="not-found-icon"
                aria-hidden="true"
            >
                🔍
            </div>


            <h1>
                Course Not Found
            </h1>


            <p>
                The course you're looking for could not be
                found in the LearnSphere catalogue.
                Please check the course link and try again.
            </p>


            <div class="details-actions">

                <a
                    href="courses.html"
                    class="details-button"
                >
                    ← Back to Courses
                </a>

            </div>

        </div>

    `;

}


/* =========================================================
   DATA LOADING ERROR
   ========================================================= */

function showLoadError() {

    hideStatus();


    if (!detailsContainer) {
        return;
    }


    detailsContainer.hidden = false;


    detailsContainer.innerHTML = `

        <div class="not-found">

            <div
                class="not-found-icon"
                aria-hidden="true"
            >
                ⚠️
            </div>


            <h1>
                Unable to Load Course
            </h1>


            <p>
                We couldn't load the course information right now.
                Please make sure LearnSphere is running through
                VS Code Live Server and that
                <strong>data/courses.json</strong>
                exists in the correct location.
            </p>


            <div class="details-actions">

                <a
                    href="courses.html"
                    class="details-button"
                >
                    ← Back to Courses
                </a>

            </div>

        </div>

    `;

}


/* =========================================================
   HIDE LOADING STATUS
   ========================================================= */

function hideStatus() {

    if (!detailsStatus) {
        return;
    }


    detailsStatus.textContent = "";

    detailsStatus.hidden = true;

}


/* =========================================================
   NAVIGATION
   ========================================================= */

function setupNavigation() {

    const toggle =
        document.querySelector(
            ".menu-toggle"
        );


    const links =
        document.querySelector(
            ".nav-links"
        );


    if (!toggle || !links) {
        return;
    }


    toggle.addEventListener(
        "click",
        () => {

            const isOpen =
                links.classList.toggle("open");


            toggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

        }
    );


    /*
     * Close mobile navigation after
     * clicking a navigation link.
     */

    links
        .querySelectorAll("a")
        .forEach(
            link => {

                link.addEventListener(
                    "click",
                    () => {

                        links.classList.remove(
                            "open"
                        );

                        toggle.setAttribute(
                            "aria-expanded",
                            "false"
                        );

                    }
                );

            }
        );

}


/* =========================================================
   URL VALIDATION
   ========================================================= */

function isSafeExternalURL(value) {

    if (!value) {
        return false;
    }


    try {

        const url =
            new URL(value);


        /*
         * Only HTTPS external resources
         * are allowed.
         */

        return (
            url.protocol === "https:" &&
            (
                url.hostname !==
                window.location.hostname ||
                url.origin !==
                window.location.origin
            )
        );

    }

    catch (error) {

        return false;

    }

}


/* =========================================================
   HTML ESCAPING
   ========================================================= */

function escapeHTML(value) {

    return String(
        value ?? ""
    )
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        )
        .replaceAll(
            '"',
            "&quot;"
        )
        .replaceAll(
            "'",
            "&#039;"
        );

}


/* =========================================================
   ATTRIBUTE ESCAPING
   ========================================================= */

function escapeAttribute(value) {

    return escapeHTML(value);

}