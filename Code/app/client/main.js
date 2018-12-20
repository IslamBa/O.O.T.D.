import { Template } from 'meteor/templating';
import { Profile } from '../collections';
import './main.html';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/@fortawesome/fontawesome-free/js/all.js';
//import '../node_modules/animate.css/animate.css';


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

Router.route('/allcloth', function () {
    this.render('Kategorien');
});

Router.route('/anlass', function () {
    this.render('Anlass');
});

Router.route('/addanlass', function () {
    this.render('AddAnlass');
});

Router.route('/oberteil', function () {
    this.render('Oberteil');
});

Router.route('/hosen', function () {
    this.render('Hosen');
});

Router.route('/schuhe', function () {
    this.render('Schuhe');
});

Router.route('/accessoire', function () {
    this.render('Accessoire');
});

Router.route('/favoutfits', function () {
    this.render('FavOutfits');
});

var userProfile;
var allbtncount = 1;

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

        Meteor.loginWithPassword(username, passwort, (err) => {
            if (err) {
                console.log(err);
            }
            else {
                Router.go('startseite');
            }
        });
    },
    'click #forgotPass'(event) {
        Accounts.forgotPassword({ email: 'islam2000@live.at' }, (err) => {
            if (!err) {
                console.log("passt");
            }
            else {
                console.log(err);
            }
        });
    }
});


//Events für Passwort Zurücksetzen Seite
Template.resPass.events({
    'click #sendReset'(event) {
        email = $("#resEmail").val();
        Accounts.forgotPassword({ email: email }, (err) => {
            if (!err) {
                console.log("passt");
            }
            else {
                console.log(err);
            }
        });
    }
});

Template.content.helpers({
    username() {
        return Meteor.user().username;
    }
});


//Wird aufgerufen wenn Content Page geladen wird
Template.content.onRendered(() => {

    Meteor.call('getWeather', function (error, result) {
        if (result != false) {
            $(".title").text(result.weather.temperatur.temp_max + "°C");
        }
        else {
            console.log("10 Minuten noch nicht vorbei");
        }
    });

    Meteor.call('getProfile', Meteor.userId(), (error, result) => {
        userProfile = result;

        $(".title").text(result.weather.temperatur.temp_max + "°C");
    });
});


//Events für Content Seite
Template.content.events({
    'click .btnLogout'(event) {
        Meteor.logout();
    },
    'click #btnWeather'(event) {
        Meteor.call('getWeather', function (error, result) {
            if (result != false) {
                $(".title").text("Wetter: " + result.weather.temperatur.temp_max + "°C");
            }
            else {
                console.log("10 Minuten noch nicht vorbei");
            }
        });
    },
    'click #NochnichtexistierenderButton'(event) {
        var typ = 'Wert von Input';
        var wetterMin = 'Wert von Input';
        var wetterMax = 'Wert von Input';
        var anlaesse = 'Wert von Input - Array';
        var forNiederschlag = 'Wert von Input - Boolean';
        var layer = 'Wert von Frontend';
        var image = '';
        var icon = 'Wert von Frontend';

        var obj = {
            typ: typ,
            weatherRange: { wetterMin: wetterMin, wetterMax: wetterMax },
            anlaesse: anlaesse,
            forNiederschlag: forNiederschlag,
            image: image,
            layer: layer,
            icon: icon
        };

        Meteor.call('addClothing', obj, (error, result) => {
            if (!error) {
                console.log("Kleidung erfolgreich hinzugefügt");
            }
        });
    },
    'click #CurrentNoButton'(event) {
        var name = 'Wert von Input';
        var date = 'Wert von Input';
        var typ = 'Wert von Input';

        var obj = {
            name: name,
            date: date,
            typ: typ
        };

        Meteor.call('addOccasion', obj, (error, result) => {
            if (!error) {
                console.log("Kleidung erfolgreich hinzugefügt");
            }
        });
    },
    'click .allbtn'() {
        if (allbtncount == 1) {
            $('.btnLogout').fadeIn(200);
            $('.allcloth').fadeIn(400);
            $('.anlassbtn').fadeIn(600);
            allbtncount--;
        }
        else {
            $('.btnLogout').fadeOut(600);
            $('.allcloth').fadeOut(400);
            $('.anlassbtn').fadeOut(200);
            allbtncount++;
        }
    },
    'click #getPicture'() {

        MeteorCamera.getPicture((err, res) => {
            if (!err) {
                console.log(res);

            }
            else {
                console.log("fehler yow");
            }
        });
    },
    'click #uploadImage'() {

    },
    'click #getOutfit'() {
        Meteor.call('addOccasion', {test:"test"}, (error, result) => {
            console.log(error);
        });
        Meteor.call('getOutfit', (error, result) => {
            if (error) {
                console.log(error);
            }
            else {
                console.log(result);
            }
        });
    }
});


