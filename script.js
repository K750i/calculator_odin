'use strict';
const buttons = document.querySelector('.button-wrapper');
const display = document.querySelector('.main-display');
const secondDisplay = document.querySelector('.secondary-display');
const regex = /\.?0+$/;
const states = {
    START: 1,   // initial state where no key is pressed
    FIRST_NUM: 2,   // number w/o decimal is displayed
    FIRST_NUM_WITH_DECIMAL: 3,  // number w/ decimal is displayed
    SECOND_NUM: 4,  // number w/o decimal that comes after an operator key was pressed
    SECOND_NUM_WITH_DECIMAL: 5, // number w/ decimal that comes after an operator key was pressed
    OP: 6,  // an operator key is pressed
    EQUALS: 7,   // equal key is pressed
    FIRST_PCT: 8,    // pct key pressed before operator keys
    SECOND_PCT: 9,  // pct key pressed after operator keys
};
const symbols = { add: '+', sub: '-', mul: '×', div: '÷' };
const operations = {
    add: (n1, n2) => parseFloat(n1) + parseFloat(n2),
    sub: (n1, n2) => parseFloat(n1) - parseFloat(n2),
    mul: (n1, n2) => parseFloat(n1) * parseFloat(n2),
    div: (n1, n2) => parseFloat(n1) / parseFloat(n2),
    neg: n => n.startsWith('-') ? n.slice(1) : '-' + n,
};
const calculate = (operation, n1, n2) => {
    const result = operation(n1, n2).toPrecision(12);
    return result.replace(regex, '');
};
const updateDisplay = value => display.textContent = value;
const updateSecondaryDisplay = (first, operator, second) => {
    first = first ?? '';
    operator = symbols[operator] ?? '';
    second = second ?? '';
    secondDisplay.textContent = `${first} ${operator} ${second} ${currentState === 7 ? '=' : ''}`;
};
const reset = () => {
    currentState = states.START;
    disp = 0;
    firstOperand = null;
    secondOperand = null;
    operatorKey = null;
    updateDisplay(disp);
    updateSecondaryDisplay();
};
const deleteNum = state => {
    disp = disp.toString();
    if (disp.length === 1 || (disp.length === 2 && disp.startsWith('-'))) {
        disp = 0;
        currentState = state;
    }
    else {
        disp = disp.slice(0, -1);
    }
};
let currentState = states.START;
let disp;
let firstOperand;
let secondOperand;
let operatorKey;

