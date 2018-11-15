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
      weather= {weather};
      return weather;
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
      kleider:[],
      anlaesse:[],
      favorites:[]
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
  },
  addFavorite(obj){
    const user = Profile.findOne({ id: Meteor.userId() });
    user.favorites.insert(obj);
  },
  getOutfit(){
    const user = Profile.findOne({ id: Meteor.userId() });
    var currTemp = user.temperatur.temp;
    var Anlass = '';
    var outfitCandidates=[];
    outfitCandidates = user.kleider.filter(el => el.weatherRange.minWetter >= currTemp && el.weatherRange.maxWetter <= currTemp);
    if(this.checkNiederschlag(user.zustand[0].id)){
      outfitCandidates = outfitCandidates.filter(el => el.forNiederschlag == true);
    }
    if(user.anlaesse.length>0){
      Anlass = this.checkAnlaesse(user.anlaesse);
    }
    if(Anlass!=''){
      outfitCandidates = user.kleider.filter(el => el.anlaesse.includes(Anlass));
    }
  },
  checkDate(d1,d2){
    return d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();
  },
  checkAnlaesse(arr){
    var currDate = new Date();
    arr.forEach((el)=>{
      if(this.checkDate(currDate,el)){
        return el.typ;
      }
      else{
        return '';
      }
    });
  },
  checkNiederschlag(zustand){
    var code = zustand.charAt(0);
    if(code == 2 || code == 3 || code == 5 || code == 6){
      return true;
    }
    else{
      return false;
    }
  }
});



