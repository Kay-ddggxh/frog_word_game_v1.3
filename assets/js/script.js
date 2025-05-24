// Object for clue word pairs and their solution
const cluesAndSolutions = [
  { clue1: "Cup", clue2: "Game", solution: "Board" },
  { clue1: "Rain", clue2: "Rack", solution: "Coat" },
  { clue1: "Cart", clue2: "Chair", solution: "Wheel" },
  { clue1: "Pillow", clue2: "Study", solution: "Case" },
  { clue1: "Foot", clue2: "Game", solution: "Ball" },
  { clue1: "Horse", clue2: "Horn", solution: "Shoe" },
];

// Array of mis-direct words
const misDirects = [
  "Leaf",
  "Pen",
  "Stop",
  "Place",
  "Book",
  "Chair",
  "Table",
  "Lamp",
];

// Global variables
let currentClue = null;
const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
const columnWidth = canvas.width / 3;

// Load the frog sprite
const frogImage = new Image();
frogImage.src = "assets/images/froggy.png"; // Path to the frog sprite

// Load the lily pad sprite
const lilyPadImage = new Image();
lilyPadImage.src = "assets/images/lily-pad.png"; // Path to the lily pad sprite

// Ensure the frog and lily pad images are loaded before drawing
frogImage.onload = function () {
    lilyPadImage.onload = function () {
        // Initialize the columns on page load
        generateColumns();
    };
};

// Function to draw the game areas (sand, river, grass)
function drawGameAreas() {
    // Sand area
    ctx.fillStyle = "#d2b48c"; // Light brown
    ctx.fillRect(0, 0, columnWidth, canvas.height);

    // River area
    ctx.fillStyle = "#87ceeb"; // Blue
    ctx.fillRect(columnWidth, 0, columnWidth, canvas.height);

    // Grass area
    ctx.fillStyle = "#32cd32"; // Green
    ctx.fillRect(columnWidth * 2, 0, columnWidth, canvas.height);
}

// Global variables for animation
let isAnimating = false; // To prevent multiple animations at the same time
let frogX = columnWidth / 2 - 25; // Initial horizontal position of the frog
let frogY = 50 + 3 * 50 + 10; // Initial vertical position of the frog (below the words)
const lilyPadX = columnWidth + columnWidth / 2 - 75; // Horizontal position of the lily pad
const lilyPadY = frogY; // Vertical position of the lily pad
const grassX = columnWidth * 2 + columnWidth / 2 - 25; // Horizontal position of the grass area
let sandWords = []; // Global variable for words in the sand column
let grassWords = []; // Global variable for words in the grass column

// Function to animate the frog
function animateFrog(startX, startY, endX, endY, jumpHeight, duration, callback) {
    if (isAnimating) return; // Prevent multiple animations
    isAnimating = true;

    const startTime = performance.now(); // Start time of the animation

    function step(currentTime) {
        const elapsedTime = currentTime - startTime; // Time elapsed since the animation started
        const progress = Math.min(elapsedTime / duration, 1); // Progress of the animation (0 to 1)

        // Update the frog's position
        frogX = startX + (endX - startX) * progress; // Linear horizontal movement
        frogY = startY + (endY - startY) * progress - jumpHeight * Math.sin(Math.PI * progress); // Parabolic vertical movement

        // Redraw the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
        drawGameAreas(); // Redraw the game areas
        drawWords(); // Redraw the words
        drawFrogAndLilyPad(); // Ensure the frog is drawn after the lily pad

        // Continue the animation or stop if complete
        if (progress < 1) {
            requestAnimationFrame(step); // Continue the animation
        } else {
            isAnimating = false; // Animation complete
            if (callback) callback(); // Execute the callback function if provided
        }
    }

    requestAnimationFrame(step); // Start the animation
}

