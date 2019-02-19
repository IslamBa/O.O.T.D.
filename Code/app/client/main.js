import { Template } from 'meteor/templating';
import { Profile } from '../collections';
import './main.html';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

import '../node_modules/@fortawesome/fontawesome-free/js/all.js';
import '../node_modules/bootstrap/dist/js/bootstrap.min.js';


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
    },
    'click .arrow-back'() {
        window.history.back();
        console.log("ghjhgh");
    }
});

Template.login.events({
    'submit form'(event, template) {
        $("#loginLoading").show();
        event.preventDefault();
        var username = $("#login-username").val().trim();
        var passwort = $("#login-password").val();

        Meteor.loginWithPassword(username, passwort, (err) => {
            if (err) {
                $("#loginLoading").hide();
                console.log(err);
                $(".fehlermeldung").slideDown(200, function () {
                    setTimeout(function () {
                        $('.fehlermeldung').fadeOut();
                    }, 1200);
                });
            }
            else {
                $("#loginLoading").hide();
                Router.go('startseite');
            }
        });
    },
    'click #forgotPass'(event) {
        // Accounts.forgotPassword({ email: 'islam2000@live.at' }, (err) => {
        //     if (!err) {
        //         console.log("passt");
        //     }
        //     else {
        //         console.log(err);
        //     }
        // });
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
    },
    zip() {
        if (Profile.findOne()) { return Profile.findOne().location.zip; }

    },
    zustand() {
        if (Profile.findOne()) {
            if (Profile.findOne().weather.zustand[0].description == "clear sky") {
                return "KLARER HIMMEL";
            }
            else if (Profile.findOne().weather.zustand[0].description == "scattered clouds") {
                return "BEWÖLKT";
            }
            else if (Profile.findOne().weather.zustand[0].description == "overcast clouds") {
                return "BEWÖLKT";
            }
            else if (Profile.findOne().weather.zustand[0].description == "light shower snow") {
                return "LEICHTER SCHNEEREGEN";
            }
            else if (Profile.findOne().weather.zustand[0].description == "broken clouds") {
                return "BEWÖLKT";
            }
            else if (Profile.findOne().weather.zustand[0].description == "few clouds") {
                return "BEWÖLKT";
            }
            else if(Profile.findOne().weather.zustand[0].description == "fog"){
                return "NEBELIG";
            }
            else if(Profile.findOne().weather.zustand[0].description == "mist"){
                return "NEBELIG";
            }
            else if(Profile.findOne().weather.zustand[0].description == "broken clouds"){
                return "BEWÖLKT";
            }
            else if(Profile.findOne().weather.zustand[0].description == "few clouds"){
                return "BEWÖLKT";
            }
            else if(Profile.findOne().weather.zustand[0].description == "light intensity shower rain"){
                return "LEICHTER REGEN";
            }
            else if(Profile.findOne().weather.zustand[0].description == "moderate rain"){
                return "LEICHTER REGEN";
            }
            
        }
    },
    wetter() {
        if (Profile.findOne()) { return Profile.findOne().weather.temperatur.temp_max; }
    },
    outfits(){
        if (Profile.findOne()) { return Profile.findOne().currentOutfit; }
    }
});

Template.Oberteil.helpers({

    shirts(){
        if (Profile.findOne()) {
            var shirts = Profile.findOne().kleider.filter(el => el.type == "shirt");
             return shirts;
            }
    }
})

Template.Hosen.helpers({
    
        hosen(){
            if (Profile.findOne()) {
                var hosen = Profile.findOne().kleider.filter(el => el.type == "pants");
                 return hosen;
                }
        }
})

Template.Schuhe.helpers({
    
        schuhe(){
            if (Profile.findOne()) {
                var schuhe = Profile.findOne().kleider.filter(el => el.type == "shoes");
                 return schuhe;
                }
        }
})

Template.Accessoire.helpers({
        accessoires(){
            if (Profile.findOne()) {
                var accessoire = Profile.findOne().kleider.filter(el => el.type == "accessoire");
                 return accessoire;
                }
        }
})

Template.FavOutfits.helpers({
    
        // favoutfits(){
        //     if (Profile.findOne()) {
        //         var favoutfits = Profile.findOne().kleider.filter(el => el.type == "accessoire");
        //          return accessoire;
        //         }
        // }
})


//Wird aufgerufen wenn Content Page geladen wird
Template.content.onRendered(() => {

    $("#loginLoading").hide();

    Meteor.call('getWeather', function (error, result) {

        if (result != false) {
            // $(".title").text(result.weather.temperatur.temp_max + "°");
        }
        else {
            console.log("10 Minuten noch nicht vorbei");
        }
    });

    Meteor.call('getProfile', Meteor.userId(), (error, result) => {

        // $(".title").text(result.weather.temperatur.temp_max + "°");
    });







    function notification() {
        // IF Statement um zu schauen ob letztes Datum schon vorbei ist
        var lastNotification = '';
        var date = new Date();
        if (Meteor.isCordova) {
            Meteor.call('getProfile', Meteor.userId(), (error, result) => {

                lastNotification = result.notificationDate;
                if (lastNotification == '') { lastNotification = '2000-01-31'; }
                var difference = (new Date(lastNotification) - date) * -1;
                difference = difference / 1000 / 60 / 60 / 24;

                if (difference >= 2) {
                    cordova.plugins.notification.local.cancelAll();
                    try {
                        alert("yow");
                        date.setMinutes(date.getMinutes() + 1);
                        cordova.plugins.notification.local.schedule(
                            {
                                id: 1,
                                title: 'OOTD',
                                text: 'Pa gönn dir Gucci Outfit, ' + Meteor.user().username,
                                trigger: { at: date },
                                foreground: true
                            }
                            // {
                            //     id: 2,
                            //     title: 'OOTD',
                            //     text: 'Pa gönn dir Gucci Outfit, ' + Meteor.user().username,
                            //     trigger: { at: date },
                            //     foreground: true
                            // }
                        );
                        Meteor.call("updateNotificationDate", date, (error, result) => {
                            console.log(error);
                        });
                    } catch (error) {
                        console.log(error);
                    }
                }

            });
            //Server Aufrufen und neue Push Date einfügen/updaten
        }
    }
    notification();
});


