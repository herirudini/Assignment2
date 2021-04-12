const calculateTip = (total, tipPercent = .25) => total + (total * tipPercent)

const fahrenheitToCelcius = (temp) => (temp - 32) / 1.8

const celciusToFarenheit = (temp) => (temp * 1.8) + 32

//
// Goal: Test temperature conversion functions
//
// 1. Export both functions and load them into test suite
// 2. Create "Should convert 32 F to 0 C"
// 3. Create "Should convert 0 c to 32 F"
// 4. Run the Jest to test your work!

const add = (a, b) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (a < 0 || b < 0) {
                return reject('Numbers must be non-negative')
            }

            resolve(a + b)
        }, 2000)
    })
}

module.exports = {
    calculateTip,
    fahrenheitToCelcius,
    celciusToFarenheit,
    add
}