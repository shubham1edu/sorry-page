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
    "Really? Think about it once more.",
    "I promise I'm genuinely sorry. ❤️",
    "Please give me one little chance."
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
        "I know he messed up things before... " +
        "but today he wanted to say something. " +
        "Something he really means.";

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
   NO BUTTON
========================================= */

function handleNoClick() {

    if (responseSent) {
        return;
    }

    /*
       First four NO clicks are playful.
       The fifth click is treated as the
       final NO and sends the email.
    */

    if (noClicks >= 4) {
        confirmNo();
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


    /* Change message */

    const messageIndex =
        Math.min(
            noClicks - 1,
            noMessages.length - 1
        );

    response.textContent =
        noMessages[messageIndex];


    /* Make YES bigger */

    const scale =
        Math.min(
            1 + noClicks * 0.12,
            1.55
        );

    yes.style.transform =
        `scale(${scale})`;


    /* Move NO safely */

    if (noClicks >= 2) {

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
                (Math.random() * 40) - 20;

            no.style.transform =
                `translate(${x}px, ${y}px)`;
        }
    }


    /* On fourth NO, show final wording */

    if (noClicks >= 4) {

        no.textContent =
            "NO, I really mean it 😔";

        no.style.opacity = "0.82";

        response.textContent =
            "Okay... if you really mean it, tap NO once more.";
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
        "She clicked YES and forgave you! ❤️"
    );

    nextScreen(5);

    createHeartBurst();
}


/* =========================================
   FINAL NO
========================================= */

function confirmNo() {

    if (responseSent) {
        return;
    }

    responseSent = true;

    sendResponseEmail(
        "NO 😔",
        "She chose NO. She was honest about how she feels."
    );

    nextScreen(6);
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

            /*
               The website still works even if
               email delivery fails.
            */
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
