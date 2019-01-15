import { Meteor } from 'meteor/meteor';
import { Profile } from '../collections';
var cloudinary = require('cloudinary');

cloudinary.config({ 
  cloud_name: 'sample', 
  api_key: '874837483274837', 
  api_secret: 'a676b67565c6767a6767d6767f676fe1' 
});

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
    var weather = {};

    var zip = user.location.zip;
    var country = user.location.country;

    var newDate = new Date();

    var zeitDifferenz = (Math.abs(newDate - user.lastWeatherDt)) / 60000;

    if (zeitDifferenz >= 10) {
      var temp_min = null;
      var temp_max = null;
      Profile.update(user._id, { $set: { lastWeatherDt: new Date() } });


      const result = HTTP.call('GET', 'http://api.openweathermap.org/data/2.5/weather?zip=' + zip + ',' + country + '&units=metric&APPID=50fd161807446be0d6d1b7e5ee0f537c');

      
      // if (zeitDifferenz >= 60) {
      //   const forecast = HTTP.call('GET', 'http://api.openweathermap.org/data/2.5/forecast?zip=' + zip + ',' + country + '&units=metric&cnt=8&APPID=50fd161807446be0d6d1b7e5ee0f537c');
      //   var list = forecast.data.list.slice(0,10);
      //   console.log(list);
      //   for (let index = 0; index < 9; index++) {

      //     if(index = 0){
      //       temp_max = list[0].main.temp_max;
      //       temp_min = list[0].main.temp_min;
      //     }
      //     if(index > 0 && list[index].main.temp_max >list[index-1].main.temp_max){
      //       temp_max = list[index].main.temp_max;
      //     }
      //     if(index > 0 && list[index].main.temp_min < list[index-1].main.temp_min){
      //       temp_min = list[index].main.temp_min;
      //     }


      //   }
      //   console.log(temp_max);
      //     console.log(temp_min);
      // }
      weather = {
        zustand: result.data.weather,
        temperatur: result.data.main,
        city: result.data.name
      };
      //Profile.update(user._id, { $set: { weather: result.data } });
      Profile.update(user._id, { $set: { weather: weather } });
      weather = { weather };
      return weather;
    }
    else {
      return false;
    }
  },
  addNewProfile(obj) {
    var weaterDate = new Date();
    weaterDate.setMinutes(weaterDate.getMinutes() - 15);

    Profile.insert({
      id: obj.id,
      location: {
        zip: obj.zip,
        country: obj.country
      },
      lastWeatherDt: weaterDate,
      kleider: [],
      occasions: [],
      favorites: [],
      candidates: [],
      currentOutfit: []
    });

  },
  getProfile(id) {
    return Profile.findOne({ id: id });
  },
  addClothing(obj) {
    const user = Profile.findOne({ id: Meteor.userId() });
    if (!user.kleider) { user.kleider = []; }
    Profile.update(user._id, { $push: { kleider: obj } });
  },
  addOccasion(obj) {
    const user = Profile.findOne({ id: Meteor.userId() });
    if (!user.occasions) { user.occasions = []; }
    Profile.update(user._id, { $push: { occasions: obj } });
  },
  addFavorite(obj) {
    const user = Profile.findOne({ id: Meteor.userId() });
    if (!user.favorites) { user.favorites = []; }
    Profile.update(user._id, { $push: { favorites: obj } });
  },
  getOutfit() {
    const user = Profile.findOne({ id: Meteor.userId() });
    var currTemp = user.weather.temperatur.temp;
    var Occasion = '';
    //Alle Kleidungsstücke die die Kriterien erfüllen werden in dieses Array gepackt
    var outfitCandidates = [];
    //Das finale Outfift wird in dieses Objekt gespeichert
    var finalOutfit = {};

    //Wetterrange, Niederschlagsbeständigkeit und Anlass werden überprüft und anhand dieser Kleidungsstücke gefiltert
    outfitCandidates = user.kleider.filter(el => el.weather_range.min <= currTemp && el.weather_range.max >= currTemp);

    if (Meteor.call('checkPrecipitation', user.weather.zustand[0].id.toString())) {
      outfitCandidates = outfitCandidates.filter(el => el.forWetWeather == true);
    }

    if (user.occasions.length > 0) {
      Occasion = Meteor.call('checkOccasions', user.occasions);
    }

    if (Occasion != '') {
      outfitCandidates = user.kleider.filter(el => el.occasions.includes(Occasion));
    }

    var types = ["shirt", "tshirt", "shoes", "pants", "jacket", "accessoires", "headgear"];

    for (var type of types) {
      var array = outfitCandidates.filter(el => el.type == type);
      finalOutfit[type] = Meteor.call('getClothing', type, array, user.kleider);
    }


    //Kleidungsstücke entfernen nach Wetter
    if (currTemp < 20) {
      var zufallszahl = Math.floor((Math.random() * 30) + 1);

      if (zufallszahl > 10) {
        delete finalOutfit.tshirt;
      } else {
        delete finalOutfit.shirt;
      }
    }

    if (currTemp >= 18) {
      delete finalOutfit.jacket;
    }

    Meteor.call('insertCandidates', outfitCandidates);

    return finalOutfit;
  },
  checkDate(d1, d2) {
    try {
      return d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate();
    } catch (error) {
      console.log(error);
    }
    
  },
  getClothing(type, filteredArray, fullArray) {
    if (filteredArray.length > 0) {
      return filteredArray.filter(el => el.typ = type)[Math.floor(Math.random() * filteredArray.length)];
    }
    else {
      var completeRandomType = fullArray.filter(el => el.type == type);

      if (completeRandomType.length > 0) {
        return completeRandomType[Math.floor(Math.random() * completeRandomType.length)];
      }
      else {
        return "";
      }
    }
  },
  checkOccasions(arr) {
    var currDate = new Date();
    arr.forEach((el) => {
      if (Meteor.call("checkDate",currDate, el.date)) {
        return el.typ;
      }
      else {
        return '';
      }
    });
  },
  checkPrecipitation(zustand) {
    var code = zustand.charAt(0);
    if (code == 2 || code == 3 || code == 5 || code == 6) {
      return true;
    }
    else {
      return false;
    }
  },
  insertCandidates(arr) {
    const user = Profile.findOne({ id: Meteor.userId() });
    var idArr = [];
    for (var el of arr) {
      idArr.push(el.id);
    }
    if (!user.candidates) { user.candidates = []; }
    Profile.update(user._id, { $set: { candidates: idArr } });
  },
  updateNotificationDate(date) {
    const user = Profile.findOne({ id: Meteor.userId() });
    Profile.update(user._id, { $set: { notificationDate: date } });
  }
});



