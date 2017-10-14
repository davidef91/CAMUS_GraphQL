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

//INPUT: [{city: {city}}], OUTPUT: [{city: {city}, event: {...}, param1: venue_id, param2: category_id}]
let eventBriteGetEventsByCity = (cities) => {
    return new Promise((resolve, reject) => {
        _.map(cities, (obj) => {
            let { city } = obj        
            fetch('https://www.eventbriteapi.com/v3/events/search/?token=FLLF3FJHKUWCXUIUYAZ3&location.address=' + city)
            .then((res) => {
                return res.json()
            }).then((json) => {
                return _b.map(json.events, (e) => {
                    let result = {
                        city: city,
                        event: { 'id': uuidv1(), 'name': e.name.text, 'description': e.description.text, 'url': e.url, 'startTime': e.start.local, 'endTime': e.end.local},
                        param1: e.venue_id,
                        param2: e.category_id
                    }
                    return result
                })
                .then((arr) => {
                    resolve(arr)
                })
            })
        })
    })
}

//INPUT: [event: {...}, param1: venue_id, param2: category_id}], OUTPUT: add Location to every event
let eventBriteGetEventLocation = (input) => {
    return _b.map(input, (obj) => {
        let { param1 } = obj
        return fetch('https://www.eventbriteapi.com/v3/venues/' + param1 + '?token=FLLF3FJHKUWCXUIUYAZ3')
        .then((res) => {
            return res.json()
        }).then((json) => {
            obj.event.location = { 'id': uuidv1(), 'latitude': json.address.latitude, 'longitude': json.address.longitude, 'zip_code': json.address.postal_code, 'address': json.address.localized_address_display, 'city': json.address.city, 'country': json.address.country, 'name': json.name }
            return obj
        })
    })
    .then((arr) => {return arr})
}

//INPUT: [event: {...}, param1: venue_id, param2: category_id}], OUTPUT: add Category to every event
let eventBriteGetEventCategory = (input) => {
    return _b.map(input, (obj) => {
        let { param2 } = obj
        return fetch('https://www.eventbriteapi.com/v3/categories/' + param2 + '?token=FLLF3FJHKUWCXUIUYAZ3')
        .then((res) => {
            return res.json()
        }).then((json) => {
            obj.event.category = json.name
            return obj
        })
    })
    .then((arr) => {return arr})
}

//INPUT: [{category: {category}}], OUTPUT: [{category: {category}, event: {...}, param1: venue_id}]
let eventBriteGetEventsByCategory = ( categories ) => {
    return new Promise((resolve, reject) => {
        _.map(categories, (obj) => {
            let { category } = obj
            fetch('https://www.eventbriteapi.com/v3/categories/?token=FLLF3FJHKUWCXUIUYAZ3')
            .then((res) => {
                return res.json()
            }).then((json) => {
                let categoryID = _.find(json.categories, (c) => { return c.name === category }).id                
                return fetch('https://www.eventbriteapi.com/v3/events/search/?token=FLLF3FJHKUWCXUIUYAZ3&categories=' + categoryID)
                .then((res) => {
                    return res.json()
                }).then((json) => {
                    return _b.map(json.events, (e) => {
                        let result = {
                            category: category,
                            event: { 'id': uuidv1(), 'name': e.name.text, 'description': e.description.text, 'url': e.url, 'startTime': e.start.local, 'endTime': e.end.local},
                            param1: e.venue_id,
                            param2: e.category_id
                        }
                        return result
                    })
                })
                .then((arr) => {
                    resolve(arr)
                })
            })
        })
    })
}

//INPUT: [{city: {city}, category: {category}}], OUTPUT: [{city: {city}, category: {category}, event: {...}, param1: venue_id}]
let eventBriteGetEventsByCityAndCategory = (input) => {
    return new Promise((resolve, reject) => {
        _.map(input, (obj) => {
            let { category } = obj
            let { city } = obj
            fetch('https://www.eventbriteapi.com/v3/categories/?token=FLLF3FJHKUWCXUIUYAZ3')
            .then((res) => {
                return res.json()
            }).then((json) => {
                let categoryID = _.find(json.categories, (c) => { return c.name === category }).id                
                return fetch('https://www.eventbriteapi.com/v3/events/search/?token=FLLF3FJHKUWCXUIUYAZ3&categories=' + categoryID + '&location.address=' + city)
                .then((res) => {
                    return res.json()
                }).then((json) => {
                    return _b.map(json.events, (e) => {
                        let result = {
                            category: category,
                            city: city,
                            event: { 'id': uuidv1(), 'name': e.name.text, 'description': e.description.text, 'url': e.url, 'startTime': e.start.local, 'endTime': e.end.local, 'category': category},
                            param1: e.venue_id
                        }
                        return result
                    })
                })
                .then((arr) => {
                    resolve(arr)
                })
            })
        })
    })
}

//INPUT: [{city: {city}, category: {category}}], OUTPUT: [{city: {city}, category: {category}, event: {...}, param1: venue_id}]
let eventfulGetEventsByCity = ( cities ) => {
    return new Promise((resolve, reject) => {
        _.map(cities, (obj) => {
            let { city } = obj
            fetch('http://api.eventful.com/json/events/search?app_key=tQ7XxjRcFLKvhTWV&date=Future&location=' + city)
            .then((res) => {
                return res.json()
            }).then((json) => {
                return _b.map(json.events.event, (obj) => {
                    return fetch('http://api.eventful.com/json/events/get?app_key=tQ7XxjRcFLKvhTWV&id=' + obj.id)
                    .then((res) => {
                        return res.json()
                    }).then((e) => {
                        let location = { 'id': uuidv1(), 'latitude': e.latitude, 'longitude': e.longitude, 'zip_code': e.postal_code, 'address': e.address, 'city': e.city, 'country': e.country_abbr, 'name': e.venue_name }
                        let result = {
                            city: city,
                            event: { 'id': uuidv1(), 'name': e.title, 'description': e.description, 'url': e.url, 'startTime': e.start_time, 'endTime': e.stop_time, 'location': location, 'category': e.categories.category[0].name }
                        }
                        return result
                    })
                })
                .then((arr) => {
                    resolve(arr)})
            })
        })
    })
}

