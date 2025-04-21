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

// Function to draw words in the canvas
function drawWords(sandWords, grassWords) {
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

    // Draw the frog sprite below the words in the sand column
    const frogX = columnWidth / 2 - 25; // Center the frog horizontally in the sand column
    const frogY = 50 + sandWords.length * 50 + 10; // Position below the last word
    ctx.drawImage(frogImage, frogX, frogY, 50, 50); // Draw the frog (50x50 size)

    // Draw the lily pad in the river area at the same horizontal level as the frog
    const lilyPadX = columnWidth + columnWidth / 2 - 75; // Center the lily pad in the river column
    const lilyPadY = frogY - 50; // Same vertical position as the frog
    ctx.drawImage(lilyPadImage, lilyPadX, lilyPadY, 150, 150); // Draw the lily pad (150x150 size)
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
    const sandWords = [...selectedMisDirects.slice(0, 2), clueWords[0]];
    const grassWords = [...selectedMisDirects.slice(2), clueWords[1]];

    // Shuffle the words in each column
    shuffleArray(sandWords);
    shuffleArray(grassWords);

    // Draw the words and the frog in the canvas
    drawWords(sandWords, grassWords);
}

// Event listener for form submission
document.getElementById("word-form").addEventListener("submit", function (event) {
    event.preventDefault();
    const userInput = document.getElementById("word-input").value.trim();

    // Use the solution word from the currently displayed clue
    const solutionWord = currentClue.solution;

    // Check if the user's input matches the solution word
    if (userInput.toLowerCase() === solutionWord.toLowerCase()) {
        alert("Correct! You solved the puzzle.");
    } else {
        alert("Incorrect. Try again!");
    }

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
