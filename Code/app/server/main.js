import { Meteor } from 'meteor/meteor';
import { Profile } from '../collections';

Meteor.startup(() => {
  // code to run on server at startup
  // process.env.MONGO_URL="mongodb+srv://user:IslamTolga1@cluster0-gnru9.mongodb.net/ootd?retryWrites=true";
  console.log(process.env.MONGO_URL);
});

Meteor.publish('Profile', () => Profile.find({ id: Meteor.userId() }));
// Meteor.publish('User', () => Meteor.users.find({ id: Meteor.userId() }));

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
      var temp_min_arr = [];
      var temp_max_arr = [];
      Profile.update(user._id, { $set: { lastWeatherDt: new Date() } });


      const result = HTTP.call('GET', 'http://api.openweathermap.org/data/2.5/weather?zip=' + zip + ',' + country + '&units=metric&APPID=50fd161807446be0d6d1b7e5ee0f537c');

      const vorschau = HTTP.call('GET', 'http://api.openweathermap.org/data/2.5/forecast?zip=' + zip + ',' + country + '&units=metric&cnt=8&APPID=50fd161807446be0d6d1b7e5ee0f537c');


      for (let index = 0; index < vorschau.data.list.length; index++) {
        temp_min_arr.push(vorschau.data.list[index].main.temp_min);
        temp_max_arr.push(vorschau.data.list[index].main.temp_max);
      }


      weather = {
        zustand: result.data.weather,
        temperatur: result.data.main,
        city: result.data.name,
        min: Math.min(...temp_min_arr),
        max: Math.max(...temp_max_arr)
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
      weather: {
        zustand: [{
          id: "",
          main: "",
          description: "",
          icon: ""
        }],
        temperatur: {
          temp: "",
          pressure: "",
          humidity: "",
          temp_min: "",
          temp_max: ""
        },
        city: "",
        min: "",
        max: ""
      },
      lastWeatherDt: weaterDate,
      currentOutfit: [],
      occasions: [],
      favorites: [],
      candidates: [],
      kleider: []
    });

  },
  getProfile(id) {
    return Profile.findOne({ id: id });
  },
  addClothing(obj) {
    const user = Profile.findOne({ id: Meteor.userId() });
    if (!user.kleider) { user.kleider = []; }

    // obj.id = Date.now();
    obj.id = new Mongo.ObjectID()._str;

    if (obj.occasions.length < 1) {
      obj.occasions.push("Freizeit");
    }

    if (obj.image != '') {
      Meteor.call('uploadImage', obj.image, (error, result) => {
        if (!error) {
          obj.image = result;
          Profile.update(user._id, { $push: { kleider: obj } });
        }
      });
    }
    else {
      Profile.update(user._id, { $push: { kleider: obj } });
    }


  },
  addOccasion(obj) {
    const user = Profile.findOne({ id: Meteor.userId() });
    if (!user.occasions) { user.occasions = []; }
    var id = Date.now();
    obj.id = id;
    Profile.update(user._id, { $push: { occasions: obj } });
  },
  addFavorite() {
    var pieces = [];
    var obj = {};
    obj.id = new Mongo.ObjectID()._str;
    const user = Profile.findOne({ id: Meteor.userId() });
    if (!user.favorites) { user.favorites = []; }

    for (let index = 0; index < user.currentOutfit.length; index++) {
      pieces.push(user.currentOutfit[index].id);
    }
    
    obj.pieces = pieces;
    Profile.update(user._id, { $push: { favorites: obj } });
  },
  getOutfit() {
    const user = Profile.findOne({ id: Meteor.userId() });
    var currTemp = user.weather.temperatur.temp;
    var Occasion = '';
    //Alle Kleidungsstücke die die Kriterien erfüllen werden in dieses Array gepackt
    var outfitCandidates = [];
    //Das finale Outfift wird in dieses Objekt gespeichert
    var finalOutfit = [];

    //Wetterrange, Niederschlagsbeständigkeit und Anlass werden überprüft und anhand dieser Kleidungsstücke gefiltert
    outfitCandidates = user.kleider.filter(el => el.weather_range.min <= currTemp && el.weather_range.max >= currTemp);

    if (Meteor.call('checkPrecipitation', user.weather.zustand[0].id.toString())) {
      outfitCandidates = outfitCandidates.filter(el => el.forWetWeather == true);
    }

    if (user.occasions.length > 0) {
      Occasion = Meteor.call('checkOccasions', user.occasions);
    }

    if (Occasion != '') {
      outfitCandidates = outfitCandidates.filter(el => el.occasions.includes(Occasion));
      console.log(outfitCandidates);
    }
    else {
      outfitCandidates = outfitCandidates.filter(el => el.occasions.includes("Freizeit"));
    }

    var types = ["shirt", "tshirt", "shoes", "pants", "jacket", "accessoires", "headgear", "dress", "skirt"];

    for (var type of types) {
      var array = outfitCandidates.filter(el => el.type == type);
      var cloth = Meteor.call('getClothing', type, array, user.kleider);
      if (cloth) { finalOutfit.push(cloth); }

    }

    //Kollidierende Kleidungsstücke filtern
    var toplayer = [];
    toplayer = finalOutfit.filter(el => el.type == "shirt" || el.type == "tshirt" || el.type == "dress");

    if (toplayer.length > 0) {
      finalOutfit = finalOutfit.filter(el => el.type != "shirt" && el.type != "tshirt" && el.type != "dress");
      (finalOutfit.push(toplayer[Math.floor(Math.random() * toplayer.length)]));
    }
    if (finalOutfit.find(el => el.type == "dress")) {
      finalOutfit = finalOutfit.filter(el => el.type != "pants" && el.type != "skirt");
    }
    else {
      var bottomLayer = [];
      bottomLayer = finalOutfit.filter(el => el.type == "skirt" || el.type == "pants");

      if (bottomLayer.length > 0) {
        finalOutfit = finalOutfit.filter(el => el.type != "skirt" && el.type != "pants");
        finalOutfit.push(bottomLayer[Math.floor(Math.random() * bottomLayer.length)]);
      }
    }

    var jacket = finalOutfit.find(el => el.type == "jacket");
    if (jacket) {
      if (jacket.weather_range.max < currTemp) {
        finalOutfit = finalOutfit.filter(el => el.type != "jacket");
      }
    }


    Meteor.call('insertCandidates', outfitCandidates);

    if (!user.currentOutfit) { user.currentOutfit = []; }
    Profile.update(user._id, { $set: { currentOutfit: finalOutfit } });

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
      return filteredArray.filter(el => el.type = type)[Math.floor(Math.random() * filteredArray.length)];
    }
    else {
      var completeRandomType = fullArray.filter(el => el.type == type);

      if (completeRandomType.length > 0 && type != "headgear" && type != "accessoires") {
        return completeRandomType[Math.floor(Math.random() * completeRandomType.length)];
      }
      // else {
      //   return "";
      // }
    }
  },
  checkOccasions(arr) {
    var currDate = new Date();
    var type = '';
    arr.forEach((el) => {
      if (Meteor.call("checkDate", currDate, new Date(el.date))) {
        type = el.type;
      }
    });
    return type;
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
    if (!user.candidates) { user.candidates = []; }

    var idArr = [];
    for (let index = 0; index < arr.length; index++) {
      var obj = {};
      obj.id = arr[index].id;
      obj.type = arr[index].type;
      idArr.push(obj);
    }

    Profile.update(user._id, { $set: { candidates: idArr } });
  },
  changeCloth(obj) {
    const user = Profile.findOne({ id: Meteor.userId() });
    var change = [];
    if (obj.type == "shirt" || obj.type == "tshirt") {
      change = user.candidates.filter(el => el.type == "shirt" || el.type == "tshirt");
    }
    else {
      change = user.candidates.filter(el => el.type == obj.type);
    }

    if (change.length > 1) {
      var newPiece = change.filter(el => el.id != obj.id);
      newPiece = newPiece[Math.floor(Math.random() * newPiece.length)];

      var newPieceFromKleider = user.kleider.find(el => el.id == newPiece.id);

      var currOutfit = user.currentOutfit;

      for (let index = 0; index < currOutfit.length; index++) {
        if (currOutfit[index].type == obj.type) {
          currOutfit[index] = newPieceFromKleider;
        }
      }

      Profile.update(user._id, { $set: { currentOutfit: currOutfit } });
    }
  },
  updateNotificationDate(date) {
    const user = Profile.findOne({ id: Meteor.userId() });
    Profile.update(user._id, { $set: { notificationDate: date } });
  },
  uploadImage(file) {
    var timestamp = new Date().getTime();
    var api_secret = 'VSd_wf6a877FD-G0xlWN59PcDck';

    var signature = "timestamp=" + timestamp + api_secret;
    signature = CryptoJS.SHA1(signature).toString();

    var res = HTTP.call('POST', 'https://api.cloudinary.com/v1_1/ootdapp/image/upload', {
      data: {
        file: file,
        api_key: 559484368377945,
        timestamp: timestamp,
        signature: signature
      }
    });
    return res.data.url;
  },
  delOldOccasions() {
    const user = Profile.findOne({ id: Meteor.userId() });
    var date = new Date();

    for (let index = 0; index < user.occasions.length; index++) {
      var occDate = new Date(user.occasions[index].date);

      var difference = date.getTime() - occDate.getTime();
      if (difference / (1000 * 60 * 60 * 24) >= 1) {
        Profile.update({ _id: user._id }, { $pull: { occasions: { id: user.occasions[index].id } } });
      }
    }
  },
  delFavorite(favId){
    const user = Profile.findOne({ id: Meteor.userId() });
    Profile.update({ _id: user._id }, { $pull: { favorites: { id: favId } } });
  },
  updateCloth(obj) {
    Profile.update(user._id, { $pull: { kleider: { id: obj.id } } });
    Profile.update(user._id, { $push: { kleider: obj } });
  },
  checkFavorite() {
    const user = Profile.findOne({ id: Meteor.userId() });
    var check;
    for (let index = 0; index < user.favorites.length; index++) {
      const element = user.favorites[index];
      check = false;
      element.forEach(element => {
        if (!user.currentOutfit.find(el => el.id == element)) {
          check = true;
        }
      });
      if (!check) { break };
    }
    console.log(check);
    return check;
  }
});



