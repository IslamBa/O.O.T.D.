import {Mongo} from 'meteor/mongo';

const Profile = new Mongo.Collection('profiles');

export {Profile};