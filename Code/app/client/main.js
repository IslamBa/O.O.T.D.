import { Template } from 'meteor/templating';
import { Profile } from '../collections';
import './main.html';

Meteor.subscribe('Profile');
Meteor.subscribe('User');

Router.route('/', function () {
    this.render('login');
});

Router.route('/registrieren', function () {
    this.render('register');
});

Router.route('/startseite', function () {
    this.render('content');
});

Router.route('/resetPassword', function () {
    this.render('resPass');
});

Router.route('/addcloth', function () {
    this.render('AddClothes');
});

var userProfile;

Template.register.events({
    'submit form'(event, template) {
        event.preventDefault();
        var username = $("#username").val();
        var email = $("#email").val();
        var passwort = $("#password").val();
        var zip = $("#zip").val();
        var country = $("#countrySel").val();

        Accounts.createUser({
            username: username,
            email: email,
            password: passwort
        }, (error) => {
            if (!error) {
                var user = {
                    id: Meteor.userId(),
                    zip: zip,
                    country: country
                }
                Meteor.call('addNewProfile', user);
            }
        });
    }
});

Template.login.events({
    'submit form'(event, template) {
        event.preventDefault();
        var username = $("#login-username").val();
        var passwort = $("#login-password").val();

        Meteor.loginWithPassword(username, passwort,(err)=>{
            if(err){
                console.log(err);
            }
            else{
                console.log("passt");
                Router.go('startseite');
            }
        });
    },
    'click #forgotPass'(event){
        Accounts.forgotPassword({email: 'islam2000@live.at'}, (err)=>{
            if(!err){
                console.log("passt");
            }
            else{
                console.log(err);
            }
        });
    }
});

Template.resPass.events({
    'click #sendReset'(event){
        email = $("#resEmail").val();
        Accounts.forgotPassword({email: email}, (err)=>{
            if(!err){
                console.log("passt");
            }
            else{
                console.log(err);
            }
        });
    }
});

Template.content.helpers({
    username(){
        return Meteor.user().username;
    }
})

Template.content.onRendered(() => {
   
    Meteor.call('getWeather', function (error, result) {
        if (result != false) {
            $(".title").text(result.data.main.temp_max + "°C");
        }
    });

    Meteor.call('getProfile', Meteor.userId(), (error, result) => {
        userProfile = result;
        
        $(".title").text(result.weather.main.temp_max + "°C");
    });
});


Template.content.events({
    'click .btnLogout'(event) {
        Meteor.logout();
    },
    'click #btnWeather'(event) {



        Meteor.call('getWeather', function (error, result) {
            if (result != false) {
                $(".title").text("Wetter: " + result.data.main.temp + "°C");
            }
        });
    }
});


