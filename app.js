const express = require('express');
const {graphqlHTTP} = require('express-graphql');

const schema = require('./schema/schema');

const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 3000

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true,
}));

mongoose.connect(`mongodb+srv://${process.env.mongoUserName}:${process.env.mongoUserPassword}@graphql-cluster.8dlpxr5.mongodb.net/${process.env.mongoUserName}?retryWrites=true&w=majority`,
 { useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
  app.listen({ port }, () => {
    console.log(`Server is running on port ${port}`);
  });
 }).catch((err) => {
  console.log(`Error::: ${err}`);
  });

