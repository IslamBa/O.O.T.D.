import { Mongo } from 'meteor/mongo';

// var sconn=  new MongoInternals.RemoteCollectionDriver("mongodb+srv://user:IslamTolga1@cluster0-gnru9.mongodb.net/ootd?retryWrites=true");

// const Profile = new Mongo.Collection('profiles',{_driver: sconn});

const Profile = new Mongo.Collection('profiles');

export { Profile };

