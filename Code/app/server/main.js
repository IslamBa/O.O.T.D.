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
      favorites: []
    });

  },
  getProfile(id) {
    return Profile.findOne({ id: id });
  },
  addClothing(obj) {
    const user = Profile.findOne({ id: Meteor.userId() });
    if (!user.kleider) { user.kleider = []; }
    user.kleider.insert(obj);
  },
  addOccasion(obj) {
    const user = Profile.findOne({ id: Meteor.userId() });
    if (!user.occasions) { user.occasions = []; }
    user.occasions.insert(obj);
  },
  addFavorite(obj) {
    const user = Profile.findOne({ id: Meteor.userId() });
    user.favorites.insert(obj);
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
      console.log(type);
      var array = outfitCandidates.filter(el => el.type == type);
      finalOutfit[type] = Meteor.call('getClothing', type, array, user.kleider);
      console.log(finalOutfit);
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

    // var shirtArray = outfitCandidates.filter(el => el.typ == "shirt");
    // finalOutfit.shirt = Meteor.call('getClothing',"shirt", shirtArray, user.kleider);
    // var shoeArray = outfitCandidates.filter(el => el.typ == "shoe");
    // finalOutfit.shoe = Meteor.call('getClothing',"shoe", shoeArray, user.kleider);
    // var pantsArray = outfitCandidates.filter(el => el.typ == "shoe");
    // finalOutfit.pants = Meteor.call('getClothing',"pants", pantsArray, user.kleider);

    return finalOutfit;
  },
  checkDate(d1, d2) {
    return d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate();
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
      if (this.checkDate(currDate, el)) {
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
  }
});



