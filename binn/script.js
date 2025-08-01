// Game State
const gameState = {
    currentStep: 0,
    currentChapter: 0,
    xp: localStorage.getItem('chizelXP') ? parseInt(localStorage.getItem('chizelXP')) : 0,
    level: localStorage.getItem('chizelLevel') ? parseInt(localStorage.getItem('chizelLevel')) : 1,
    completedTasks: [],
    audioEnabled: true,
    currentTask: null,
    taskCompleted: false,
    inventory: {
        'double-xp': 0,
        'time-extend': 0,
        'hint': 3
    },
    brainrotHealth: 100,
    volume: 0.7,
    seenIntro: localStorage.getItem('seenIntro') === 'true'
};

// DOM Elements
const elements = {
    leftCharacter: document.querySelector('.character.left'),
    rightCharacter: document.querySelector('.character.right'),
    leftBubble: document.querySelector('.left-bubble'),
    rightBubble: document.querySelector('.right-bubble'),
    leftBubbleContent: document.querySelector('.left-bubble .bubble-content'),
    rightBubbleContent: document.querySelector('.right-bubble .bubble-content'),
    optionsContainer: document.querySelector('.options-container'),
    xpBar: document.querySelector('.xp-progress'),
    xpValue: document.querySelector('.xp-value'),
    levelValue: document.querySelector('.level-value'),
    taskContainer: document.querySelector('.task-container'),
    taskContent: document.querySelector('.task-content'),
    taskSubmit: document.querySelector('.task-submit'),
    taskHeader: document.querySelector('.task-header'),
    taskHint: document.querySelector('.task-hint'),
    hintText: document.querySelector('.hint-text'),
    audioToggle: document.querySelector('.audio-toggle'),
    volumeSlider: document.querySelector('.volume-slider'),
    volumeControl: document.querySelector('.volume-control'),
    typingIndicator: document.querySelector('.typing-indicator'),
    thinkingCloud: document.querySelector('.thinking-cloud'),
    cloudContent: document.querySelector('.cloud-content'),
    enemyCharacter: document.querySelector('.enemy-character'),
    brainrotHealth: document.querySelector('.health-progress'),
    inventoryContainer: document.querySelector('.inventory-container'),
    missionComplete: document.querySelector('.mission-complete'),
    earnedXp: document.querySelector('.earned-xp'),
    rewardMessage: document.querySelector('.reward-message'),
    nextMissionBtn: document.querySelector('.next-mission'),
    logo: document.querySelector('.logo')
};

// Audio Elements
const audio = {
    success: new Audio('assets/success.mp3'),
    notification: new Audio('assets/notification.mp3'),
    music: new Audio('assets/music.mp3')
};

// Set initial volume
audio.music.volume = gameState.volume;
audio.success.volume = gameState.volume;
audio.notification.volume = gameState.volume;
audio.music.loop = true;

