import { Meteor } from "meteor/meteor";

if (Meteor.isServer) {
    Meteor.methods({
        getWeather(city, newDate) {
            var weatherApiKey = '&APPID=50fd161807446be0d6d1b7e5ee0f537c';
            if (!Meteor.userId()) {
                throw new Meteor.Error("Nicht autorisiert");
            }
            else {
                const user = Profile.find({ userId: Meteor.userId() }).fetch();

                console.log(user);

                // HTTP.get('http://api.openweathermap.org/data/2.5/forecast?q='+city+'&units=metric&APPID=50fd161807446be0d6d1b7e5ee0f537c', (error, result) => {
                //     if (!error) {
                //         return result;
                //     }
                // });
            }
        }
    });
}