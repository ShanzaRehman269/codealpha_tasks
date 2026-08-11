const expression = document.getElementById("expression");
const result = document.getElementById("result");

let current = "";
let calculated = false;


// Display
function updateDisplay() {
    expression.textContent = current || "0";

    if (!current) {
        result.textContent = "0";
        return;
    }

    try {
        const value = calculate(current);

        if (value !== null && isFinite(value)) {
            result.textContent = format(value);
        } else {
            result.textContent = "0";
        }
    } catch {
        result.textContent = "0";
    }
}


// Calculate expression
function calculate(value) {

    value = value
        .replace(/×/g, "*")
        .replace(/÷/g, "/")
        .replace(/−/g, "-");

    // Check for invalid characters
    if (!/^[0-9+\-*/.() ]+$/.test(value)) {
        throw new Error("Syntax Error");
    }

    // Check for consecutive operators
    if (/[+\-*/]{2,}/.test(value)) {
        throw new Error("Syntax Error");
    }

    // Check for operator at the beginning
    if (/^[+*/]/.test(value)) {
        throw new Error("Syntax Error");
    }

    // Check for operator at the end
    if (/[+\-*/]$/.test(value)) {
        throw new Error("Syntax Error");
    }

    // Check for empty brackets
    if (/\(\)/.test(value)) {
        throw new Error("Syntax Error");
    }

    return Function("return " + value)();
}

// Format numbers
function format(value) {

    if (!Number.isFinite(value)) {
        return "Error";
    }

    return Number.isInteger(value)
        ? value.toString()
        : Number(value.toFixed(8)).toString();
}


// Add number/operator
function addValue(value) {

    if (calculated && /[0-9.]/.test(value)) {
        current = "";
        calculated = false;
    }

    current += value;
    updateDisplay();
}


// Clear
function clearCalculator() {
    current = "";
    calculated = false;
    updateDisplay();
}


// Delete
function deleteLast() {
    current = current.slice(0, -1);
    updateDisplay();
}


// Percentage
function percentage() {

    const match = current.match(/(\d+\.?\d*)$/);

    if (match) {
        const number = parseFloat(match[0]);
        current = current.slice(0, -match[0].length) + number / 100;
    }

    updateDisplay();
}


// Final calculation

function finalCalculate() {

    if (!current) {
        result.textContent = "Syntax Error";
        result.classList.add("error");
        return;
    }

    try {

        const value = calculate(current);

        if (!Number.isFinite(value)) {
            result.textContent = "Syntax Error";
            result.classList.add("error");
            return;
        }

        // Valid answer
        result.textContent = format(value);

        // Remove error styling
        result.classList.remove("error");

        calculated = true;

    } catch {

        // Invalid operation
        result.textContent = "Syntax Error";
        result.classList.add("error");
    }
}

// Button controls
document.querySelectorAll("button").forEach(button => {

    button.addEventListener("click", () => {

        const value = button.dataset.value;
        const action = button.dataset.action;

        if (value !== undefined) {
            addValue(value);
        }

        if (action === "clear") {
            clearCalculator();
        }

        if (action === "delete") {
            deleteLast();
        }

        if (action === "percent") {
            percentage();
        }

        if (action === "calculate") {
            finalCalculate();
        }
    });
});


// Keyboard support
document.addEventListener("keydown", event => {

    const key = event.key;

    if ("0123456789.".includes(key)) {
        addValue(key);
    }

    else if ("+-*/".includes(key)) {
        addValue(key);
    }

    else if (key === "Enter" || key === "=") {
        event.preventDefault();
        finalCalculate();
    }

    else if (key === "Escape") {
        clearCalculator();
    }

    else if (key === "Backspace") {
        deleteLast();
    }

    else if (key === "%") {
        percentage();
    }
});


updateDisplay();