import fetch from 'node-fetch'

export default class ServiceEventBrite {

    name = service.name
    servizio = 'Service'
    if ((servizio + name) == 'ServiceEventBrite')
        ServiceEventBrite


    constructor(category, city, startTime, latitude, longitude, radius) {
        let path = ''

        if (category != null) {
            path = path + this.getCategory(category)
        }
        if (city != null) {
            path = path + this.getCity(city)
        }
        if (startTime != null) {
            path = path + this.getStartTime(startTime)
        }
        if (latitude != null) {
            path = path + this.getLatitude(latitude)
        }
        if (longitude != null) {
            path = path + this.getLongitude(longitude)
        }
        if (radius != null) {
            path = path + this.getRadius(radius)
        }
    }

    getCategory(category) {
        let res = '&categories='

        fetch('https://www.eventbriteapi.com/v3/categories/?token=FLLF3FJHKUWCXUIUYAZ3')
            .then((res) => {
                return res.json()
            }).then((json) => {
                let catID = json.categories.forEach((c) => {
                    if (c.name === category) {
                        res = res + c.id
                    }
                })
            })

        return res
    }

    getCity(city) {
        return '&location.address=' + city
    }

    getStartTime(startTime) {
        return '&start_date.range_start=' + startTime
    }

    getLatitude(latitude) {
        return '&location.latitude=' + latitude
    }

    getLongitude(longitude) {
        return '&location.longitude=' + longitude
    }

    getRadius(radius) {
        return '&location.within=' + radius
    }


}