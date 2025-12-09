const aiCore = document.getElementById('ai-core');
const aiText = document.getElementById('ai-text');
const micBtn = document.getElementById('mic-btn');
const soundEffect = document.getElementById('start-sound');
const particlesContainer = document.getElementById('particles');

// 1. Particle Generator (Background Stars)
function createParticles() {
    for (let i = 0; i < 50; i++) {
        let p = document.createElement('div');
        p.className = 'particle';
        p.style.left = Math.random() * 100 + 'vw';
        p.style.animationDuration = (Math.random() * 3 + 2) + 's';
        p.style.opacity = Math.random();
        particlesContainer.appendChild(p);
    }
}
createParticles();

// 2. Mouse Movement Effect (Parallax)
document.addEventListener('mousemove', (e) => {
    let x = (window.innerWidth / 2 - e.pageX) / 20;
    let y = (window.innerHeight / 2 - e.pageY) / 20;
    aiCore.style.transform = `translate(${x}px, ${y}px)`;
});

// 3. Typewriter Effect for Text
function typeText(text) {
    aiText.innerHTML = '';
    let i = 0;
    let speed = 50; 
    
    function typing() {
        if (i < text.length) {
            aiText.innerHTML += text.charAt(i);
            i++;
            setTimeout(typing, speed);
        }
    }
    typing();
}

// 4. Voice Recognition (Speech to Text)
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.continuous = false; // Stops after one sentence
    recognition.lang = 'en-US';

    micBtn.addEventListener('click', () => {
        try {
            soundEffect.play(); // Play sci-fi sound
        } catch(e) { console.log("Audio play blocked"); }
        
        typeText("LISTENING...");
        aiCore.style.backgroundColor = "#ff0055"; // Change color to red when listening
        recognition.start();
    });

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        aiCore.style.backgroundColor = "#0ff"; // Back to cyan
        processCommand(transcript);
    };

    recognition.onerror = (event) => {
        typeText("ERROR: VOICE NOT DETECTED.");
        aiCore.style.backgroundColor = "#0ff";
    };
} else {
    micBtn.style.display = 'none';
    typeText("SYSTEM ERROR: SPEECH API NOT SUPPORTED IN THIS BROWSER.");
}

// 5. Basic AI Response Logic
function processCommand(command) {
    command = command.toLowerCase();
    let response = "COMMAND NOT RECOGNIZED.";

    if (command.includes('hello') || command.includes('hi')) {
        response = "GREETINGS, USER. SYSTEMS ARE ONLINE.";
    } else if (command.includes('time')) {
        response = "CURRENT TIME IS: " + new Date().toLocaleTimeString();
    } else if (command.includes('who are you')) {
        response = "I AM A VIRTUAL ASSISTANT PROTOTYPE.";
    } else if (command.includes('open google')) {
        response = "OPENING GOOGLE DATABASE...";
        window.open('https://google.com', '_blank');
    }

    typeText(response);
    
    // Make the AI speak the response
    let speech = new SpeechSynthesisUtterance();
    speech.text = response;
    speech.pitch = 0.8; // Lower pitch for robotic feel
    speech.rate = 1;
    window.speechSynthesis.speak(speech);
}
  
