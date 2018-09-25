import { Template } from 'meteor/templating';
import { Profile } from '../collections';
import './main.html';

Template.register.events({
    'submit form'(event, template) {
        event.preventDefault();
        var username = $("#username").val();
        var email = $("#email").val();
        var passwort = $("#password").val();
        
        Accounts.createUser({
            username: username,
            email: email,
            password: passwort
        });

        
    }
});

Template.login.events({
    'submit form'(event, template) {
        event.preventDefault();
        var username = $("#login-username").val();
        var passwort = $("#login-password").val();

        Meteor.loginWithPassword(username, passwort);
    }
});

Template.content.events({
    'click .btnLogout'(event) {
        Meteor.logout();
    },
    'click #btnWeather'(event) {
        // var alt = new Date(); alt.setMinutes(alt.getMinutes() - 20);
        // var neu = new Date();
        

        Meteor.call('addNewProfile',Meteor.userId());

        Meteor.call('getWeather',function (error,result){
            console.log(result);
        });

        // Profile.update(Meteor.userId(), { $set: { lastWeatherDt: 'banane' } });

        // Profile.insert({ id: Meteor.userId(),lastWeatherDt: new Date() });

        // var zeitDifferenz = (Math.abs(neu - alt)) / 60000;
        // HTTP.get('http://api.openweathermap.org/data/2.5/forecast?q=Vienna&units=metric&APPID=50fd161807446be0d6d1b7e5ee0f537c', (error, result) => {
        //     if (!error) {
        //         console.log(result);
        //     }
        // });
    }
});
