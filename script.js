// Game State
const gameState = {
    currentScreen: 'story',
    xp: 0,
    streak: 1,
    completedTasks: 0,
    bossHealth: 100,
    currentDialogue: 0,
    musicEnabled: false,
    audioContext: null
};

// DOM Elements
const elements = {
    zippyBubble: document.getElementById('zippy-bubble'),
    userBubble: document.getElementById('user-bubble'),
    optionsContainer: document.getElementById('options-container'),
    xpFill: document.getElementById('xp-fill'),
    xpText: document.getElementById('xp-text'),
    streak: document.getElementById('streak'),
    taskContainer: document.getElementById('task-container'),
    tasks: document.getElementById('tasks'),
    battleBtn: document.getElementById('battle-btn'),
    battleContainer: document.getElementById('battle-container'),
    boss: document.getElementById('boss'),
    healthBar: document.getElementById('health-bar'),
    battleMessage: document.getElementById('battle-message'),
    attackBtn: document.getElementById('attack-btn'),
    winContainer: document.getElementById('win-container'),
    restartBtn: document.getElementById('restart-btn'),
    clickSound: document.getElementById('click-sound'),
    musicToggle: document.getElementById('music-toggle')
};

// Story Dialogues
const dialogues = [
    {
        speaker: 'zippy',
        text: "Hey there, future Skillionaire! I'm Zippy, your AI learning coach! 🚀",
        options: ["Hi Zippy!", "Who are you?"],
        xp: 0
    },
    {
        speaker: 'zippy',
        text: "We've got a serious problem - Brainrot is spreading! It turns screen time into wasted time!",
        options: ["What's Brainrot?", "How can I help?"],
        xp: 0
    },
    {
        speaker: 'zippy',
        text: "Brainrot is a digital virus that drains skills and knowledge. Raj, a brilliant scientist, lost all his XP to it!",
        options: ["That's terrible!", "What can we do?"],
        xp: 0
    },
    {
        speaker: 'zippy',
        text: "You can help by completing daily missions! Convert screen time into SKILL TIME to restore Raj's XP and defeat Brainrot!",
        options: ["I'm ready!", "Let's do this!"],
        xp: 10
    },
    {
        speaker: 'zippy',
        text: "Awesome! First, complete 3 learning tasks each day. Then we'll battle Brainrot monsters together!",
        options: ["Got it!", "Let's go!"],
        xp: 10
    }
];

// Tasks Data
const dailyTasks = [
    {
        id: 1,
        icon: "🧠",
        title: "Brain Teaser",
        description: "Solve this puzzle to sharpen your mind",
        xp: 10,
        completed: false
    },
    {
        id: 2,
        icon: "📚",
        title: "Learning Byte",
        description: "Learn one amazing fact about science",
        xp: 10,
        completed: false
    },
    {
        id: 3,
        icon: "🛠️",
        title: "Skill Builder",
        description: "Practice typing for 1 minute",
        xp: 10,
        completed: false
    }
];

// Initialize the game
function initGame() {
    loadGameState();
    setupEventListeners();
    showDialogue();
    
    // Initialize Web Audio API
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        gameState.audioContext = new AudioContext();
        elements.clickSound.load();
    } catch (e) {
        console.log("Web Audio API not supported");
    }
}

// Show dialogue with typing animation
function showDialogue() {
    if (gameState.currentDialogue >= dialogues.length) {
        showTaskScreen();
        return;
    }

    const dialogue = dialogues[gameState.currentDialogue];
    const bubble = elements[`${dialogue.speaker}Bubble`];
    
    // Clear previous content
    bubble.innerHTML = '';
    bubble.classList.remove('show');
    
    // Add typing animation
    bubble.style.width = 'fit-content';
    bubble.style.whiteSpace = 'nowrap';
    bubble.style.overflow = 'hidden';
    bubble.style.borderRight = '2px solid white';
    bubble.style.animation = `typing 3s steps(40, end), blink-caret 0.75s step-end infinite`;
    
    setTimeout(() => {
        bubble.style.animation = 'none';
        bubble.style.borderRight = 'none';
        bubble.style.whiteSpace = 'normal';
        bubble.innerHTML = `<p>${dialogue.text}</p>`;
        bubble.classList.add('show');
        
        // Show options after a delay
        setTimeout(() => showOptions(dialogue.options), 500);
    }, 3000);
}

