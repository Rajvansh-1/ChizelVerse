// Game State
const gameState = {
    currentStep: 0,
    xp: localStorage.getItem('chizelXP') ? parseInt(localStorage.getItem('chizelXP')) : 0,
    completedTasks: [],
    audioEnabled: true,
    currentTask: null,
    taskCompleted: false
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
    taskContainer: document.querySelector('.task-container'),
    taskContent: document.querySelector('.task-content'),
    taskSubmit: document.querySelector('.task-submit'),
    taskHeader: document.querySelector('.task-header'),
    audioToggle: document.querySelector('.audio-toggle'),
    typingIndicator: document.querySelector('.typing-indicator')
};

// Audio Elements
const audio = {
    success: new Audio('assets/success.mp3'),
    notification: new Audio('assets/notification.mp3')
};

// Show characters with animation
setTimeout(() => {
    elements.leftCharacter.classList.add('visible');
    elements.rightCharacter.classList.add('visible');
}, 500);

// Story Script
const storyScript = [
    // Introduction
    {
        speaker: 'zippy',
        message: "Hey there, champ! I'm ZIPPY, your AI mentor from Chizel. Ready to turn your screen time into SKILL time?",
        options: [
            { text: "I'm ready!", nextStep: 1, xp: 10 },
            { text: "Tell me more...", nextStep: 2, xp: 5 }
        ]
    },
    {
        speaker: 'zippy',
        message: "That's the spirit! Together, we'll defeat the evil Brainrot that's stealing learning time from kids everywhere!",
        options: [
            { text: "What's Brainrot?", nextStep: 3, xp: 5 },
            { text: "How do we defeat it?", nextStep: 4, xp: 5 }
        ]
    },
    {
        speaker: 'zippy',
        message: "Chizel is your secret weapon against wasted time! We turn fun screen activities into real skills - math, science, creativity - you name it!",
        options: [
            { text: "Sounds awesome!", nextStep: 1, xp: 5 },
            { text: "How does it work?", nextStep: 5, xp: 5 }
        ]
    },
    {
        speaker: 'zippy',
        message: "Brainrot is a sneaky monster that tricks kids into mindless scrolling and gaming without learning anything useful!",
        options: [
            { text: "That's bad!", nextStep: 6, xp: 5 },
            { text: "How can I help?", nextStep: 4, xp: 5 }
        ]
    },
    {
        speaker: 'zippy',
        message: "By completing fun learning missions! Each task you complete weakens Brainrot and makes you smarter!",
        options: [
            { text: "Let's do it!", nextStep: 7, xp: 10 },
            { text: "What kind of tasks?", nextStep: 8, xp: 5 }
        ]
    },
    {
        speaker: 'zippy',
        message: "Simple! You play fun games, solve puzzles, and complete challenges that secretly teach you awesome skills!",
        options: [
            { text: "That sounds fun!", nextStep: 7, xp: 5 },
            { text: "Show me an example", nextStep: 9, xp: 5 }
        ]
    },
    {
        speaker: 'zippy',
        message: "Exactly! And you're going to be a hero by learning while having fun. Ready for your first mission?",
        options: [
            { text: "I'm ready!", nextStep: 7, xp: 10 },
            { text: "One more question...", nextStep: 10, xp: 5 }
        ]
    },
    {
        speaker: 'zippy',
        message: "Great! Here's your first mission to defeat Brainrot. Complete these 3 tasks to level up!",
        options: [],
        action: 'startTasks'
    },
    {
        speaker: 'zippy',
        message: "You'll get brain teasers, quick challenges, and fun facts to learn! Each one gives you XP to level up.",
        options: [
            { text: "Let's try it!", nextStep: 7, xp: 10 },
            { text: "How does XP work?", nextStep: 11, xp: 5 }
        ]
    },
    {
        speaker: 'zippy',
        message: "For example, what's 15 × 3? See? You're already learning math without it feeling like homework!",
        options: [
            { text: "45! That was fun!", nextStep: 7, xp: 10 },
            { text: "Show me more!", nextStep: 8, xp: 5 }
        ]
    },
    {
        speaker: 'zippy',
        message: "What else would you like to know before we begin our mission against Brainrot?",
        options: [
            { text: "How do I track progress?", nextStep: 11, xp: 5 },
            { text: "Nothing, I'm ready!", nextStep: 7, xp: 5 }
        ]
    },
    {
        speaker: 'zippy',
        message: "See that XP bar? It fills as you learn! More XP = higher levels = cooler rewards and powers against Brainrot!",
        options: [
            { text: "Got it! Let's go!", nextStep: 7, xp: 10 },
            { text: "What kind of rewards?", nextStep: 12, xp: 5 }
        ]
    },
    {
        speaker: 'zippy',
        message: "Badges, power-ups, and even real-world prizes! But the best reward is the knowledge you gain!",
        options: [
            { text: "Awesome! Let's start!", nextStep: 7, xp: 10 },
            { text: "Tell me about Brainrot again", nextStep: 3, xp: 5 }
        ]
    },
    // After tasks are completed
    {
        speaker: 'zippy',
        message: "INCREDIBLE! You completed all tasks and earned 50 XP! Brainrot doesn't stand a chance against you!",
        options: [],
        action: 'showFinalMessage'
    }
];

