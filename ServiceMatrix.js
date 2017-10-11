import fetch from 'node-fetch'

const _ = require('lodash')
const _b = require('bluebird')
const uuidv1 = require('uuid/v1')

const NONE = 0
const IN = -1
const OUT = 1

let lift = (f) => {
    return function(arr) {
      return _b.map(arr, f).then(a => {
        return _.flatten(a)
      })
    }
}

//INPUT: [{city}], OUTPUT: [{city: {city}, event: {}, param1: venue_id, param2: category_id}]
let eventBriteGetEventsByCity = (cities) => {
    return new Promise((resolve, reject) => {
        let results = []
        _.map(cities, (obj) => {
            let { city } = obj            
            fetch('https://www.eventbriteapi.com/v3/events/search/?token=FLLF3FJHKUWCXUIUYAZ3&location.address=' + city)
            .then((res) => {
                return res.json()
            }).then((json) => {
                _.forEach(json.events, (e) => {
                    let result = {
                        city: city,
                        event: { 'id': uuidv1(), 'name': e.name.text, 'description': e.description.text, 'url': e.url, 'startTime': e.start.local, 'endTime': e.end.local},
                        param1: e.venue_id,
                        param2: e.category_id
                    }
                    results.push(result)
                    result = {}
                })
                resolve(results)
            })
        })
    })
}

//INPUT: [{city: {city}, event: {}, param1: venue_id, param2: category_id}], OUTPUT: add Location to every event
let eventBriteGetEventLocation = (input) => {
    return new Promise((resolve, reject) => {
        _.forEach(input, (obj, i) => {
            let { param1 } = obj
            let { event }  = obj
            fetch('https://www.eventbriteapi.com/v3/venues/' + param1 + '?token=FLLF3FJHKUWCXUIUYAZ3')
            .then((res) => {
                return res.json()
            }).then((json) => {
                input[i].event.location = { 'id': uuidv1(), 'latitude': json.address.latitude, 'longitude': json.address.longitude, 'zip_code': json.address.postal_code, 'address': json.address.localized_address_display, 'city': json.address.city, 'country': json.address.country, 'name': json.name }
                resolve(input)
            })   
        })
    })
}

//INPUT: category_id, OUTPUT: eventCategory
let eventBriteGetEventCategory = (obj) => {
    return new Promise((resolve, reject) => {
        let { param2 } = obj
        let category = ''
        fetch('https://www.eventbriteapi.com/v3/categories/' + param2 + '?token=FLLF3FJHKUWCXUIUYAZ3')
        .then((res) => {
            return res.json()
        }).then((json) => {
            //console.log(category_id + ': ' + json.name)
            category = json.name            
            resolve(category)
        })
    })
}

//INPUT: category, OUTPUT: {event, venue_id, category_id}
let eventBriteGetEventsByCategory = ({ category }) => {
    return new Promise((resolve, reject) => {
        let result = {'event': {}, 'venue_id': 0, 'category_id': 0}
        let results = []
        let i = 0
        let categoryID = 0
        fetch('https://www.eventbriteapi.com/v3/categories/?token=FLLF3FJHKUWCXUIUYAZ3')
        .then((res) => {
            return res.json()
        }).then((json) => {
            categoryID = json.categories.forEach((c) => {
                if (c.name === category) {
                    return c.id
                }
            })
            fetch('https://www.eventbriteapi.com/v3/events/search/?token=FLLF3FJHKUWCXUIUYAZ3&categories=' + categoryID)
            .then((res) => {
                return res.json()
            }).then((json) => {
                json.events.forEach((e) => {
                    result.event = { 'id': i, 'name': e.name.text, 'description': e.description.text, 'url': e.url, 'startTime': e.start.local, 'endTime': e.end.local}
                    result.venue_id = e.venue_id
                    result.category_id = e.category_id
                    results.push(result)
                    i++
                })
                resolve(results)
            })
        })
    })
}

