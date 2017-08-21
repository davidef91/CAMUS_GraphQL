import express from 'express'
import graphqlHTTP from 'express-graphql'
import bodyParser from 'body-parser'

import camusSchema from './graphQL/querySchema'

var app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use('/graphql', graphqlHTTP({
  schema: camusSchema,
  graphiql: true,
}))

app.listen(4000)
console.log('Running a GraphQL API server at localhost:4000/graphql')