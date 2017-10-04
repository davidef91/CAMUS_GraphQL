import fetch from 'node-fetch'
import QueryComposer from './QueryComposer'

let queryComposer = new QueryComposer()

export default class ServicesManager {

    constructor(){}

    getResults(category, city) {
        let eventBrite = {
            id: 1234
        }

        let eventful = {
            id: 5678
        }

        return new Promise((resolve, reject) => {
            queryComposer.composeQuery(eventBrite, category, city, null, null)
            .then((results) => {
                resolve(results)
            })
        })
    }
}