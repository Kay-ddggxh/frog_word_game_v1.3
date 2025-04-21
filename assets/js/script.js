// Object for clue word pairs and their solution
/**
 * An array of objects representing clues and their corresponding solution.
 * Each object contains two clues and a solution that connects them.
 *
 */
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

// Global variable to store the currently displayed clue
let currentClue = null;

// Function to generate random words for the columns
function generateColumns() {
    const leftColumn = document.querySelector(".left-column");
    const rightColumn = document.querySelector(".right-column");

    // Clear existing content
    leftColumn.innerHTML = "";
    rightColumn.innerHTML = "";

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
    const leftWords = [...selectedMisDirects.slice(0, 2), clueWords[0]];
    const rightWords = [...selectedMisDirects.slice(2), clueWords[1]];

    // Shuffle the words in each column
    shuffleArray(leftWords);
    shuffleArray(rightWords);

    // Display the words in the columns
    leftWords.forEach((word) => {
        const p = document.createElement("p");
        p.textContent = word;
        leftColumn.appendChild(p);
    });

    rightWords.forEach((word) => {
        const p = document.createElement("p");
        p.textContent = word;
        rightColumn.appendChild(p);
    });
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

// Initialize the columns on page load
generateColumns();
