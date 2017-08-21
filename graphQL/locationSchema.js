'use strict'

import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLFloat,
    GraphQLInt
} from 'graphql'


export const locationType = new GraphQLObjectType({
    name: 'Location',
    description: 'The location resource schema',
    fields: () => ({
        id: {
            description: 'The location\'s id',
            type: GraphQLID
        },
        latitude: {
            description: 'The location\'s latitude',
            type: GraphQLFloat
        },
        longitude: {
            description: 'The location\'s longitude',
            type: GraphQLFloat
        },
        zip_code: {
            description: 'The location\'s zip_code',
            type: GraphQLInt
        },
        address: {
            description: 'The location\'s address',
            type: GraphQLString
        },
        city: {
            description: 'The location\'s city',
            type: GraphQLString
        },
        country: {
            description: 'The location\'s country', 
            type: GraphQLString
        },
        name: {
            description: 'The location\'s name',
            type: GraphQLString
        },
        radius: {
            description: 'The distance you want to search around the given location',
            type: GraphQLInt
        }
    })
})