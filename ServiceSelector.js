const _ = require('lodash')


export default class ServiceSelector {

    constructor() {}

    selectServices(category, city, startTime, position) {

        let eventBrite = {
            id: 1234
        }

        let eventful = {
            id: 5678
        }

        return [eventful, eventBrite]
    }
}