// Function to handle the frog falling off the lily pad
function fallOffLilyPad() {
    const startX = lilyPadX + 75 - 25; // Center of the lily pad
    const startY = lilyPadY; // Current vertical position of the frog
    const endY = canvas.height; // Bottom edge of the canvas

    animateFrog(startX, startY, startX, endY, 0, 1000, () => {
        // Frog has fallen off and disappeared
        console.log("Frog fell off the lily pad!");
    });
}

// Function to draw the frog and lily pad
function drawFrogAndLilyPad() {
    // Draw the lily pad first
    ctx.drawImage(lilyPadImage, lilyPadX, lilyPadY, 150, 150);

    // Draw the frog on top of the lily pad
    ctx.drawImage(frogImage, frogX, frogY, 50, 50);
}

// Function to draw words in the canvas
function drawWords() {
    ctx.font = "20px Arial";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";

    // Draw words in the sand column
    sandWords.forEach((word, index) => {
        const x = columnWidth / 2; // Center of the sand column
        const y = 50 + index * 50; // Spacing between words
        ctx.fillText(word, x, y);
    });

    // Draw words in the grass column
    grassWords.forEach((word, index) => {
        const x = columnWidth * 2.5; // Center of the grass column
        const y = 50 + index * 50; // Spacing between words
        ctx.fillText(word, x, y);
    });

    // Draw the frog and lily pad
    drawFrogAndLilyPad();
}

// Function to generate random words for the columns
function generateColumns() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the game areas
    drawGameAreas();

    // Randomly select a clue pair from the array
    const randomClueIndex = Math.floor(Math.random() * cluesAndSolutions.length);
    const selectedClue = cluesAndSolutions[randomClueIndex];

    // Store the selected clue in the global variable
    currentClue = selectedClue;

    // Extract clue words and solution
    const clueWords = [selectedClue.clue1, selectedClue.clue2];
    const solutionWord = selectedClue.solution;

    // Randomly select 4 mis-directs that are not clue words or the solution
    const filteredMisDirects = misDirects.filter(
        (word) => !clueWords.includes(word) && word !== solutionWord
    );
    const selectedMisDirects = [];
    while (selectedMisDirects.length < 4) {
        const randomWord = filteredMisDirects[Math.floor(Math.random() * filteredMisDirects.length)];
        if (!selectedMisDirects.includes(randomWord)) {
            selectedMisDirects.push(randomWord);
        }
    }

    // Randomly position the clue words among the mis-directs
    sandWords = [...selectedMisDirects.slice(0, 2), clueWords[0]]; // Assign to global variable
    grassWords = [...selectedMisDirects.slice(2), clueWords[1]]; // Assign to global variable

    // Shuffle the words in each column
    shuffleArray(sandWords);
    shuffleArray(grassWords);

    // Draw the words and the frog in the canvas
    drawWords();
}

// Event listener for form submission
document.getElementById("word-form").addEventListener("submit", function (event) {
    event.preventDefault();
    const userInput = document.getElementById("word-input").value.trim();

    // Use the solution word from the currently displayed clue
    const solutionWord = currentClue.solution;

    // First jump: Sand to Lily Pad
    animateFrog(frogX, frogY, lilyPadX + 75 - 25, lilyPadY, 50, 1000, () => {
        // Check the user's input after the first jump
        if (userInput.toLowerCase() === solutionWord.toLowerCase()) {
            // Correct input: Jump to the grass area
            animateFrog(lilyPadX + 75 - 25, lilyPadY, grassX, frogY, 50, 1000, () => {
                console.log("Frog successfully jumped to the grass!");
            });
        } else {
            // Incorrect input: Fall off the lily pad
            fallOffLilyPad();
        }
    });

    // Clear the input field
    document.getElementById("word-input").value = "";
});

// Event listener for the "Play Again" button
document.getElementById("play-again-button").addEventListener("click", function () {
    generateColumns(); // Regenerate the columns with a new random clue and mis-directs
});

// Utility function to shuffle an array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