// Show response options
function showOptions(options) {
    elements.optionsContainer.innerHTML = '';
    
    options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'option-btn';
        button.textContent = option;
        button.style.transitionDelay = `${index * 0.1}s`;
        
        button.addEventListener('click', () => {
            playSound();
            selectOption(option);
        });
        
        elements.optionsContainer.appendChild(button);
        
        // Animate options in
        setTimeout(() => {
            button.classList.add('show');
        }, 100);
    });
}

// Handle option selection
function selectOption(option) {
    // Show user's response
    elements.userBubble.innerHTML = `<p>${option}</p>`;
    elements.userBubble.classList.add('show');
    
    // Hide options
    elements.optionsContainer.innerHTML = '';
    
    // Add XP if this dialogue awards some
    const currentDialogue = dialogues[gameState.currentDialogue];
    if (currentDialogue.xp > 0) {
        addXP(currentDialogue.xp);
    }
    
    // Move to next dialogue
    gameState.currentDialogue++;
    
    // Show next dialogue after a delay
    setTimeout(() => {
        elements.userBubble.classList.remove('show');
        showDialogue();
    }, 1500);
}

// Show task screen
function showTaskScreen() {
    elements.taskContainer.style.display = 'flex';
    renderTasks();
}

// Render daily tasks
function renderTasks() {
    elements.tasks.innerHTML = '';
    
    dailyTasks.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.className = `task ${task.completed ? 'completed' : ''}`;
        taskElement.innerHTML = `
            <div class="task-icon">${task.icon}</div>
            <div class="task-info">
                <div class="task-title">${task.title}</div>
                <div class="task-description">${task.description}</div>
                <div class="task-xp">+${task.xp} XP</div>
            </div>
            <div class="task-status">${task.completed ? '✓' : ''}</div>
        `;
        
        if (!task.completed) {
            taskElement.addEventListener('click', () => completeTask(task.id));
        }
        
        elements.tasks.appendChild(taskElement);
    });
    
    // Show battle button if all tasks completed
    if (gameState.completedTasks >= 3) {
        elements.battleBtn.style.display = 'block';
    }
}

// Complete a task
function completeTask(taskId) {
    playSound();
    
    const task = dailyTasks.find(t => t.id === taskId);
    if (task && !task.completed) {
        task.completed = true;
        gameState.completedTasks++;
        addXP(task.xp);
        renderTasks();
        
        if (gameState.completedTasks >= 3) {
            elements.battleBtn.style.display = 'block';
        }
    }
}

// Show battle screen
function showBattleScreen() {
    playSound();
    elements.taskContainer.style.display = 'none';
    elements.battleContainer.style.display = 'flex';
    gameState.bossHealth = 100;
    elements.healthBar.style.width = '100%';
    elements.battleMessage.textContent = "The Scroll Naga is distracting you with endless content!";
}

// Handle attack
function handleAttack() {
    playSound();
    
    if (gameState.bossHealth <= 0) return;
    
    // Player attack
    const damage = Math.floor(Math.random() * 15) + 10;
    gameState.bossHealth = Math.max(0, gameState.bossHealth - damage);
    elements.healthBar.style.width = `${gameState.bossHealth}%`;
    elements.battleMessage.textContent = `You hit Scroll Naga for ${damage} damage!`;
    
    // Check if boss is defeated
    if (gameState.bossHealth <= 0) {
        elements.battleMessage.textContent = "You defeated the Scroll Naga!";
        elements.attackBtn.textContent = "Victory!";
        setTimeout(showWinScreen, 1500);
        return;
    }
    
    // Boss attack after delay
    setTimeout(() => {
        if (gameState.bossHealth > 0) {
            const bossDamage = Math.floor(Math.random() * 10) + 5;
            elements.battleMessage.textContent = `Scroll Naga distracts you with memes! -${bossDamage} focus!`;
        }
    }, 800);
}

