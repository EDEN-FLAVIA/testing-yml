/* ==========================================
   LEARNSPHERE HOMEPAGE JAVASCRIPT
========================================== */


/* =========================
   MOBILE NAVIGATION
========================= */

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");


if (menuToggle && navLinks) {

    menuToggle.addEventListener("click", () => {

        navLinks.classList.toggle("open");

    });

}


/* Close mobile navigation after clicking a link */

const navigationLinks = document.querySelectorAll(".nav-links a");


navigationLinks.forEach((link) => {

    link.addEventListener("click", () => {

        navLinks.classList.remove("open");

    });

});



/* =========================
   MOTIVATIONAL QUOTES
========================= */

const quotes = [

    {
        text: "The beautiful thing about learning is that nobody can take it away from you.",
        author: "— B.B. King"
    },

    {
        text: "Live as if you were to die tomorrow. Learn as if you were to live forever.",
        author: "— Mahatma Gandhi"
    },

    {
        text: "Education is the most powerful weapon which you can use to change the world.",
        author: "— Nelson Mandela"
    },

    {
        text: "The expert in anything was once a beginner.",
        author: "— Helen Hayes"
    }

];


const learningQuote =
    document.getElementById("learningQuote");


const quoteAuthor =
    document.getElementById("quoteAuthor");


const quoteDots =
    document.querySelectorAll(".quote-dot");


let currentQuote = 0;


/* Function to display quote */

function showQuote(index) {

    if (!learningQuote || !quoteAuthor) {
        return;
    }


    learningQuote.style.opacity = "0";

    quoteAuthor.style.opacity = "0";


    setTimeout(() => {

        learningQuote.textContent =
            quotes[index].text;


        quoteAuthor.textContent =
            quotes[index].author;


        learningQuote.style.opacity = "1";

        quoteAuthor.style.opacity = "1";


    }, 200);


    quoteDots.forEach((dot) => {

        dot.classList.remove("active");

    });


    if (quoteDots[index]) {

        quoteDots[index].classList.add("active");

    }

}


/* Quote dot click */

quoteDots.forEach((dot, index) => {

    dot.addEventListener("click", () => {

        currentQuote = index;

        showQuote(currentQuote);

    });

});


/* Automatically rotate quotes */

setInterval(() => {

    currentQuote++;


    if (currentQuote >= quotes.length) {

        currentQuote = 0;

    }


    showQuote(currentQuote);


}, 6000);



/* =========================
   STATISTICS COUNTER
========================= */

const statNumbers =
    document.querySelectorAll(".stat-number");


let countersStarted = false;


/* Animate statistics */

function animateCounters() {

    statNumbers.forEach((stat) => {

        const target =
            Number(stat.dataset.target);


        let current = 0;


        const increment =
            Math.max(
                1,
                Math.ceil(target / 40)
            );


        const counter = setInterval(() => {

            current += increment;


            if (current >= target) {

                stat.textContent =
                    target + "+";

                clearInterval(counter);

            } else {

                stat.textContent =
                    current;

            }


        }, 35);

    });

}


/* Start animation when statistics become visible */

const statsSection =
    document.querySelector(".statistics-section");


if (statsSection) {

    const observer =
        new IntersectionObserver(

            (entries) => {

                entries.forEach((entry) => {

                    if (
                        entry.isIntersecting &&
                        !countersStarted
                    ) {

                        countersStarted = true;

                        animateCounters();

                    }

                });

            },

            {
                threshold: 0.4
            }

        );


    observer.observe(statsSection);

}