// Story Chapters
const storyChapters = [
    // Chapter 0: Introduction
    [
        {
            speaker: 'zippy',
            message: "Greetings, Space Cadet! I'm ZIPPY, your AI mentor from Chizel. We're on a critical mission to defeat Brainrot and turn screen time into SKILL time across the galaxy!",
            options: [
                { text: "Ready for mission!", nextStep: 1, xp: 10 },
                { text: "What's Brainrot?", nextStep: 2, xp: 5 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Excellent! Brainrot is a cosmic parasite feeding on wasted potential. It turns learning time into mindless scrolling. But together, we'll stop it!",
            options: [
                { text: "How do we fight it?", nextStep: 3, xp: 5 },
                { text: "What's our first move?", nextStep: 4, xp: 5 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Brainrot is an ancient cosmic entity that drains knowledge from young minds across the universe. It thrives on passive consumption and hates active learning!",
            options: [
                { text: "That's terrible!", nextStep: 3, xp: 5 },
                { text: "How can I help?", nextStep: 4, xp: 5 }
            ]
        },
        {
            speaker: 'zippy',
            message: "By completing cosmic learning missions! Each task weakens Brainrot and strengthens your mind. We'll use math, logic, and creativity as our weapons!",
            options: [
                { text: "Let's do this!", nextStep: 5, xp: 10 },
                { text: "Show me an example", nextStep: 6, xp: 5 }
            ]
        },
        {
            speaker: 'zippy',
            message: "First, we need to calibrate your learning engine. Complete these training missions to power up our anti-Brainrot weapons!",
            options: [
                { text: "I'm ready to train!", nextStep: 7, xp: 10 },
                { text: "What will I learn?", nextStep: 8, xp: 5 }
            ]
        },
        {
            speaker: 'zippy',
            message: "That's the spirit! Remember, every XP point you earn weakens Brainrot's hold on the galaxy. Let's launch your first mission!",
            options: [],
            action: 'startTasks'
        },
        {
            speaker: 'zippy',
            message: "For example: If a rocket travels at 1000 km/h for 3 hours, how far does it go? See? You're already doing space math! The answer is 3000 km!",
            options: [
                { text: "Got it! Let's go!", nextStep: 5, xp: 10 },
                { text: "Show me more", nextStep: 9, xp: 5 }
            ]
        },
        {
            speaker: 'zippy',
            message: "You'll master cosmic math, intergalactic logic puzzles, alien languages, and space science! Each skill is a weapon against Brainrot!",
            options: [
                { text: "Sounds amazing!", nextStep: 5, xp: 10 },
                { text: "How does XP work?", nextStep: 10, xp: 5 }
            ]
        },
        {
            speaker: 'zippy',
            message: "XP powers your learning engine! More XP = stronger skills = bigger hits on Brainrot! Your level shows your cosmic learning rank!",
            options: [
                { text: "Understood! Let's go!", nextStep: 5, xp: 10 },
                { text: "What are power-ups?", nextStep: 11, xp: 5 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Power-ups give you special abilities! Double XP boosts, time extenders, and hint capsules. You'll earn them by completing missions!",
            options: [
                { text: "Awesome! Begin mission!", nextStep: 5, xp: 15 },
                { text: "Tell me about Brainrot again", nextStep: 2, xp: 5 }
            ]
        }
    ],
    // Chapter 1: After first tasks
    [
        {
            speaker: 'zippy',
            message: "INCREDIBLE! You've completed training and earned your first cosmic badge! Brainrot is already feeling the heat!",
            options: [
                { text: "What's next?", nextStep: 1, xp: 10 },
                { text: "How's Brainrot doing?", nextStep: 2, xp: 5 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Now we journey to the Math Nebula! Brainrot has hidden knowledge crystals there. Solve equations to reclaim them!",
            options: [
                { text: "Let's go!", nextStep: 3, xp: 10 },
                { text: "What kind of equations?", nextStep: 4, xp: 5 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Brainrot's health is down 20%! Your learning is working! Keep going to weaken it further and free the trapped knowledge!",
            options: [
                { text: "Yes! Next mission!", nextStep: 3, xp: 10 },
                { text: "How do we defeat it completely?", nextStep: 5, xp: 5 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Prepare for Math Nebula Mission! Solve these cosmic equations to power up our knowledge cannon!",
            options: [],
            action: 'startTasks'
        },
        {
            speaker: 'zippy',
            message: "We'll face addition, subtraction, multiplication, and division problems with increasing difficulty. Each one powers our weapons!",
            options: [
                { text: "I'm ready!", nextStep: 3, xp: 10 },
                { text: "Show me an example", nextStep: 6, xp: 5 }
            ]
        },
        {
            speaker: 'zippy',
            message: "To defeat Brainrot completely, we need to reach Level 5 and complete all galaxy sectors! You're on your way, Space Cadet!",
            options: [
                { text: "Understood! Continue!", nextStep: 3, xp: 10 },
                { text: "What sectors are left?", nextStep: 7, xp: 5 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Example: If a space station has 15 aliens and 10 humans, what's the total? (25!) See? You're already solving space population math!",
            options: [
                { text: "Easy! Next mission!", nextStep: 3, xp: 10 },
                { text: "Give me a harder one", nextStep: 8, xp: 5 }
            ]
        },
        {
            speaker: 'zippy',
            message: "After Math Nebula, we have Logic Asteroid Belt, Science Supernova, and Creativity Quasar! Each sector unlocks new powers!",
            options: [
                { text: "Let's do this!", nextStep: 3, xp: 15 },
                { text: "Tell me about Logic Asteroid", nextStep: 9, xp: 5 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Okay: If a rocket's speed doubles every hour (starting at 100 km/h), how fast is it after 3 hours? (800 km/h) That's exponential growth!",
            options: [
                { text: "Got it! Begin mission!", nextStep: 3, xp: 15 },
                { text: "Explain exponential growth", nextStep: 10, xp: 10 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Logic Asteroid teaches pattern recognition and problem-solving - crucial for hacking Brainrot's defenses! But first, Math Nebula!",
            options: [
                { text: "Understood! Math first!", nextStep: 3, xp: 10 },
                { text: "How do I track progress?", nextStep: 11, xp: 5 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Exponential growth means doubling each time - 100, 200, 400, 800... It's how Brainrot spreads, and how we'll defeat it with learning!",
            options: [
                { text: "Fascinating! Let's go!", nextStep: 3, xp: 15 },
                { text: "How does learning defeat it?", nextStep: 12, xp: 5 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Your XP bar tracks progress. Each level unlocks new sectors. Complete all sectors to become a Chizel Guardian and defeat Brainrot forever!",
            options: [
                { text: "Got it! Begin mission!", nextStep: 3, xp: 10 },
                { text: "What are Chizel Guardians?", nextStep: 13, xp: 5 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Learning creates neural pathways that Brainrot can't penetrate! The more you learn, the more you're immune to its effects!",
            options: [
                { text: "Amazing! Let's learn!", nextStep: 3, xp: 15 },
                { text: "Tell me more science", nextStep: 14, xp: 10 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Chizel Guardians are elite learners who've mastered all sectors. They protect the galaxy from Brainrot and mentor new cadets like you!",
            options: [
                { text: "I want to be one!", nextStep: 3, xp: 15 },
                { text: "How long does it take?", nextStep: 15, xp: 5 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Your brain has 100 billion neurons! Learning creates connections between them - like building cosmic bridges Brainrot can't cross!",
            options: [
                { text: "Wow! Let's build bridges!", nextStep: 3, xp: 15 },
                { text: "How do neurons work?", nextStep: 16, xp: 10 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Depends on your learning speed! Some reach Guardian in weeks, others months. The journey is what matters - each step weakens Brainrot!",
            options: [
                { text: "I'll start now!", nextStep: 3, xp: 15 },
                { text: "What's my first goal?", nextStep: 17, xp: 5 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Neurons are brain cells that communicate via electrical signals. Learning strengthens these connections - like upgrading your spaceship!",
            options: [
                { text: "Fascinating! Let's go!", nextStep: 3, xp: 15 },
                { text: "More brain facts please", nextStep: 18, xp: 10 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Complete Math Nebula to reach Level 2! Then we unlock Logic Asteroid with even cooler challenges and rewards!",
            options: [
                { text: "Yes! Begin Math Nebula!", nextStep: 3, xp: 15 },
                { text: "What rewards?", nextStep: 19, xp: 5 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Did you know your brain generates enough electricity to power a small light bulb? That's the power you're harnessing against Brainrot!",
            options: [
                { text: "Incredible! Let's use it!", nextStep: 3, xp: 15 },
                { text: "Tell me more", nextStep: 20, xp: 10 }
            ]
        },
        {
            speaker: 'zippy',
            message: "New power-ups, cosmic badges, skill unlocks, and even real-world prizes! But the best reward is watching Brainrot shrink as you grow!",
            options: [
                { text: "Awesome! Let's begin!", nextStep: 3, xp: 15 },
                { text: "Show me Math Nebula", nextStep: 21, xp: 5 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Your brain is more complex than the entire internet! Each learning session builds new pathways - like creating your own cosmic web!",
            options: [
                { text: "Let's build it!", nextStep: 3, xp: 15 },
                { text: "How often should I learn?", nextStep: 22, xp: 5 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Here's a preview: Solve 15 × 4 to power our engine! (Answer: 60) Each correct answer charges our knowledge cannon to blast Brainrot!",
            options: [
                { text: "Got it! Begin full mission!", nextStep: 3, xp: 15 },
                { text: "Give me another example", nextStep: 23, xp: 5 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Daily missions work best! Even 15 minutes weakens Brainrot. Consistency is key - like a spaceship's steady course through the stars!",
            options: [
                { text: "I'll learn daily!", nextStep: 3, xp: 15 },
                { text: "What if I miss a day?", nextStep: 24, xp: 5 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Try this: A spaceship carries 120 aliens in 3 pods. How many per pod? (40!) That's division - crucial for resource allocation in space!",
            options: [
                { text: "Easy! Begin mission!", nextStep: 3, xp: 15 },
                { text: "Give me a harder one", nextStep: 25, xp: 10 }
            ]
        },
        {
            speaker: 'zippy',
            message: "No problem! Brainrot only grows when learning stops completely. Just resume your missions when you can - the galaxy needs you!",
            options: [
                { text: "Understood! Let's go!", nextStep: 3, xp: 15 },
                { text: "Tell me about streaks", nextStep: 26, xp: 5 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Challenge: If a comet appears every 7 years, how many in 28 years? (4!) That's division with remainders - advanced space math!",
            options: [
                { text: "Got it! Begin mission!", nextStep: 3, xp: 20 },
                { text: "Explain remainders", nextStep: 27, xp: 10 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Learning streaks (consecutive days) give bonus XP! But don't worry about breaks - the important thing is your overall journey!",
            options: [
                { text: "Got it! Begin Math Nebula!", nextStep: 3, xp: 15 },
                { text: "What's my current streak?", nextStep: 28, xp: 5 }
            ]
        },
        {
            speaker: 'zippy',
            message: "A remainder is what's left after division. Like if 10 aliens share 3 pizzas, each gets 3 slices with 1 left over! (10 ÷ 3 = 3 R1)",
            options: [
                { text: "Understood! Let's go!", nextStep: 3, xp: 20 },
                { text: "Give me another example", nextStep: 29, xp: 10 }
            ]
        },
        {
            speaker: 'zippy',
            message: "You're just starting - no streak yet! Complete missions daily to build one. At 7 days, you get a bonus power-up!",
            options: [
                { text: "I'll build a streak!", nextStep: 3, xp: 15 },
                { text: "What power-up?", nextStep: 30, xp: 5 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Try this: 17 ÷ 5 = 3 R2 (like sharing 17 moon rocks among 5 astronauts). Remainders help with fair distribution in space!",
            options: [
                { text: "Got it! Begin mission!", nextStep: 3, xp: 20 },
                { text: "How is this useful?", nextStep: 31, xp: 10 }
            ]
        },
        {
            speaker: 'zippy',
            message: "A Double XP Booster! It doubles all XP for your next mission - helping you level up faster and hit Brainrot harder!",
            options: [
                { text: "Awesome! Let's begin!", nextStep: 3, xp: 15 },
                { text: "How do I use power-ups?", nextStep: 32, xp: 5 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Space missions often need exact resource division - like fuel between rockets or food for astronauts. Remainders ensure nothing's wasted!",
            options: [
                { text: "Fascinating! Let's go!", nextStep: 3, xp: 20 },
                { text: "Give me a space example", nextStep: 33, xp: 10 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Click power-ups in your inventory before starting a mission! They automatically activate when needed. You'll earn more by leveling up!",
            options: [
                { text: "Got it! Begin Math Nebula!", nextStep: 3, xp: 15 },
                { text: "Show me my inventory", nextStep: 34, xp: 5 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Imagine dividing 100kg of space food among 7 astronauts. 100 ÷ 7 = 14 R2 - each gets 14kg with 2kg left for emergencies!",
            options: [
                { text: "Makes sense! Let's go!", nextStep: 3, xp: 20 },
                { text: "What about decimals?", nextStep: 35, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Your inventory holds power-ups you've earned. Currently you have 3 hint capsules! Earn more by completing missions and leveling up!",
            options: [
                { text: "Understood! Begin mission!", nextStep: 3, xp: 15 },
                { text: "How do hints work?", nextStep: 36, xp: 5 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Decimals are another way to handle remainders! 100 ÷ 7 ≈ 14.2857 kg. But in space, we often use whole numbers for simplicity!",
            options: [
                { text: "Got it! Begin mission!", nextStep: 3, xp: 20 },
                { text: "When to use decimals?", nextStep: 37, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Click the hint icon during missions for clues! Each mission has limited hints, so use them wisely when really stuck!",
            options: [
                { text: "Understood! Let's go!", nextStep: 3, xp: 15 },
                { text: "Can I earn more hints?", nextStep: 38, xp: 5 }
            ]
        },
        {
            speaker: 'zippy',
            message: "For precise measurements like fuel ratios or scientific data! But for daily tasks, whole numbers often suffice. Both are important!",
            options: [
                { text: "Makes sense! Begin mission!", nextStep: 3, xp: 20 },
                { text: "Show me decimal examples", nextStep: 39, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Yes! Complete bonus challenges or reach new levels to earn more. The Logic Asteroid sector has especially generous hint rewards!",
            options: [
                { text: "Can't wait! Let's begin!", nextStep: 3, xp: 15 },
                { text: "What are bonus challenges?", nextStep: 40, xp: 5 }
            ]
        },
        {
            speaker: 'zippy',
            message: "A rocket travels 250km in 4 hours. 250 ÷ 4 = 62.5 km/h! Decimals give exact speed for navigation calculations!",
            options: [
                { text: "Understood! Begin mission!", nextStep: 3, xp: 20 },
                { text: "Give me another", nextStep: 41, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Extra missions that appear randomly! They offer bonus XP and power-ups. Keep an eye out - they're marked with a gold border!",
            options: [
                { text: "I'll watch for them!", nextStep: 3, xp: 15 },
                { text: "How often do they appear?", nextStep: 42, xp: 5 }
            ]
        },
        {
            speaker: 'zippy',
            message: "A space probe weighs 347.5kg with fuel. After using 128.3kg, what remains? (219.2kg) Precise measurements prevent space mishaps!",
            options: [
                { text: "Got it! Begin Math Nebula!", nextStep: 3, xp: 20 },
                { text: "Explain subtraction", nextStep: 43, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "About 1-2 per day if you're active! They're more common in higher level sectors. Math Nebula has a 20% chance per mission!",
            options: [
                { text: "Understood! Let's go!", nextStep: 3, xp: 15 },
                { text: "What's in Math Nebula?", nextStep: 44, xp: 5 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Subtraction finds differences - crucial for fuel tracking, distance calculations, and resource management in space missions!",
            options: [
                { text: "Makes sense! Begin!", nextStep: 3, xp: 20 },
                { text: "Show me space examples", nextStep: 45, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Math Nebula focuses on arithmetic: addition, subtraction, multiplication, division - the foundation for all space calculations!",
            options: [
                { text: "Ready to begin!", nextStep: 3, xp: 15 },
                { text: "What comes after?", nextStep: 46, xp: 5 }
            ]
        },
        {
            speaker: 'zippy',
            message: "If Mars is 225M km away and we've traveled 150M km, how far left? (75M km)! Or if you have 500kg of fuel and use 320kg... (180kg left)!",
            options: [
                { text: "Got it! Begin mission!", nextStep: 3, xp: 20 },
                { text: "Give me a harder one", nextStep: 47, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "After Math comes Logic Asteroid (patterns, sequences), then Science Supernova (space facts), then Creativity Quasar (problem-solving)!",
            options: [
                { text: "Exciting! Let's begin!", nextStep: 3, xp: 15 },
                { text: "Tell me about Logic", nextStep: 48, xp: 5 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Challenge: A spaceship had 1200kg fuel. It used 475kg to reach orbit, then 380kg to the moon. How much remains? (345kg)!",
            options: [
                { text: "Got it! Begin Math Nebula!", nextStep: 3, xp: 25 },
                { text: "Explain multi-step problems", nextStep: 49, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Logic Asteroid teaches pattern recognition - crucial for decoding alien messages, solving space puzzles, and hacking Brainrot's systems!",
            options: [
                { text: "Sounds cool! Math first!", nextStep: 3, xp: 15 },
                { text: "Show me a pattern", nextStep: 50, xp: 5 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Real problems often need multiple steps - like calculating remaining fuel after several maneuvers. Break them down piece by piece!",
            options: [
                { text: "Understood! Let's go!", nextStep: 3, xp: 20 },
                { text: "Give me another example", nextStep: 51, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Try this sequence: 2, 4, 8, 16... What's next? (32 - doubling each time!) Patterns help predict cosmic events like comet returns!",
            options: [
                { text: "Got it! Begin Math Nebula!", nextStep: 3, xp: 15 },
                { text: "Give me another pattern", nextStep: 52, xp: 5 }
            ]
        },
        {
            speaker: 'zippy',
            message: "If a space hotel has 50 rooms with 4 guests each, and 12 rooms are empty, how many guests? (50-12=38 rooms used × 4 guests=152)!",
            options: [
                { text: "Makes sense! Begin!", nextStep: 3, xp: 25 },
                { text: "Explain multiplication", nextStep: 53, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Here's another: 3, 5, 7, 9... (11 - adding 2 each time!) Recognizing patterns helps solve problems faster in space emergencies!",
            options: [
                { text: "Understood! Let's go!", nextStep: 3, xp: 15 },
                { text: "How does this help?", nextStep: 54, xp: 5 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Multiplication is repeated addition - like 4 guests × 38 rooms = 4+4+4... (38 times)! It's essential for scaling space calculations!",
            options: [
                { text: "Got it! Begin mission!", nextStep: 3, xp: 20 },
                { text: "Show me space uses", nextStep: 55, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Pattern recognition speeds up problem-solving - vital when quick decisions are needed, like during solar flares or system failures!",
            options: [
                { text: "Makes sense! Math first!", nextStep: 3, xp: 15 },
                { text: "Give me a logic puzzle", nextStep: 56, xp: 5 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Calculating food for 100 astronauts for 30 days (100×30=3000 meals), or fuel for 5 rockets making 12 trips each (5×12=60 fuel loads)!",
            options: [
                { text: "Understood! Begin!", nextStep: 3, xp: 20 },
                { text: "What about division?", nextStep: 57, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Puzzle: If all Zorgons are green and this alien is green, is it a Zorgon? (Not necessarily! Other aliens could be green too!)",
            options: [
                { text: "Got it! Math Nebula now!", nextStep: 3, xp: 15 },
                { text: "Explain the logic", nextStep: 58, xp: 5 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Division distributes resources - like 3000 meals ÷ 100 astronauts = 30 days of food! Or 60 fuel loads ÷ 5 rockets = 12 trips each!",
            options: [
                { text: "Makes sense! Begin!", nextStep: 3, xp: 20 },
                { text: "Give me a word problem", nextStep: 59, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "The statement says all Zorgons are green, not that ONLY Zorgons are green. This is crucial for accurate alien identification!",
            options: [
                { text: "Understood! Let's go!", nextStep: 3, xp: 15 },
                { text: "Give me another puzzle", nextStep: 60, xp: 5 }
            ]
        },
        {
            speaker: 'zippy',
            message: "A space station has 48 energy cells to distribute equally among 6 departments. How many each? (48 ÷ 6 = 8 cells per department!)",
            options: [
                { text: "Got it! Begin Math Nebula!", nextStep: 3, xp: 20 },
                { text: "What if it doesn't divide evenly?", nextStep: 61, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Puzzle: A spaceship's path goes North, East, South, West. What's next? (North - it's moving in a clockwise square pattern!)",
            options: [
                { text: "Cool! Math mission now!", nextStep: 3, xp: 15 },
                { text: "Explain pattern recognition", nextStep: 62, xp: 5 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Then we use remainders or decimals! Like 50 cells ÷ 6 depts = 8 each with 2 left over for emergencies! Or ≈8.33 cells per dept!",
            options: [
                { text: "Understood! Let's go!", nextStep: 3, xp: 20 },
                { text: "Show me another example", nextStep: 63, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Recognizing patterns helps predict what comes next - like navigation sequences, alien communication, or even Brainrot's attacks!",
            options: [
                { text: "Fascinating! Math first!", nextStep: 3, xp: 15 },
                { text: "How to improve this skill?", nextStep: 64, xp: 5 }
            ]
        },
        {
            speaker: 'zippy',
            message: "175kg of oxygen ÷ 8 astronauts = 21.875kg each! Or 21kg each with 7kg left! Both approaches have space applications!",
            options: [
                { text: "Got it! Begin mission!", nextStep: 3, xp: 20 },
                { text: "Which is better?", nextStep: 65, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Practice with sequences, puzzles, and games! The Logic Asteroid sector has special training for this. First, master Math Nebula!",
            options: [
                { text: "Understood! Let's begin!", nextStep: 3, xp: 15 },
                { text: "What math will we do?", nextStep: 66, xp: 5 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Depends on the situation! Whole numbers for discrete items (like oxygen tanks), decimals for continuous measurements (like fuel)!",
            options: [
                { text: "Makes sense! Begin!", nextStep: 3, xp: 20 },
                { text: "Show me both approaches", nextStep: 67, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Math Nebula covers: Basic operations, word problems, multi-step calculations, and applying math to real space scenarios!",
            options: [
                { text: "Ready to start!", nextStep: 3, xp: 15 },
                { text: "Show me a word problem", nextStep: 68, xp: 5 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Oxygen tanks: 175 ÷ 8 = 21 R7 (give 21kg tanks, keep 7kg reserve). Fuel: 175 ÷ 8 = 21.875kg (precise measurement for engines)!",
            options: [
                { text: "Understood! Let's go!", nextStep: 3, xp: 20 },
                { text: "Give me a fuel problem", nextStep: 69, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "A cargo ship carries 15 crates weighing 12kg each. What's the total weight? (15 × 12 = 180kg) - crucial for launch calculations!",
            options: [
                { text: "Got it! Begin mission!", nextStep: 3, xp: 15 },
                { text: "Give me a harder one", nextStep: 70, xp: 5 }
            ]
        },
        {
            speaker: 'zippy',
            message: "A rocket uses 12.5kg fuel per minute. How much for 8 minutes? (12.5 × 8 = 100kg)! Always monitor fuel in space missions!",
            options: [
                { text: "Makes sense! Begin!", nextStep: 3, xp: 20 },
                { text: "What about different rates?", nextStep: 71, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Challenge: If 3 rockets carry 24 crates total, and 2 rockets carry the same amount, how many on the third? (24 - (2×8) = 8)!",
            options: [
                { text: "Understood! Let's go!", nextStep: 3, xp: 20 },
                { text: "Explain the steps", nextStep: 72, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Rates vary by engine mode! Idle: 5kg/min. Cruise: 12.5kg/min. Boost: 20kg/min. Always calculate based on current mode!",
            options: [
                { text: "Got it! Begin mission!", nextStep: 3, xp: 20 },
                { text: "Give me a boost example", nextStep: 73, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "1. If 2 rockets carry equal amounts: 24 ÷ 3 = 8 crates average. 2. So 2 rockets have 8 each (16 total). 3. Third has 24 - 16 = 8!",
            options: [
                { text: "Makes sense! Begin!", nextStep: 3, xp: 20 },
                { text: "Give me another", nextStep: 74, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Boost example: 3 minutes boost (20kg/min) + 5 minutes cruise (12.5kg/min) = (3×20) + (5×12.5) = 60 + 62.5 = 122.5kg total!",
            options: [
                { text: "Understood! Let's go!", nextStep: 3, xp: 25 },
                { text: "What about mixed problems?", nextStep: 75, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "A space truck carries 36 boxes. The first 2 stops deliver 12 boxes each. How many remain? (36 - (12×2) = 12 boxes left)!",
            options: [
                { text: "Got it! Begin Math Nebula!", nextStep: 3, xp: 20 },
                { text: "Give me a harder one", nextStep: 76, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Mixed problem: A rocket has 200kg fuel. It uses 25kg to launch, then 12.5kg/min for 10min. Remaining fuel? 200 - 25 - (12.5×10) = 50kg!",
            options: [
                { text: "Makes sense! Begin!", nextStep: 3, xp: 25 },
                { text: "Break it down", nextStep: 77, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Challenge: A spaceship has 5 crew members who each work 8 hours daily. Total weekly (7-day) work hours? (5 × 8 × 7 = 280 hours)!",
            options: [
                { text: "Understood! Let's go!", nextStep: 3, xp: 25 },
                { text: "Explain multiplication", nextStep: 78, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "1. Calculate launch use: 200 - 25 = 175kg. 2. Calculate cruise use: 12.5 × 10 = 125kg. 3. Subtract: 175 - 125 = 50kg remaining!",
            options: [
                { text: "Got it! Begin mission!", nextStep: 3, xp: 25 },
                { text: "Give me another", nextStep: 79, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Multiplication combines equal groups - like 5 crew × 8 hours = total daily hours (40). Then ×7 days = weekly total (280)!",
            options: [
                { text: "Makes sense! Begin!", nextStep: 3, xp: 20 },
                { text: "Show me division", nextStep: 80, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "A satellite uses 15kg fuel/day. After 7 days, it has 195kg left. Initial fuel? (15 × 7 = 105kg used) + 195 = 300kg initial!",
            options: [
                { text: "Understood! Let's go!", nextStep: 3, xp: 25 },
                { text: "Explain the steps", nextStep: 81, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Division splits into equal parts - like 280 weekly hours ÷ 5 crew = 56 hours each! Or 300kg fuel ÷ 15kg/day = 20 days supply!",
            options: [
                { text: "Got it! Begin Math Nebula!", nextStep: 3, xp: 20 },
                { text: "Give me a word problem", nextStep: 82, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "1. Calculate total used: 15kg/day × 7 days = 105kg. 2. Add remaining: 105 + 195 = 300kg initial! Working backwards is crucial in space!",
            options: [
                { text: "Makes sense! Begin!", nextStep: 3, xp: 25 },
                { text: "Give me another", nextStep: 83, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "A space station needs 168 meal packs weekly. If divided equally among 3 meal times daily, how many per meal? (168 ÷ (7×3) = 8 packs/meal!",
            options: [
                { text: "Understood! Let's go!", nextStep: 3, xp: 25 },
                { text: "Break it down", nextStep: 84, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "A probe had 500kg fuel. After 12 days at 25kg/day, remaining fuel? (500 - (25×12) = 200kg)! Always track fuel in space!",
            options: [
                { text: "Got it! Begin mission!", nextStep: 3, xp: 25 },
                { text: "What if rate changes?", nextStep: 85, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "1. Weekly meals: 168. 2. Daily meals: 7 days × 3 meals = 21 total meals. 3. 168 ÷ 21 = 8 packs per meal! Division splits fairly!",
            options: [
                { text: "Makes sense! Begin!", nextStep: 3, xp: 25 },
                { text: "Give me another", nextStep: 86, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "If first 5 days at 25kg/day, then 20kg/day: (5×25) + (7×20) = 125 + 140 = 265kg used. 500 - 265 = 235kg remaining! Track rates carefully!",
            options: [
                { text: "Understood! Let's go!", nextStep: 3, xp: 30 },
                { text: "Show me more", nextStep: 87, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "A lunar base uses 15 oxygen tanks weekly (3/day × 5 days + 0/weekend). Monthly (4-week) need? 15 × 4 = 60 tanks! Patterns help planning!",
            options: [
                { text: "Got it! Begin Math Nebula!", nextStep: 3, xp: 25 },
                { text: "What about irregular usage?", nextStep: 88, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Example: First week 25kg/day, second 20kg/day, third 15kg/day. Total used: (7×25) + (7×20) + (7×15) = 175 + 140 + 105 = 420kg!",
            options: [
                { text: "Makes sense! Begin!", nextStep: 3, xp: 30 },
                { text: "Can we average it?", nextStep: 89, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "For irregular usage, track daily! Like: Mon 5, Tue 7, Wed 4, Thu 6, Fri 5, Sat 3, Sun 2. Weekly total: 5+7+4+6+5+3+2 = 32 tanks!",
            options: [
                { text: "Understood! Let's go!", nextStep: 3, xp: 25 },
                { text: "Show me monthly total", nextStep: 90, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Average is total ÷ time: 420kg ÷ 21 days = 20kg/day average. Useful for long-term planning but not precise daily tracking!",
            options: [
                { text: "Got it! Begin mission!", nextStep: 3, xp: 30 },
                { text: "When to use averages?", nextStep: 91, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Assuming similar weeks: 32 tanks/week × 4 weeks = 128 tanks/month. Always add buffer for space missions - maybe 150 tanks!",
            options: [
                { text: "Makes sense! Begin!", nextStep: 3, xp: 25 },
                { text: "How much buffer?", nextStep: 92, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Averages help with big picture - like yearly fuel needs. But daily operations need exact amounts - both are important in space!",
            options: [
                { text: "Understood! Let's go!", nextStep: 3, xp: 30 },
                { text: "Give me an example", nextStep: 93, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Typically 10-20% extra for emergencies. For 128 tanks: 128 × 1.2 ≈ 154 tanks! In space, it's better to have and not need than need and not have!",
            options: [
                { text: "Got it! Begin Math Nebula!", nextStep: 3, xp: 25 },
                { text: "Show me the math", nextStep: 94, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Yearly planning: Average 20kg/day × 365 = 7,300kg fuel. Daily ops: Today needs 25kg for special maneuver. Both numbers matter!",
            options: [
                { text: "Makes sense! Begin!", nextStep: 3, xp: 30 },
                { text: "Give me a yearly problem", nextStep: 95, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "128 tanks × 0.2 = 25.6 extra (round to 26). 128 + 26 = 154 tanks! Or calculate directly: 128 × 1.2 = 153.6 ≈ 154!",
            options: [
                { text: "Understood! Let's go!", nextStep: 3, xp: 25 },
                { text: "What if 15% buffer?", nextStep: 96, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "A Mars base needs 15kg oxygen/day average. Yearly need? 15 × 365 = 5,475kg! Plus 20% buffer: 5,475 × 1.2 = 6,570kg to send!",
            options: [
                { text: "Got it! Begin mission!", nextStep: 3, xp: 30 },
                { text: "Break it down", nextStep: 97, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "128 × 0.15 = 19.2 extra (round to 20). 128 + 20 = 148 tanks! Or 128 × 1.15 = 147.2 ≈ 148! Percentages are crucial in space math!",
            options: [
                { text: "Makes sense! Begin!", nextStep: 3, xp: 25 },
                { text: "Teach me percentages", nextStep: 98, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "1. Daily average: 15kg. 2. Yearly total: 15 × 365 = 5,475kg. 3. Buffer (20%): 5,475 × 0.2 = 1,095kg. 4. Total: 5,475 + 1,095 = 6,570kg!",
            options: [
                { text: "Understood! Let's go!", nextStep: 3, xp: 30 },
                { text: "Give me another", nextStep: 99, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Percent means per hundred! 15% = 15/100 = 0.15. To find 15% of 200: 200 × 0.15 = 30. To add 15%: 200 × 1.15 = 230! Essential for space calculations!",
            options: [
                { text: "Got it! Begin Math Nebula!", nextStep: 3, xp: 25 },
                { text: "Show me space examples", nextStep: 100, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "A rocket's speed increases 12% after boost. If original speed was 5,000 km/h, new speed? 5,000 × 1.12 = 5,600 km/h! Percentages show changes!",
            options: [
                { text: "Understood! Let's begin!", nextStep: 3, xp: 30 },
                { text: "Give me another", nextStep: 101, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Fuel efficiency improves 8%. If old engines used 100kg/hour, new usage? 100 × 0.92 = 92kg/hour! Percentages track improvements!",
            options: [
                { text: "Got it! Begin mission!", nextStep: 3, xp: 30 },
                { text: "Show me calculation", nextStep: 102, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "1. Find 8% of 100: 100 × 0.08 = 8kg savings. 2. Subtract: 100 - 8 = 92kg! Or directly: 100 × (1 - 0.08) = 100 × 0.92 = 92kg!",
            options: [
                { text: "Makes sense! Begin!", nextStep: 3, xp: 30 },
                { text: "What about discounts?", nextStep: 103, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Space parts discounted 15%. Original price $200. Sale price? $200 × 0.85 = $170! Or calculate discount first: $200 × 0.15 = $30 off → $170!",
            options: [
                { text: "Understood! Let's go!", nextStep: 3, xp: 30 },
                { text: "Give me a harder one", nextStep: 104, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "A space suit costs $1,200 with 25% discount, plus 10% tax. Final price? 1. $1,200 × 0.75 = $900. 2. $900 × 1.10 = $990! Multi-step percentages!",
            options: [
                { text: "Got it! Begin Math Nebula!", nextStep: 3, xp: 35 },
                { text: "Break it down", nextStep: 105, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "1. Discount: $1,200 × 25% = $300 off → $900. 2. Tax: $900 × 10% = $90 extra → $990 total! Order matters in multi-step problems!",
            options: [
                { text: "Makes sense! Begin!", nextStep: 3, xp: 35 },
                { text: "Give me another", nextStep: 106, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "A space meal costs $15. With 20% discount and 8% tax: 1. $15 × 0.80 = $12. 2. $12 × 1.08 ≈ $12.96! Always round money to cents!",
            options: [
                { text: "Understood! Let's go!", nextStep: 3, xp: 35 },
                { text: "Show me rounding", nextStep: 107, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "A rocket part was $500, increased 10%, then discounted 15%. Final price? 1. $500 × 1.10 = $550. 2. $550 × 0.85 = $467.50! Notice it's not $500!",
            options: [
                { text: "Got it! Begin mission!", nextStep: 3, xp: 35 },
                { text: "Explain why", nextStep: 108, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "$12 × 1.08 = $12.96 (no rounding needed). But $12.964 would round to $12.96, while $12.966 would round to $12.97! Always look at the third decimal!",
            options: [
                { text: "Makes sense! Begin!", nextStep: 3, xp: 35 },
                { text: "Give me a rounding example", nextStep: 109, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Because percentages compound! 10% up then 15% down isn't net 5% down. The 15% discount is on the new $550 price, not original $500!",
            options: [
                { text: "Understood! Let's go!", nextStep: 3, xp: 35 },
                { text: "Show me the math", nextStep: 110, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Round $8.437 to cents: Look at 3rd decimal (7) ≥5 → round up → $8.44. Round $8.434: 4 <5 → round down → $8.43! Crucial for precise space calculations!",
            options: [
                { text: "Got it! Begin Math Nebula!", nextStep: 3, xp: 35 },
                { text: "Give me another", nextStep: 111, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Original: $500. After 10% increase: $500 + ($500 × 0.10) = $550. Then 15% discount: $550 - ($550 × 0.15) = $550 - $82.50 = $467.50!",
            options: [
                { text: "Makes sense! Begin!", nextStep: 3, xp: 35 },
                { text: "What's net change?", nextStep: 112, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Round 12.5kg to whole kg: 0.5 ≥0.5 → round up → 13kg. Round 12.4kg: 0.4 <0.5 → round down → 12kg! Useful for whole items like oxygen tanks!",
            options: [
                { text: "Understood! Let's go!", nextStep: 3, xp: 35 },
                { text: "When to round up?", nextStep: 113, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "$467.50 vs original $500: $32.50 decrease. $32.50 ÷ $500 = 0.065 → 6.5% net decrease (not 5%)! Percent changes aren't symmetric!",
            options: [
                { text: "Got it! Begin mission!", nextStep: 3, xp: 35 },
                { text: "Give me another example", nextStep: 114, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Always round up for safety in space! If calculation says 12.1 tanks needed, round to 13! Better to have extra than run out in space!",
            options: [
                { text: "Makes sense! Begin!", nextStep: 3, xp: 35 },
                { text: "Show me the difference", nextStep: 115, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "A $1,000 item: 50% up then 50% down: 1. $1,000 × 1.5 = $1,500. 2. $1,500 × 0.5 = $750! Net 25% loss, not break-even! Order matters!",
            options: [
                { text: "Understood! Let's go!", nextStep: 3, xp: 35 },
                { text: "Why not break-even?", nextStep: 116, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "12.1 oxygen tanks: Normal rounding → 12 tanks (risky!). Always round up → 13 tanks (safe!). In space, safety first - always round up!",
            options: [
                { text: "Got it! Begin Math Nebula!", nextStep: 3, xp: 35 },
                { text: "Give me a problem", nextStep: 117, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Because the 50% decrease applies to the new $1,500 amount ($750 off), not original $1,000! Percent changes are relative to current value!",
            options: [
                { text: "Makes sense! Begin!", nextStep: 3, xp: 35 },
                { text: "Show me the math", nextStep: 118, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "A mission needs 1.5kg food/astronaut/day for 5 astronauts for 8 days. Total food? 1.5 × 5 × 8 = 60kg. Round up → 65kg for safety!",
            options: [
                { text: "Understood! Let's go!", nextStep: 3, xp: 35 },
                { text: "Why 65kg not 60kg?", nextStep: 119, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Original: $1,000. After 50% up: $1,000 + ($1,000 × 0.5) = $1,500. Then 50% down: $1,500 - ($1,500 × 0.5) = $750! Net change: $250 loss!",
            options: [
                { text: "Got it! Begin mission!", nextStep: 3, xp: 35 },
                { text: "Give me another", nextStep: 120, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Because 60kg is exact minimum. Adding 5kg (8% buffer) accounts for spills, extra needs, or emergencies! Always plan buffer in space!",
            options: [
                { text: "Makes sense! Begin!", nextStep: 3, xp: 35 },
                { text: "How to calculate buffer?", nextStep: 121, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "A $800 item: 25% up then 25% down: 1. $800 × 1.25 = $1,000. 2. $1,000 × 0.75 = $750! Net $50 loss (6.25%) not break-even!",
            options: [
                { text: "Understood! Let's go!", nextStep: 3, xp: 35 },
                { text: "Show me the pattern", nextStep: 122, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Typical buffer is 10-20%. For 60kg: 60 × 1.10 = 66kg or 60 × 1.20 = 72kg. Choose based on mission risk - maybe 65kg compromise!",
            options: [
                { text: "Got it! Begin Math Nebula!", nextStep: 3, xp: 35 },
                { text: "Give me a problem", nextStep: 123, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "For equal % up and down, net change is always a loss! (1 + p)(1 - p) = 1 - p² <1. For p=0.5: 1.5 × 0.5 = 0.75 (25% loss)! Math is beautiful!",
            options: [
                { text: "Fascinating! Let's begin!", nextStep: 3, xp: 40 },
                { text: "Show me more math", nextStep: 124, xp: 20 }
            ]
        },
        {
            speaker: 'zippy',
            message: "A space station needs 80kg supplies weekly. With 15% buffer, how much to send monthly (4 weeks)? 80 × 4 × 1.15 = 368kg!",
            options: [
                { text: "Understood! Let's go!", nextStep: 3, xp: 35 },
                { text: "Break it down", nextStep: 125, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "This shows (a + b)(a - b) = a² - b² pattern! For percentages: (1 + p)(1 - p) = 1 - p². The loss is the square of the percentage change!",
            options: [
                { text: "Amazing! Begin mission!", nextStep: 3, xp: 40 },
                { text: "Give me an example", nextStep: 126, xp: 20 }
            ]
        },
        {
            speaker: 'zippy',
            message: "1. Weekly need: 80kg. 2. Monthly: 80 × 4 = 320kg. 3. Buffer: 320 × 0.15 = 48kg. 4. Total: 320 + 48 = 368kg! Or directly: 320 × 1.15 = 368kg!",
            options: [
                { text: "Got it! Begin!", nextStep: 3, xp: 35 },
                { text: "Give me another", nextStep: 127, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "For 20% changes: (1 + 0.2)(1 - 0.2) = 1 - 0.04 = 0.96 → 4% loss! For 10%: 1 - 0.01 = 0.99 → 1% loss! The pattern holds!",
            options: [
                { text: "Fascinating! Let's go!", nextStep: 3, xp: 40 },
                { text: "How is this useful?", nextStep: 128, xp: 20 }
            ]
        },
        {
            speaker: 'zippy',
            message: "A moon base uses 50kg water/week. With 20% buffer, quarterly (13-week) supply? 50 × 13 × 1.20 = 780kg! Always plan ahead in space!",
            options: [
                { text: "Makes sense! Begin!", nextStep: 3, xp: 35 },
                { text: "Why 13 weeks?", nextStep: 129, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Understanding this prevents financial mistakes in space trade! If prices fluctuate ±10%, you lose 1% overall (not break-even)!",
            options: [
                { text: "Understood! Let's begin!", nextStep: 3, xp: 40 },
                { text: "Give me a trade example", nextStep: 130, xp: 20 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Because quarters have 13 weeks (52 weeks/year ÷ 4 = 13)! Precise planning is crucial in space resource management!",
            options: [
                { text: "Got it! Begin mission!", nextStep: 3, xp: 35 },
                { text: "Show me yearly total", nextStep: 131, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Buying at $100, selling at +10% ($110), then buying at -10% ($99), then selling at +10% ($108.90): Net $8.90 gain on $100 (8.9%) not 10%!",
            options: [
                { text: "Fascinating! Let's go!", nextStep: 3, xp: 40 },
                { text: "Break it down", nextStep: 132, xp: 20 }
            ]
        },
        {
            speaker: 'zippy',
            message: "50kg/week × 52 weeks = 2,600kg/year. With 20% buffer: 2,600 × 1.2 = 3,120kg annual supply! Always account for leap years in space!",
            options: [
                { text: "Understood! Let's begin!", nextStep: 3, xp: 35 },
                { text: "What about leap years?", nextStep: 133, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "1. Start: $100. 2. After +10%: $110. 3. After -10%: $99. 4. After +10%: $108.90. Net gain: $8.90! Sequence matters in compounding!",
            options: [
                { text: "Got it! Begin Math Nebula!", nextStep: 3, xp: 40 },
                { text: "Show me the pattern", nextStep: 134, xp: 20 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Leap year has 52 weeks + 1 day → 50kg/week × 52 = 2,600kg + 50kg for the extra day ≈ 2,650kg! Then add buffer: 2,650 × 1.2 = 3,180kg!",
            options: [
                { text: "Makes sense! Begin!", nextStep: 3, xp: 35 },
                { text: "Give me another", nextStep: 135, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "For n cycles of ±p%, final amount = initial × (1 - p²)^(n/2). For p=0.1, n=2: $100 × (1 - 0.01) = $99! Then next cycle: $99 × 1.1 = $108.90!",
            options: [
                { text: "Fascinating! Let's go!", nextStep: 3, xp: 40 },
                { text: "How to predict outcome?", nextStep: 136, xp: 20 }
            ]
        },
        {
            speaker: 'zippy',
            message: "A Mars colony uses 200kg/month. With 25% buffer, 5-year supply? 200 × 60 × 1.25 = 15,000kg! Long-term planning prevents space shortages!",
            options: [
                { text: "Understood! Let's begin!", nextStep: 3, xp: 35 },
                { text: "Break it down", nextStep: 137, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "For small p, after n cycles: ≈ initial × (1 - n×p²/2). For p=0.1, n=4: ≈ $100 × (1 - 0.02) = $98! Approximations help quick estimates!",
            options: [
                { text: "Got it! Begin mission!", nextStep: 3, xp: 40 },
                { text: "Show me exact vs approx", nextStep: 138, xp: 20 }
            ]
        },
        {
            speaker: 'zippy',
            message: "1. Monthly need: 200kg. 2. 5 years = 60 months. 3. Basic need: 200 × 60 = 12,000kg. 4. Buffer: 12,000 × 0.25 = 3,000kg. 5. Total: 15,000kg!",
            options: [
                { text: "Makes sense! Begin!", nextStep: 3, xp: 35 },
                { text: "Give me another", nextStep: 139, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Exact: $100 × 1.1 × 0.9 × 1.1 × 0.9 ≈ $98.01. Approx: $100 × (1 - 2×0.01) = $98! Close enough for quick space trade estimates!",
            options: [
                { text: "Understood! Let's go!", nextStep: 3, xp: 40 },
                { text: "When to use exact?", nextStep: 140, xp: 20 }
            ]
        },
        {
            speaker: 'zippy',
            message: "A lunar lab uses 80kg/month. With 15% buffer, 3-year supply? 80 × 36 × 1.15 = 3,312kg! Always plan for contingencies in space!",
            options: [
                { text: "Got it! Begin Math Nebula!", nextStep: 3, xp: 35 },
                { text: "Show me calculation", nextStep: 141, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Use exact for final calculations, especially with large amounts! Approximations are for quick checks and mental math during space negotiations!",
            options: [
                { text: "Makes sense! Begin!", nextStep: 3, xp: 40 },
                { text: "Give me an example", nextStep: 142, xp: 20 }
            ]
        },
        {
            speaker: 'zippy',
            message: "1. Monthly: 80kg. 2. 3 years = 36 months. 3. Basic: 80 × 36 = 2,880kg. 4. Buffer: 2,880 × 0.15 = 432kg. 5. Total: 2,880 + 432 = 3,312kg!",
            options: [
                { text: "Understood! Let's go!", nextStep: 3, xp: 35 },
                { text: "What if usage changes?", nextStep: 143, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Estimating $1,000,000 trade with 2% fluctuations: Approx. loss = 1,000,000 × n × 0.0002 = $200n. Exact calculation confirms $198,014 after 100 cycles!",
            options: [
                { text: "Got it! Begin mission!", nextStep: 3, xp: 40 },
                { text: "Show me the math", nextStep: 144, xp: 20 }
            ]
        },
        {
            speaker: 'zippy',
            message: "If usage increases 5kg/month: Month 1: 80kg, Month 2: 85kg... Use arithmetic series! Sum = n/2 × (2a + (n-1)d) = 36/2 × (160 + 35×5) = 5,130kg!",
            options: [
                { text: "Fascinating! Let's begin!", nextStep: 3, xp: 35 },
                { text: "Explain the formula", nextStep: 145, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Exact: 1,000,000 × (1 - 0.0004)^50 ≈ 1,000,000 × 0.9802 ≈ $980,200. Approx: 1,000,000 × (1 - 50×0.0004) = $980,000! Close enough for quick estimates!",
            options: [
                { text: "Understood! Let's go!", nextStep: 3, xp: 40 },
                { text: "When are they different?", nextStep: 146, xp: 20 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Sum = number of terms/2 × (first term + last term). Or n/2 × (2a + (n-1)d) where a=first term, d=common difference! Essential for space resource planning!",
            options: [
                { text: "Got it! Begin Math Nebula!", nextStep: 3, xp: 35 },
                { text: "Give me a problem", nextStep: 147, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "For large p or n, approximations diverge! p=0.5, n=10: exact = 0.5^10 ≈ 0.001, approx ≈ e^(-10×0.25/2) ≈ 0.287 - very different! Know when to use exact!",
            options: [
                { text: "Makes sense! Begin!", nextStep: 3, xp: 40 },
                { text: "Show me exact calculation", nextStep: 148, xp: 20 }
            ]
        },
        {
            speaker: 'zippy',
            message: "A space station uses 100kg in Month 1, increasing by 10kg/month. 1-year supply? 12/2 × (200 + 11×10) = 6 × 310 = 1,860kg! Plus buffer!",
            options: [
                { text: "Understood! Let's go!", nextStep: 3, xp: 35 },
                { text: "Add 20% buffer", nextStep: 149, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "For p=0.5, n=10: Exact product = (1.5 × 0.5)^5 ≈ 0.237^5 ≈ 0.001! Approx fails here - always use exact for large fluctuations in space economics!",
            options: [
                { text: "Got it! Begin mission!", nextStep: 3, xp: 40 },
                { text: "When does approx work?", nextStep: 150, xp: 20 }
            ]
        },
        {
            speaker: 'zippy',
            message: "1,860kg × 1.20 = 2,232kg! Always round up in space - maybe 2,250kg for safety! Precise calculations prevent space shortages!",
            options: [
                { text: "Makes sense! Begin!", nextStep: 3, xp: 35 },
                { text: "Give me another", nextStep: 151, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Approx works when p²n is small (typically <0.1). For p=0.1, n=10: p²n=0.1 → okay. p=0.3, n=10: p²n=0.9 → use exact! Crucial for space trade decisions!",
            options: [
                { text: "Understood! Let's go!", nextStep: 3, xp: 40 },
                { text: "Give me an example", nextStep: 152, xp: 20 }
            ]
        },
        {
            speaker: 'zippy',
            message: "A Mars base starts at 50kg/month, increasing 5kg/month. 2-year supply? 24/2 × (100 + 23×5) = 12 × 215 = 2,580kg! Plus 15% buffer → 2,967kg!",
            options: [
                { text: "Got it! Begin Math Nebula!", nextStep: 3, xp: 35 },
                { text: "Break it down", nextStep: 153, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "For p=0.1, n=20: p²n=0.2 → approx may be off by ~10%. Exact: ~0.82, Approx: ~0.80. Okay for estimates but use exact for final space contracts!",
            options: [
                { text: "Makes sense! Begin!", nextStep: 3, xp: 40 },
                { text: "Show me exact value", nextStep: 154, xp: 20 }
            ]
        },
        {
            speaker: 'zippy',
            message: "1. First term (a)=50, difference (d)=5, terms (n)=24. 2. Sum = 24/2 × (2×50 + 23×5) = 12 × (100 + 115) = 12 × 215 = 2,580kg. 3. Buffer: 2,580 × 1.15 = 2,967kg!",
            options: [
                { text: "Understood! Let's go!", nextStep: 3, xp: 35 },
                { text: "What if decrease?", nextStep: 155, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Exact: (1.1 × 0.9)^10 ≈ 0.99^10 ≈ 0.904. Approx: 1 - 10×0.01/2 = 0.95. Actual: 0.904 - approximation overestimates by ~5%!",
            options: [
                { text: "Got it! Begin mission!", nextStep: 3, xp: 40 },
                { text: "How to improve approx?", nextStep: 156, xp: 20 }
            ]
        },
        {
            speaker: 'zippy',
            message: "If decreasing by 2kg/month from 100kg: Month 1:100, Month 2:98... Sum = n/2 × (2a - (n-1)d)! For 12 months: 12/2 × (200 - 11×2) = 6 × 178 = 1,068kg!",
            options: [
                { text: "Fascinating! Let's begin!", nextStep: 3, xp: 35 },
                { text: "Add 10% buffer", nextStep: 157, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Include higher-order terms! Better approx: exp(-p²n/2 - p⁴n/12). For p=0.1, n=10: ≈ exp(-0.05 - 0.000083) ≈ 0.951 - much closer to exact 0.904!",
            options: [
                { text: "Understood! Let's go!", nextStep: 3, xp: 40 },
                { text: "Show me calculation", nextStep: 158, xp: 20 }
            ]
        },
        {
            speaker: 'zippy',
            message: "1,068kg × 1.10 = 1,174.8kg → round up to 1,200kg for safety! Decreasing usage is rare in space - usually we plan for growth!",
            options: [
                { text: "Got it! Begin Math Nebula!", nextStep: 3, xp: 35 },
                { text: "Why plan for growth?", nextStep: 159, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "For p=0.1, n=10: -p²n/2 = -0.05, -p⁴n/12 ≈ -0.000083. exp(-0.050083) ≈ 0.951. Still overestimates but closer than 0.95! Advanced space math!",
            options: [
                { text: "Makes sense! Begin!", nextStep: 3, xp: 40 },
                { text: "Is there exact formula?", nextStep: 160, xp: 20 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Space colonies always grow! More crew, more experiments, more needs. Planning for growth prevents shortages - running out in space is dangerous!",
            options: [
                { text: "Understood! Let's go!", nextStep: 3, xp: 35 },
                { text: "Give me growth example", nextStep: 161, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Exact formula is (1 - p²)^(n/2) for even n! For odd n, multiply by one more (1±p) term. Or compute exactly: (1+p)(1-p)(1+p)... for all terms!",
            options: [
                { text: "Got it! Begin mission!", nextStep: 3, xp: 40 },
                { text: "Show me odd n example", nextStep: 162, xp: 20 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Mars base starts with 10 crew @50kg/month each. Adding 2 crew/year: Year 1: 500kg/month, Year 2: 600kg/month... Plan for 5 years accordingly!",
            options: [
                { text: "Makes sense! Begin!", nextStep: 3, xp: 35 },
                { text: "Calculate 5-year need", nextStep: 163, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "For n=3 (+, -, +): (1+p)(1-p)(1+p) = (1-p²)(1+p) ≈ 1 + p - p² - p³. For p=0.1: ≈ 1 + 0.1 - 0.01 - 0.001 = 1.089 (exact: 1.089)!",
            options: [
                { text: "Understood! Let's go!", nextStep: 3, xp: 40 },
                { text: "How does this help?", nextStep: 164, xp: 20 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Year 1: 500×12=6,000kg. Year 2: 600×12=7,200kg... Total 5 years: 6,000+7,200+8,400+9,600+10,800=42,000kg! Plus 20% buffer → 50,400kg!",
            options: [
                { text: "Got it! Begin Math Nebula!", nextStep: 3, xp: 35 },
                { text: "Is there faster way?", nextStep: 165, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Understanding exact patterns helps optimize space trade! Buy when prices drop p%, sell when rise p% - know your exact expected outcome!",
            options: [
                { text: "Fascinating! Let's begin!", nextStep: 3, xp: 40 },
                { text: "Give me trade strategy", nextStep: 166, xp: 20 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Yes! Use arithmetic series sum: a=6,000, d=1,200, n=5. Sum = 5/2 × (12,000 + 4×1,200) = 2.5 × 16,800 = 42,000kg! Math saves time in space!",
            options: [
                { text: "Understood! Let's go!", nextStep: 3, xp: 35 },
                { text: "Teach me series sum", nextStep: 167, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Best strategy: buy low, sell high with p% > q% to overcome (p-q)²/2 loss! Or hold through fluctuations - long-term growth beats oscillation losses!",
            options: [
                { text: "Got it! Begin mission!", nextStep: 3, xp: 40 },
                { text: "Show me the math", nextStep: 168, xp: 20 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Arithmetic series sum = n/2 × (first + last term). Or n/2 × (2a + (n-1)d). For our 5 years: 5/2 × (6,000 + 10,800) = 2.5 × 16,800 = 42,000kg!",
            options: [
                { text: "Makes sense! Begin!", nextStep: 3, xp: 35 },
                { text: "Give me a problem", nextStep: 169, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "If buy at -10%, sell at +12%: Net factor = 0.9 × 1.12 = 1.008 → 0.8% gain (vs 1.1% loss for ±10%)! Small edge compounds over time in space trade!",
            options: [
                { text: "Understood! Let's go!", nextStep: 3, xp: 40 },
                { text: "Show me compounding", nextStep: 170, xp: 20 }
            ]
        },
        {
            speaker: 'zippy',
            message: "A space hotel starts with 20 guests @10kg/month, adding 5 guests/quarter. Yearly supply? Quarterly guests: 20,25,30,35. Quarterly needs: 200,250,300,350kg. Total = 200+250+300+350=1,100kg!",
            options: [
                { text: "Got it! Begin Math Nebula!", nextStep: 3, xp: 35 },
                { text: "Use series formula", nextStep: 171, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "10 trades at 0.8% gain each: 1.008^10 ≈ 1.083 → 8.3% total gain! Consistent small edges beat random large fluctuations in space economy!",
            options: [
                { text: "Fascinating! Let's begin!", nextStep: 3, xp: 40 },
                { text: "How to find edges?", nextStep: 172, xp: 20 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Using formula: a=200, d=50, n=4. Sum = 4/2 × (400 + 3×50) = 2 × 550 = 1,100kg! Formulas make space calculations faster and more reliable!",
            options: [
                { text: "Understood! Let's go!", nextStep: 3, xp: 35 },
                { text: "Give me harder problem", nextStep: 173, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Study patterns! If prices usually rebound 12% after 10% drops, that's your edge. Space economics requires both math and observation!",
            options: [
                { text: "Got it! Begin mission!", nextStep: 3, xp: 40 },
                { text: "Teach me more", nextStep: 174, xp: 20 }
            ]
        },
        {
            speaker: 'zippy',
            message: "A lunar mine produces 100kg/month, increasing production by 10% each month. 6-month total? Month 1:100, 2:110, 3:121... This is geometric series!",
            options: [
                { text: "Makes sense! Begin!", nextStep: 3, xp: 35 },
                { text: "What's geometric series?", nextStep: 175, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Track price histories, identify support/resistance levels, calculate expected values - but always leave safety margins in space trading!",
            options: [
                { text: "Understood! Let's go!", nextStep: 3, xp: 40 },
                { text: "Give me example", nextStep: 176, xp: 20 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Geometric series multiplies by fixed ratio (r) each term! Sum = a × (r^n - 1)/(r - 1). For our mine: r=1.1, a=100, n=6: Sum ≈ 100 × (1.77 - 1)/0.1 ≈ 770kg!",
            options: [
                { text: "Got it! Begin Math Nebula!", nextStep: 3, xp: 35 },
                { text: "Show me calculation", nextStep: 177, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "If space metal prices bounce at $100/kg 90% of time and drop to $80 otherwise, expected value of buying at $100 is 0.9×$120 + 0.1×$80 = $116!",
            options: [
                { text: "Fascinating! Let's begin!", nextStep: 3, xp: 40 },
                { text: "Break it down", nextStep: 178, xp: 20 }
            ]
        },
        {
            speaker: 'zippy',
            message: "1. Month 1: 100kg. 2. Month 2: 100 × 1.1 = 110kg. 3. Month 3: 110 × 1.1 = 121kg... 6. Month 6: 146.41kg. Total = 100 + 110 + 121 + 133.1 + 146.41 + 161.05 ≈ 771.56kg!",
            options: [
                { text: "Understood! Let's go!", nextStep: 3, xp: 35 },
                { text: "What's the formula?", nextStep: 179, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "90% chance price rises to $120 (20% gain), 10% falls to $80 (20% loss). Expected return: (0.9×20 + 0.1×(-20)) = 16%! Positive expectation!",
            options: [
                { text: "Got it! Begin mission!", nextStep: 3, xp: 40 },
                { text: "How to use this?", nextStep: 180, xp: 20 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Geometric series sum = a × (r^n - 1)/(r - 1). a=first term, r=common ratio, n=terms. For r>1, series grows exponentially - common in space industries!",
            options: [
                { text: "Makes sense! Begin!", nextStep: 3, xp: 35 },
                { text: "Give me a problem", nextStep: 181, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Execute many small trades with positive expectation! Even 1% edge compounds over time. But always maintain emergency reserves in space!",
            options: [
                { text: "Understood! Let's go!", nextStep: 3, xp: 40 },
                { text: "Show me compounding", nextStep: 182, xp: 20 }
            ]
        },
        {
            speaker: 'zippy',
            message: "A space farm grows 5% more food each month. Starting at 200kg, 1-year production? r=1.05, n=12. Sum ≈ 200 × (1.79 - 1)/0.05 ≈ 3,160kg!",
            options: [
                { text: "Got it! Begin Math Nebula!", nextStep: 3, xp: 35 },
                { text: "Compare to linear growth", nextStep: 183, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "100 trades with 1% edge: 1.01^100 ≈ 2.70 → 170% gain! But risk management is crucial - never bet everything on one space trade!",
            options: [
                { text: "Fascinating! Let's begin!", nextStep: 3, xp: 40 },
                { text: "Teach me risk management", nextStep: 184, xp: 20 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Linear growth adding 10kg/month (200,210,220...): Sum = 12/2 × (400 + 11×10) = 6 × 510 = 3,060kg. Geometric grows faster long-term!",
            options: [
                { text: "Understood! Let's go!", nextStep: 3, xp: 35 },
                { text: "Show me graph", nextStep: 185, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Never risk more than 1-2% of capital per trade! Diversify across sectors. Use stop-losses. Keep 50% reserves. Space trading is about survival first!",
            options: [
                { text: "Got it! Begin mission!", nextStep: 3, xp: 40 },
                { text: "What's stop-loss?", nextStep: 186, xp: 20 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Imagine graph: Linear is straight line, geometric is curving upward! After 12 months: linear=3,060kg, geometric=3,160kg. After 5 years: huge difference!",
            options: [
                { text: "Makes sense! Begin!", nextStep: 3, xp: 35 },
                { text: "Calculate 5-year difference", nextStep: 187, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Stop-loss automatically sells if price drops to limit losses. Like ejecting damaged cargo to save your spaceship! Crucial for space trade survival!",
            options: [
                { text: "Understood! Let's go!", nextStep: 3, xp: 40 },
                { text: "Give me example", nextStep: 188, xp: 20 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Linear: 60 × (400 + 59×10)/2 = 60 × 990/2 = 29,700kg. Geometric: 200 × (1.05^60 - 1)/0.05 ≈ 200 × (18.68 - 1)/0.05 ≈ 70,720kg! Huge difference!",
            options: [
                { text: "Got it! Begin Math Nebula!", nextStep: 3, xp: 35 },
                { text: "Why such big difference?", nextStep: 189, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Buy at $100 with stop-loss at $90: Max loss is $10/kg. Without it, price could drop to $80 for $20 loss! Always know your exit in space trades!",
            options: [
                { text: "Fascinating! Let's begin!", nextStep: 3, xp: 40 },
                { text: "How to set stop-loss?", nextStep: 190, xp: 20 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Because 5% growth compounds - each increase builds on previous gains! Like interest in space banks or population growth in colonies!",
            options: [
                { text: "Understood! Let's go!", nextStep: 3, xp: 35 },
                { text: "Teach me compounding", nextStep: 191, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Base on volatility! If typical 5% daily swings, set stop-loss beyond that (maybe 8%). Or use technical levels - below recent lows in chart!",
            options: [
                { text: "Got it! Begin mission!", nextStep: 3, xp: 40 },
                { text: "What's technical analysis?", nextStep: 192, xp: 20 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Compounding means earning on previous earnings! $100 at 5%: Year1=$105, Year2=$110.25 (5% of $105), Year3=$115.76... Exponential growth!",
            options: [
                { text: "Makes sense! Begin!", nextStep: 3, xp: 35 },
                { text: "Give me space example", nextStep: 193, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Studying price charts to predict movements! Support/resistance, trends, patterns. Like space navigation using star patterns!",
            options: [
                { text: "Understood! Let's go!", nextStep: 3, xp: 40 },
                { text: "Show me patterns", nextStep: 194, xp: 20 }
            ]
        },
        {
            speaker: 'zippy',
            message: "A Mars colony starts with 100 people growing at 10%/year: Year1=110, Year2=121... Year7≈195 people! Small growth rate → big long-term impact!",
            options: [
                { text: "Got it! Begin Math Nebula!", nextStep: 3, xp: 35 },
                { text: "Calculate 20-year growth", nextStep: 195, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Common patterns: Head-and-shoulders (reversal), Cup-and-handle (continuation), Triangles (breakout). Each suggests likely next move in space markets!",
            options: [
                { text: "Fascinating! Let's begin!", nextStep: 3, xp: 40 },
                { text: "Explain head-and-shoulders", nextStep: 196, xp: 20 }
            ]
        },
        {
            speaker: 'zippy',
            message: "100 × 1.1^20 ≈ 100 × 6.73 = 673 people! That's why space colonies plan infrastructure for growth - small changes compound over time!",
            options: [
                { text: "Understood! Let's go!", nextStep: 3, xp: 35 },
                { text: "What's the formula?", nextStep: 197, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Three peaks: left shoulder (high), head (higher), right shoulder (lower high). Neckline break confirms trend reversal - sell signal in space trading!",
            options: [
                { text: "Got it! Begin mission!", nextStep: 3, xp: 40 },
                { text: "Show me example", nextStep: 198, xp: 20 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Future value = Present × (1 + r)^n. r=growth rate, n=periods. For 5% growth over 10 years: 100 × 1.05^10 ≈ 100 × 1.63 = 163!",
            options: [
                { text: "Makes sense! Begin!", nextStep: 3, xp: 35 },
                { text: "Give me problem", nextStep: 199, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Imagine price chart: $50 (shoulder), $60 (head), $55 (shoulder), then breaks $45 neckline → likely drop to $30 ($60-$30=$30 drop from head)!",
            options: [
                { text: "Understood! Let's go!", nextStep: 3, xp: 40 },
                { text: "How to trade this?", nextStep: 200, xp: 20 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Space metal deposit grows value 8%/year. Current worth $1M. 15-year value? 1 × 1.08^15 ≈ 1 × 3.17 = $3.17M! That's compounding in space mining!",
            options: [
                { text: "Got it! Begin Math Nebula!", nextStep: 3, xp: 35 },
                { text: "What if withdraw annually?", nextStep: 201, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Sell at neckline break ($45), target $30, stop-loss above right shoulder ($56). Risk $11 to make $15 - good risk/reward for space trades!",
            options: [
                { text: "Fascinating! Let's begin!", nextStep: 3, xp: 40 },
                { text: "What's risk/reward?", nextStep: 202, xp: 20 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Taking $80k/year: Growth stops at $1M (80k/0.08)! Sustainable withdrawal rate in space economics is crucial for long-term survival!",
            options: [
                { text: "Understood! Let's go!", nextStep: 3, xp: 35 },
                { text: "Explain sustainable rate", nextStep: 203, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Ratio of potential profit to possible loss. Aim for ≥1:2 in space trades - make $2 for every $1 risked. Ensures profits cover losses!",
            options: [
                { text: "Got it! Begin mission!", nextStep: 3, xp: 40 },
                { text: "Give me example", nextStep: 204, xp: 20 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Typically 3-4% of portfolio annually allows principal to grow with inflation. For $1M: $30-40k/year safely indefinitely in space economy!",
            options: [
                { text: "Makes sense! Begin!", nextStep: 3, xp: 35 },
                { text: "Why so low?", nextStep: 205, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Buy at $100, stop-loss $90 ($10 risk), target $120 ($20 gain) → 1:2 risk/reward. Even if only 50% win rate, expect profit long-term!",
            options: [
                { text: "Understood! Let's go!", nextStep: 3, xp: 40 },
                { text: "Show me math", nextStep: 206, xp: 20 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Because markets fluctuate! 4% gives buffer during space recessions. Higher rates risk depleting capital during downturns - dangerous in space!",
            options: [
                { text: "Got it! Begin Math Nebula!", nextStep: 3, xp: 35 },
                { text: "What during bull markets?", nextStep: 207, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "10 trades: 5 win $20 ($100), 5 lose $10 ($50). Net $50 profit! Positive expectation strategies win in space trading long-term!",
            options: [
                { text: "Fascinating! Let's begin!", nextStep: 3, xp: 40 },
                { text: "What's expectation formula?", nextStep: 208, xp: 20 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Can take occasional bonuses! But maintain 4% baseline. Space economics is about surviving the bad times to enjoy the good times!",
            options: [
                { text: "Understood! Let's go!", nextStep: 3, xp: 35 },
                { text: "Give me example", nextStep: 209, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Expected value = (Win% × Win$) - (Loss% × Loss$). For our 50% $20/$10: (0.5×20) - (0.5×10) = $5 expected profit per trade!",
            options: [
                { text: "Got it! Begin mission!", nextStep: 3, xp: 40 },
                { text: "How to improve?", nextStep: 210, xp: 20 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Normal year: $40k (4%). Great year (portfolio up 20%): Can take extra $10k (1%) as bonus while keeping $50k (4% of new $1.25M) baseline!",
            options: [
                { text: "Makes sense! Begin!", nextStep: 3, xp: 35 },
                { text: "What in bad years?", nextStep: 211, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Increase win rate or risk/reward! 60% wins at 1:2 → (0.6×20) - (0.4×10) = $8 expected! Or keep 50% but aim for 1:3 risk/reward!",
            options: [
                { text: "Understood! Let's go!", nextStep: 3, xp: 40 },
                { text: "Give me best combination", nextStep: 212, xp: 20 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Cut spending! If portfolio drops to $800k, reduce to $32k (4%). Temporary austerity preserves capital for space market recovery!",
            options: [
                { text: "Got it! Begin Math Nebula!", nextStep: 3, xp: 35 },
                { text: "How long to recover?", nextStep: 213, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Best is high win rate AND good risk/reward! 70% wins at 1:2 → (0.7×20) - (0.3×10) = $11 expected! Requires excellent space market analysis!",
            options: [
                { text: "Fascinating! Let's begin!", nextStep: 3, xp: 40 },
                { text: "Teach me analysis", nextStep: 214, xp: 20 }
            ]
        },
        {
            speaker: 'zippy',
            message: "At 7% growth: $800k needs 3 years to surpass $1M again! Space investing requires patience - think in years, not days!",
            options: [
                { text: "Understood! Let's go!", nextStep: 3, xp: 35 },
                { text: "Show me calculation", nextStep: 215, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Fundamental: Value based on assets, earnings. Technical: Price patterns, trends. Sentiment: Market psychology. Use all three in space trading!",
            options: [
                { text: "Got it! Begin mission!", nextStep: 3, xp: 40 },
                { text: "Explain fundamental", nextStep: 216, xp: 20 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Year1: $800k × 1.07 = $856k. Year2: $856k × 1.07 ≈ $916k. Year3: $916k × 1.07 ≈ $980k. Year4: Pass $1M! Compound growth repairs losses!",
            options: [
                { text: "Makes sense! Begin!", nextStep: 3, xp: 35 },
                { text: "What if higher growth?", nextStep: 217, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Evaluating intrinsic value - like space mining company worth based on reserves, equipment, contracts. Buy undervalued, sell overvalued!",
            options: [
                { text: "Understood! Let's go!", nextStep: 3, xp: 40 },
                { text: "Give me example", nextStep: 218, xp: 20 }
            ]
        },
        {
            speaker: 'zippy',
            message: "At 10% growth: $800k × 1.1^3 ≈ $1,065k in 3 years! Higher returns speed recovery but increase risk - balance is key in space investing!",
            options: [
                { text: "Got it! Begin Math Nebula!", nextStep: 3, xp: 35 },
                { text: "How to balance?", nextStep: 219, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Asteroid mining co. has $1B reserves, $500M equipment, no debt. Market cap $1.2B → fairly valued. At $800M → undervalued buy opportunity!",
            options: [
                { text: "Fascinating! Let's begin!", nextStep: 3, xp: 40 },
                { text: "What metrics to use?", nextStep: 220, xp: 20 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Diversify! Core in stable 7% growth, portion in higher-risk 10%+ opportunities. Never risk more than you can afford to lose in space!",
            options: [
                { text: "Understood! Let's go!", nextStep: 3, xp: 35 },
                { text: "Give me allocation example", nextStep: 221, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "P/E ratio (price/earnings), P/Reserves, Debt/Equity, Growth Rate. Compare to space industry averages to spot undervalued gems!",
            options: [
                { text: "Got it! Begin mission!", nextStep: 3, xp: 40 },
                { text: "Calculate P/E example", nextStep: 222, xp: 20 }
            ]
        },
        {
            speaker: 'zippy',
            message: "60% stable bonds (5%), 30% growth stocks (10%), 10% high-risk ventures (20% or -100%) → blended 8.5% return with manageable risk!",
            options: [
                { text: "Makes sense! Begin!", nextStep: 3, xp: 35 },
                { text: "What's expected return?", nextStep: 223, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Company earns $10/share, trades at $150 → P/E=15. Space industry average P/E=20 → undervalued! Unless growth prospects are worse!",
            options: [
                { text: "Understood! Let's go!", nextStep: 3, xp: 40 },
                { text: "Factor in growth", nextStep: 224, xp: 20 }
            ]
        },
        {
            speaker: 'zippy',
            message: "(0.6×5) + (0.3×10) + (0.1×20) = 3 + 3 + 2 = 8% expected return. Risk comes from venture portion - but limited to 10% allocation!",
            options: [
                { text: "Got it! Begin Math Nebula!", nextStep: 3, xp: 35 },
                { text: "What if ventures fail?", nextStep: 225, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "PEG ratio = P/E ÷ Growth Rate. P/E=15, Growth=20% → PEG=0.75 (<1 → undervalued). Industry PEG=1.2 confirms bargain in space stocks!",
            options: [
                { text: "Fascinating! Let's begin!", nextStep: 3, xp: 40 },
                { text: "Give me problem", nextStep: 226, xp: 20 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Lose 100% of 10% allocation → -10% portfolio impact. Recovery: 90% × 1.088 ≈ 98% → only 2% net loss! Diversification cushions space risks!",
            options: [
                { text: "Understood! Let's go!", nextStep: 3, xp: 35 },
                { text: "Show me calculation", nextStep: 227, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Space tech co. has P/E=25, grows at 30%. Industry PEG=1.5. Undervalued? PEG=25/30≈0.83 <1.5 → undervalued! Potential buy for space portfolio!",
            options: [
                { text: "Got it! Begin mission!", nextStep: 3, xp: 40 },
                { text: "What's downside?", nextStep: 228, xp: 20 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Original $100: $60 bonds → $63, $30 stocks → $33, $10 ventures → $0. Total $96 → 4% loss. Rebalanced: $96 × 1.085^3 ≈ $122 in 3 years!",
            options: [
                { text: "Makes sense! Begin!", nextStep: 3, xp: 35 },
                { text: "What's rebalancing?", nextStep: 229, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "High P/E could mean overestimated growth. If growth slows to 20%, PEG=1.25 → fairly valued. Always verify growth assumptions in space!",
            options: [
                { text: "Understood! Let's go!", nextStep: 3, xp: 40 },
                { text: "How to verify?", nextStep: 230, xp: 20 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Periodically reset to target allocations. If stocks grow to 40%, sell some to buy bonds/ventures back to 30/60/10! Maintains risk profile!",
            options: [
                { text: "Got it! Begin Math Nebula!", nextStep: 3, xp: 35 },
                { text: "Give me example", nextStep: 231, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Study industry trends, management plans, competitive advantages. Space moats like exclusive asteroid rights ensure sustained growth!",
            options: [
                { text: "Fascinating! Let's begin!", nextStep: 3, xp: 40 },
                { text: "What's space moat?", nextStep: 232, xp: 20 }
            ]
        },
        {
            speaker: 'zippy',
            message: "$100 grows to $110: $66 bonds, $33 stocks, $11 ventures. Rebalance: Sell $3 stocks → $63 bonds (60%), $30 stocks (27%), $11 ventures (10%)!",
            options: [
                { text: "Understood! Let's go!", nextStep: 3, xp: 35 },
                { text: "Why rebalance?", nextStep: 233, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Sustainable competitive advantage in space - like unique mining tech, orbital slots, or patents that prevent competition for years!",
            options: [
                { text: "Got it! Begin mission!", nextStep: 3, xp: 40 },
                { text: "Give me examples", nextStep: 234, xp: 20 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Prevents risk creep! If stocks keep growing unchecked, portfolio becomes riskier. Rebalancing enforces discipline in space investing!",
            options: [
                { text: "Makes sense! Begin!", nextStep: 3, xp: 35 },
                { text: "Show me risk difference", nextStep: 235, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "1. Lunar water extraction patents 2. Asteroid mapping database 3. Exclusive space elevator rights 4. Mars habitat dome technology!",
            options: [
                { text: "Understood! Let's go!", nextStep: 3, xp: 40 },
                { text: "How to value moats?", nextStep: 236, xp: 20 }
            ]
        },
        {
            speaker: 'zippy',
            message: "60/30/10 portfolio has ~8% volatility. If stocks grow to 50%, volatility jumps to ~12%! Rebalancing maintains comfortable risk level!",
            options: [
                { text: "Got it! Begin Math Nebula!", nextStep: 3, xp: 35 },
                { text: "What's volatility?", nextStep: 237, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "By earnings premium they enable! Exclusive Mars tech might justify 30% higher P/E than competitors. Moats = pricing power in space markets!",
            options: [
                { text: "Fascinating! Let's begin!", nextStep: 3, xp: 40 },
                { text: "Give me valuation example", nextStep: 238, xp: 20 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Price fluctuation size. High volatility = big swings. Space stocks often volatile due to uncertainty - manage with diversification!",
            options: [
                { text: "Understood! Let's go!", nextStep: 3, xp: 35 },
                { text: "How to measure?", nextStep: 239, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Standard space mining P/E=15. With asteroid mapping moat: P/E=20 → 33% premium! If earnings $10M, moat adds $50M valuation ($10M×5)!",
            options: [
                { text: "Got it! Begin mission!", nextStep: 3, xp: 40 },
                { text: "What if moat erodes?", nextStep: 240, xp: 20 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Standard deviation of returns! If stock typically moves ±5% daily, that's its volatility. Space ETFs often show ±2% → less risky!",
            options: [
                { text: "Makes sense! Begin!", nextStep: 3, xp: 35 },
                { text: "Give me ETF example", nextStep: 241, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Premium disappears! If competitors develop similar tech, P/E falls back to 15. Always monitor moat durability in space investments!",
            options: [
                { text: "Understood! Let's go!", nextStep: 3, xp: 40 },
                { text: "How to monitor?", nextStep: 242, xp: 20 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Space Infrastructure ETF: Holds 100 space stocks → daily moves ±1.5%. Single space stock might move ±8%. Diversification reduces volatility!",
            options: [
                { text: "Got it! Begin Math Nebula!", nextStep: 3, xp: 35 },
                { text: "What's diversification?", nextStep: 243, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Track patent filings, competitor announcements, tech breakthroughs. Space moats last 5-10 years typically before erosion begins!",
            options: [
                { text: "Fascinating! Let's begin!", nextStep: 3, xp: 40 },
                { text: "Give me timeline example", nextStep: 244, xp: 20 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Spreading investments across sectors/asset classes. Not just space mining, but also habitats, transport, tourism! Reduces overall risk!",
            options: [
                { text: "Understood! Let's go!", nextStep: 3, xp: 35 },
                { text: "Show me math", nextStep: 245, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Lunar water patents filed 2040, expire 2055. Competitors start workarounds by 2050 → moat strongest 2040-2045, weakens 2045-2055!",
            options: [
                { text: "Got it! Begin mission!", nextStep: 3, xp: 40 },
                { text: "How to invest accordingly?", nextStep: 246, xp: 20 }
            ]
        },
        {
            speaker: 'zippy',
            message: "10 space stocks: If one fails (-100%), impact is -10%. If one moonshot (+1000%), can't compensate all losses. Balance is key in space!",
            options: [
                { text: "Makes sense! Begin!", nextStep: 3, xp: 35 },
                { text: "What's optimal number?", nextStep: 247, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Buy early (2040), hold through prime (2045), start exiting as competition emerges (2048), fully exit by 2053 before patent expiry!",
            options: [
                { text: "Understood! Let's go!", nextStep: 3, xp: 40 },
                { text: "What indicators to watch?", nextStep: 248, xp: 20 }
            ]
        },
        {
            speaker: 'zippy',
            message: "20-30 stocks capture most diversification benefits. Beyond that, marginal gains decrease. Space portfolios often target 25 positions!",
            options: [
                { text: "Got it! Begin Math Nebula!", nextStep: 3, xp: 35 },
                { text: "Show me calculation", nextStep: 249, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Competitor R&D spending, patent challenges, substitute tech development, customer concentration shifts in space markets!",
            options: [
                { text: "Fascinating! Let's begin!", nextStep: 3, xp: 40 },
                { text: "Give me R&D example", nextStep: 250, xp: 20 }
            ]
        },
        {
            speaker: 'zippy',
            message: "1 stock: 100% volatility. 10: ~40%. 20: ~30%. 30: ~25%. Diminishing returns after 20-30. Space ETFs achieve ~15% with 100+ holdings!",
            options: [
                { text: "Understood! Let's go!", nextStep: 3, xp: 35 },
                { text: "What's ETF advantage?", nextStep: 251, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "If competitor doubles space mining R&D while your company's flat → moat erosion likely within 2-3 years! Time to reassess position!",
            options: [
                { text: "Got it! Begin mission!", nextStep: 3, xp: 40 },
                { text: "How to reassess?", nextStep: 252, xp: 20 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Instant diversification! One ETF purchase = ownership in 100+ space companies. Perfect for beginners in space investing!",
            options: [
                { text: "Makes sense! Begin!", nextStep: 3, xp: 35 },
                { text: "What's the cost?", nextStep: 253, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Reduce position size, tighten stop-losses, hedge with competitor stocks. Space investing requires active monitoring and adjustment!",
            options: [
                { text: "Understood! Let's go!", nextStep: 3, xp: 40 },
                { text: "What's hedging?", nextStep: 254, xp: 20 }
            ]
        },
        {
            speaker: 'zippy',
            message: "ETF fees (expense ratio) typically 0.1-0.5%/year. Small price for professional space diversification! Cheaper than building your own portfolio!",
            options: [
                { text: "Got it! Begin Math Nebula!", nextStep: 3, xp: 35 },
                { text: "Show me cost comparison", nextStep: 255, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Offsetting risks - like buying competitor stock to balance your main space investment. Limits upside but protects against sector risks!",
            options: [
                { text: "Fascinating! Let's begin!", nextStep: 3, xp: 40 },
                { text: "Give me example", nextStep: 256, xp: 20 }
            ]
        },
        {
            speaker: 'zippy',
            message: "DIY portfolio: $10/trade × 25 stocks = $250 commission. ETF: $10/trade + $50/year fees. After 1 year: ETF cheaper! Scales better!",
            options: [
                { text: "Understood! Let's go!", nextStep: 3, xp: 35 },
                { text: "What about control?", nextStep: 257, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Own Lunar Mining Corp (LMC) → buy 20% position in Mars Diggers (MDG). If LMC falls due to sector risk, MDG may rise, offsetting losses!",
            options: [
                { text: "Got it! Begin mission!", nextStep: 3, xp: 40 },
                { text: "What's perfect hedge?", nextStep: 258, xp: 20 }
            ]
        },
        {
            speaker: 'zippy',
            message: "ETFs offer less control - can't exclude specific space companies. But for most investors, diversification benefits outweigh this!",
            options: [
                { text: "Makes sense! Begin!", nextStep: 3, xp: 35 },
                { text: "Best of both worlds?", nextStep: 259, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Short selling equal amount - if long $10k LMC, short $10k LMC. Zero net exposure! But impractical for most space investors!",
            options: [
                { text: "Understood! Let's go!", nextStep: 3, xp: 40 },
                { text: "What's short selling?", nextStep: 260, xp: 20 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Core-satellite approach! Core (70%) in space ETFs, satellite (30%) in individual picks. Balances diversification with selective bets!",
            options: [
                { text: "Got it! Begin Math Nebula!", nextStep: 3, xp: 35 },
                { text: "Give me allocation example", nextStep: 261, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Borrowing shares to sell, hoping to buy back cheaper later. High risk in space stocks - unlimited losses if price rises! Not recommended!",
            options: [
                { text: "Fascinating! Let's begin!", nextStep: 3, xp: 40 },
                { text: "Alternative to shorting?", nextStep: 262, xp: 20 }
            ]
        },
        {
            speaker: 'zippy',
            message: "$100k space portfolio: $70k ETF (diversified), $20k 4-5 quality space stocks, $10k speculative moonshots! Balanced space investing!",
            options: [
                { text: "Understood! Let's go!", nextStep: 3, xp: 35 },
                { text: "How to select satellites?", nextStep: 263, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Put options! Pay premium for right to sell at set price. Limits space downside to premium paid. Like insurance for your portfolio!",
            options: [
                { text: "Got it! Begin mission!", nextStep: 3, xp: 40 },
                { text: "Give me example", nextStep: 264, xp: 20 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Fundamental analysis! Strong space moats, growing revenues, reasonable valuations. Avoid hype - focus on sustainable space businesses!",
            options: [
                { text: "Makes sense! Begin!", nextStep: 3, xp: 35 },
                { text: "What metrics to use?", nextStep: 265, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Buy LMC $100 put for $5. If LMC drops to $80, exercise put → sell at $100 (20% protection). Max loss $5 (5%), not $20! Space portfolio insurance!",
            options: [
                { text: "Understood! Let's go!", nextStep: 3, xp: 40 },
                { text: "What's the catch?", nextStep: 266, xp: 20 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Revenue growth (>20% for space), Profit margins (expanding), Cash flow (positive), P/E (<industry), PEG (<1.5), Debt/Equity (<1)!",
            options: [
                { text: "Got it! Begin Math Nebula!", nextStep: 3, xp: 35 },
                { text: "Give me example analysis", nextStep: 267, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Options expire worthless if not exercised! Like unused insurance. Typical cost: 2-5%/year of portfolio value for space stock protection!",
            options: [
                { text: "Fascinating! Let's begin!", nextStep: 3, xp: 40 },
                { text: "Worth the cost?", nextStep: 268, xp: 20 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Asteroid Mining Inc: Revenue +25%, Margins 15% (up from 10%), P/E=18 (industry=22), PEG=1.2, Debt/Equity=0.8 → solid space investment!",
            options: [
                { text: "Understood! Let's go!", nextStep: 3, xp: 35 },
                { text: "What's downside?", nextStep: 269, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "For conservative space investors, yes! 5% annual cost beats 20%+ drawdowns during space market crashes. Peace of mind has value!",
            options: [
                { text: "Got it! Begin mission!", nextStep: 3, xp: 40 },
                { text: "Alternative strategies?", nextStep: 270, xp: 20 }
            ]
        },
        {
            speaker: 'zippy',
            message: "High capex needs - may dilute shares. Space mining is volatile - prices swing with asteroid findings. Always diversify even strong picks!",
            options: [
                { text: "Makes sense! Begin!", nextStep: 3, xp: 35 },
                { text: "How to monitor capex?", nextStep: 271, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Trailing stop-losses (automatic sell if drops X%), sector rotation (shift to defensive space stocks in downturns), cash reserves!",
            options: [
                { text: "Understood! Let's go!", nextStep: 3, xp: 40 },
                { text: "Explain trailing stops", nextStep: 272, xp: 20 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Track quarterly reports - 'Capital Expenditures' line. Compare to operating cash flow. Sustainable space firms fund capex from operations!",
            options: [
                { text: "Got it! Begin Math Nebula!", nextStep: 3, xp: 35 },
                { text: "Give me example", nextStep: 273, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Stop-loss that follows price up! Set at 20% below peak. If space stock rises to $100, stop=$80. Rises to $120, stop=$96. Locks in gains!",
            options: [
                { text: "Fascinating! Let's begin!", nextStep: 3, xp: 40 },
                { text: "What percentage to use?", nextStep: 274, xp: 20 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Space Manufacturing Co: OCF=$50M, Capex=$30M → healthy $20M leftover. If Capex=$60M → $10M deficit → may need debt/equity → warning sign!",
            options: [
                { text: "Understood! Let's go!", nextStep: 3, xp: 35 },
                { text: "What's OCF/capex ratio?", nextStep: 275, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Depends on space stock volatility! Stable space infrastructure: 15-20%. Volatile space mining: 25-30%. Adjust to your risk tolerance!",
            options: [
                { text: "Got it! Begin mission!", nextStep: 3, xp: 40 },
                { text: "Give me backtest example", nextStep: 276, xp: 20 }
            ]
        },
        {
            speaker: 'zippy',
            message: "OCF/Capex >1 is ideal (funds growth internally). <1 means relying on external financing. Space firms at 0.8-1.2 are typically healthy!",
            options: [
                { text: "Makes sense! Begin!", nextStep: 3, xp: 35 },
                { text: "Give me sector examples", nextStep: 277, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Space tourism stock: 25% trailing stop would have exited at $75 (from $100 peak) before crash to $50. Saved 25% loss vs 50%!",
            options: [
                { text: "Understood! Let's go!", nextStep: 3, xp: 40 },
                { text: "What about whipsaws?", nextStep: 278, xp: 20 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Space stations: OCF/Capex ~1.5 (stable). Asteroid mining: 0.3 (growth phase). Space tourism: 0.8 (moderate growth). Know sector norms!",
            options: [
                { text: "Got it! Begin Math Nebula!", nextStep: 3, xp: 35 },
                { text: "How to use this?", nextStep: 279, xp: 15 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Whipsaws (triggering stop then rebounding) happen! Wider stops reduce them but increase losses. Balance based on space stock volatility!",
            options: [
                { text: "Fascinating! Let's begin!", nextStep: 3, xp: 40 },
                { text: "Optimal balance?", nextStep: 280, xp: 20 }
            ]
        },
        {
            speaker: 'zippy',
            message: "Compare to sector! Space mining at 0.3 is normal, but station at 0.3 is worrisome. Track trend - improving ratios signal space turnaround!",
            options: [
                { text: "Understood! Let's go!", nextStep: 3, x            
            action: 'startTasks'
        }
    ]
];

// Tasks for each chapter
const chapterTasks = {
    0: [
        {
            question: "What is 5 + 3?",
            answer: "8",
            hint: "Add the two numbers together.",
            xp: 10
        },
        {
            question: "If a spaceship travels 100 km in 2 hours, what is its speed?",
            answer: "50",
            hint: "Speed = Distance ÷ Time",
            xp: 15
        },
        {
            question: "Solve for x: x - 4 = 10",
            answer: "14",
            hint: "Add 4 to both sides of the equation.",
            xp: 10
        }
    ],
    1: [
        {
            question: "What is 12 × 5?",
            answer: "60",
            hint: "Multiply the two numbers.",
            xp: 15
        },
        {
            question: "If a space station has 24 crew members and 6 escape pods, how many crew per pod?",
            answer: "4",
            hint: "Divide crew members by number of pods.",
            xp: 15
        },
        {
            question: "A rocket uses 15kg of fuel per hour. How much for 8 hours?",
            answer: "120",
            hint: "Multiply fuel rate by time.",
            xp: 20
        }
    ]
};

// Initialize the game
function initGame() {
    if (!gameState.seenIntro) {
        showLogo();
    } else {
        startGame();
    }
    
    // Set up event listeners
    elements.audioToggle.addEventListener('click', toggleAudio);
    elements.volumeSlider.addEventListener('input', updateVolume);
    elements.taskSubmit.addEventListener('click', checkTaskAnswer);
    elements.taskHint.addEventListener('click', showHint);
    elements.nextMissionBtn.addEventListener('click', nextMission);
}

// Show logo animation
function showLogo() {
    elements.logo.style.display = 'block';
    setTimeout(() => {
        elements.logo.style.display = 'none';
        gameState.seenIntro = true;
        localStorage.setItem('seenIntro', 'true');
        startGame();
    }, 3000);
}

// Start the game
function startGame() {
    updateGameState();
    showCurrentStep();
    playMusic();
}

// Update game state display
function updateGameState() {
    elements.xpValue.textContent = gameState.xp;
    elements.levelValue.textContent = gameState.level;
    
    // Calculate XP needed for next level (simplified)
    const xpNeeded = gameState.level * 100;
    const xpPercentage = Math.min(100, (gameState.xp / xpNeeded) * 100);
    elements.xpBar.style.width = `${xpPercentage}%`;
    
    // Update Brainrot health
    elements.brainrotHealth.style.width = `${gameState.brainrotHealth}%`;
    
    // Update inventory display
    updateInventory();
}

// Update inventory display
function updateInventory() {
    elements.inventoryContainer.innerHTML = '';
    for (const item in gameState.inventory) {
        if (gameState.inventory[item] > 0) {
            const itemElement = document.createElement('div');
            itemElement.className = 'inventory-item';
            itemElement.textContent = `${item}: ${gameState.inventory[item]}`;
            elements.inventoryContainer.appendChild(itemElement);
        }
    }
}

// Show current story step
function showCurrentStep() {
    const chapter = storyChapters[gameState.currentChapter];
    const step = chapter[gameState.currentStep];
    
    // Clear previous options
    elements.optionsContainer.innerHTML = '';
    
    // Set speaker and message
    if (step.speaker === 'zippy') {
        elements.leftBubble.style.display = 'block';
        elements.rightBubble.style.display = 'none';
        elements.leftBubbleContent.textContent = step.message;
    } else {
        elements.rightBubble.style.display = 'block';
        elements.leftBubble.style.display = 'none';
        elements.rightBubbleContent.textContent = step.message;
    }
    
    // Show typing indicator if no options
    if (step.options.length === 0) {
        elements.typingIndicator.style.display = 'block';
        setTimeout(() => {
            elements.typingIndicator.style.display = 'none';
            if (step.action) {
                executeAction(step.action);
            } else {
                // Default to next step if no action
                gameState.currentStep++;
                showCurrentStep();
            }
        }, 2000);
    } else {
        // Show options
        step.options.forEach(option => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option';
            optionElement.textContent = option.text;
            optionElement.addEventListener('click', () => selectOption(option));
            elements.optionsContainer.appendChild(optionElement);
        });
    }
}

// Execute story action
function executeAction(action) {
    switch(action) {
        case 'startTasks':
            startTasks();
            break;
        // Add other actions as needed
    }
}

// Start tasks for current chapter
function startTasks() {
    const tasks = chapterTasks[gameState.currentChapter];
    gameState.currentTask = 0;
    showTask(tasks[gameState.currentTask]);
}

// Show task
function showTask(task) {
    elements.taskContainer.style.display = 'block';
    elements.taskHeader.textContent = `Task ${gameState.currentTask + 1} of ${chapterTasks[gameState.currentChapter].length}`;
    elements.taskContent.textContent = task.question;
    elements.hintText.textContent = '';
    elements.taskSubmit.disabled = false;
    gameState.taskCompleted = false;
}

// Check task answer
function checkTaskAnswer() {
    const tasks = chapterTasks[gameState.currentChapter];
    const currentTask = tasks[gameState.currentTask];
    const userAnswer = elements.taskContent.value.trim();
    
    if (userAnswer === currentTask.answer) {
        // Correct answer
        if (!gameState.taskCompleted) {
            gameState.xp += currentTask.xp;
            gameState.taskCompleted = true;
            playSound('success');
            
            // Check level up
            checkLevelUp();
            
            // Show completion message
            elements.taskContent.value = 'Correct!';
            elements.taskSubmit.disabled = true;
            
            // Move to next task or complete chapter
            setTimeout(() => {
                gameState.currentTask++;
                if (gameState.currentTask < tasks.length) {
                    showTask(tasks[gameState.currentTask]);
                } else {
                    completeChapter();
                }
            }, 1500);
        }
    } else {
        // Wrong answer
        elements.taskContent.value = '';
        playSound('notification');
        elements.taskContent.placeholder = 'Try again!';
    }
}

// Show hint
function showHint() {
    if (gameState.inventory.hint > 0) {
        const tasks = chapterTasks[gameState.currentChapter];
        const currentTask = tasks[gameState.currentTask];
        elements.hintText.textContent = currentTask.hint;
        gameState.inventory.hint--;
        updateInventory();
    }
}

// Complete chapter
function completeChapter() {
    elements.taskContainer.style.display = 'none';
    gameState.brainrotHealth = Math.max(0, gameState.brainrotHealth - 20);
    
    // Show mission complete screen
    elements.missionComplete.style.display = 'block';
    elements.earnedXp.textContent = chapterTasks[gameState.currentChapter].reduce((sum, task) => sum + task.xp, 0);
    
    // Move to next chapter
    gameState.currentChapter++;
    gameState.currentStep = 0;
}

// Next mission
function nextMission() {
    elements.missionComplete.style.display = 'none';
    showCurrentStep();
}

// Check for level up
function checkLevelUp() {
    const xpNeeded = gameState.level * 100;
    if (gameState.xp >= xpNeeded) {
        gameState.level++;
        gameState.xp = gameState.xp - xpNeeded;
        playSound('success');
        updateGameState();
    }
}

// Select story option
function selectOption(option) {
    gameState.currentStep = option.nextStep;
    gameState.xp += option.xp;
    checkLevelUp();
    showCurrentStep();
}

// Audio controls
function toggleAudio() {
    gameState.audioEnabled = !gameState.audioEnabled;
    if (gameState.audioEnabled) {
        playMusic();
        elements.audioToggle.textContent = '🔊';
    } else {
        pauseMusic();
        elements.audioToggle.textContent = '🔇';
    }
}

function updateVolume() {
    gameState.volume = elements.volumeSlider.value;
    audio.music.volume = gameState.volume;
    audio.success.volume = gameState.volume;
    audio.notification.volume = gameState.volume;
}

function playMusic() {
    if (gameState.audioEnabled) {
        audio.music.play();
    }
}

function pauseMusic() {
    audio.music.pause();
}

function playSound(sound) {
    if (gameState.audioEnabled) {
        audio[sound].currentTime = 0;
        audio[sound].play();
    }
}

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', initGame);



assets/logo.png

assets/mummy.jpg

assets/kid.jpg