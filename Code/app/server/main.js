import { Meteor } from 'meteor/meteor';
import { Profile } from '../collections';

Meteor.startup(() => {
  // code to run on server at startup
  // process.env.MAIL_URL="smtps://ootdapp1@gmail.com:IslamTolga@smtp.gmail.com:465";
});

Meteor.publish('Profile', () => Profile.find({ id: Meteor.userId() }));
Meteor.publish('User', () => Meteor.users.find());

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
      const result = HTTP.call('GET', 'http://api.openweathermap.org/data/2.5/weather?zip=' + zip + ',' + country + '&units=metric&APPID=50fd161807446be0d6d1b7e5ee0f537c');
      var weather = {
        zustand: result.data.weather,
        temperatur: result.data.main,
        city: result.data.name
      };
      //Profile.update(user._id, { $set: { weather: result.data } });
      Profile.update(user._id, { $set: { weather: weather } });
      return result;
    }
    else {
      return false;
    }
  },
  addNewProfile(obj) {
    var weaterDate = new Date();
    weaterDate.setMinutes(weaterDate.getMinutes()-15);

    Profile.insert({
      id: obj.id,
      location: {
        zip: obj.zip,
        country: obj.country
      },
      lastWeatherDt: weaterDate,
      kleider:[]
    });

  },
  getProfile(id) {
    return Profile.findOne({ id: id });
  },
  addClothing(obj){
    const user = Profile.findOne({ id: Meteor.userId() });
    if(!user.kleider){user.kleider = [];}
    user.kleider.insert(obj);
  },
  addAnlass(obj){
    const user = Profile.findOne({ id: Meteor.userId() });
    if(!user.anlaesse){user.anlaesse = [];}
    user.anlaesse.insert(obj);
  }
});