buttons.addEventListener('click', e => {
    const { type: btnType, value: btnValue } = e.target.dataset;

    if (btnType === 'key_ac') {
        reset();
        return;
    }

    if (btnType === 'key_neg') {
        if (currentState === states.OP) return;
        disp = operations[btnValue](disp.toString());
        updateDisplay(disp);
        return;
    }

    switch (currentState) {
        case states.START:
            if (btnType === 'number') {
                if (btnValue === '0') return;
                disp = btnValue;
                updateDisplay(disp);
                currentState = states.FIRST_NUM;
            }
            if (btnType === 'key_dot') {
                disp = '0.';
                updateDisplay(disp);
                currentState = states.FIRST_NUM_WITH_DECIMAL;
            }
            break;
        case states.FIRST_NUM:
            if (btnType === 'number') {
                disp += btnValue;
                updateDisplay(disp);
            }
            if (btnType === 'key_dot') {
                disp += '.';
                updateDisplay(disp);
                currentState = states.FIRST_NUM_WITH_DECIMAL;
            }
            if (btnType === 'operator') {
                operatorKey = btnValue;
                firstOperand = disp;
                currentState = states.OP;
            }
            if (btnType === 'key_pct') {
                disp = disp / 100;
                updateDisplay(disp);
                currentState = states.FIRST_PCT;
            }
            if (btnType === 'key_ce') {
                disp = 0;
                updateDisplay(disp);
                currentState = states.START;
            }
            if (btnType === 'key_del') {
                deleteNum(states.START);
                updateDisplay(disp);
            }
            break;
        case states.FIRST_NUM_WITH_DECIMAL:
            if (btnType === 'number') {
                disp += btnValue;
                updateDisplay(disp);
            }
            if (btnType === 'operator') {
                operatorKey = btnValue;
                firstOperand = disp;
                currentState = states.OP;
            }
            if (btnType === 'key_pct') {
                disp = disp / 100;
                updateDisplay(disp);
                currentState = states.FIRST_PCT;
            }
            if (btnType === 'key_ce') {
                disp = 0;
                updateDisplay(disp);
                currentState = states.START;
            }
            if (btnType === 'key_del') {
                deleteNum(states.START);
                updateDisplay(disp);
            }
            break;
        case states.OP:
            if (btnType === 'number') {
                disp = btnValue;
                updateDisplay(disp);
                if (btnValue === '0') return;
                currentState = states.SECOND_NUM;
            }
            if (btnType === 'operator') {
                secondOperand = null;
                operatorKey = btnValue;
            }
            if (btnType === 'key_dot') {
                disp = '0.';
                updateDisplay(disp);
                currentState = states.SECOND_NUM_WITH_DECIMAL;
            }
            if (btnType === 'key_eq') {
                secondOperand = disp;
                disp = calculate(operations[operatorKey], disp, firstOperand);
                updateDisplay(disp);
                currentState = states.EQUALS;
            }
            break;
        case states.SECOND_NUM:
            if (btnType === 'number') {
                disp += btnValue;
                updateDisplay(disp);
            }
            if (btnType === 'operator') {
                disp = calculate(operations[operatorKey], firstOperand, disp);
                updateDisplay(disp);
                operatorKey = btnValue;
                firstOperand = disp;
                currentState = states.OP;
            }
            if (btnType === 'key_dot') {
                disp += '.';
                updateDisplay(disp);
                currentState = states.SECOND_NUM_WITH_DECIMAL;
            }
            if (btnType === 'key_pct') {
                if (operatorKey === 'mul' || operatorKey === 'div') {
                    secondOperand = disp / 100;
                    disp = calculate(operations[operatorKey], firstOperand, secondOperand);
                } else {
                    secondOperand = firstOperand * disp / 100;
                    disp = calculate(operations[operatorKey], firstOperand, secondOperand);
                }
                updateDisplay(disp);
                currentState = states.SECOND_PCT;
            }
            if (btnType === 'key_eq') {
                secondOperand = disp;
                disp = calculate(operations[operatorKey], firstOperand, secondOperand);
                updateDisplay(disp);
                currentState = states.EQUALS;
            }
            if (btnType === 'key_ce') {
                disp = 0;
                updateDisplay(disp);
                currentState = states.OP;
            }
            if (btnType === 'key_del') {
                deleteNum(states.OP);
                updateDisplay(disp);
            }
            break;
        case states.SECOND_NUM_WITH_DECIMAL:
            if (btnType === 'number') {
                disp += btnValue;
                updateDisplay(disp);
            }
            if (btnType === 'operator') {
                disp = calculate(operations[operatorKey], firstOperand, disp);
                updateDisplay(disp);
                operatorKey = btnValue;
                firstOperand = disp;
                currentState = states.OP;
            }
            if (btnType === 'key_pct') {
                if (operatorKey === 'mul' || operatorKey === 'div') {
                    secondOperand = disp / 100;
                    disp = calculate(operations[operatorKey], firstOperand, secondOperand);
                } else {
                    secondOperand = firstOperand * disp / 100;
                    disp = calculate(operations[operatorKey], firstOperand, secondOperand);
                }
                updateDisplay(disp);
                currentState = states.SECOND_PCT;
            }
            if (btnType === 'key_eq') {
                secondOperand = disp;
                disp = calculate(operations[operatorKey], firstOperand, disp);
                updateDisplay(disp);
                currentState = states.EQUALS;
            }
            if (btnType === 'key_ce') {
                disp = 0;
                updateDisplay(disp);
                currentState = states.OP;
            }
            if (btnType === 'key_del') {
                deleteNum(states.OP);
                updateDisplay(disp);
            }
            break;
        case states.EQUALS:
            if (btnType === 'number') {
                disp = btnValue;
                updateDisplay(disp);
                firstOperand = null;
                secondOperand = null;
                operatorKey = null;
                if (btnValue === '0') return;
                currentState = states.FIRST_NUM;
            }
            if (btnType === 'key_dot') {
                disp = '0.';
                updateDisplay(disp);
                currentState = states.FIRST_NUM_WITH_DECIMAL;
            }
            if (btnType === 'key_eq') {
                firstOperand = disp;
                disp = calculate(operations[operatorKey], disp, secondOperand);
                updateDisplay(disp);
            }
            if (btnType === 'operator') {
                firstOperand = disp;
                secondOperand = null;
                operatorKey = btnValue;
                currentState = states.OP;
            }
            break;
        case states.FIRST_PCT:
            if (btnType === 'key_pct') {
                disp = disp / 100;
                updateDisplay(disp);
            }
            if (btnType === 'number') {
                disp = btnValue;
                updateDisplay(disp);
                if (btnValue === '0') return;
                currentState = states.FIRST_NUM;
            }
            if (btnType === 'key_dot') {
                disp = '0.';
                updateDisplay(disp);
                currentState = states.FIRST_NUM_WITH_DECIMAL;
            }
            if (btnType === 'operator') {
                operatorKey = btnValue;
                firstOperand = disp;
                currentState = states.OP;
            }
            break;
        case states.SECOND_PCT:
            if (btnType === 'number') {
                disp = btnValue;
                updateDisplay(disp);
                if (btnValue === '0') return;
                currentState = states.FIRST_NUM;
            }
            if (btnType === 'operator') {
                operatorKey = btnValue;
                firstOperand = disp;
                updateDisplay(disp);
                currentState = states.OP;
            }
            if (btnType === 'key_dot') {
                disp = '0.';
                updateDisplay(disp);
                currentState = states.FIRST_NUM_WITH_DECIMAL;
            }
            break;
    }
    updateSecondaryDisplay(firstOperand, operatorKey, secondOperand);
});