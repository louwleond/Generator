let display = document.getElementById('display');
let historyDiv = document.getElementById('history');
let currentInput = '0';
let previousInput = '';
let operator = null;
let shouldResetDisplay = false;
let history = JSON.parse(localStorage.getItem('calculatorHistory')) || [];

// Load history on startup
loadHistory();

function updateDisplay() {
    display.textContent = currentInput.length > 15 ? currentInput.slice(-15) : currentInput;
}

function appendNumber(num) {
    if (shouldResetDisplay) {
        currentInput = num;
        shouldResetDisplay = false;
    } else {
        if (currentInput === '0' && num !== '.') {
            currentInput = num;
        } else if (num === '.' && currentInput.includes('.')) {
            return;
        } else {
            currentInput += num;
        }
    }
    updateDisplay();
}

function appendOperator(op) {
    if (operator !== null && !shouldResetDisplay) {
        calculate();
    }
    previousInput = currentInput;
    operator = op;
    shouldResetDisplay = true;
}

function calculate() {
    if (operator === null || shouldResetDisplay) {
        return;
    }

    let result;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);

    switch (operator) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            if (current === 0) {
                alert('Cannot divide by zero!');
                clearDisplay();
                return;
            }
            result = prev / current;
            break;
        case '%':
            result = prev % current;
            break;
        default:
            return;
    }

    // Add to history
    const calculation = `${prev} ${operator} ${current} = ${result}`;
    addToHistory(calculation);

    currentInput = parseFloat(result.toFixed(10)).toString();
    operator = null;
    shouldResetDisplay = true;
    updateDisplay();
}

function clearDisplay() {
    currentInput = '0';
    previousInput = '';
    operator = null;
    shouldResetDisplay = false;
    updateDisplay();
}

function deleteLast() {
    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = '0';
    }
    updateDisplay();
}

function addToHistory(calculation) {
    history.unshift(calculation);
    if (history.length > 10) {
        history.pop();
    }
    localStorage.setItem('calculatorHistory', JSON.stringify(history));
    loadHistory();
}

function loadHistory() {
    historyDiv.innerHTML = '';
    if (history.length === 0) {
        historyDiv.innerHTML = '<div class="history-item">No history yet</div>';
    } else {
        history.forEach(item => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.textContent = item;
            historyDiv.appendChild(historyItem);
        });
    }
}

function clearHistory() {
    if (confirm('Are you sure you want to clear history?')) {
        history = [];
        localStorage.removeItem('calculatorHistory');
        loadHistory();
    }
}

// Keyboard support
document.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9') appendNumber(e.key);
    if (e.key === '.') appendNumber('.');
    if (e.key === '+') { e.preventDefault(); appendOperator('+'); }
    if (e.key === '-') { e.preventDefault(); appendOperator('-'); }
    if (e.key === '*') { e.preventDefault(); appendOperator('*'); }
    if (e.key === '/') { e.preventDefault(); appendOperator('/'); }
    if (e.key === '%') { e.preventDefault(); appendOperator('%'); }
    if (e.key === 'Enter') { e.preventDefault(); calculate(); }
    if (e.key === 'Backspace') { e.preventDefault(); deleteLast(); }
    if (e.key === 'Escape') { e.preventDefault(); clearDisplay(); }
});

// Initialize display
updateDisplay();
