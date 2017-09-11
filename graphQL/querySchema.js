import { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLList } from 'graphql'
import {
    GraphQLURL,
    GraphQLDateTime
} from 'graphql-custom-types'

import { eventType } from './eventSchema'
import { restaurantType } from './restaurantSchema'
import { locationType } from './locationSchema'
import Services from './../services'

const services = new Services()

const eventArgs = {
    startTime: {
        description: 'The event\'s start day',
        type: GraphQLDateTime
    },
    category: {
        description: 'The event\'s category',
        type: GraphQLString
    },
    city: {
        description: 'The event\'s location',
        type: GraphQLString
    }
}

const restaurantArgs = {
    cuisine_type: {
        description: 'The restaurant\'s cuisine type',
        type: GraphQLString
    },
    type: {
        description: 'The restaurant\'s type',
        type: GraphQLString
    },
    city: {
        description: 'The restaurant\'s location',
        type: GraphQLString
    }
}

const camusSchema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'CamusQuery',
        fields: {
            event: {
                type: new GraphQLList(eventType),
                args: eventArgs,
                resolve: (root, { category, city }) => {
                    return services.getEventsFromService(category, city)
                }
            },
            restaurant: {
                type: new GraphQLList(restaurantType),
                args: restaurantArgs,
                resolve: (root, { cuisine_type, type, city }) => {
                    return services.getRestaurantsFromService(cuisine_type, type, city)
                }
            }
        }
    })
})

export default camusSchema