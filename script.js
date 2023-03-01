const buttons = document.querySelector('.button-wrapper');
const display = document.querySelector('.display');
const add = (n1, n2) => parseFloat(n1) + parseFloat(n2);
const sub = (n1, n2) => parseFloat(n1) - parseFloat(n2);
const mul = (n1, n2) => parseFloat(n1) * parseFloat(n2);
const div = (n1, n2) => parseFloat(n1) / parseFloat(n2);
const updateDisplay = value => display.textContent = value;
const states = {
    START: 1,   // initial state where no key is pressed
    FIRST_NUM: 2,   // number w/o decimal is displayed
    FIRST_NUM_WITH_DECIMAL: 3,  // number w/ decimal is displayed
    SECOND_NUM: 4,  // number w/o decimal that comes after an operator key was pressed
    SECOND_NUM_WITH_DECIMAL: 5, // number w/ decimal that comes after an operator key was pressed
    SECOND_NUM_DEC_START: 6,    // decimal key is pressed right after an operator key
    OP: 7,  // an operator key is pressed
    EQUALS: 8   // equal key is pressed
};
let currentState = states.START;
let disp;
let firstOperand;
let secondOperand;
let operatorKey;

buttons.addEventListener('click', e => {
    const btnType = e.target.dataset.type;
    const btnValue = e.target.dataset.value;
    switch (currentState) {
        case states.START:
            if (btnType === 'number') {
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
            break;
        default:
            break;
    }
});