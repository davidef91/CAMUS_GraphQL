'use strict'

import mongoose, { Schema } from 'mongoose'

const eventSchema = new Schema({
    id: {
        type: Schema.Types.ObjectId
    },
    name: {
        type: String
    },
    category: {
        type: String
    },
    description: {
        type: String
    },
    url: {
        type: String
    },
    startTime: {
        type: Date
    },
    endTime: {
        type: Date
    },
    location: {
        type: Schema.Types.ObjectId,
        ref: 'location'
    }
})

const eventModel = mongoose.model('event', eventSchema, 'event')

export default eventModel