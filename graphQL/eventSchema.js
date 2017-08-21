import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLID,
    GraphQLFloat,
    GraphQLList
} from 'graphql'

import {
  GraphQLURL,
  GraphQLDateTime
} from 'graphql-custom-types'

import { locationType } from './locationSchema'
import { restaurantType } from './restaurantSchema'


export const eventType = new GraphQLObjectType({
    name: 'Event',
    description: 'The event resource schema',
    fields: () => ({
        id: {
            description: 'The event\'s id',
            type: GraphQLID
        },
        name: {
            description: 'The event\'s name',
            type: GraphQLString
        },
        category: {
            description: 'The event\'s category',
            type: GraphQLString
        },
        description: {
            description: 'An event\'s description',
            type: GraphQLString
        },
        url: {
            description: 'The event\'s url',
            type: GraphQLURL
        },
        startTime: {
            description: 'The event\'s start time',
            type: GraphQLDateTime
        },
        endTime: {
            description: 'The event\'s end time',
            type: GraphQLDateTime
        },
        location: {
            description: 'The event\'s location',
            type: locationType
        },
        nearByRestaurants: {
            description: 'Restaurants located within a 1km radius from the event',
            type: new GraphQLList(restaurantType)
        }
    })
})