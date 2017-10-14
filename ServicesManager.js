import fetch from 'node-fetch'
import QueryComposer from './QueryComposer'
import ServiceSelector from './ServiceSelector'

let queryComposer = new QueryComposer()
let serviceSelector = new ServiceSelector()

const _ = require('lodash')
const _b = require('bluebird')

export default class ServicesManager {

    constructor(){}

    getResults(category, city) {
        
        //call the serviceSelector
        let services = serviceSelector.selectServices(category, city, null, null)

        //call a queryCompose for each selected service and execute the queries
        return new Promise((resolve, reject) => {
            return _b.map(services, (service) => {
                return queryComposer.composeQuery(service, category, city, null, null)
                .then((res) => {
                    return res
                })
            })
            .then((arr) => {
                resolve(_.flatten(arr))})
            }) 
    }
}