// Task Data
const tasks = [
    {
        id: 'brain-teaser',
        title: "Brain Teaser Challenge",
        type: "brain-teaser",
        question: "If you have 3 apples and you give 1 to your friend and 1 to your sister, how many apples do you have left?",
        options: ["1 apple", "2 apples", "3 apples", "0 apples"],
        correctAnswer: 0,
        xp: 20
    },
    {
        id: 'quick-challenge',
        title: "Quick Challenge",
        type: "quick-challenge",
        instruction: "Drag the correct answer to the target area: What is the capital of India?",
        items: ["Mumbai", "New Delhi", "Bangalore", "Kolkata"],
        correctAnswer: "New Delhi",
        xp: 20
    },
    {
        id: 'learn-fact',
        title: "Learn a Fascinating Fact",
        type: "learn-fact",
        fact: "The human brain has about 100 billion neurons! That's more stars than in our entire Milky Way galaxy!",
        question: "About how many neurons does the human brain have?",
        options: ["1 million", "100 million", "1 billion", "100 billion"],
        correctAnswer: 3,
        xp: 20
    }
];

// Initialize the game
function initGame() {
    updateXPDisplay();
    showStoryStep(0);
    
    // Set up audio toggle
    elements.audioToggle.addEventListener('click', toggleAudio);
    
    // Set up task submit button
    elements.taskSubmit.addEventListener('click', checkTaskAnswer);
}

// Show story step
function showStoryStep(stepIndex) {
    gameState.currentStep = stepIndex;
    const step = storyScript[stepIndex];
    
    if (!step) return;
    
    // Clear options
    elements.optionsContainer.innerHTML = '';
    elements.optionsContainer.classList.add('hidden');
    
    // Hide right bubble if it's Zippy's turn to speak
    elements.rightBubble.classList.remove('visible');
    
    if (step.speaker === 'zippy') {
        // Show typing indicator
        elements.typingIndicator.style.display = 'flex';
        elements.leftBubble.classList.remove('hidden');
        
        // Type out the message
        typeMessage(step.message, elements.leftBubbleContent, () => {
            // Hide typing indicator when done
            elements.typingIndicator.style.display = 'none';
            
            // Show bubble
            elements.leftBubble.classList.add('visible');
            
            // If there's an action, perform it
            if (step.action) {
                performAction(step.action);
            }
            
            // Show options if they exist
            if (step.options && step.options.length > 0) {
                showOptions(step.options);
            }
        });
    } else {
        // For user responses (not used in current story flow)
        elements.rightBubbleContent.textContent = step.message;
        elements.rightBubble.classList.add('visible');
        
        // Move to next step after delay
        setTimeout(() => {
            showStoryStep(step.nextStep);
        }, 1500);
    }
}

// Type message with typing animation
function typeMessage(message, element, callback) {
    let i = 0;
    element.textContent = '';
    
    function typing() {
        if (i < message.length) {
            element.textContent += message.charAt(i);
            i++;
            setTimeout(typing, 30);
        } else if (callback) {
            callback();
        }
    }
    
    typing();
}

// Show response options
function showOptions(options) {
    elements.optionsContainer.innerHTML = '';
    
    options.forEach(option => {
        const button = document.createElement('button');
        button.className = 'option-btn';
        button.textContent = option.text;
        
        button.addEventListener('click', () => {
            // Play sound if audio is enabled
            if (gameState.audioEnabled) {
                audio.notification.currentTime = 0;
                audio.notification.play();
            }
            
            // Show user's response
            showUserResponse(option.text);
            
            // Add XP if specified
            if (option.xp) {
                addXP(option.xp);
            }
            
            // Move to next step after delay
            setTimeout(() => {
                if (option.nextStep !== undefined) {
                    showStoryStep(option.nextStep);
                }
            }, 1500);
        });
        
        elements.optionsContainer.appendChild(button);
    });
    
    elements.optionsContainer.classList.remove('hidden');
}

