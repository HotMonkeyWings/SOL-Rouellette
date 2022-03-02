// Function to calulcate amount potentially won by player
// Amount is multiplied by the ratio inverse
function getReturnAmount(amount, ratio) {
    let _ratio = ratio.split(':');
    let ratioInverse = parseFloat(_ratio[1]) / parseFloat(_ratio[0]);
    return parseInt(amount, 10) * ratioInverse;
}

// Function to find random number
const randomNumber = (min, max) => {
    return Math.floor(Math.random() * (max) + min);
};

module.exports = {
    getReturnAmount,
    randomNumber
}