let eventBriteGetEventsByCityAndCategory = ({ category, city }) => {

}

let eventfulGetEventsByCity = ({ city }) => {
    return new Promise((resolve, reject) => {
        let event = {}
        let results = []
        let location = {}
        let i = 0
        let j = 0
        fetch('http://api.eventful.com/json/events/search?app_key=tQ7XxjRcFLKvhTWV&date=Future&location=' + city)
        .then((res) => {
            return res.json()
        }).then((json) => {
            json.events.event.forEach((ev) => {
                fetch('http://api.eventful.com/json/events/get?app_key=tQ7XxjRcFLKvhTWV&id=' + ev.id)
                .then((res) => {
                    return res.json()
                }).then((e) => {
                    location = { 'id': j, 'latitude': e.latitude, 'longitude': e.longitude, 'zip_code': e.postal_code, 'address': e.venue_address, 'city': e.city_name, 'country': e.country_abbr, 'name': e.venue_name.name }
                    event = { 'id': i, 'name': e.title, 'description': e.description, 'url': e.url, 'startTime': e.start_time, 'endTime': e.stop_time, 'location': location, 'category': e.categories.category[0].name }
                    results.push(event)
                    event = {}
                    location = {}
                    i++
                    j++
                    if(i = 10)
                        resolve(results)
                })
            })
        })
    })
}

let eventfulGetEventsByCategory = ({ category }) => {
    
}

let serviceMatrix = [
    {
        serviceID: 1234,
        city: IN,
        searchPosition: NONE,
        category: NONE,
        startDate: NONE,
        event: OUT,
        eventPosition: NONE,
        eventCategory: NONE,
        param1: OUT, //venue_id
        param2: OUT, //category_id
        param3: NONE,
        query: eventBriteGetEventsByCity
    },
    {
        serviceID: 1234,
        city: NONE,
        searchPosition: NONE,
        category: NONE,
        startDate: NONE,
        event: NONE,
        eventPosition: OUT,
        eventCategory: NONE,
        param1: IN, //venue_id
        param2: NONE,
        param3: NONE,
        query: eventBriteGetEventLocation
    },
    {
        serviceID: 1234,
        city: NONE,
        searchPosition: NONE,
        category: NONE,
        startDate: NONE,
        event: NONE,
        eventPosition: NONE,
        eventCategory: OUT,
        param1: NONE,
        param2: IN, //category_id
        param3: NONE,
        query: eventBriteGetEventCategory
    },
    {
        serviceID: 1234,
        city: IN,
        searchPosition: NONE,
        category: IN,
        startDate: NONE,
        event: OUT,
        eventPosition: NONE,
        eventCategory: NONE,
        param1: OUT, //venue_id
        param2: OUT, //category_id
        param3: NONE,
        query: eventBriteGetEventsByCityAndCategory
    },
    {
        serviceID: 1234,
        city: NONE,
        searchPosition: NONE,
        category: IN,
        startDate: NONE,
        event: OUT,
        eventPosition: NONE,
        eventCategory: NONE,
        param1: OUT, //venue_id
        param2: OUT, //category_id
        param3: NONE,
        query: eventBriteGetEventsByCategory
    },
    {
        serviceID: 5678,
        city: IN,
        searchPosition: NONE,
        category: NONE,
        startDate: NONE,
        event: OUT,
        eventPosition: NONE,
        eventCategory: NONE,
        param1: NONE,
        param2: NONE,
        param3: NONE,
        query: eventfulGetEventsByCity
    },
    {
        serviceID: 5678,
        city: NONE,
        searchPosition: NONE,
        category: IN,
        startDate: NONE,
        event: OUT,
        eventPosition: NONE,
        eventCategory: NONE,
        param1: NONE,
        param2: NONE,
        param3: NONE,
        query: eventfulGetEventsByCategory
    }
]

export { serviceMatrix }