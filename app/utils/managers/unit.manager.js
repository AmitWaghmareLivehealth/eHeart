export function height(unit, main_unit, val){
  if(main_unit === 'ft'){
    if(unit === 'cm'){
      return Math.round((parseFloat(val) / 30.48) * 10000) / 10000
    } else if(unit === 'inches' || unit === 'inch'){
      return Math.round((parseFloat(val) / 12) * 10000) / 10000
    } else {
      return Math.round((parseFloat(val)) * 10000) / 10000
    }
  } else if(main_unit === 'cm'){
    if(unit === 'ft'){
      return Math.round((parseFloat(val) * 30.48) * 10000) / 10000
    } else if(unit === 'inches' || unit === 'inch'){
      return Math.round((parseFloat(val) / 0.39370) * 10000) / 10000
    } else {
      return Math.round((parseFloat(val)) * 10000) / 10000
    }
  } else if(main_unit === 'inches' || main_unit === 'inch'){
    if(unit === 'ft'){
      return Math.round((parseFloat(val) * 12) * 10000) / 10000
    } else if(unit === 'cm'){
      return Math.round((parseFloat(val) * 0.39370) * 10000) / 10000
    } else {
      return Math.round((parseFloat(val)) * 10000) / 10000
    }
  }
}

export function weight(unit, main_unit, val){
  if(main_unit === 'kg'){
    if(unit === 'gms' || unit === 'grams'){
      return Math.round((parseFloat(val) / 1000) * 10000) / 10000
    } else if(unit === 'lbs'){
      return Math.round((parseFloat(val) / 2.2046) * 10000) / 10000
    } else {
      return Math.round((parseFloat(val)) * 10000) / 10000
    }
  } else if(main_unit === 'gms' || unit === 'grams'){
    if(unit === 'kg'){
      return Math.round((parseFloat(val) * 1000) * 10000) / 10000
    } else if(unit === 'lbs'){
      return Math.round((parseFloat(val) / 0.0022046) * 10000) / 10000
    } else {
      return Math.round((parseFloat(val)) * 10000) / 10000
    }
  } else if(main_unit === 'lbs'){
    if(unit === 'kg'){
      return Math.round((parseFloat(val) * 2.2046) * 10000) / 10000
    } else if(unit === 'gms'){
      return Math.round((parseFloat(val) * 0.0022046) * 10000) / 10000
    } else {
      return Math.round((parseFloat(val)) * 10000) / 10000
    }
  }
}

export function distance(unit, main_unit, val){
  if(main_unit === 'kms'){
    if(unit === 'meters'){
      return Math.round((parseFloat(val) / 1000) * 10000) / 10000
    } else if(unit === 'miles'){
      return Math.round((parseFloat(val) / 0.62137) * 10000) / 10000
    } else {
      return Math.round((parseFloat(val)) * 10000) / 10000
    }
  } else if(main_unit === 'meters'){
    if(unit === 'kms'){
      return Math.round((parseFloat(val) * 1000) * 10000) / 10000
    } else if(unit === 'miles'){
      return Math.round((parseFloat(val) / 0.00062137) * 10000) / 10000
    } else {
      return Math.round((parseFloat(val)) * 10000) / 10000
    }
  } else if(main_unit === 'miles'){
    if(unit === 'kms'){
      return Math.round((parseFloat(val) * 0.62137) * 10000) / 10000
    } else if(unit === 'meters'){
      return Math.round((parseFloat(val) * 0.00062137) * 10000) / 10000
    } else {
      return Math.round((parseFloat(val)) * 10000) / 10000
    }
  }
}


export function temperature(unit, main_unit, val){
  if(main_unit === 'C'){
    if(unit === 'F'){
      temp = Math.round((parseFloat(val) - 32) * 10000) / 10000
      temp = temp * 5
      return temp / 9
    } else {
      return Math.round((parseFloat(val)) * 10000) / 10000
    }
  } else if(main_unit === 'F'){
    if(unit === 'C'){
      temp = Math.round((parseFloat(val) * 9) * 10000) / 10000
      temp = temp / 5
      temp += 32
      return temp
    } else {
      return Math.round((parseFloat(val)) * 10000) / 10000
    }
  }
}

export function mgdltommol(unit, main_unit, val){
  if(main_unit === 'mg/dL'){
    if(unit === 'mmol/L'){
      return Math.round((parseFloat(val) * 38.67) * 10000) / 10000
    } else {
      return Math.round((parseFloat(val)) * 10000) / 10000
    }
  } else if(main_unit === 'mmol/L'){
    if(unit === 'mg/dL'){
      return Math.round((parseFloat(val) / 38.67) * 10000) / 10000
    } else {
      return Math.round((parseFloat(val)) * 10000) / 10000
    }
  }
}

