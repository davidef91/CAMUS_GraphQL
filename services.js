import fetch from 'node-fetch'

export default class Services {

    constructor(){}

    getEventsFromService(category, city){
        return new Promise((resolve, reject) => {
            const events = []
            let event = {}
            let location = {}
            let i = 1
            let j = 0
            let categoryPath = ''
            let cityPath = ''
            if(city !== undefined)
                cityPath='&location.address=' + city
            if(category !== undefined)
                this.transformCategory(category).then((category) => {
                    categoryPath='&categories=' + category
                    fetch('https://www.eventbriteapi.com/v3/events/search/?token=FLLF3FJHKUWCXUIUYAZ3'+ cityPath + categoryPath)
                    .then((res) => {
                        return res.json()
                    }).then((json) => {
                        json.events.forEach((e) => {
                            let category = fetch('https://www.eventbriteapi.com/v3/categories/' + e.category_id + '?token=FLLF3FJHKUWCXUIUYAZ3')
                            .then((res) => {
                                return res.json()
                            }).then((json) => {
                                return json.name
                            })
                            location = fetch('https://www.eventbriteapi.com/v3/venues/' + e.venue_id + '?token=FLLF3FJHKUWCXUIUYAZ3')
                            .then((res) => {
                                return res.json()
                            }).then((json) => {
                                j++
                                let venue = {'id': j, 'latitude': json.address.latitude, 'longitude': json.address.longitude, 'zip_code': json.address.postal_code, 'address': json.address.localized_address_display, 'city': json.address.city, 'country': json.address.country, 'name': json.name}
                                return venue
                            })
                            event = {'id': i, 'name': e.name.text, 'description': e.description.text, 'url': e.url, 'category': category, 'startTime': e.start.local, 'endTime': e.end.local, 'location': location}
                            events.push(event)
                            i++
                            resolve(events)
                        })               
                    })
                })
            else{             
                fetch('https://www.eventbriteapi.com/v3/events/search/?token=FLLF3FJHKUWCXUIUYAZ3'+ cityPath + categoryPath)
                .then((res) => {
                    return res.json()
                }).then((json) => {
                    json.events.forEach((e) => {
                        let category = fetch('https://www.eventbriteapi.com/v3/categories/' + e.category_id + '?token=FLLF3FJHKUWCXUIUYAZ3')
                        .then((res) => {
                            return res.json()
                        }).then((json) => {
                            return json.name
                        })
                        location = fetch('https://www.eventbriteapi.com/v3/venues/' + e.venue_id + '?token=FLLF3FJHKUWCXUIUYAZ3')
                        .then((res) => {
                            return res.json()
                        }).then((json) => {
                            j++
                            let venue = {'id': j, 'latitude': json.address.latitude, 'longitude': json.address.longitude, 'zip_code': json.address.postal_code, 'address': json.address.localized_address_display, 'city': json.address.city, 'country': json.address.country, 'name': json.name}
                            return venue
                        })
                        event = {'id': i, 'name': e.name.text, 'description': e.description.text, 'url': e.url, 'category': category, 'startTime': e.start.local, 'endTime': e.end.local, 'location': location}
                        events.push(event)
                        i++
                    })              
                })
            }
            if(category !== undefined)
                categoryPath='&category=' + category.toLowerCase()
            if(city !== undefined)
                cityPath='&location=' + city
            fetch('http://api.eventful.com/json/events/search?app_key=tQ7XxjRcFLKvhTWV&date=Future' + categoryPath + cityPath)
            .then((res) => {
                return res.json()
            }).then((json) => {
                if(json.events !== null){
                    json.events.event.forEach((e) => {
                        let category = fetch('http://api.eventful.com/json/events/get?app_key=tQ7XxjRcFLKvhTWV&id=' + e.id)
                        .then((res) => {
                            return res.json()
                        }).then((json) => {
                            return json.categories.category[0].name
                        })
                        location = {'id': j, 'latitude': e.latitude, 'longitude': e.longitude, 'zip_code': e.postal_code, 'address': e.venue_address, 'city': e.city_name, 'country': e.country_abbr, 'name': e.venue_name.name}
                        event = {'id': i, 'name': e.title, 'description': e.description, 'url': e.url, 'category': category, 'startTime': e.start_time, 'endTime': e.stop_time, 'location': location}
                        events.push(event)
                        i++
                        j++
                    })
                }            
            })
        })
    }

    transformCategory(category) {
        return new Promise((resolve, reject) => {
            fetch('https://www.eventbriteapi.com/v3/categories/?token=FLLF3FJHKUWCXUIUYAZ3')
            .then((res) => {
                return res.json()
            }).then((json) => {
                let catID = json.categories.forEach((c) => {
                    if(c.name===category){
                        resolve(c.id)
                    }                        
                })
            })
        })
    }

}