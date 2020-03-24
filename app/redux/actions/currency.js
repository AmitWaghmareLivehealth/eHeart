
import {CURRENCY, SetCurrency} from './types'


  export function setCurrency (json): SetCurrency {
    return {
      type: CURRENCY,
      payload: json
    }
  }
   