// Show user response in bubble
function showUserResponse(message) {
    elements.rightBubbleContent.textContent = message;
    elements.rightBubble.classList.add('visible');
    elements.optionsContainer.classList.add('hidden');
}

// Perform special action
function performAction(action) {
    switch (action) {
        case 'startTasks':
            startTasks();
            break;
        case 'showFinalMessage':
            showFinalMessage();
            break;
    }
}

// Start tasks
function startTasks() {
    // Reset completed tasks
    gameState.completedTasks = [];
    gameState.taskCompleted = false;
    
    // Show first task
    showTask(0);
}

// Show task
function showTask(taskIndex) {
    if (taskIndex >= tasks.length) {
        // All tasks completed
        showStoryStep(13); // Show final message
        return;
    }
    
    const task = tasks[taskIndex];
    gameState.currentTask = task;
    
    // Set task header
    elements.taskHeader.textContent = task.title;
    
    // Clear previous task content
    elements.taskContent.innerHTML = '';
    elements.taskSubmit.classList.add('hidden');
    
    // Create task based on type
    switch (task.type) {
        case 'brain-teaser':
            createBrainTeaser(task);
            break;
        case 'quick-challenge':
            createQuickChallenge(task);
            break;
        case 'learn-fact':
            createLearnFact(task);
            break;
    }
    
    // Show task container
    elements.taskContainer.classList.add('visible');
}

// Create brain teaser task
function createBrainTeaser(task) {
    const container = document.createElement('div');
    container.className = 'brain-teaser';
    
    const question = document.createElement('div');
    question.className = 'teaser-question';
    question.textContent = task.question;
    container.appendChild(question);
    
    const options = document.createElement('div');
    options.className = 'teaser-options';
    
    task.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.className = 'teaser-option';
        optionElement.textContent = option;
        
        optionElement.addEventListener('click', () => {
            // Remove selected class from all options
            document.querySelectorAll('.teaser-option').forEach(el => {
                el.classList.remove('selected');
            });
            
            // Add selected class to clicked option
            optionElement.classList.add('selected');
            
            // Store selected answer
            gameState.currentTask.selectedAnswer = index;
            
            // Show submit button
            elements.taskSubmit.classList.remove('hidden');
        });
        
        options.appendChild(optionElement);
    });
    
    container.appendChild(options);
    elements.taskContent.appendChild(container);
}

// Create quick challenge task
function createQuickChallenge(task) {
    const container = document.createElement('div');
    container.className = 'quick-challenge';
    
    const instruction = document.createElement('div');
    instruction.className = 'challenge-instruction';
    instruction.textContent = task.instruction;
    container.appendChild(instruction);
    
    const dragDropArea = document.createElement('div');
    dragDropArea.className = 'drag-drop-area';
    
    // Drag items
    const dragItems = document.createElement('div');
    dragItems.className = 'drag-items';
    
    task.items.forEach(item => {
        const dragItem = document.createElement('div');
        dragItem.className = 'drag-item';
        dragItem.textContent = item;
        dragItem.draggable = true;
        
        dragItem.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', item);
        });
        
        dragItems.appendChild(dragItem);
    });
    
    // Drop target
    const dropTarget = document.createElement('div');
    dropTarget.className = 'drop-target';
    dropTarget.textContent = 'Drop answer here';
    
    dropTarget.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropTarget.classList.add('highlight');
    });
    
    dropTarget.addEventListener('dragleave', () => {
        dropTarget.classList.remove('highlight');
    });
    
    dropTarget.addEventListener('drop', (e) => {
        e.preventDefault();
        dropTarget.classList.remove('highlight');
        
        const answer = e.dataTransfer.getData('text/plain');
        dropTarget.textContent = answer;
        
        // Store selected answer
        gameState.currentTask.selectedAnswer = answer;
        
        // Show submit button
        elements.taskSubmit.classList.remove('hidden');
    });
    
    dragDropArea.appendChild(dragItems);
    dragDropArea.appendChild(dropTarget);
    container.appendChild(dragDropArea);
    elements.taskContent.appendChild(container);
}

