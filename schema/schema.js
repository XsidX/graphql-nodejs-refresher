const graphql = require('graphql');
const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
  GraphQLID,
  GraphQLInt,
} = graphql;

const User = require('../model/user')
const Post = require('../model/post')
const Hobby = require('../model/hobby')

// //dummy data

// const usersData = [
//   { id: '1', name: 'Latifah', age: 21, profession: "Rich" },
//   {id: '2', name: 'Sid', age: 22, profession: "SWE" },
//   {id: '3', name: 'Idris', age: 23, profession: "Teacher" },
//   {id: '4', name: 'John', age: 24, profession: "Doctor" },
//   {id: '5', name: 'Lotus', age: 25, profession: "Baker" },

// ];

// const hobbiesData = [
//   { id: '1', title: 'Programming', description: 'Programming description' },
//   { id: '2', title: 'Reading', description: 'Reading description' },
//   { id: '3', title: 'Swimming', description: 'Swimming description' },
//   { id: '4', title: 'Singing', description: 'Singing description' },
//   { id: '5', title: 'Dancing', description: 'Dancing description' }
// ];

// const postsData = [
//   { id: '1', comment: 'This is a comment', userId: '1' },
//   { id: '2', comment: 'This is comment 2', userId: '2' },
//   { id: '3', comment: 'This is a comment 3', userId: '2' },
//   { id: '4', comment: 'This is a comment 4',userId: '2' },
//   { id: '5', comment: 'This is a comment 5', userId: '3' }
// ];


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
        // return postsData.filter((post) => post.userId === parent.id);
        return Post.find({userId: parent.id})
      }
    },
    hobbies: {
      type: new GraphQLList(HobbyType),
      resolve(parent, args) {
        // return hobbiesData.filter((hobby) => hobby.userId === parent.id);
        return Hobby.find({userId: parent.id})
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
        return User.findById(parent.userId);
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
        return User.findById(parent.userId);
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

      return User.findById(args.id);
      },
    },
    users: {
      type: new GraphQLList(UserType),
      resolve(parent, args){
        return User.find({});
      }
    },
    hobby: {
      type: HobbyType,
      args: { id: { type: GraphQLString } },

      resolve(parent, args) {
        // Code to get data from db / other source

      return Hobby.findById(args.id);
      },
    },
    hobbies: {
      type: new GraphQLList(HobbyType),
      resolve(parent, args){
        return Hobby.find({});
      }
    },
    post: {
      type: PostType,
      args: { id: { type: GraphQLID } },

      resolve(parent, args) {
        // Code to get data from db / other source

      return Post.findById(args.id)
      },
  },
  
  posts: {
    type: new GraphQLList(PostType),
    resolve(parent, args) {
      return Post.find({});
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
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        profession: { type: GraphQLString }
      },

      resolve(parent, args) {
        let user = User({
          name: args.name,
          age: args.age,
          profession: args.profession
        })

        return user.save();
      }
    },

    //Update user

    updateUser: {
      type: UserType,
      args: {
        id: {type: new GraphQLNonNull(GraphQLString) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        profession: { type: GraphQLString }
      },
      resolve(parent, args) {
        return (updateUser = User.findByIdAndUpdate(
          args.id,
          {
            $set: {
              name: args.name,
              age: args.age,
              profession: args.profession
            }
          },
          { new: true } // send back the updated objectType
        ));
      }
    },

    removeUser: {
      type: UserType,
      args: { id: {type: new GraphQLNonNull(GraphQLString)} },

      resolve(parent, args){
        let removedUser = User.findByIdAndRemove(args.id).exec();
        if(!removedUser){
          throw new Error()
        }
        return removedUser;
      }
    },
    createPost: {
      type: PostType,
      args: {
        comment: { type: new GraphQLNonNull(GraphQLString) },
        userId: { type: new GraphQLNonNull(GraphQLID) }
      },

      resolve(parent, args) {
        let post = Post({
          comment: args.comment,
          userId: args.userId
        })

        return post.save();
      }
    },
    updatePost: {
      type: PostType,
      args: {
        id: {type: new GraphQLNonNull(GraphQLString) },
        comment: { type: new GraphQLNonNull(GraphQLString) },
      },

      resolve(parent, args) {
        return (updatePost = Post.findByIdAndUpdate(
          args.id,
          {
            $set: {
              comment: args.comment,
              userId: args.userId
            }
          },
          { new: true } // send back the updated objectType
        ));
      }

    },
    removePost: {
      type: PostType,
      args: { id: {type: new GraphQLNonNull(GraphQLString)} },

      resolve(parent, args){
        let removedPost = Post.findByIdAndRemove(args.id).exec();
        if(!removedPost){
          throw new Error()
        }
        return removedPost;
      }
    },
    createHobby: {
      type: HobbyType,
      args: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLString },
        userId: { type: new GraphQLNonNull(GraphQLID) }
      },

      resolve(parent, args) {
        let hobby = Hobby({
          title: args.title,
          description: args.description,
          userId: args.userId
        })

        return hobby.save();
      }
    },
    updateHobby: {
      type: HobbyType,
      args: {
        id: {type: new GraphQLNonNull(GraphQLString) },
        title: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLString },
      },

      resolve(parent, args) {
        return (updateHobby = Hobby.findByIdAndUpdate(
          args.id,
          {
            $set: {
              title: args.title,
              description: args.description,
              userId: args.userId
            }
          },
          { new: true } // send back the updated objectType
        ));
      }
    },
    removeHobby: {
      type: HobbyType,
      args: { id: {type: new GraphQLNonNull(GraphQLString)} },

      resolve(parent, args){
        let removedHobby = Hobby.findByIdAndRemove(args.id).exec();
        if(!removedHobby){
          throw new Error()
        }
        return removedHobby;
      }
    }
  }
});
  
module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});

