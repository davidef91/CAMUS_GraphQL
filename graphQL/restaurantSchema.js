'use strict'

import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID, 
    GraphQLList
} from 'graphql'


import {
  GraphQLURL,
  GraphQLDateTime
} from 'graphql-custom-types'


import { locationType } from './locationSchema'
import { eventType } from './eventSchema'


export const restaurantType = new GraphQLObjectType({
    name: 'Restaurant',
    description: 'The restaurant resource schema',
    fields: () => ({
        id: {
            description: 'The restaurant\'s id',
            type: GraphQLID
        },
        name: {
            description: 'The restaurant\'s name',
            type: GraphQLString
        },
        url: {
            description: 'The restaurant\'s url',
            type: GraphQLURL
        },
        phone: {
            description: 'The restaurant\'s phone',
            type: GraphQLString
        },
        cuisine_type: {
            description: 'The restaurant\'s cuisine type',
            type: GraphQLString
        },
        type: {
            description: 'The restaurant\'s type',
            type: GraphQLString
        },
        location: {
            description: 'The restaurant\'s location',
            type: locationType
        },
        nearByEvents: {
            description: 'Events located within a 1km radius from the restaurant',
            type: new GraphQLList(eventType)
        }
    })
})