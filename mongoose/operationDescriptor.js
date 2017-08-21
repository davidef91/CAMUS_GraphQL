'use strict'

import mongoose, { Schema } from 'mongoose'


/**
 * Translate schema
 */
const translateSchema = new Schema({
    from: {
        type: String,
        required: true
    },
    to: {
        type: String,
        required: true
    }
})

/**
 * Parameter schema
 */
const parameterSchema = new Schema ({
    name: {
        type: String,
        required: true
    },
    description: String,
    required: {
        type: Boolean,
        default: false
    },
    type: String,
    default: String,
    collectionFormat: {
        type: String,
        enum: ['csv', 'ssv', 'tsv', 'pipes']
    },
    /* name of the resource schema */
    resourceSchema: String,
    /* attribute of the selected resource schema */
    fieldRS: String,
    /* ID of the operation from which the parameter is taken */
    operationId: {
        type: Schema.Types.ObjectId,
        ref: 'operation'
    },
    /* Path of the parameter inside the operation response */
    operationResponsePath: String,
    mappingTerm: [String],
    translate: [translateSchema]
})

/**
 * Header schema
 */
const headerSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    value: {
        type: String,
        required: true
    }
})

/**
 * Item schema
 */
const itemSchema = new Schema({
    termName: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true
    },
    /* name of the resource schema */
    resourceSchema: String,
    /* attribute of the selected resource schema */
    fieldRS: String
})

/**
 * Operate schema
 */
const operateSchema = new Schema({
    run: {
        type: String,
        required: true
    },
    onAttribute: {
        type: String,
        required: true
    }
})

/**
 * Response schema
 */
const responseSchema = new Schema({
    list: String,
    items: [itemSchema],
    functions: [operateSchema]
})

/**
 * Pagination Schema
 */
const paginationSchema = new Schema ({
    attributeName: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['number', 'token']
    },
    tokenAttribute: String,
    pageCountAttribute: String
})

/**
 * Operation schema
 */
const operationSchema = new Schema ({
    /* Service in which operation belongs */
    service: {
        type: Schema.Types.ObjectId,
        ref: 'service'
    },
    /* Name of the operation */
    name: {
        type: String,
        required: true
    },
    /* Type of the operation */
    type: {
        type: String,
        required: true,
        enum: ['primary', 'support']
    },
    /* Short description of the operation */
    description: String,
    /* Specific path to call the operation. It will be added to service’s basePath */
    path: String,
    /* Link to app store */
    storeLink: String,
    /* Name of the bridge with the logic to call this operation */
    bridgeName: String,
    /* Array of input parameters */
    parameters: [parameterSchema],
    headers: [headerSchema],
    responseMapping: responseSchema,
    pagination: paginationSchema
})

const operationModel = mongoose.model('operation', operationSchema)

export default operationModel