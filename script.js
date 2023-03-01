const buttons = document.querySelector('.button-wrapper');
const add = (n1, n2) => parseFloat(n1) + parseFloat(n2);
const sub = (n1, n2) => parseFloat(n1) - parseFloat(n2);
const mul = (n1, n2) => parseFloat(n1) * parseFloat(n2);
const div = (n1, n2) => parseFloat(n1) / parseFloat(n2);
const states = {
    START: 1,
    FIRST_NUM: 2,
    FIRST_NUM_WITH_DECIMAL: 3,
    SECOND_NUM: 4,
    SECOND_NUM_WITH_DECIMAL: 5,
    SECOND_NUM_DEC_START: 6,
    OP: 7,
    EQUALS: 8
};
let currentState = states.START;
let display;
let firstOperand;
let secondOperand;
let operator;

buttons.addEventListener('click', e => {
    const btnType = e.target.dataset.type;
    const btnValue = e.target.dataset.value;
    switch (currentState) {
        case states.START:
            break;

        default:
            break;
    }
});