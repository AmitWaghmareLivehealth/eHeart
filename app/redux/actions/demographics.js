import {DEMOGRAPHICS, SetDemographics } from './types'

export function setDemographics (json): SetDemographics{
    return{
        type:DEMOGRAPHICS,
        payload:json
    }
}