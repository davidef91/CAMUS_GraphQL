import fetch from 'node-fetch'
import QueryComposer from './QueryComposer'
import ServiceSelector from './ServiceSelector'

let queryComposer = new QueryComposer()
let serviceSelector = new ServiceSelector()

export default class ServicesManager {

    constructor(){}

    getResults(category, city) {
        
        let service = serviceSelector.selectServices(category, city, null, null)

        return new Promise((resolve, reject) => {
            queryComposer.composeQuery(service, category, city, null, null)
            .then((results) => {
                resolve(results)
            })
        })
    }
}