export function mgdltommolVLDL( unit, main_unit, val){
  if(main_unit === 'mg/dL'){
    if(unit === 'mmol/L'){
      return Math.round((parseFloat(val) * 38.61) * 10000) / 10000
    } else {
      return Math.round((parseFloat(val)) * 10000) / 10000
    }
  } else if(main_unit === 'mmol/L'){
    if(unit === 'mg/dL'){
      return Math.round((parseFloat(val) / 38.61) * 10000) / 10000
    } else {
      return Math.round((parseFloat(val)) * 10000) / 10000
    }
  }
}

export function mgdltommolSerum( unit, main_unit, val){
  if(main_unit === 'mg/dL'){
    if(unit === 'mmol/L'){
      return Math.round((parseFloat(val) * 88.57) * 10000) / 10000
    } else {
      return Math.round((parseFloat(val)) * 10000) / 10000
    }
  } else if(main_unit === 'mmol/L'){
    if(unit === 'mg/dL'){
      return Math.round((parseFloat(val) / 88.57) * 10000) / 10000
    } else {
      return Math.round((parseFloat(val)) * 10000) / 10000
    }
  }
}

export function mgdltommolGlucose(unit, main_unit, val){
  if(main_unit === 'mg/dL'){
    if(unit === 'mmol/L'){
      return Math.round((parseFloat(val) * 18016) * 10000) / 10000
    } else {
      return Math.round((parseFloat(val)) * 10000) / 10000
    }
  } else if(main_unit === 'mmol/L'){
    if(unit === 'mg/dL'){
      return Math.round((parseFloat(val) * 0.0555) * 10000) / 10000
    } else {
      return Math.round((parseFloat(val)) * 10000) / 10000
    }
  }
}








// export function mgdlTommolGlucose(val){
//     return float(val) * 0.0555
// }
//
// export function mmolTomgdlGLucose(val){
//     return float(val) * 18016
// }
//
//
// export function mgDltommolSerum(val){
//     return float(val) / 88.57
// }
//
// export function mmoltomgDlSerum(val){
//     return float(val) * 88.57
// }
//
// export function mgDlTommol(val){
//     return float(val) / 38.67
// }
//
// export function mmolTomgDl(val){
//     return float(val) * 38.67
// }
//
// export function mgDlTommolVLDL(val){
//     return float(val) / 38.61
// }
//
// export function mmolTomgDlVLDL(val){
//     return float(val) * 38.61
// }
//
// export function cTOf(val){
//     temp = float(val) * 9
//     temp = temp / 5
//     temp += 32
//     return temp
// }
//
// export function fTOc(val){
//     temp = float(val) - 32
//     temp = temp * 5
//     return temp / 9
// }
//
//
//
// export function kmsToMeter(val){
//     return float(val) * 1000
// }
//
// export function metersToKms(val){
//     return float(val) / 1000
// }
//
// export function kmsToMiles(val){
//     return float(val) * 0.62137
// }
//
// export function milesToKms(val){
//     return float(val) / 0.62137
// }
//
// export function metersToMiles(val){
//     return float(val) * 0.00062137
// }
//
// export function milesToMeters(val){
//     return float(val) / 0.00062137
// }
//
//
// export function heigthInCms(val){
//     return float(val) * 30.48
// }
//
// export function heigthInFt(val){
//     return float(val) / 30.48
// }
//
// export function weightInKg(val){
//     return float(val) / 2.2046
// }
//
// export function weightInLbs(val){
//     return float(val) * 2.2046
// }
//
// export function leanBodyInGms(val){
//     return float(val) * 1000
// }
//
// export function leanBodyInKgs(val){
//     return float(val) / 1000
// }
//
// export function leanBodyGmsToLbs(val){
//     return float(val) * 0.0022046
// }
//
// export function leanBodyLbsToGms(val){
//     return float(val) / 0.0022046
// }
//
// export function lbsTOgms(val){
//     return float(val) * 453.592
// }
//
// export function gmsTOlbs(val){
//     return float(val) / 453.592
// }
//
// export function kgsTOgms(val){
//     return float(val) * 1000
// }
//
// export function gmsTOkgs(val){
//     return float(val) / 1000
// }
//
//
//
// export function ftTOinches(val){
//     return float(val) * 12
// }
//
// export function inchesToFt(val){
//     return float(val) / 12
// }
//
// export function cmToInches(val){
//     return float(val) * 0.39370
// }
//
// export function inchesToCm(val){
//     return float(val) / 0.39370
// }