// Show win screen
function showWinScreen() {
    playSound();
    elements.battleContainer.style.display = 'none';
    elements.winContainer.style.display = 'flex';
}

// Add XP
function addXP(amount) {
    gameState.xp = Math.min(gameState.xp + amount, 100);
    elements.xpFill.style.width = `${gameState.xp}%`;
    elements.xpText.textContent = `${gameState.xp} XP`;
    
    // Animate XP gain
    elements.xpFill.style.animation = 'none';
    void elements.xpFill.offsetWidth; // Trigger reflow
    elements.xpFill.style.animation = 'shine 2s infinite';
    
    saveGameState();
}

// Play sound effect
function playSound() {
    if (gameState.musicEnabled) {
        elements.clickSound.currentTime = 0;
        elements.clickSound.play().catch(e => console.log("Audio play failed:", e));
    }
}

// Toggle music
function toggleMusic() {
    gameState.musicEnabled = !gameState.musicEnabled;
    elements.musicToggle.textContent = gameState.musicEnabled ? "🔊" : "🔇";
    localStorage.setItem('chizelMusicEnabled', gameState.musicEnabled);
}

// Save game state
function saveGameState() {
    localStorage.setItem('chizelGameState', JSON.stringify({
        xp: gameState.xp,
        streak: gameState.streak,
        musicEnabled: gameState.musicEnabled
    }));
}

// Load game state
function loadGameState() {
    const savedState = localStorage.getItem('chizelGameState');
    if (savedState) {
        const state = JSON.parse(savedState);
        gameState.xp = state.xp || 0;
        gameState.streak = state.streak || 1;
        gameState.musicEnabled = state.musicEnabled || false;
        
        elements.xpFill.style.width = `${gameState.xp}%`;
        elements.xpText.textContent = `${gameState.xp} XP`;
        elements.streak.textContent = `Day ${gameState.streak}`;
        elements.musicToggle.textContent = gameState.musicEnabled ? "🔊" : "🔇";
    }
}

// Restart game
function restartGame() {
    playSound();
    gameState.currentDialogue = 0;
    gameState.completedTasks = 0;
    gameState.currentScreen = 'story';
    
    // Reset tasks
    dailyTasks.forEach(task => task.completed = false);
    
    // Hide all screens except story
    elements.taskContainer.style.display = 'none';
    elements.battleContainer.style.display = 'none';
    elements.winContainer.style.display = 'none';
    elements.battleBtn.style.display = 'none';
    elements.attackBtn.textContent = "ATTACK!";
    
    // Clear chat
    elements.zippyBubble.classList.remove('show');
    elements.userBubble.classList.remove('show');
    elements.optionsContainer.innerHTML = '';
    
    // Start story again
    setTimeout(showDialogue, 500);
}

// Set up event listeners
function setupEventListeners() {
    elements.battleBtn.addEventListener('click', showBattleScreen);
    elements.attackBtn.addEventListener('click', handleAttack);
    elements.restartBtn.addEventListener('click', restartGame);
    elements.musicToggle.addEventListener('click', toggleMusic);
    
    // Prevent audio context from being suspended
    document.addEventListener('click', () => {
        if (gameState.audioContext && gameState.audioContext.state === 'suspended') {
            gameState.audioContext.resume();
        }
    }, { once: true });
}

// Start the game when page loads
window.addEventListener('DOMContentLoaded', initGame);