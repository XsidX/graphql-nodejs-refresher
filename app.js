const express = require('express');
const {graphqlHTTP} = require('express-graphql');

const schema = require('./schema/schema');

const app = express();
app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true,
}));

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});