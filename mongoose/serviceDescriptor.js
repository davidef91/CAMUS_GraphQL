'use strict'

import mongoose, { Schema } from 'mongoose'


const serviceDescriptionSchema = new Schema ({
    /* Name of the service */
    name: {
        type: String,
        required: true,
    },
    /* Short description of service’s functionalities */
    description: String,
    /* Name of the bridge with the logic to call this service */
    bridgeName: {
        type: String,
        required: true
    },
    /* Base URL address of the service */
    basePath: {
        type: String,
        required: true
    }
})

const serviceModel = mongoose.model('service', serviceDescriptionSchema)

export default serviceModel