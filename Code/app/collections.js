import { Mongo } from 'meteor/mongo';

const Profile = new Mongo.Collection('profiles');

export { Profile };

if (Meteor.isServer) {
  Meteor.methods({
    getWeather() {
      // var weatherApiKey = '&APPID=50fd161807446be0d6d1b7e5ee0f537c';

      const user = Profile.findOne({ id: Meteor.userId() });

      var zip = user.location.zip;
      var country = user.location.country;

      var newDate = new Date();

      var zeitDifferenz = (Math.abs(newDate - user.lastWeatherDt)) / 60000;

      if (zeitDifferenz >= 10) {
        //  return "neuste wetter Daten";
        Profile.update(user._id, { $set: { lastWeatherDt: new Date() } });
        const result = HTTP.call('GET', 'http://api.openweathermap.org/data/2.5/weather?zip='+zip+','+country+'&units=metric&APPID=50fd161807446be0d6d1b7e5ee0f537c');
        return result;
      }
      else {

        return false;
      }


    },
    addNewProfile(id) {
      if (!Profile.findOne({ id: id })) {
        Profile.insert({ id: id, lastWeatherDt: new Date() });
      }
    }
  });
}