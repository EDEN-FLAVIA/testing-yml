/* ============================================================
   LEARNSPHERE - LEARNBOT
   Member 4
   Frontend-only chatbot
   Vanilla JavaScript
   No API
   No backend
   No API key
   ============================================================ */

(function () {

    "use strict";


    /* =========================================================
       CONFIGURATION
    ========================================================== */

    const COURSE_DATA_PATH = "data/courses.json";

    const STORAGE_KEY = "learnsphere_learnbot_history";


    /* =========================================================
       STATE
    ========================================================== */

    let courses = [];

    let coursesLoaded = false;

    let isTyping = false;


    /* =========================================================
       DOM REFERENCES
    ========================================================== */

    let launcher = null;

    let chatbotWindow = null;

    let messagesContainer = null;

    let input = null;

    let sendButton = null;

    let typingIndicator = null;

    let clearButton = null;

    let closeButton = null;


    /* =========================================================
       INITIALISE
    ========================================================== */

    document.addEventListener(
        "DOMContentLoaded",
        initialiseLearnBot
    );


    function initialiseLearnBot() {

        try {

            createLearnBot();

            cacheElements();

            bindEvents();

            loadChatHistory();

            loadCourses();

        } catch (error) {

            /*
             * LearnBot must never crash the website.
             */
            console.error(
                "LearnBot initialisation error:",
                error
            );

        }

    }


    /* =========================================================
       CREATE CHATBOT UI
    ========================================================== */

    function createLearnBot() {

        if (document.getElementById("learnbot-root")) {
            return;
        }


        const root = document.createElement("div");

        root.id = "learnbot-root";


        root.innerHTML = `

            <!-- Floating button -->

            <button
                type="button"
                class="ls-chatbot-launcher"
                id="learnbotLauncher"
                aria-label="Open LearnBot"
                aria-expanded="false"
                aria-controls="learnbotWindow"
            >

                <span class="ls-bot-open-icon">✦</span>

                <span class="ls-bot-close-icon">×</span>

            </button>


            <!-- Chat window -->

            <section
                class="ls-chatbot-window"
                id="learnbotWindow"
                aria-label="LearnBot chatbot"
                aria-hidden="true"
            >

                <!-- Header -->

                <header class="ls-chatbot-header">

                    <div class="ls-chatbot-brand">

                        <div class="ls-chatbot-avatar">
                            ✦
                        </div>

                        <div>

                            <p class="ls-chatbot-title">
                                LearnBot
                            </p>

                            <div class="ls-chatbot-status">

                                <span
                                    class="ls-chatbot-status-dot"
                                ></span>

                                Ready to help

                            </div>

                        </div>

                    </div>


                    <div class="ls-chatbot-header-actions">

                        <button
                            type="button"
                            class="ls-chatbot-icon-btn"
                            id="learnbotClear"
                            aria-label="Clear chat"
                            title="Clear chat"
                        >
                            ↺
                        </button>

                        <button
                            type="button"
                            class="ls-chatbot-icon-btn"
                            id="learnbotClose"
                            aria-label="Close LearnBot"
                            title="Close"
                        >
                            ×
                        </button>

                    </div>

                </header>


                <!-- Messages -->

                <div
                    class="ls-chatbot-messages"
                    id="learnbotMessages"
                    role="log"
                    aria-live="polite"
                    aria-label="Chat messages"
                ></div>


                <!-- Typing indicator -->

                <div
                    class="ls-typing"
                    id="learnbotTyping"
                    aria-label="LearnBot is typing"
                >

                    <span></span>
                    <span></span>
                    <span></span>

                </div>


                <!-- Quick questions -->

                <div class="ls-chatbot-quick">

                    <div class="ls-quick-title">
                        Quick questions
                    </div>

                    <div class="ls-quick-list">

                        <button
                            type="button"
                            class="ls-quick-btn"
                            data-question="What beginner courses are available?"
                        >
                            Beginner Courses
                        </button>

                        <button
                            type="button"
                            class="ls-quick-btn"
                            data-question="Do you have Python?"
                        >
                            Python
                        </button>

                        <button
                            type="button"
                            class="ls-quick-btn"
                            data-question="Do you have web development courses?"
                        >
                            Web Development
                        </button>

                        <button
                            type="button"
                            class="ls-quick-btn"
                            data-question="What AI courses are available?"
                        >
                            AI Courses
                        </button>

                        <button
                            type="button"
                            class="ls-quick-btn"
                            data-question="Do you have Git and GitHub?"
                        >
                            Git & GitHub
                        </button>

                        <button
                            type="button"
                            class="ls-quick-btn"
                            data-question="How do I start a course?"
                        >
                            How do I start?
                        </button>

                    </div>

                </div>


                <!-- Input -->

                <form
                    class="ls-chatbot-input-area"
                    id="learnbotForm"
                >

                    <input
                        type="text"
                        class="ls-chatbot-input"
                        id="learnbotInput"
                        placeholder="Ask LearnBot..."
                        autocomplete="off"
                        maxlength="500"
                        aria-label="Type your question"
                    >

                    <button
                        type="submit"
                        class="ls-chatbot-send"
                        id="learnbotSend"
                        aria-label="Send message"
                    >
                        ➤
                    </button>

                </form>

            </section>

        `;


        document.body.appendChild(root);

    }


    /* =========================================================
       CACHE ELEMENTS
    ========================================================== */

    function cacheElements() {

        launcher =
            document.getElementById("learnbotLauncher");

        chatbotWindow =
            document.getElementById("learnbotWindow");

        messagesContainer =
            document.getElementById("learnbotMessages");

        input =
            document.getElementById("learnbotInput");

        sendButton =
            document.getElementById("learnbotSend");

        typingIndicator =
            document.getElementById("learnbotTyping");

        clearButton =
            document.getElementById("learnbotClear");

        closeButton =
            document.getElementById("learnbotClose");

    }


    /* =========================================================
       EVENT LISTENERS
    ========================================================== */

    function bindEvents() {

        if (!launcher) {
            return;
        }


        /* Open / close */

        launcher.addEventListener(
            "click",
            toggleChat
        );


        if (closeButton) {

            closeButton.addEventListener(
                "click",
                closeChat
            );

        }


        /* Clear */

        if (clearButton) {

            clearButton.addEventListener(
                "click",
                clearChat
            );

        }


        /* Form */

        const form =
            document.getElementById("learnbotForm");


        if (form) {

            form.addEventListener(
                "submit",
                function (event) {

                    event.preventDefault();

                    sendCurrentMessage();

                }
            );

        }


        /* Quick questions */

        document
            .querySelectorAll(".ls-quick-btn")
            .forEach(function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const question =
                            button.dataset.question;

                        if (!question) {
                            return;
                        }

                        openChat();

                        sendMessage(question);

                    }
                );

            });


        /*
         * Any element with:
         *
         * data-learnbot
         *
         * or:
         *
         * .learnbot-trigger
         *
         * opens LearnBot.
         */

        document
            .querySelectorAll(
                "[data-learnbot], .learnbot-trigger"
            )
            .forEach(function (element) {

                element.addEventListener(
                    "click",
                    function (event) {

                        /*
                         * Prevent #learnbot from jumping down
                         * the page.
                         */
                        event.preventDefault();

                        openChat();

                    }
                );

            });


        /* Escape closes chatbot */

        document.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key === "Escape" &&
                    chatbotWindow &&
                    chatbotWindow.classList.contains("is-open")
                ) {

                    closeChat();

                }

            }
        );

    }


    /* =========================================================
       OPEN CHAT
    ========================================================== */

    function openChat() {

        if (!chatbotWindow || !launcher) {
            return;
        }


        chatbotWindow.classList.add("is-open");

        launcher.classList.add("is-open");

        launcher.setAttribute(
            "aria-expanded",
            "true"
        );

        chatbotWindow.setAttribute(
            "aria-hidden",
            "false"
        );


        setTimeout(function () {

            if (input) {
                input.focus();
            }

        }, 150);


        scrollMessagesToBottom();

    }


    /* =========================================================
       CLOSE CHAT
    ========================================================== */

    function closeChat() {

        if (!chatbotWindow || !launcher) {
            return;
        }


        chatbotWindow.classList.remove("is-open");

        launcher.classList.remove("is-open");

        launcher.setAttribute(
            "aria-expanded",
            "false"
        );

        chatbotWindow.setAttribute(
            "aria-hidden",
            "true"
        );

    }


    /* =========================================================
       TOGGLE
    ========================================================== */

    function toggleChat() {

        if (
            chatbotWindow &&
            chatbotWindow.classList.contains("is-open")
        ) {

            closeChat();

        } else {

            openChat();

        }

    }


    /* =========================================================
       LOAD COURSE DATA
    ========================================================== */

    async function loadCourses() {

        try {

            const response =
                await fetch(COURSE_DATA_PATH, {
                    cache: "no-store"
                });


            if (!response.ok) {

                throw new Error(
                    "Unable to load courses.json. HTTP " +
                    response.status
                );

            }


            const data =
                await response.json();


            /*
             * Support either:
             *
             * [ ... ]
             *
             * or:
             *
             * { "courses": [ ... ] }
             */

            if (Array.isArray(data)) {

                courses = data;

            } else if (
                data &&
                Array.isArray(data.courses)
            ) {

                courses = data.courses;

            } else {

                courses = [];

            }


            coursesLoaded = true;


            /*
             * If the user opened LearnBot before the
             * JSON finished loading, there is no problem.
             */

        } catch (error) {

            courses = [];

            coursesLoaded = false;

            console.warn(
                "LearnBot could not load course data:",
                error
            );

        }

    }


    /* =========================================================
       CHAT HISTORY
    ========================================================== */

    function loadChatHistory() {

        if (!messagesContainer) {
            return;
        }


        let history = [];


        try {

            const stored =
                localStorage.getItem(STORAGE_KEY);


            if (stored) {

                history =
                    JSON.parse(stored);

            }

        } catch (error) {

            history = [];

        }


        if (
            Array.isArray(history) &&
            history.length > 0
        ) {

            history.forEach(function (message) {

                if (
                    message &&
                    (
                        message.sender === "bot" ||
                        message.sender === "user"
                    ) &&
                    typeof message.text === "string"
                ) {

                    addMessage(
                        message.text,
                        message.sender,
                        false
                    );

                }

            });

        }


        if (
            !messagesContainer.children.length
        ) {

            addMessage(
                getWelcomeMessage(),
                "bot",
                false
            );

        }

    }


    function saveMessage(
        text,
        sender
    ) {

        try {

            let history = [];


            const stored =
                localStorage.getItem(STORAGE_KEY);


            if (stored) {

                history =
                    JSON.parse(stored);

            }


            if (!Array.isArray(history)) {
                history = [];
            }


            history.push({
                text: text,
                sender: sender,
                timestamp: Date.now()
            });


            /*
             * Keep only the latest 50 messages.
             */
            history =
                history.slice(-50);


            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(history)
            );

        } catch (error) {

            /*
             * Storage failure should never break chat.
             */

        }

    }


    /* =========================================================
       WELCOME MESSAGE
    ========================================================== */

    function getWelcomeMessage() {

        return `
            <strong>Hi! I'm LearnBot ✦</strong><br>
            I can help you discover LearnSphere courses,
            find beginner-friendly options, and choose a
            learning path.
            <br><br>
            Try asking me about <strong>Python</strong>,
            <strong>Web Development</strong>,
            <strong>AI</strong>, or
            <strong>Git & GitHub</strong>.
        `;

    }


    /* =========================================================
       SEND CURRENT INPUT
    ========================================================== */

    function sendCurrentMessage() {

        if (!input) {
            return;
        }


        const text =
            input.value.trim();


        if (!text) {
            return;
        }


        sendMessage(text);

    }


    /* =========================================================
       SEND MESSAGE
    ========================================================== */

    function sendMessage(text) {

        if (!text || isTyping) {
            return;
        }


        const cleanText =
            String(text).trim();


        if (!cleanText) {
            return;
        }


        if (input) {
            input.value = "";
        }


        addMessage(
            escapeHtml(cleanText),
            "user",
            true
        );


        setTyping(true);


        /*
         * Small delay makes the interaction feel natural
         * without using an external service.
         */

        const delay =
            450 +
            Math.floor(
                Math.random() * 500
            );


        setTimeout(function () {

            try {

                const response =
                    generateResponse(cleanText);


                setTyping(false);


                addMessage(
                    response,
                    "bot",
                    true
                );

            } catch (error) {

                console.error(
                    "LearnBot response error:",
                    error
                );


                setTyping(false);


                addMessage(
                    getFallbackResponse(),
                    "bot",
                    true
                );

            }

        }, delay);

    }


    /* =========================================================
       ADD MESSAGE
    ========================================================== */

    function addMessage(
        text,
        sender,
        save
    ) {

        if (!messagesContainer) {
            return;
        }


        const row =
            document.createElement("div");


        row.className =
            "ls-message-row " +
            (
                sender === "user"
                    ? "user"
                    : "bot"
            );


        const bubble =
            document.createElement("div");


        bubble.className =
            "ls-message";


        /*
         * Bot responses intentionally contain controlled HTML
         * for links/strong text.
         *
         * User messages are escaped before reaching here.
         */

        bubble.innerHTML = text;


        row.appendChild(bubble);

        messagesContainer.appendChild(row);


        if (save) {

            saveMessage(
                text,
                sender
            );

        }


        scrollMessagesToBottom();

    }


    /* =========================================================
       TYPING INDICATOR
    ========================================================== */

    function setTyping(value) {

        isTyping = value;


        if (typingIndicator) {

            typingIndicator.classList.toggle(
                "is-visible",
                value
            );

        }


        if (sendButton) {

            sendButton.disabled =
                value;

        }


        scrollMessagesToBottom();

    }


    /* =========================================================
       CLEAR CHAT
    ========================================================== */

    function clearChat() {

        try {

            localStorage.removeItem(
                STORAGE_KEY
            );

        } catch (error) {
            /* Ignore storage errors */
        }


        if (messagesContainer) {

            messagesContainer.innerHTML = "";

        }


        addMessage(
            getWelcomeMessage(),
            "bot",
            false
        );

    }


    /* =========================================================
       RESPONSE ENGINE
    ========================================================== */

    function generateResponse(question) {

        const original =
            String(question).trim();


        const q =
            normalizeText(original);


        if (!q) {
            return getFallbackResponse();
        }


        /* -----------------------------------------------
           GREETINGS
        ------------------------------------------------ */

        if (
            /\b(hi|hello|hey|hii|good morning|good evening)\b/
                .test(q)
        ) {

            return `
                Hello! 👋<br><br>
                I'm <strong>LearnBot</strong>.
                I can help you explore LearnSphere courses,
                find beginner courses and recommend what to
                learn next.
            `;

        }


        /* -----------------------------------------------
           WHAT IS LEARNSPHERE
        ------------------------------------------------ */

        if (
            q.includes("what is learnsphere") ||
            q.includes("what's learnsphere") ||
            q.includes("tell me about learnsphere") ||
            q.includes("about learnsphere") ||
            q.includes("learnsphere") &&
            (
                q.includes("platform") ||
                q.includes("website") ||
                q.includes("project")
            )
        ) {

            return `
                <strong>LearnSphere</strong> is a premium,
                frontend-only online learning platform.
                <br><br>
                It helps learners discover useful
                <strong>free online courses</strong> from
                reputable learning platforms and access them
                through external learning links.
                <br><br>
                The tagline is:
                <strong>“Learn Skills. Build Your Future.”</strong>
            `;

        }


        /* -----------------------------------------------
           HOW MANY COURSES
        ------------------------------------------------ */

        if (
            q.includes("how many courses") ||
            q.includes("number of courses") ||
            q.includes("total courses") ||
            q.includes("courses available")
        ) {

            if (courses.length > 0) {

                return `
                    LearnSphere currently has
                    <strong>${courses.length} courses</strong>
                    in its catalogue.
                    <br><br>
                    You can browse them from the
                    <strong>Courses</strong> page.
                `;

            }


            return `
                LearnSphere's course catalogue contains
                <strong>12 courses</strong>.
                <br><br>
                Open the Courses page to explore them.
            `;

        }


        /* -----------------------------------------------
           ARE COURSES FREE?
        ------------------------------------------------ */

        if (
            q.includes("are the courses free") ||
            q.includes("are courses free") ||
            q.includes("free courses") ||
            q === "free" ||
            q.includes("cost")
        ) {

            const freeCourses =
                courses.filter(
                    function (course) {
                        return isFreeCourse(course);
                    }
                );


            if (freeCourses.length > 0) {

                return `
                    Yes. LearnSphere is designed to help
                    learners discover
                    <strong>free online learning resources</strong>.
                    <br><br>
                    ${freeCourses.length} course(s) in the
                    loaded catalogue are marked as free.
                `;

            }


            return `
                Yes. LearnSphere focuses on
                <strong>free online learning resources</strong>.
                You can explore the Courses page to see the
                available options.
            `;

        }


        /* -----------------------------------------------
           BEGINNER COURSES
        ------------------------------------------------ */

        if (
            q.includes("beginner") ||
            q.includes("starting out") ||
            q.includes("start learning") ||
            q.includes("new to coding") ||
            q.includes("new to programming")
        ) {

            /*
             * Specific recommendation question should be
             * handled before generic beginner filtering.
             */

            if (
                q.includes("which course") ||
                q.includes("what course") ||
                q.includes("recommend") ||
                q.includes("should i start") ||
                q.includes("where should i start")
            ) {

                return getBeginnerRecommendation();

            }


            return getBeginnerCourses();

        }


        /* -----------------------------------------------
           PYTHON
        ------------------------------------------------ */

        if (
            containsAny(
                q,
                [
                    "python",
                    "py programming"
                ]
            )
        ) {

            const result =
                findCoursesByTerms([
                    "python"
                ]);


            if (result.length > 0) {

                return formatCourseResults(
                    "Here are the Python-related courses I found:",
                    result
                );

            }


            return `
                Yes, LearnSphere is designed to include
                <strong>Python Programming</strong>.
                <br><br>
                Open the Courses page to explore it.
            `;

        }


        /* -----------------------------------------------
           JAVA
        ------------------------------------------------ */

        if (
            containsAny(
                q,
                [
                    "java programming",
                    "learn java",
                    "java course",
                    "do you have java"
                ]
            ) ||
            q === "java"
        ) {

            const result =
                findCoursesByTerms([
                    "java"
                ]);


            if (result.length > 0) {

                return formatCourseResults(
                    "Here is the Java course:",
                    result
                );

            }


            return `
                LearnSphere includes
                <strong>Java Programming</strong>.
                <br><br>
                Check the Courses page for its complete
                details.
            `;

        }


        /* -----------------------------------------------
           WEB DEVELOPMENT
        ------------------------------------------------ */

        if (
            q.includes("web development") ||
            q.includes("web developer") ||
            q.includes("website development")
        ) {

            const result =
                findCoursesByTerms([
                    "web development",
                    "responsive web design"
                ]);


            if (result.length > 0) {

                return formatCourseResults(
                    "Here are the web-development courses:",
                    result
                );

            }


            return `
                LearnSphere includes
                <strong>web development</strong> learning
                resources.
                <br><br>
                Explore the Courses page for the available
                options.
            `;

        }


        /* -----------------------------------------------
           JAVASCRIPT
        ------------------------------------------------ */

        if (
            q.includes("javascript") ||
            q.includes("js course")
        ) {

            const result =
                findCoursesByTerms([
                    "javascript"
                ]);


            return formatCourseResults(
                "Here is the JavaScript course:",
                result
            );

        }


        /* -----------------------------------------------
           REACT
        ------------------------------------------------ */

        if (
            q.includes("react")
        ) {

            const result =
                findCoursesByTerms([
                    "react"
                ]);


            return formatCourseResults(
                "Here is the React course:",
                result
            );

        }


        /* -----------------------------------------------
           SQL
        ------------------------------------------------ */

        if (
            q.includes("sql") ||
            q.includes("database")
        ) {

            const result =
                findCoursesByTerms([
                    "sql",
                    "database",
                    "relational"
                ]);


            return formatCourseResults(
                "Here are the database-related courses:",
                result
            );

        }


        /* -----------------------------------------------
           PANDAS
        ------------------------------------------------ */

        if (
            q.includes("pandas")
        ) {

            const result =
                findCoursesByTerms([
                    "pandas"
                ]);


            return formatCourseResults(
                "Here is the Pandas course:",
                result
            );

        }


        /* -----------------------------------------------
           MACHINE LEARNING / AI
        ------------------------------------------------ */

        if (
            q.includes("machine learning") ||
            q.includes("machine-learning") ||
            q.includes("artificial intelligence") ||
            q.includes(" ai ") ||
            q === "ai" ||
            q.includes("ai course") ||
            q.includes("ai courses")
        ) {

            const result =
                findCoursesByTerms([
                    "machine learning",
                    "artificial intelligence"
                ]);


            if (result.length > 0) {

                return formatCourseResults(
                    "Here are the AI and machine-learning courses:",
                    result
                );

            }


            return `
                LearnSphere includes
                <strong>machine-learning</strong> resources.
                <br><br>
                Explore the Courses page to see the available
                AI-related learning options.
            `;

        }


        /* -----------------------------------------------
           GIT & GITHUB
        ------------------------------------------------ */

        if (
            q.includes("git") ||
            q.includes("github") ||
            q.includes("git and github")
        ) {

            const result =
                findCoursesByTerms([
                    "git",
                    "github"
                ]);


            return formatCourseResults(
                "Here is the Git & GitHub course:",
                result
            );

        }


        /* -----------------------------------------------
           CYBERSECURITY
        ------------------------------------------------ */

        if (
            q.includes("cybersecurity") ||
            q.includes("cyber security") ||
            q.includes("security course")
        ) {

            const result =
                findCoursesByTerms([
                    "cybersecurity",
                    "cyber security"
                ]);


            return formatCourseResults(
                "Here is the cybersecurity course:",
                result
            );

        }


        /* -----------------------------------------------
           DATA VISUALIZATION
        ------------------------------------------------ */

        if (
            q.includes("data visualization") ||
            q.includes("data visualisation") ||
            q.includes("visualization")
        ) {

            const result =
                findCoursesByTerms([
                    "data visualization",
                    "data visualisation"
                ]);


            return formatCourseResults(
                "Here is the Data Visualization course:",
                result
            );

        }


        /* -----------------------------------------------
           ALL COURSES
        ------------------------------------------------ */

        if (
            q.includes("what courses") ||
            q.includes("available courses") ||
            q.includes("show courses") ||
            q.includes("list courses") ||
            q.includes("all courses") ||
            q === "courses"
        ) {

            return getAllCourses();

        }


        /* -----------------------------------------------
           COURSE DURATION
        ------------------------------------------------ */

        if (
            q.includes("duration") ||
            q.includes("how long") ||
            q.includes("course length")
        ) {

            const matching =
                findCourseFromQuestion(q);


            if (matching.length > 0) {

                return formatDurationResponse(
                    matching
                );

            }


            return `
                Course duration depends on the course.
                <br><br>
                Ask me something like:
                <strong>“What is the duration of Python?”</strong>
            `;

        }


        /* -----------------------------------------------
           BEST WEB COURSE
        ------------------------------------------------ */

        if (
            (
                q.includes("best") ||
                q.includes("recommend")
            ) &&
            q.includes("web")
        ) {

            const result =
                findCoursesByTerms([
                    "web development",
                    "responsive web design"
                ]);


            if (result.length > 0) {

                return `
                    For web development, I'd start with
                    <strong>${escapeHtml(
                        result[0].title
                    )}</strong>.
                    <br><br>
                    ${escapeHtml(
                        getDescription(result[0])
                    )}
                `;

            }

        }


        /* -----------------------------------------------
           WHAT AFTER PYTHON
        ------------------------------------------------ */

        if (
            q.includes("after python") ||
            q.includes("learn after python") ||
            q.includes("next after python")
        ) {

            return getAfterPythonRecommendation();

        }


        /* -----------------------------------------------
           HOW TO START
        ------------------------------------------------ */

        if (
            q.includes("how do i start") ||
            q.includes("how to start") ||
            q.includes("start a course") ||
            q.includes("begin learning") ||
            q.includes("how can i start")
        ) {

            return `
                Getting started is simple:
                <br><br>
                <strong>1.</strong> Open the
                <strong>Courses</strong> page.<br>
                <strong>2.</strong> Search or filter for a course.<br>
                <strong>3.</strong> Select
                <strong>View Course</strong>.<br>
                <strong>4.</strong> Read the course information.<br>
                <strong>5.</strong> Select
                <strong>Start Learning</strong> to open the
                external learning platform.
                <br><br>
                If you're completely new, ask me:
                <strong>“Which course should a beginner start with?”</strong>
            `;

        }


        /* -----------------------------------------------
           HOW TO FIND COURSE
        ------------------------------------------------ */

        if (
            q.includes("how do i find") ||
            q.includes("find a course") ||
            q.includes("search for a course")
        ) {

            return `
                Go to the
                <strong>Courses</strong> page.
                <br><br>
                You can use the search bar and combine it with
                <strong>Category</strong> and
                <strong>Difficulty</strong> filters.
            `;

        }


        /* -----------------------------------------------
           COURSE RECOMMENDATION
        ------------------------------------------------ */

        if (
            q.includes("recommend") ||
            q.includes("suggest a course") ||
            q.includes("what should i learn")
        ) {

            return getGeneralRecommendation();

        }


        /* -----------------------------------------------
           THANK YOU
        ------------------------------------------------ */

        if (
            q.includes("thank you") ||
            q.includes("thanks")
        ) {

            return `
                You're welcome! ✦<br><br>
                Keep learning, exploring and growing.
            `;

        }


        /* -----------------------------------------------
           GOODBYE
        ------------------------------------------------ */

        if (
            q === "bye" ||
            q === "goodbye"
        ) {

            return `
                Happy learning! 🚀<br><br>
                Come back whenever you're ready to
                explore another course.
            `;

        }


        /* -----------------------------------------------
           UNKNOWN
        ------------------------------------------------ */

        return getFallbackResponse();

    }


    /* =========================================================
       COURSE HELPERS
    ========================================================== */

    function getBeginnerCourses() {

        if (!coursesLoaded || courses.length === 0) {

            return `
                LearnSphere includes beginner-friendly courses
                such as <strong>Python Programming</strong>,
                <strong>Java Programming</strong>,
                <strong>Responsive Web Design</strong>,
                <strong>JavaScript</strong> and
                <strong>Git & GitHub</strong>.
                <br><br>
                Open the Courses page to explore them.
            `;

        }


        const beginner =
            courses.filter(
                function (course) {

                    return normalizeText(
                        course.difficulty
                    ) === "beginner";

                }
            );


        if (beginner.length === 0) {

            return `
                I couldn't find courses marked as
                <strong>Beginner</strong> in the loaded
                course data.
            `;

        }


        return formatCourseResults(
            "Here are the beginner-friendly courses:",
            beginner
        );

    }


    function getBeginnerRecommendation() {

        const beginner =
            courses.filter(
                function (course) {

                    return normalizeText(
                        course.difficulty
                    ) === "beginner";

                }
            );


        if (beginner.length > 0) {

            const first =
                beginner[0];


            return `
                If you're a beginner, I'd start with
                <strong>${escapeHtml(
                    first.title
                )}</strong>.
                <br><br>
                <strong>Difficulty:</strong>
                ${escapeHtml(
                    first.difficulty || "Beginner"
                )}
                <br>
                <strong>Duration:</strong>
                ${escapeHtml(
                    first.duration || "Not specified"
                )}
                <br>
                <strong>Platform:</strong>
                ${escapeHtml(
                    first.platform || "Online"
                )}
                <br><br>
                ${escapeHtml(
                    getDescription(first)
                )}
            `;

        }


        return `
            If you're completely new to technology,
            Python Programming is a good place to begin.
            You can then explore web development, data
            analysis or machine learning as your interests
            develop.
        `;

    }


    function getGeneralRecommendation() {

        const beginner =
            courses.filter(
                function (course) {

                    return normalizeText(
                        course.difficulty
                    ) === "beginner";

                }
            );


        if (beginner.length > 0) {

            return `
                I'd recommend starting with
                <strong>${escapeHtml(
                    beginner[0].title
                )}</strong> if you're new.
                <br><br>
                Once you build your foundation, you can move
                into web development, data science, AI,
                databases or developer tools depending on
                your interests.
            `;

        }


        return `
            Tell me what area you're interested in —
            <strong>Python, Java, Web Development, AI,
            SQL, Git & GitHub, Pandas or Cybersecurity</strong> —
            and I'll help you choose.
        `;

    }


    function getAfterPythonRecommendation() {

        const recommendations =
            findCoursesByTerms([
                "pandas",
                "machine learning",
                "data visualization"
            ]);


        if (recommendations.length > 0) {

            return `
                After Python, you could explore:
                <br><br>
                ${createCourseList(
                    recommendations.slice(0, 3)
                )}
                <br>
                Your best choice depends on your goal:
                data analysis, visualization or machine learning.
            `;

        }


        return `
            After Python, consider learning
            <strong>Pandas</strong>, data visualization or
            machine learning depending on your goals.
        `;

    }


    function getAllCourses() {

        if (!coursesLoaded || courses.length === 0) {

            return `
                LearnSphere's catalogue contains
                <strong>12 courses</strong> covering areas such
                as programming, web development, data science,
                AI, databases, developer tools and cybersecurity.
                <br><br>
                Open the Courses page to view the complete
                catalogue.
            `;

        }


        return `
            <strong>Available courses:</strong>
            <br><br>
            ${createCourseList(courses)}
        `;

    }


    function findCoursesByTerms(terms) {

        if (!Array.isArray(courses)) {
            return [];
        }


        const cleanTerms =
            terms.map(
                function (term) {
                    return normalizeText(term);
                }
            );


        return courses.filter(
            function (course) {

                const searchable =
                    getSearchableCourseText(course);


                return cleanTerms.some(
                    function (term) {

                        return searchable.includes(term);

                    }
                );

            }
        );

    }


    function findCourseFromQuestion(question) {

        if (!coursesLoaded) {
            return [];
        }


        const q =
            normalizeText(question);


        return courses.filter(
            function (course) {

                const title =
                    normalizeText(
                        course.title
                    );


                const id =
                    normalizeText(
                        course.id
                    );


                return (
                    q.includes(title) ||
                    q.includes(id) ||
                    (
                        title &&
                        title
                            .split(" ")
                            .some(
                                function (word) {

                                    return (
                                        word.length > 3 &&
                                        q.includes(word)
                                    );

                                }
                            )
                    )
                );

            }
        );

    }


    function getSearchableCourseText(course) {

        return normalizeText(
            [
                course.id,
                course.title,
                course.category,
                course.difficulty,
                course.duration,
                course.platform,
                course.instructor,
                course.description,
                Array.isArray(course.whatYouWillLearn)
                    ? course.whatYouWillLearn.join(" ")
                    : course.whatYouWillLearn,
                course.prerequisites
            ]
                .filter(Boolean)
                .join(" ")
        );

    }


    function getDescription(course) {

        if (!course) {
            return "";
        }


        return (
            course.description ||
            "Explore this course through LearnSphere."
        );

    }


    function isFreeCourse(course) {

        if (!course) {
            return false;
        }


        if (
            course.free === true ||
            course.free === "true"
        ) {

            return true;

        }


        return false;

    }


    /* =========================================================
       COURSE RESULT FORMATTING
    ========================================================== */

    function formatCourseResults(
        heading,
        results
    ) {

        if (
            !Array.isArray(results) ||
            results.length === 0
        ) {

            return `
                I couldn't find a matching course in the
                loaded catalogue.
                <br><br>
                Try another course name or ask me about
                beginner courses.
            `;

        }


        return `
            ${escapeHtml(heading)}
            <br><br>
            ${createCourseList(results)}
        `;

    }


    function createCourseList(results) {

        return results
            .slice(0, 8)
            .map(
                function (course) {

                    const title =
                        escapeHtml(
                            course.title ||
                            "Untitled Course"
                        );


                    const difficulty =
                        escapeHtml(
                            course.difficulty ||
                            "Not specified"
                        );


                    const duration =
                        escapeHtml(
                            course.duration ||
                            "Not specified"
                        );


                    const platform =
                        escapeHtml(
                            course.platform ||
                            "Online"
                        );


                    const id =
                        encodeURIComponent(
                            course.id || ""
                        );


                    let detailsLink =
                        "course-details.html?course=" +
                        id;


                    return `
                        <div style="
                            margin-bottom:10px;
                            padding-bottom:10px;
                            border-bottom:1px solid var(--about-border);
                        ">

                            <strong>
                                ${title}
                            </strong>

                            <br>

                            <small>
                                ${difficulty}
                                ·
                                ${duration}
                                ·
                                ${platform}
                            </small>

                            <br>

                            <a
                                href="${detailsLink}"
                                style="
                                    display:inline-block;
                                    margin-top:4px;
                                    color:var(--about-primary);
                                    font-weight:700;
                                    text-decoration:none;
                                "
                            >
                                View course →
                            </a>

                        </div>
                    `;

                }
            )
            .join("");

    }


    function formatDurationResponse(results) {

        return `
            <strong>Course duration:</strong>
            <br><br>
            ${results
                .slice(0, 5)
                .map(
                    function (course) {

                        return `
                            <strong>
                                ${escapeHtml(
                                    course.title ||
                                    "Course"
                                )}
                            </strong>
                            —
                            ${escapeHtml(
                                course.duration ||
                                "Not specified"
                            )}
                            <br>
                        `;

                    }
                )
                .join("")}
        `;

    }


    /* =========================================================
       FALLBACK
    ========================================================== */

    function getFallbackResponse() {

        return `
            I'm still learning! ✦
            <br><br>
            Try asking me about our
            <strong>courses</strong>,
            <strong>beginner recommendations</strong>,
            <strong>course categories</strong>,
            or <strong>how to start learning</strong>.
            <br><br>
            You can also ask about
            <strong>Python</strong>,
            <strong>Java</strong>,
            <strong>Web Development</strong>,
            <strong>AI</strong>,
            <strong>SQL</strong>,
            <strong>Git & GitHub</strong>,
            or <strong>Cybersecurity</strong>.
        `;

    }


    /* =========================================================
       UTILITY FUNCTIONS
    ========================================================== */

    function normalizeText(value) {

        return String(value || "")
            .toLowerCase()
            .replace(/[&]/g, " and ")
            .replace(/[-_/]/g, " ")
            .replace(/[^\w\s]/g, " ")
            .replace(/\s+/g, " ")
            .trim();

    }


    function containsAny(
        text,
        terms
    ) {

        return terms.some(
            function (term) {

                return text.includes(
                    normalizeText(term)
                );

            }
        );

    }


    function escapeHtml(value) {

        return String(value || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    function scrollMessagesToBottom() {

        if (!messagesContainer) {
            return;
        }


        requestAnimationFrame(
            function () {

                messagesContainer.scrollTop =
                    messagesContainer.scrollHeight;

            }
        );

    }


})();