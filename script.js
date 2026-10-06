/* =========================================
   EMAILJS CONFIGURATION
========================================= */

const PUBLIC_KEY =
    "Ow841_Yo4njduI2j2";

const SERVICE_ID =
    "service_bvnihmf";

const TEMPLATE_ID =
    "template_r4c6l5s";


/* =========================================
   STATE
========================================= */

let noClicks = 0;
let responseSent = false;


/* =========================================
   EMAILJS INITIALIZATION
========================================= */

emailjs.init({
    publicKey: PUBLIC_KEY
});


/* =========================================
   NO BUTTON MESSAGES
========================================= */

const noMessages = [
    "Are you sure? 🥺",
    "Really? Think about it once more. ❤️",
    "I promise I'm genuinely sorry.",
    "Please give me one little chance. 🥺",
    "Okay... but I'm still hoping for a YES.",
    "I think YES is getting harder to ignore now 😌",
    "You know what... I made YES pretty convincing now ❤️"
];


/* =========================================
   SCREEN NAVIGATION
========================================= */

function nextScreen(number) {

    document.querySelectorAll(".screen").forEach(
        function(screen) {
            screen.classList.remove("active");
        }
    );

    const next =
        document.getElementById("screen" + number);

    if (!next) {
        return;
    }

    next.classList.add("active");

    if (number === 2) {
        startTyping();
    }
}


/* =========================================
   TYPEWRITER
========================================= */

function startTyping() {

    const element =
        document.getElementById("typingText");

    if (!element) {
        return;
    }

    const text =
        "I know I messed things up before... " +
        "but today I wanted to say something. " +
        "Something I really mean.";

    element.textContent = "";

    let index = 0;

    function typeNext() {

        if (index >= text.length) {
            return;
        }

        element.textContent += text.charAt(index);

        index++;

        window.setTimeout(typeNext, 32);
    }

    typeNext();
}


/* =========================================
   NO BUTTON — PLAYFUL ONLY
========================================= */

function handleNoClick() {

    if (responseSent) {
        return;
    }

    noClicks++;

    const yes =
        document.getElementById("yesBtn");

    const no =
        document.getElementById("noBtn");

    const response =
        document.getElementById(
            "responseMessage"
        );

    if (!yes || !no || !response) {
        return;
    }


    /* Change the message */

    const messageIndex =
        Math.min(
            noClicks - 1,
            noMessages.length - 1
        );

    response.textContent =
        noMessages[messageIndex];


    /*
       YES grows every time NO is clicked.
       It starts normally and becomes the
       obvious choice after repeated NO clicks.
    */

    const scale =
        Math.min(
            1 + noClicks * 0.22,
            2.8
        );

    yes.style.transform =
        `scale(${scale})`;


    /*
       Move NO around while keeping it
       completely inside the button area.
    */

    const area =
        document.querySelector(
            ".button-area"
        );

    if (area) {

        const areaWidth =
            area.clientWidth;

        const buttonWidth =
            no.offsetWidth;

        const maxX =
            Math.max(
                0,
                (areaWidth - buttonWidth) / 2 - 8
            );

        const x =
            (Math.random() * 2 - 1) * maxX;

        const y =
            (Math.random() * 50) - 25;

        no.style.transform =
            `translate(${x}px, ${y}px)`;
    }


    /*
       After several NO clicks, YES becomes
       visually dominant and NO fades.
    */

    if (noClicks >= 4) {

        no.style.opacity =
            Math.max(
                0.25,
                0.9 - (noClicks - 4) * 0.18
            );

        no.textContent =
            "NO 😤";

    }


    if (noClicks >= 7) {

        response.textContent =
            "Okay... I think you know which one I'm hoping for. ❤️";

        no.style.opacity = "0.18";

        yes.style.transform =
            "scale(2.8)";
    }


    createHeart();
}


/* =========================================
   YES BUTTON
========================================= */

function sayYes() {

    if (responseSent) {
        return;
    }

    responseSent = true;

    sendResponseEmail(
        "YES ❤️",
        "She clicked YES and forgave me! ❤️"
    );

    nextScreen(5);

    createHeartBurst();
}


/* =========================================
   SEND EMAIL
========================================= */

function sendResponseEmail(answer, message) {

    const currentTime =
        new Date().toLocaleString(
            "en-IN",
            {
                dateStyle: "medium",
                timeStyle: "short"
            }
        );

    const templateParams = {
        answer: answer,
        message: message,
        time: currentTime
    };

    emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        templateParams
    )
    .then(
        function(response) {

            console.log(
                "Email sent successfully:",
                response.status,
                response.text
            );

        },
        function(error) {

            console.error(
                "EmailJS error:",
                error
            );
        }
    );
}


/* =========================================
   SMALL FLOATING HEART
========================================= */

function createHeart() {

    const container =
        document.getElementById("hearts");

    if (!container) {
        return;
    }

    if (container.children.length >= 4) {
        return;
    }

    const heart =
        document.createElement("span");

    heart.className = "heart";

    const heartTypes = [
        "❤️",
        "💕",
        "✨"
    ];

    heart.textContent =
        heartTypes[
            Math.floor(
                Math.random() * heartTypes.length
            )
        ];

    heart.style.left =
        `${10 + Math.random() * 80}%`;

    heart.style.animationDuration =
        `${4.5 + Math.random() * 2}s`;

    container.appendChild(heart);

    window.setTimeout(
        function() {
            heart.remove();
        },
        7000
    );
}


/* =========================================
   FINAL YES HEART EFFECT
========================================= */

function createHeartBurst() {

    for (let i = 0; i < 5; i++) {

        window.setTimeout(
            function() {
                createHeart();
            },
            i * 180
        );
    }
}