// Create learn a fact task
function createLearnFact(task) {
    const container = document.createElement('div');
    container.className = 'learn-fact';
    
    const fact = document.createElement('div');
    fact.className = 'fact-content';
    fact.textContent = task.fact;
    container.appendChild(fact);
    
    const question = document.createElement('div');
    question.className = 'fact-question';
    question.textContent = task.question;
    container.appendChild(question);
    
    const options = document.createElement('div');
    options.className = 'fact-options';
    
    task.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.className = 'fact-option';
        optionElement.textContent = option;
        
        optionElement.addEventListener('click', () => {
            // Remove selected class from all options
            document.querySelectorAll('.fact-option').forEach(el => {
                el.classList.remove('selected');
            });
            
            // Add selected class to clicked option
            optionElement.classList.add('selected');
            
            // Store selected answer
            gameState.currentTask.selectedAnswer = index;
            
            // Show submit button
            elements.taskSubmit.classList.remove('hidden');
        });
        
        options.appendChild(optionElement);
    });
    
    container.appendChild(options);
    elements.taskContent.appendChild(container);
}

// Check task answer
function checkTaskAnswer() {
    const task = gameState.currentTask;
    let isCorrect = false;
    
    // Check answer based on task type
    switch (task.type) {
        case 'brain-teaser':
        case 'learn-fact':
            isCorrect = (task.selectedAnswer === task.correctAnswer);
            break;
        case 'quick-challenge':
            isCorrect = (task.selectedAnswer === task.correctAnswer);
            break;
    }
    
    if (isCorrect) {
        // Play success sound if audio is enabled
        if (gameState.audioEnabled) {
            audio.success.currentTime = 0;
            audio.success.play();
        }
        
        // Add XP
        addXP(task.xp);
        
        // Mark task as completed
        gameState.completedTasks.push(task.id);
        gameState.taskCompleted = true;
        
        // Show success message
        elements.taskContent.innerHTML = `
            <div style="text-align: center;">
                <h3 style="color: var(--success);">Correct! 🎉</h3>
                <p>You earned ${task.xp} XP!</p>
                <button class="option-btn" style="margin-top: 20px;" id="next-task-btn">Next Task</button>
            </div>
        `;
        
        // Add confetti effect
        createConfetti();
        
        // Set up next task button
        document.getElementById('next-task-btn').addEventListener('click', () => {
            elements.taskContainer.classList.remove('visible');
            showTask(gameState.completedTasks.length);
        });
    } else {
        // Show try again message
        elements.taskContent.innerHTML += `
            <div style="text-align: center; margin-top: 20px; color: var(--danger);">
                <p>Not quite right. Try again!</p>
            </div>
        `;
    }
}

// Show final message
function showFinalMessage() {
    elements.taskHeader.textContent = "Mission Accomplished!";
    elements.taskContent.innerHTML = `
        <div style="text-align: center;">
            <h3 style="color: var(--success);">You're now a Skillionaire-in-progress!</h3>
            <p style="font-size: 1.2em; margin: 20px 0;">STAY TUNED with CHIZEL!</p>
            <button class="option-btn" style="margin-top: 20px;" id="restart-btn">Play Again</button>
        </div>
    `;
    
    elements.taskContainer.classList.add('visible');
    
    // Add confetti effect
    createConfetti();
    
    // Set up restart button
    document.getElementById('restart-btn').addEventListener('click', () => {
        elements.taskContainer.classList.remove('visible');
        showStoryStep(0);
    });
}

// Add XP
function addXP(amount) {
    gameState.xp += amount;
    updateXPDisplay();
    localStorage.setItem('chizelXP', gameState.xp.toString());
}

// Update XP display
function updateXPDisplay() {
    elements.xpValue.textContent = gameState.xp;
    
    // Calculate XP percentage (cap at 100 for demo)
    const xpPercentage = Math.min(100, (gameState.xp % 100));
    elements.xpBar.style.width = `${xpPercentage}%`;
}

// Toggle audio
function toggleAudio() {
    gameState.audioEnabled = !gameState.audioEnabled;
    elements.audioToggle.textContent = gameState.audioEnabled ? "🔊" : "🔇";
}

// Create confetti effect
function createConfetti() {
    const colors = ['#6C63FF', '#FF6584', '#FFC107', '#48BB78', '#4F46E5'];
    
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = `${Math.random() * 100}vw`;
        confetti.style.width = `${Math.random() * 10 + 5}px`;
        confetti.style.height = `${Math.random() * 10 + 5}px`;
        confetti.style.animationDuration = `${Math.random() * 3 + 2}s`;
        confetti.style.animationDelay = `${Math.random() * 0.5}s`;
        
        document.body.appendChild(confetti);
        
        // Remove confetti after animation
        setTimeout(() => {
            confetti.remove();
        }, 5000);
    }
}

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', initGame);