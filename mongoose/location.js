'use strict'

import mongoose, { Schema } from 'mongoose'

const locationSchema = new Schema({
    id: {
        type: Schema.Types.ObjectId
    },
    longitude: {
        type: Number
    },
    latitude: {
        type: Number
    }
})

const locationModel = mongoose.model('location', locationSchema, 'location')

export default locationModel