const display = document.getElementById("display");
const buttons = document.querySelectorAll(".btn");
const clearBtn = document.getElementById("clear");
const equalsBtn = document.getElementById("equals");

let currentInput = "";
let lastResult = null;

function updateDisplay(value) {
  display.value = value;
}

function appendToInput(value) {
  // Prevent multiple dots in one number
  if (value === "." && currentInput.endsWith(".")) return;

  // Prevent starting input with operators except '-'
  if (["+", "*", "/"].includes(value) && currentInput === "") return;

  // Prevent two operators in a row
  const operators = ["+", "-", "*", "/"];
  if (
    operators.includes(value) &&
    operators.includes(currentInput.slice(-1))
  ) {
    // Replace last operator with new one
    currentInput = currentInput.slice(0, -1);
  }

  currentInput += value;
  updateDisplay(currentInput);
}

function clearInput() {
  currentInput = "";
  lastResult = null;
  updateDisplay("0");
}

function calculate() {
  if (currentInput === "") return;

  try {
    // Evaluate the expression safely
    // Using Function constructor for safer eval
    const result = Function(`"use strict"; return (${currentInput})`)();

    if (result === Infinity || result === -Infinity) {
      updateDisplay("Error: Divide by zero");
      currentInput = "";
      return;
    }

    if (isNaN(result)) {
      updateDisplay("Error");
      currentInput = "";
      return;
    }

    updateDisplay(result);
    lastResult = result;
    currentInput = result.toString();
  } catch (e) {
    updateDisplay("Error");
    currentInput = "";
  }
}

// Button click event handling
buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const value = button.dataset.value;

    if (button.id === "clear") {
      clearInput();
      return;
    }

    if (button.id === "equals") {
      calculate();
      return;
    }

    appendToInput(value);
  });
});

// Keyboard input handling
window.addEventListener("keydown", (e) => {
  const allowedKeys = "0123456789+-*/.";

  if (allowedKeys.includes(e.key)) {
    e.preventDefault();
    appendToInput(e.key);
  } else if (e.key === "Enter") {
    e.preventDefault();
    calculate();
  } else if (e.key === "Backspace") {
    e.preventDefault();
    currentInput = currentInput.slice(0, -1);
    updateDisplay(currentInput || "0");
  } else if (e.key === "Escape") {
    e.preventDefault();
    clearInput();
  }
});
