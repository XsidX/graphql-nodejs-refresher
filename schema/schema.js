const graphql = require('graphql');
const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLInt,
} = graphql;

//dummy data

const data = [
  { id: '1', name: 'Latifah', age: 21 },
  {id: '2', name: 'Sid', age: 22},
  {id: '3', name: 'Idris', age: 23},
  {id: '4', name: 'John', age: 23},
  {id: '5', name: 'Lotus', age: 23},
];


// Create types
const UserType = new GraphQLObjectType({
  name: 'User',
  description: 'Documentation for user...',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
  }),
});

// Root query
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  description: 'Description',
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },

      resolve(parent, args) {
        // Code to get data from db / other source

      return data.find((user) => user.id === args.id);
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});

