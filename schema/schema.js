const graphql = require('graphql');
const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLID,
  GraphQLInt,
} = graphql;

//dummy data

const data = [
  { id: '1', name: 'Latifah', age: 21, profession: "Rich" },
  {id: '2', name: 'Sid', age: 22, profession: "SWE" },
  {id: '3', name: 'Idris', age: 23, profession: "Teacher" },
  {id: '4', name: 'John', age: 24, profession: "Doctor" },
  {id: '5', name: 'Lotus', age: 25, profession: "Baker" },

];

const hobbiesData = [
  { id: '1', title: 'Programming', description: 'Programming description' },
  { id: '2', title: 'Reading', description: 'Reading description' },
  { id: '3', title: 'Swimming', description: 'Swimming description' },
  { id: '4', title: 'Singing', description: 'Singing description' },
  { id: '5', title: 'Dancing', description: 'Dancing description' }
];


// Create types
const UserType = new GraphQLObjectType({
  name: 'User',
  description: 'Documentation for user...',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    profession: { type: GraphQLString }
  }),
});

const HobbyType = new GraphQLObjectType({
  name: 'Hobby',
  description: 'Hobby description...',
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    description: { type: GraphQLString }
  })
})

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
    hobby: {
      type: HobbyType,
      args: { id: { type: GraphQLString } },

      resolve(parent, args) {
        // Code to get data from db / other source

      return hobbiesData.find((hobby) => hobby.id === args.id);
      },
    }
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});

