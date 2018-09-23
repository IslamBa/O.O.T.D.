import { Meteor } from 'meteor/meteor';
import { Profile } from '../collections';

Meteor.startup(() => {
  // code to run on server at startup
});

Meteor.methods({
  getWeather(city, newDate) {
    
    // var weatherApiKey = '&APPID=50fd161807446be0d6d1b7e5ee0f537c';
 
        const user = Profile.findOne({ id: Meteor.userId() });
        
        var zeitDifferenz = (Math.abs(newDate - user.lastWeatherDt)) / 60000;
        
        Profile.update(user._id, { $set: { lastWeatherDt: new Date() } });

       if(zeitDifferenz >= 10){
         
         return "neuste wetter Daten";
       }
       else{
         return false;
       }
        // HTTP.get('http://api.openweathermap.org/data/2.5/forecast?q='+city+'&units=metric&APPID=50fd161807446be0d6d1b7e5ee0f537c', (error, result) => {
        //     if (!error) {
        //         return result;
        //     }
        // });
    
  },
  addNewProfile(id) {
    if(!Profile.findOne({ id: id })){
      Profile.insert({ id: id, lastWeatherDt: new Date() });
    }
  }
});