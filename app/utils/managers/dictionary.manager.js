import Color from '../const/colors'
import ext from '../exts/strings'

export var IndicatorCalculator = function calculateIndicatorsForValue (value, upperbound1, lowerbound1) {
    var val = parseFloat((value.trim()).replace(/,/g, '')) || -999
    var lb = parseFloat(lowerbound1.trim()) || -999
    var ub = parseFloat(upperbound1.trim()) || -999
    var zeroArray = ['0','00','0.0', 0, 0.0]
    val = zeroArray.includes(value) ? 0.0 : val
    lb = zeroArray.includes(lowerbound1) ? 0.0 : lb
    ub = zeroArray.includes(upperbound1) ? 0.0 : ub

    if (val !== -999 && lb !== -999 && ub !== -999) {
        var upperbound = parseFloat(upperbound1.trim())
        var lowerbound = parseFloat(lowerbound1.trim())

        let threshold = (upperbound - lowerbound) * 0.05
        let lowerThreshold = lowerbound - threshold
        let upperThreshold = upperbound + threshold
        if ((val >= lowerThreshold && val < lowerbound)
            || (val > upperbound && val <= upperThreshold)) {
            return {
                visibility: true,
                color: Color.yellow
            }
        } else if (lowerbound <= val && upperbound >= val) {
            return {
                visibility: true,
                color: Color.greenBright
            }
        } else {
            return {
                visibility: true,
                color: Color.redExit
            }
        }
    }
    return {
        visibility: false,
        color: Color.clearColor
    }
}