//INPUT: [{category: {category}}], OUTPUT: [{category: {category}, event: {...}]
let eventfulGetEventsByCategory = (categories) => {
    return new Promise((resolve, reject) => {
        _.map(categories, (obj) => {
            let { category } = obj
            fetch('http://api.eventful.com/json/events/search?app_key=tQ7XxjRcFLKvhTWV&date=Future&category=' + category.toLowerCase())
            .then((res) => {
                return res.json()
            }).then((json) => {
                return _b.map(json.events.event, (obj) => {
                    return fetch('http://api.eventful.com/json/events/get?app_key=tQ7XxjRcFLKvhTWV&id=' + obj.id)
                    .then((res) => {
                        return res.json()
                    }).then((e) => {
                        let location = { 'id': uuidv1(), 'latitude': e.latitude, 'longitude': e.longitude, 'zip_code': e.postal_code, 'address': e.address, 'city': e.city, 'country': e.country_abbr, 'name': e.venue_name }
                        let result = {
                            city: city,
                            event: { 'id': uuidv1(), 'name': e.title, 'description': e.description, 'url': e.url, 'startTime': e.start_time, 'endTime': e.stop_time, 'location': location, 'category': e.categories.category[0].name }
                        }
                        return result
                    })
                })
                .then((arr) => {
                    resolve(arr)})
            })
        })
    })    
}

//INPUT: [{city: {city}, category: {category}}], OUTPUT: [{city: {city}, category: {category}, event: {...}]
let eventfulGetEventsByCityAndCategory = (input) => {
    return new Promise((resolve, reject) => {
        _.map(input, (obj) => {
            let { category } = obj
            let { city } = obj
            fetch('http://api.eventful.com/json/events/search?app_key=tQ7XxjRcFLKvhTWV&date=Future&category=' + category.toLowerCase() + '&location=' + city)
            .then((res) => {
                return res.json()
            }).then((json) => {
                return _b.map(json.events.event, (obj) => {
                    return fetch('http://api.eventful.com/json/events/get?app_key=tQ7XxjRcFLKvhTWV&id=' + obj.id)
                    .then((res) => {
                        return res.json()
                    }).then((e) => {
                        let location = { 'id': uuidv1(), 'latitude': e.latitude, 'longitude': e.longitude, 'zip_code': e.postal_code, 'address': e.address, 'city': e.city, 'country': e.country_abbr, 'name': e.venue_name }
                        let result = {
                            city: city,
                            category: category,
                            event: { 'id': uuidv1(), 'name': e.title, 'description': e.description, 'url': e.url, 'startTime': e.start_time, 'endTime': e.stop_time, 'location': location, 'category': category }
                        }
                        return result
                    })
                })
                .then((arr) => {
                    resolve(arr)})
            })
        })
    })
}



let serviceMatrix = [
    {
        serviceID: 1234,
        city: IN,
        position: NONE,
        category: NONE,
        startDate: NONE,
        event: OUT,
        param1: OUT, //venue_id
        param2: OUT, //category_id
        param3: NONE,
        query: eventBriteGetEventsByCity
    },
    {
        serviceID: 1234,
        city: NONE,
        position: OUT,
        category: NONE,
        startDate: NONE,
        event: NONE,
        param1: IN, //venue_id
        param2: NONE,
        param3: NONE,
        query: eventBriteGetEventLocation
    },
    {
        serviceID: 1234,
        city: NONE,
        position: NONE,
        category: OUT,
        startDate: NONE,
        event: NONE,
        param1: NONE,
        param2: IN, //category_id
        param3: NONE,
        query: eventBriteGetEventCategory
    },
    {
        serviceID: 1234,
        city: IN,
        position: NONE,
        category: IN,
        startDate: NONE,
        event: OUT,
        param1: OUT, //venue_id
        param2: NONE,
        param3: NONE,
        query: eventBriteGetEventsByCityAndCategory
    },
    {
        serviceID: 1234,
        city: NONE,
        position: NONE,
        category: IN,
        startDate: NONE,
        event: OUT,
        param1: OUT, //venue_id
        param2: OUT, //category_id
        param3: NONE,
        query: eventBriteGetEventsByCategory
    },
    {
        serviceID: 5678,
        city: IN,
        position: NONE,
        category: NONE,
        startDate: NONE,
        event: OUT,
        param1: NONE,
        param2: NONE,
        param3: NONE,
        query: eventfulGetEventsByCity
    },
    {
        serviceID: 5678,
        city: NONE,
        position: NONE,
        category: IN,
        startDate: NONE,
        event: OUT,
        param1: NONE,
        param2: NONE,
        param3: NONE,
        query: eventfulGetEventsByCategory
    },
    {
        serviceID: 5678,
        city: IN,
        position: NONE,
        category: IN,
        startDate: NONE,
        event: OUT,
        param1: NONE,
        param2: NONE,
        param3: NONE,
        query: eventfulGetEventsByCityAndCategory
    },
]

export { serviceMatrix }