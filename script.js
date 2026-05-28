document.addEventListener('DOMContentLoaded', () => {
    const envelope = document.getElementById('envelope');
    const scene = document.getElementById('scene');
    const instruction = document.getElementById('instruction-text');
    const glow = document.getElementById('glow');
    const storyContainer = document.getElementById('story-container');
    const bgAnimations = document.getElementById('bg-animations');
    const finalGiftContainer = document.getElementById('final-gift-container');
    const finalGift = document.getElementById('final-gift');
    const giftInstruction = document.getElementById('gift-instruction');

    // The cinematic story
    const storyLines = [
        "Yo sé que tal vez no tenemos tanto tiempo de conocernos...",
        "...pero nunca se me va a olvidar la primera vez que te vi llegar en el transporte para el trabajo.",
        "En ese momento me llené de muchos prejuicios...",
        "...que, al final, no tenían nada que ver contigo.",
        "Con el tiempo fuimos coincidiendo cada vez más...",
        "...aunque realmente no tengamos muchas cosas en común y seamos muy diferentes.",
        "Pero tal vez eso fue justamente lo que nos acercó más...",
        "...porque los polos opuestos se atraen.",
        "Fuimos compartiendo más y más y, para no hacerlo largo, ahora somos amigos.",
        "Y sinceramente me alegra mucho haberte conocido, aunque a veces no te soporto jajajaja...",
        "...pero eres una persona muy especial y diferente a cualquiera que haya conocido antes.",
        "En tu cumpleaños quería recordarte lo importante que eres...",
        "...y agradecerte por cada conversación, cada risa y cada momento compartido.",
        "Espero que hoy la pases increíble, que recibas mucho cariño...",
        "...y que todos tus deseos se vayan cumpliendo poco a poco.",
        "Nunca cambies esa forma tan única de ser.",
        "¡Feliz cumpleaños! "
    ];

    let currentStoryIndex = 0;

    // Envelope Interaction
    envelope.addEventListener('click', () => {
        if (!envelope.classList.contains('open')) {
            envelope.classList.add('open');
            instruction.style.opacity = '0';

            setTimeout(() => {
                scene.style.opacity = '0';
                glow.style.opacity = '0';
                setTimeout(() => {
                    scene.style.display = 'none';
                    startStory();
                }, 2000);
            }, 1500);
        }
    });

    function startStory() {
        displayNextStoryObject();
    }

    function spawnBgAnimation(icon, animClass, leftPos, topPos) {
        const el = document.createElement('div');
        el.className = `bg-anim-icon ${animClass}`;
        el.innerText = icon;
        el.style.left = leftPos;
        el.style.top = topPos;
        bgAnimations.appendChild(el);
        setTimeout(() => el.remove(), 8000);
    }

    // Trigger animations based on story context
    function triggerStoryAnimation(index) {
        if (index === 1) { // transporte
            spawnBgAnimation('', 'pan-right', '0', '40%');
        } else if (index === 7) { // polos opuestos
            spawnBgAnimation('', 'magnet-pull', '40%', '30%');
            spawnBgAnimation('', 'magnet-pull', '60%', '60%');
        } else if (index === 9) { // no te soporto jajajaja
            spawnBgAnimation('', 'float-up', '30%', '50%');
            spawnBgAnimation('', 'float-up', '70%', '40%');
        }
    }

    function displayNextStoryObject() {
        if (currentStoryIndex >= storyLines.length) {
            // End of story -> Show Final Gift
            setTimeout(() => {
                finalGiftContainer.style.display = 'flex';
            }, 1000);
            return;
        }

        triggerStoryAnimation(currentStoryIndex);

        const line = storyLines[currentStoryIndex];
        const textElement = document.createElement('div');
        textElement.className = 'story-text';
        textElement.innerText = line;

        storyContainer.appendChild(textElement);
        void textElement.offsetWidth; // Force reflow
        textElement.classList.add('active');

        const readingTime = Math.max(3500, line.length * 70);

        setTimeout(() => {
            textElement.classList.remove('active');
            textElement.classList.add('exit');
            setTimeout(() => {
                textElement.remove();
                currentStoryIndex++;
                displayNextStoryObject();
            }, 2000);
        }, readingTime);
    }

    // --- FINAL GIFT INTERACTION ---
    finalGift.addEventListener('click', () => {
        if (finalGift.classList.contains('open')) return;

        finalGift.classList.add('open');
        giftInstruction.style.opacity = '0';

        // Explosion of butterflies, flowers, etc
        const emojis = ['✧', '✦', 'sparkles', 'react', 'heart', 'star'];
        const rect = finalGift.getBoundingClientRect();
        const startX = rect.left + rect.width / 2;
        const startY = rect.top + rect.height / 2;

        for (let i = 0; i < 40; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.className = 'magic-particle';
                particle.innerText = emojis[Math.floor(Math.random() * emojis.length)];

                // Random destination around the screen
                const tx = (Math.random() - 0.5) * window.innerWidth;
                const ty = (Math.random() - 0.5) * window.innerHeight * 1.5 - 200; // tends upward
                const r = Math.random() * 360;

                particle.style.setProperty('--tx', `${tx}px`);
                particle.style.setProperty('--ty', `${ty}px`);
                particle.style.setProperty('--tx-mid', `${tx * 0.3}px`);
                particle.style.setProperty('--ty-mid', `${ty * 0.3}px`);
                particle.style.setProperty('--rot', `${r}deg`);

                particle.style.left = `${startX}px`;
                particle.style.top = `${startY}px`;

                document.body.appendChild(particle);

                setTimeout(() => particle.remove(), 4000);
            }, i * 30); // staggered burst
        }
    });

    // --- Particle System (Fireflies/Stars) ---
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');

    let width, height;
    let particles = [];

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
            this.life = Math.random() * 100;
            this.alpha = Math.random();
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (Math.random() > 0.95) {
                this.speedX += Math.random() * 0.2 - 0.1;
                this.speedY += Math.random() * 0.2 - 0.1;
            }
            if (this.x < 0) this.x = width;
            if (this.x > width) this.x = 0;
            if (this.y < 0) this.y = height;
            if (this.y > height) this.y = 0;
            this.life++;
            this.alpha = Math.abs(Math.sin(this.life * 0.05));
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(212, 175, 55, ${this.alpha * 0.8})`;
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#d4af37';
            ctx.fill();
        }
    }
    function initParticles() {
        particles = [];
        for (let i = 0; i < 100; i++) { particles.push(new Particle()); }
    }
    function animateParticles() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animateParticles);
    }
    initParticles();
    animateParticles();
});
