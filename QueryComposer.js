import fetch from 'node-fetch'
const _ = require('lodash')
const _b = require('bluebird')

import {serviceMatrix} from './ServiceMatrix'

export default class QueryComposer {

    constructor() {}

    composeQuery(service, category, city, startTime, searchPosition) {

        let filteredMatrix = _.filter(serviceMatrix, { serviceID: service.id })

        return filteredMatrix[0].query([{ city }])
        .then(filteredMatrix[1].query)
        .then((events) => { 
            return _.map(events, (e) => {
                return e.event
            })
        })
    }
}