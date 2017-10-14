const _ = require('lodash')

import {serviceMatrix} from './ServiceMatrix'

export default class QueryComposer {

    constructor() {}

    composeQuery(service, category, city, startTime, position) {
        const IN = -1
        const NONE = 0    
        const OUT = 1
        
        let filteredMatrix = []
        let input = {}

        //filter the serviceMatrix by service ID
        let oneServiceMatrix = _.filter(serviceMatrix, { serviceID: service.id })

        //check which input parameters are selected by user and select the first method to use
        if(city !== undefined)
            if(category !== undefined){
                filteredMatrix = _.filter(oneServiceMatrix, { city: IN, category: IN })
                input = {city: city, category: category}
            }                
            else {
                filteredMatrix = _.filter(oneServiceMatrix, { city: IN, category: NONE })
                input = {city: city}
            }
                
        else if(category !== undefined){
            filteredMatrix = _.filter(oneServiceMatrix, { city: NONE, category: IN })
            input = {category: category}
        }

        //add the other methods that service needs to complete the results
        if(filteredMatrix[0].param1 !== NONE){
            filteredMatrix = _.union(filteredMatrix, _.filter(oneServiceMatrix, { param1: IN }))
            if(filteredMatrix[0].param2 !== NONE){
                filteredMatrix = _.union(filteredMatrix, _.filter(oneServiceMatrix, { param2: IN }))
                if(filteredMatrix[0].param3 !== NONE)
                filteredMatrix = _.union(filteredMatrix, _.filter(oneServiceMatrix, { param3: IN }))
            }
        }
        
        //call the methods sequentially according to the number of needed methods
        switch(_.size(filteredMatrix)){
            case 1: {
                return filteredMatrix[0].query([input])
                .then((events) => {
                    return _.map(events, (e) => {
                        return e.event
                    })
                })
                break
            }
                
            case 2: {
                return filteredMatrix[0].query([input])
                .then(filteredMatrix[1].query)
                .then((events) => {
                    return _.map(events, (e) => {
                        return e.event
                    })
                })
                break
            }
            case 3: {
                return filteredMatrix[0].query([input])
                .then(filteredMatrix[1].query)
                .then(filteredMatrix[2].query)
                .then((events) => {
                    return _.map(events, (e) => {
                        return e.event
                    })
                })
                break
            }
        }
    }
}