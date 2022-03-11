function hasDuplicates(array) {
    return (new Set(array)).size !== array.length;
}

// 3 to 5   
// 0~2.999 => 0~2 => 3 ~ 5
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
    hasDuplicates,
    getRandomNumber
}