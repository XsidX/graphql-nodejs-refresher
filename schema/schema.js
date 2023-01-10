const graphql = require('graphql');
const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLList,
  GraphQLString,
  GraphQLID,
  GraphQLInt,
} = graphql;

//dummy data

const usersData = [
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

const postsData = [
  { id: '1', comment: 'This is a comment', userId: '1' },
  { id: '2', comment: 'This is comment 2', userId: '2' },
  { id: '3', comment: 'This is a comment 3', userId: '2' },
  { id: '4', comment: 'This is a comment 4',userId: '2' },
  { id: '5', comment: 'This is a comment 5', userId: '3' }
];


// Create types
const UserType = new GraphQLObjectType({
  name: 'User',
  description: 'Documentation for user...',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    profession: { type: GraphQLString },

    posts: {
      type: new GraphQLList(PostType),
      resolve(parent, args) {
        return postsData.filter((post) => post.userId === parent.id);
      }
    },
    hobbies: {
      type: new GraphQLList(HobbyType),
      resolve(parent, args) {
        return hobbiesData.filter((hobby) => hobby.userId === parent.id);
      }
    }
  }),
});

const HobbyType = new GraphQLObjectType({
  name: 'Hobby',
  description: 'Hobby description...',
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    user: {
      type: UserType,
      resolve(parent, args) {
        return usersData.find((user) => user.id === parent.userId);
      }
    }
  })
})

const PostType = new GraphQLObjectType({
  name: 'Post',
  description: 'Post description...',
  fields: () => ({
    id: { type: GraphQLID },
    comment: { type: GraphQLString },
    user: {
      type: UserType,
      resolve(parent, args) {
        return usersData.find((user) => user.id === parent.userId);
      }
    }
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

      return usersData.find((user) => user.id === args.id);
      },
    },
    users: {
      type: new GraphQLList(UserType),
      resolve(parent, args){
        return usersData;
      }
    },
    hobby: {
      type: HobbyType,
      args: { id: { type: GraphQLString } },

      resolve(parent, args) {
        // Code to get data from db / other source

      return hobbiesData.find((hobby) => hobby.id === args.id);
      },
    },
    hobbies: {
      type: new GraphQLList(HobbyType),
      resolve(parent, args){
        return hobbiesData;
      }
    },
    post: {
      type: PostType,
      args: { id: { type: GraphQLID } },

      resolve(parent, args) {
        // Code to get data from db / other source

      return postsData.find((post) => post.id === args.id);
      },
  },
  
  posts: {
    type: new GraphQLList(PostType),
    resolve(parent, args) {
      return postsData;
    }
  }

  },
});


// Mutations

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createUser: {
      type: UserType,
      args: {
        // id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        profession: { type: GraphQLString }
      },

      resolve(parent, args) {
        let user = {
          name: args.name,
          age: args.age,
          profession: args.profession
        }

        return user;
      }
    },
    createPost: {
      type: PostType,
      args: {
        // id: { type: GraphQLID },
        comment: { type: GraphQLString },
        userId: { type: GraphQLID }
      },

      resolve(parent, args) {
        let post = {
          comment: args.comment,
          userId: args.userId
        }

        return post;
      }
    },
    createHobby: {
      type: HobbyType,
      args: {
        // id: { type: GraphQLID },
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        userId: { type: GraphQLID }
      },

      resolve(parent, args) {
        let hobby = {
          title: args.title,
          description: args.description,
          userId: args.userId
        }

        return hobby;
      }
    }
  }
})
  
module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});