Template.AddAnlass.onRendered(() => {
    this.$('.datepicker').datepicker();

});

//Events für Content Seite
Template.content.events({
    'click .btnLogout'(event) {
        Meteor.logout();
    },
    'click #btnWeather'(event) {
        Meteor.call('getWeather', function (error, result) {
            if (result != false) {
                $(".title").text(result.weather.temperatur.temp_max + "°");
                console.log("erfolgreich wetter aktualisiert");
            }
            else {
                console.log("10 Minuten noch nicht vorbei");
            }
        });
    },
    'click #NochnichtexistierenderButton'(event) {
        var type = 'Wert von Input';
        var wetterMin = 'Wert von Input';
        var wetterMax = 'Wert von Input';
        var anlaesse = 'Wert von Input - Array';
        var forWetWeather = 'Wert von Input - Boolean';
        var layer = 'Wert von Frontend';
        var image = '';
        var icon = 'Wert von Frontend';

        var obj = {
            type: type,
            weathe_range: { min: wetterMin, mX: wetterMax },
            anlaesse: anlaesse,
            forWetWeather: forWetWeather,
            occasions:[],
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
        // var name = 'Wert von Input';
        // var date = 'Wert von Input';
        // var typ = 'Wert von Input';

        // var obj = {
        //     name: name,
        //     date: date,
        //     typ: typ
        // };

        // Meteor.call('addOccasion', obj, (error, result) => {
        //     if (!error) {
        //         console.log("Kleidung erfolgreich hinzugefügt");
        //     }
        // });
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

        // MeteorCameraUI.getPicture((err, res) => {
        //     if (!err) {
        //         console.log(res);
        //         // Meteor.call('uploadImage', res, (error, result) => {
        //         //     if (error) {
        //         //         console.log(error);
        //         //     }
        //         //     else {
        //         //         console.log(result);
        //         //     }
        //         // });

        //     }
        //     else {
        //         console.log(err);
        //     }
        // });
    },
    'click #save_occasion'() {
        alert("yow");
    },
    'click #uploadImage'() {
        Meteor.call('uploadImage', 'https://upload.wikimedia.org/wikipedia/commons/1/17/HTL-Ottakring.png', (error, result) => {
            if (error) {
                console.log(error);
            }
            else {
                console.log(result);
            }
        });
    },
    'click #getOutfit'() {
        Meteor.call('getOutfit', (error, result) => {
            if (error) {
                console.log(error);
            }
            else {
                console.log(result);
            }
        });
    },
    'click #changePiece'() {
        Meteor.call('changeCloth', {id:"test5785",type:"shirt"},(error, result) => {
            if (error) {
                console.log(error);
            }
            else {
                console.log(result);
            }
        });
    }
});

Template.AddClothes.events({
    'click #btn_addCloth'() {
        alert("passz");
    },
    'click .arrow-back'() {
        window.history.back();
        console.log("ghjhgh");
    },
    'change #otherclothanlass'(){
        if($(this).is(':checked')){
            $(".hiddeninputcloth").show();
            console.log("fghfghg");
        }
        else{
            $(".hiddeninputcloth").hide();
        }
        
    },
});

Template.AddAnlass.events({
    'click #save_occasion'() {
        var obj = {};
        obj.name = $("#select_anlass").val();
        obj.date = $('.inputaddanlass').val();

        Meteor.call('addOccasion', obj, (error, result) => {
            if (!err) {
                alert("passt");
            }
            else {
                alert(error);
            }
        });
    },
    'click .arrow-back'() {
        window.history.back();
        console.log("ghjhgh");
    },
    'click #other'() {
        $("#hiddeninputanlass").show();
        alert("ghgh");
    }
});

Template.Anlass.events({

    'click .arrow-back'() {
        window.history.back();
        console.log("ghjhgh");
    }
})

Template.Kategorien.events({

    'click .arrow-back'() {
        window.history.back();
        console.log("ghjhgh");
    }
})


Template.AddClothes.onRendered(() =>{
    var slider2 = new Slider('#ex2');

    slider2.on("slide", function(sliderValue) {

        document.getElementById("maxtempzahl").textContent = sliderValue[0] + " °C | " + sliderValue[1] + " °C";

    });

    var switchStatus = false;
    $("#otherclothanlass").on('change', function() {
        if ($(this).is(':checked')) {
            $("#hiddeninputcloth").show();
            console.log("fghfghg");
        }
        else {
            $("#hiddeninputcloth").hide();
            console.log("klklklkl");
        }
    });
});

Template.Oberteil.onRendered(() =>{
    var slider = new Slider('#ex3');
    slider.on("slide", function(sliderValue) {
        document.getElementById("maxtempzahl").textContent = sliderValue[0] + " °C | " + sliderValue[1] + " °C";
    });
});