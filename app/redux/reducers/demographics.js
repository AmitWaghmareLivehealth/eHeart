import {DEMOGRAPHICS} from '../actions/types'


const INITIAL_STATE ={
    demographics:{
        industryType:0,
        occupation:0,
        isDiabetic:0,
        isChronic:0,
        isSmoker:0,
        consumesAlcohol:0,
        bloodGroup:0,
        hasInsurance:0,
        insuranceName:0,

        height:0,
        weight:0,

        activenessLevel:0,
        stressLevel:0,

        email:0,
        fullName:0,
        profilePic:0,
        dateOfBirth:0,
        sex:0,
        screen:1,

        show:1
        },
};


export default (state = INITIAL_STATE, action)=>{

    switch(action.type){
        case DEMOGRAPHICS:
            let temp = state
            let list = Object.keys(state['demographics'])
            let updatedList = Object.keys(action.payload)
            for(let i=0;i<list.length;i++){
                temp['demographics'][updatedList[i]] = action.payload[updatedList[i]]
            }
            return   {...state, demographics: temp.demographics}

    default:
      return state
    }

}