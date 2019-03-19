import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import './main.html';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

import '../node_modules/@fortawesome/fontawesome-free/js/all.js';
import '../node_modules/bootstrap/dist/js/bootstrap.min.js';




Meteor.subscribe('Profile');
Meteor.subscribe('User');

var Profile = new Mongo.Collection("profiles");

Router.route('/', function () {
    if (!Meteor.userId()) {
        this.render('login');
    }
    else {
        this.redirect('/startseite');
    }
});

Router.route('/registrieren', function () {
    if (!Meteor.userId()) {
        this.render('register');
    }
    else {
        this.redirect('/startseite');
    }
});

Router.route('/startseite', function () {
    // this.render('content');
    if (Meteor.userId()) {
        this.render('content');
    }
    else {
        this.redirect('/');
    }
});

Router.route('/resetPassword', function () {
    this.render('resPass');
});

Router.route('/addcloth', function () {
    // this.render('AddClothes');
    if (Meteor.userId()) {
        this.render('AddClothes');
    }
    else {
        this.redirect('/');
    }
});

Router.route('/allcloth', function () {
    // this.render('Kategorien');
    if (Meteor.userId()) {
        this.render('Kategorien');
    }
    else {
        this.redirect('/');
    }
});

Router.route('/anlass', function () {
    // this.render('Anlass');
    if (Meteor.userId()) {
        this.render('Anlass');
    }
    else {
        this.redirect('/');
    }
});

Router.route('/addanlass', function () {
    // this.render('AddAnlass');
    if (Meteor.userId()) {
        this.render('AddAnlass');
    }
    else {
        this.redirect('/');
    }
});

Router.route('/oberteil', function () {
    // this.render('Oberteil');
    if (Meteor.userId()) {
        this.render('Oberteil');
    }
    else {
        this.redirect('/');
    }
});

Router.route('/hosen', function () {
    // this.render('Hosen');
    if (Meteor.userId()) {
        this.render('Hosen');
    }
    else {
        this.redirect('/');
    }
});

Router.route('/schuhe', function () {
    // this.render('Schuhe');
    if (Meteor.userId()) {
        this.render('Schuhe');
    }
    else {
        this.redirect('/');
    }
});

Router.route('/accessoire', function () {
    // this.render('Accessoire');
    if (Meteor.userId()) {
        this.render('Accessoire');
    }
    else {
        this.redirect('/');
    }
});

Router.route('/favoutfits', function () {
    // this.render('FavOutfits');
    if (Meteor.userId()) {
        this.render('FavOutfits');
    }
    else {
        this.redirect('/');
    }
});


var allbtncount = 1;
var slidermin;
var slidermax;
var updateID;

screen.orientation.lock("natural");


Template.register.events({
    'submit form'(event, template) {
        event.preventDefault();
        var username = $("#username").val();
        var email = $("#email").val();
        var passwort = $("#password").val();
        var passwortb = $("#passwordb").val();
        var zip = $("#zip").val();
        var country = $("#countrySel").val();

        if (username == "" || email == "" || passwort == "" || zip == "") {
            $(".fehlertext").text("Bitte alle Felder ausfüllen!")
            $(".fehlermeldung").slideDown(200, function () {
                setTimeout(function () {
                    $('.fehlermeldung').fadeOut();
                }, 1200);
            });
        }
        else if ($("#countrySel").children("option").filter(":selected").text() == "Land wählen") {
            $(".fehlertext").text("Bitte ein Land auswählen!")
            $(".fehlermeldung").slideDown(200, function () {
                setTimeout(function () {
                    $('.fehlermeldung').fadeOut();
                }, 1200);
            });
        }
        else if (passwortb != passwort) {
            $(".fehlertext").text("Passwort stimmt nicht überein!")
            $(".fehlermeldung").slideDown(200, function () {
                setTimeout(function () {
                    $('.fehlermeldung').fadeOut();
                }, 1200);
            });
        }
        else {
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
                    Router.go('startseite');
                }
                else{
                    $(".fehlertext").text(error.reason)
                    $(".fehlermeldung").slideDown(200, function () {
                        setTimeout(function () {
                            $('.fehlermeldung').fadeOut();
                        }, 1200);
                    });
                }
            });
            
        }
    },
    'click .arrow-back'() {
        window.history.back();
        localStorage.removeItem("image");
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
    }
});

Template.FavOutfits.events({
    'click .arrow-back'() {
        window.history.back();
        console.log("ghjhgh");
    }
})

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
        if (Profile.findOne()) {
            // console.log(Profile.findOne().kleider.find(el=>el.id == "test88712"));
            return Profile.findOne().location.zip; }
       
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
            else if (Profile.findOne().weather.zustand[0].description == "fog") {
                return "NEBELIG";
            }
            else if (Profile.findOne().weather.zustand[0].description == "mist") {
                return "NEBELIG";
            }
            else if (Profile.findOne().weather.zustand[0].description == "broken clouds") {
                return "BEWÖLKT";
            }
            else if (Profile.findOne().weather.zustand[0].description == "few clouds") {
                return "BEWÖLKT";
            }
            else if (Profile.findOne().weather.zustand[0].description == "light intensity shower rain") {
                return "LEICHTER REGEN";
            }
            else if (Profile.findOne().weather.zustand[0].description == "moderate rain") {
                return "LEICHTER REGEN";
            }
            else if (Profile.findOne().weather.zustand[0].description == "light rain") {
                return "LEICHTER REGEN";
            }

        }
    },
    color() {
        if (Profile.findOne()) {
            if (Profile.findOne().weather.zustand[0].description == "clear sky") {
                return "suncolor";
            }
            else if (Profile.findOne().weather.zustand[0].description == "scattered clouds") {
                return "cloudycolor";
            }
            else if (Profile.findOne().weather.zustand[0].description == "overcast clouds") {
                return "cloudycolor";
            }
            else if (Profile.findOne().weather.zustand[0].description == "light shower snow") {
                return "LEICHTER SCHNEEREGEN";
            }
            else if (Profile.findOne().weather.zustand[0].description == "broken clouds") {
                return "cloudycolor";
            }
            else if (Profile.findOne().weather.zustand[0].description == "few clouds") {
                return "cloudycolor";
            }
            else if (Profile.findOne().weather.zustand[0].description == "fog") {
                return "cloudycolor";
            }
            else if (Profile.findOne().weather.zustand[0].description == "mist") {
                return "cloudycolor";
            }
            else if (Profile.findOne().weather.zustand[0].description == "broken clouds") {
                return "cloudycolor";
            }
            else if (Profile.findOne().weather.zustand[0].description == "few clouds") {
                return "cloudycolor";
            }
            else if (Profile.findOne().weather.zustand[0].description == "light intensity shower rain") {
                return "raincolor";
            }
            else if (Profile.findOne().weather.zustand[0].description == "moderate rain") {
                return "raincolor";
            }
            else if (Profile.findOne().weather.zustand[0].description == "light rain") {
                return "raincolor";
            }

        }
    },
    wetter() {
        if (Profile.findOne()) { return Math.round(Profile.findOne().weather.temperatur.temp) + "°"; }
    },
    outfits() {
        if (Profile.findOne()) { return Profile.findOne().currentOutfit; }
    },
    kleider() {
        if (Profile.findOne()) { return Profile.findOne().kleider.filter(el => el.type == "shirt"); }
    },
    hasOutfit() {
        if (Profile.findOne()) {
            if (Profile.findOne().currentOutfit.length > 0)
                return true;
            else 
            return false;
        }
    }
});


Template.Oberteil.helpers({
    shirts() {
        if (Profile.findOne()) {
            var shirts = Profile.findOne().kleider.filter(el => el.type == "shirt"||el.type=="tshirt"||el.type=="jacket");
            return shirts;
        }
    }
});

Template.Hosen.helpers({

    hosen() {
        if (Profile.findOne()) {
            var hosen = Profile.findOne().kleider.filter(el => el.type == "pants");
            return hosen;
        }
    }
});

Template.Schuhe.helpers({

    schuhe() {
        if (Profile.findOne()) {
            var schuhe = Profile.findOne().kleider.filter(el => el.type == "shoes");
            return schuhe;
        }
    }
});

Template.Accessoire.helpers({
    accessoires() {
        if (Profile.findOne()) {
            var accessoire = Profile.findOne().kleider.filter(el => el.type == "accessoires");
            return accessoire;
        }
    }
});

Template.Anlass.helpers({
    anlass() {
        if (Profile.findOne()) {
            var anlass = Profile.findOne().occasions;
            return anlass;
        }
    },
    wetter() {
        if (Profile.findOne()) { return Math.round(Profile.findOne().weather.temperatur.temp) + "°"; }
    }
});

Template.Kategorien.helpers({
    wetter() {
        if (Profile.findOne()) { return Math.round(Profile.findOne().weather.temperatur.temp) + "°"; }
    }
});

Template.AddClothes.helpers({
    occasions() {
        if (Profile.findOne()) {
            return Profile.findOne().occasions;
        }
    }
});

Template.FavOutfits.helpers({

    favoutfits(){
        if (Profile.findOne()) {
            var newFavs = [];
            var favs = Profile.findOne().favorites;
            favs.forEach(element => {
                var pieceArr = [];
                
                element.pieces.forEach(el => {
                   
                    //pieceArr.push(Profile.findOne({kleider:{id:el}}));
                    
                    pieceArr.push(Profile.findOne().kleider.find(kleid => kleid.id == el));
                });
                newFavs.push(pieceArr);
            });
            console.log(newFavs);
            return newFavs;
        }
    }
})

//Wird aufgerufen wenn Content Page geladen wird
Template.content.onRendered(() => {
    

    localStorage.removeItem("image");
    $("#loginLoading").hide();

    $('#btnWeather').addClass('spinner');
    Meteor.call('getWeather', function (error, result) {

        if (result != false) {
            // $(".title").text(result.weather.temperatur.temp_max + "°");
            $('#btnWeather').removeClass('spinner');
        }
        else {
            console.log("10 Minuten noch nicht vorbei");
            $('#btnWeather').removeClass('spinner');
        }
    });

    Meteor.call('getProfile', Meteor.userId(), (error, result) => {

        // $(".title").text(result.weather.temperatur.temp_max + "°");
    });

    function notification() {
        // IF Statement um zu schauen ob letztes Datum schon vorbei ist


        var lastNotification = '';
        var date = new Date();
        const user = Profile.findOne({ id: Meteor.userId() });

        lastNotification = user.notificationDate;
        if (!lastNotification) { lastNotification = '2000-01-31'; }
        var difference = (new Date(lastNotification) - date) * -1;
        difference = difference / 1000 / 60 / 60 / 24;

        if (difference >= 1) {

            cordova.plugins.notification.local.cancelAll();
            try {
                for (var i = 1; i < 3; i++) {
                    var dateArr = new Date(date);

                    dateArr.setDate(dateArr.getDate() + i);
                    dateArr.setHours(5);
                    dateArr.setSeconds(0);

                    cordova.plugins.notification.local.schedule({
                        id: i,
                        title: 'OOTD',
                        text: 'Schau dir dein heutiges Outfit an, ' + Meteor.user().username,
                        trigger: { at: dateArr },
                        foreground: true
                    });

                }
                Meteor.call("updateNotificationDate", date, (error, result) => {
                    console.log(error);
                });
            } catch (error) {
                console.log(error);
            }
        }
        //Server Aufrufen und neue Push Date einfügen/updaten
    }


    if (Meteor.isCordova) {
        window.onpopstate = function () {
            if (history.state && history.state.initial === true) {
                navigator.app.exitApp();
            }
        };
        notification();
    }

    Meteor.call('checkFavorite', (error, result) => {
        if (!error) {
            console.log(result);
            if (result == false) {
                $('#favicon').removeClass();
                $('#favicon').addClass("fas fa-star");
            }
            else {
                $('#favicon').removeClass();
                $('#favicon').addClass("far fa-star");
            }
        }

    });
});


Template.AddAnlass.onRendered(() => {
    this.$('.datepicker').datepicker({
        autoclose: true
    });

});

//Events für Content Seifte
Template.content.events({
    'click .btnLogout'(event) {
        Meteor.logout();
    },
    'click #btnWeather'(event) {
        $('#btnWeather').addClass('spinner');
        Meteor.call('getWeather', function (error, result) {
            if (result != false) {
                $(".title").text(result.weather.temperatur.temp_max + "°");
                console.log("erfolgreich wetter aktualisiert");
                $('#btnWeather').removeClass('spinner');
            }
            else {
                console.log("10 Minuten noch nicht vorbei");
                $('#btnWeather').removeClass('spinner');
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
    'dblclick .imgOut'(event) {
        var values = event.target.id.split(":");
        // var parent = $(event.currentTarget).parent();
        // parent.addClass("clothChange");
        console.log(values);
        Meteor.call('changeCloth', { id: values[0], type: values[1] }, (error, result) => {
            if (error) {
                console.log(error);
                // parent.removeClass("clothChange");
            }
            else {
                console.log(result);
                // parent.removeClass("clothChange");
            }
        });
        Meteor.call('checkFavorite', (error, result) => {
            if (result == false) {
                console.log("boiidjhf");
                $('#favicon').addClass("fas fa-star");
            }
            else {
                console.log("passthjhj");
                $('#favicon').removeClass();
                $('#favicon').addClass("far fa-star");
            }
        });
    },
    'click #favicon'() {
        Meteor.call('checkFavorite', (error, result) => {
            if (result == false) {
                console.log("boiidjhf");
                // console.log(this);
            }
            else {
                Meteor.call('addFavorite', (error, result) => {
                    if (!error) {
                        console.log("passthjhj");
                        $('#favicon').removeClass();
                        $('#favicon').addClass("fas fa-star");
                    }
                    else {
                        console.log(error);
                    }
                });
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
    'change #otherclothanlass'() {
        if ($(this).is(':checked')) {
            $(".hiddeninputcloth").show();
            console.log("fghfghg");
        }
        else {
            $(".hiddeninputcloth").hide();
        }

    },
    'click #btnCamera'() {
        navigator.camera.getPicture((res) => {

            localStorage.setItem("image", res);
        }, (err) => {
            console.log(err);
        }, {
                targetWidth: 1500, targetHeight: 1500, destinationType: Camera.DestinationType.DATA_URL,
                correctOrientation: true, allowEdit: true
            })
    },
    'click .clothpic'() {
        // $("#addImageInput").click();
        navigator.camera.getPicture((res) => {

            localStorage.setItem("image", res);
        }, (err) => {
            console.log(err);
        }, {
                targetWidth: 1500, targetHeight: 1500, destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY, allowEdit: true
            })
    },
    'click .addspeichern'() {
        var niederschlag = false;
        var anlaesse = [];
        var image = '';
        var type;
        // var reader = new FileReader();

        if ($("#select_kleiderart").children("option").filter(":selected").text() == "Kleiderart wählen") {
            $("#fehlertext2").text("Bitte eine Kleiderart auswählen!")
            $(".fehlermeldung2").slideDown(200, function () {
                setTimeout(function () {
                    $('.fehlermeldung2').fadeOut();
                }, 1200);
            });
        }
        else if (!$("#festlich").is(":checked") && !$("#freizeit").is(":checked") && !$("#business").is(":checked") && !$("#otherclothanlass").is(":checked")) {
            $("#fehlertext2").text("Bitte mindestens einen Anlass auswählen!")
            $(".fehlermeldung2").slideDown(200, function () {
                setTimeout(function () {
                    $('.fehlermeldung2').fadeOut();
                }, 1200);
            });
        }
        else if ($("#hiddeninputcloth").val() == "" && $("#otherclothanlass").is(":checked")) {
            $("#fehlertext2").text("Bitte einen neuen Anlass eintragen!")
            $(".fehlermeldung2").slideDown(200, function () {
                setTimeout(function () {
                    $('.fehlermeldung2').fadeOut();
                }, 1200);
            });
        }
        else if (image == "") {
            $("#fehlertext2").text("Bitte ein Bild wählen!")
            $(".fehlermeldung2").slideDown(200, function () {
                setTimeout(function () {
                    $('.fehlermeldung2').fadeOut();
                }, 1200);
            });
        }
        else {
            if ($("#niederschlag").is(":checked")) {
                niederschlag = true;
            }
            if ($("#festlich").is(":checked")) {
                anlaesse.push("Festlich");
            }
            if ($("#freizeit").is(":checked")) {
                anlaesse.push("Freizeit");
            }
            if ($("#business").is(":checked")) {
                anlaesse.push("Business");
            }
            if ($("#otherclothanlass").is(":checked")) {
                anlaesse.push($("#hiddeninputcloth").val());
            }
            if ($("#select_kleiderart").children("option").filter(":selected").text() == "Jacke") {
                type = "jacket"
            }
            if ($("#select_kleiderart").children("option").filter(":selected").text() == "Hose") {
                type = "pants"
            }
            if ($("#select_kleiderart").children("option").filter(":selected").text() == "Shirt") {
                type = "shirt"
            }
            if ($("#select_kleiderart").children("option").filter(":selected").text() == "T-Shirt") {
                type = "tshirt"
            }
            if ($("#select_kleiderart").children("option").filter(":selected").text() == "Schuhe") {
                type = "shoes"
            }
            if ($("#select_kleiderart").children("option").filter(":selected").text() == "Kleid") {
                type = "dress"
            }
            if ($("#select_kleiderart").children("option").filter(":selected").text() == "Rock") {
                type = "skirt"
            }
            if ($("#select_kleiderart").children("option").filter(":selected").text() == "Accessoire") {
                type = "accessoires"
            }
            if ($("#select_kleiderart").children("option").filter(":selected").text() == "Kopfbedeckung") {
                type = "headgear"
            }

            // alert(image);

            // function getBase64(file) {
            //     return new Promise((resolve, reject) => {
            //         const reader = new FileReader();
            //         reader.readAsDataURL(file);
            //         reader.onload = () => resolve(reader.result);
            //         reader.onerror = error => reject(error);
            //     });
            // };

            // getBase64(image).then((data) => {
            image = "data:image/jpeg;base64," + localStorage.getItem("image");

            var obj = {
                type: type,
                weather_range: { min: slidermin, max: slidermax },
                forWetWeather: niederschlag,
                occasions: anlaesse,
                image: image
            };
            console.log(obj);


            Meteor.call('addClothing', obj, (error, result) => {
                if (!error) {
                    console.log(result);
                    localStorage.removeItem("image");
                }
                else {
                    console.log(error);
                    localStorage.removeItem("image");
                }
            });
            // });



            // reader.addEventListener("load", function () {
            //     console.log(reader.result);
            //   }, false);






            $("#fehlertext2").text("Ihr Kleidungstück wurde gespeichert!")
            $(".fehlermeldung2").slideDown(200, function () {
                setTimeout(function () {
                    $('.fehlermeldung2').fadeOut();
                }, 1200);
            });
        }

    }
});

Template.AddAnlass.events({
    'click #save_occasion'() {
        var obj = {};
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();

        if (dd < 10) {
            dd = '0' + dd;
        }

        if (mm < 10) {
            mm = '0' + mm;
        }

        today = mm + '/' + dd + '/' + yyyy;
        if ($('.inputaddanlass').val() == "") {
            $("#fehlertext3").text("Bitte ein Datum eintragen!")
            $(".fehlermeldung2").slideDown(200, function () {
                setTimeout(function () {
                    $('.fehlermeldung2').fadeOut();
                }, 1200);
            });
        }
        else if ($('.inputaddanlass').val() < today) {
            $("#fehlertext3").text("Bitte ein neues Datum eintragen!")
            $(".fehlermeldung2").slideDown(200, function () {
                setTimeout(function () {
                    $('.fehlermeldung2').fadeOut();
                }, 1200);
            });
        }
        else if ($("#select_anlass").val() == "Other" && $('.inputnewanlass').val() == "") {

            $("#fehlertext3").text("Bitte einen Anlass eintragen!")
            $(".fehlermeldung2").slideDown(200, function () {
                setTimeout(function () {
                    $('.fehlermeldung2').fadeOut();
                }, 1200);
            });
        }
        else {
            if ($("#select_anlass").val() == "Other") {
                obj.type = $('.inputnewanlass').val();
            }
            else {
                obj.type = $("#select_anlass").val();
            }
            obj.date = $('.inputaddanlass').val();


            Meteor.call('addOccasion', obj, (error, result) => {
                if (!err) {
                    alert("passt");
                }
                else {
                    alert(error);
                }
            });
        }

    },
    'click .arrow-back'() {
        window.history.back();
        console.log("ghjhgh");
    },
    'click #select_anlass'() {
        if ($("#select_anlass").val() == "Other") {
            $("#hiddeninputanlass").show();
            console.log("ghgh");
        }
        else {
            $("#hiddeninputanlass").hide();
        }

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

Template.Hosen.events({
    'click .arrow-back'() {
        window.history.back();
        console.log("ghjhgh");
    },
    'click #otherclothanlass'() {
        console.log("gcggvgvzg");
        if ($("#otherclothanlass").is(':checked')) {
            $("#hiddeninputcloth").show();
            console.log("fghfg");
        }
        else {
            $("#hiddeninputcloth").hide();
        }

    },
    'click .edit-icon': function (e) {
        updateID = e.currentTarget.id;
    },
    'click .clothedit'() {
        var niederschlag = false;
        var anlaesse = [];
        if ($("#select_kleiderart").children("option").filter(":selected").text() == "Kleiderart wählen") {
            $("#fehlertext2").text("Bitte eine Kleiderart auswählen!")
            $(".fehlermeldung2").slideDown(200, function () {
                setTimeout(function () {
                    $('.fehlermeldung2').fadeOut();
                }, 1200);
            });
        }
        else if (!$("#festlich").is(":checked") && !$("#freizeit").is(":checked") && !$("#business").is(":checked") && !$("#otherclothanlass").is(":checked")) {
            $("#fehlertext2").text("Bitte mindestens einen Anlass auswählen!")
            $(".fehlermeldung2").slideDown(200, function () {
                setTimeout(function () {
                    $('.fehlermeldung2').fadeOut();
                }, 1200);
            });
        }
        else if ($("#hiddeninputcloth").val() == "" && $("#otherclothanlass").is(":checked")) {
            $("#fehlertext2").text("Bitte einen neuen Anlass eintragen!")
            $(".fehlermeldung2").slideDown(200, function () {
                setTimeout(function () {
                    $('.fehlermeldung2').fadeOut();
                }, 1200);
            });
        }
        else {
            if ($("#niederschlag").is(":checked")) {
                niederschlag = true;
            }
            if ($("#festlich").is(":checked")) {
                anlaesse.push("Festlich");
            }
            if ($("#freizeit").is(":checked")) {
                anlaesse.push("Freizeit");
            }
            if ($("#business").is(":checked")) {
                anlaesse.push("Business");
            }
            if ($("#otherclothanlass").is(":checked")) {
                anlaesse.push($("#hiddeninputcloth").val());
            }
            var obj = {
                id: updateID,
                tempmin: slidermin,
                tempmax: slidermax,
                niederschlag: niederschlag,
                anlaesse: anlaesse,
                kleiderart: kleiderart
            }

            Meteor.call('updateCloth', obj, (error, result) => {

            });

        }

    }
})

Template.Oberteil.events({
    'click .arrow-back'() {
        window.history.back();
        console.log("ghjhgh");
    },
    'click #otherclothanlass'() {
        console.log("gcggvgvzg");
        if ($("#otherclothanlass").is(':checked')) {
            $("#hiddeninputcloth").show();
            console.log("fghfg");
        }
        else {
            $("#hiddeninputcloth").hide();
        }

    },
    'click .edit-icon': function (e) {
        updateID = e.currentTarget.id;
    },
    'click .clothedit'() {
        var niederschlag = false;
        var anlaesse = [];
        if ($("#select_kleiderart").children("option").filter(":selected").text() == "Kleiderart wählen") {
            $("#fehlertext2").text("Bitte eine Kleiderart auswählen!")
            $(".fehlermeldung2").slideDown(200, function () {
                setTimeout(function () {
                    $('.fehlermeldung2').fadeOut();
                }, 1200);
            });
        }
        else if (!$("#festlich").is(":checked") && !$("#freizeit").is(":checked") && !$("#business").is(":checked") && !$("#otherclothanlass").is(":checked")) {
            $("#fehlertext2").text("Bitte mindestens einen Anlass auswählen!")
            $(".fehlermeldung2").slideDown(200, function () {
                setTimeout(function () {
                    $('.fehlermeldung2').fadeOut();
                }, 1200);
            });
        }
        else if ($("#hiddeninputcloth").val() == "" && $("#otherclothanlass").is(":checked")) {
            $("#fehlertext2").text("Bitte einen neuen Anlass eintragen!")
            $(".fehlermeldung2").slideDown(200, function () {
                setTimeout(function () {
                    $('.fehlermeldung2').fadeOut();
                }, 1200);
            });
        }
        else {
            if ($("#niederschlag").is(":checked")) {
                niederschlag = true;
            }
            if ($("#festlich").is(":checked")) {
                anlaesse.push("Festlich");
            }
            if ($("#freizeit").is(":checked")) {
                anlaesse.push("Freizeit");
            }
            if ($("#business").is(":checked")) {
                anlaesse.push("Business");
            }
            if ($("#otherclothanlass").is(":checked")) {
                anlaesse.push($("#hiddeninputcloth").val());
            }
            var obj = {
                id: updateID,
                tempmin: slidermin,
                tempmax: slidermax,
                niederschlag: niederschlag,
                anlaesse: anlaesse,
                kleiderart: kleiderart
            }

            Meteor.call('updateCloth', obj, (error, result) => {

            });

        }

    }
})

Template.Schuhe.events({
    'click .arrow-back'() {
        window.history.back();
        console.log("ghjhgh");
    },
    'click #otherclothanlass'() {
        console.log("gcggvgvzg");
        if ($("#otherclothanlass").is(':checked')) {
            $("#hiddeninputcloth").show();
            console.log("fghfg");
        }
        else {
            $("#hiddeninputcloth").hide();
        }

    },
    'click .edit-icon': function (e) {
        updateID = e.currentTarget.id;
    },
    'click .clothedit'() {
        var niederschlag = false;
        var anlaesse = [];
        if ($("#select_kleiderart").children("option").filter(":selected").text() == "Kleiderart wählen") {
            $("#fehlertext2").text("Bitte eine Kleiderart auswählen!")
            $(".fehlermeldung2").slideDown(200, function () {
                setTimeout(function () {
                    $('.fehlermeldung2').fadeOut();
                }, 1200);
            });
        }
        else if (!$("#festlich").is(":checked") && !$("#freizeit").is(":checked") && !$("#business").is(":checked") && !$("#otherclothanlass").is(":checked")) {
            $("#fehlertext2").text("Bitte mindestens einen Anlass auswählen!")
            $(".fehlermeldung2").slideDown(200, function () {
                setTimeout(function () {
                    $('.fehlermeldung2').fadeOut();
                }, 1200);
            });
        }
        else if ($("#hiddeninputcloth").val() == "" && $("#otherclothanlass").is(":checked")) {
            $("#fehlertext2").text("Bitte einen neuen Anlass eintragen!")
            $(".fehlermeldung2").slideDown(200, function () {
                setTimeout(function () {
                    $('.fehlermeldung2').fadeOut();
                }, 1200);
            });
        }
        else {
            if ($("#niederschlag").is(":checked")) {
                niederschlag = true;
            }
            if ($("#festlich").is(":checked")) {
                anlaesse.push("Festlich");
            }
            if ($("#freizeit").is(":checked")) {
                anlaesse.push("Freizeit");
            }
            if ($("#business").is(":checked")) {
                anlaesse.push("Business");
            }
            if ($("#otherclothanlass").is(":checked")) {
                anlaesse.push($("#hiddeninputcloth").val());
            }
            var obj = {
                id: updateID,
                tempmin: slidermin,
                tempmax: slidermax,
                niederschlag: niederschlag,
                anlaesse: anlaesse,
                kleiderart: kleiderart
            }

            Meteor.call('updateCloth', obj, (error, result) => {

            });

        }

    }
})

Template.Accessoire.events({
    'click .arrow-back'() {
        window.history.back();
        console.log("ghjhgh");
    },
    'click #otherclothanlass'() {
        console.log("gcggvgvzg");
        if ($("#otherclothanlass").is(':checked')) {
            $("#hiddeninputcloth").show();
            console.log("fghfg");
        }
        else {
            $("#hiddeninputcloth").hide();
        }

    },
    'click .edit-icon': function (e) {
        updateID = e.currentTarget.id;
    },
    'click .clothedit'() {
        var niederschlag = false;
        var anlaesse = [];
        if ($("#select_kleiderart").children("option").filter(":selected").text() == "Kleiderart wählen") {
            $("#fehlertext2").text("Bitte eine Kleiderart auswählen!")
            $(".fehlermeldung2").slideDown(200, function () {
                setTimeout(function () {
                    $('.fehlermeldung2').fadeOut();
                }, 1200);
            });
        }
        else if (!$("#festlich").is(":checked") && !$("#freizeit").is(":checked") && !$("#business").is(":checked") && !$("#otherclothanlass").is(":checked")) {
            $("#fehlertext2").text("Bitte mindestens einen Anlass auswählen!")
            $(".fehlermeldung2").slideDown(200, function () {
                setTimeout(function () {
                    $('.fehlermeldung2').fadeOut();
                }, 1200);
            });
        }
        else if ($("#hiddeninputcloth").val() == "" && $("#otherclothanlass").is(":checked")) {
            $("#fehlertext2").text("Bitte einen neuen Anlass eintragen!")
            $(".fehlermeldung2").slideDown(200, function () {
                setTimeout(function () {
                    $('.fehlermeldung2').fadeOut();
                }, 1200);
            });
        }
        else {
            if ($("#niederschlag").is(":checked")) {
                niederschlag = true;
            }
            if ($("#festlich").is(":checked")) {
                anlaesse.push("Festlich");
            }
            if ($("#freizeit").is(":checked")) {
                anlaesse.push("Freizeit");
            }
            if ($("#business").is(":checked")) {
                anlaesse.push("Business");
            }
            if ($("#otherclothanlass").is(":checked")) {
                anlaesse.push($("#hiddeninputcloth").val());
            }
            var obj = {
                id: updateID,
                tempmin: slidermin,
                tempmax: slidermax,
                niederschlag: niederschlag,
                anlaesse: anlaesse,
                kleiderart: kleiderart
            }

            Meteor.call('updateCloth', obj, (error, result) => {

            });

        }

    }
})


Template.AddClothes.onRendered(() => {
    var slider2 = new Slider('#ex2');

    var slider = document.getElementById("ex2").value;
    var zahl = slider.split(",");
    slidermin = zahl[0];
    slidermax = zahl[1];
    document.getElementById("maxtempzahl").textContent = slidermin + " °C | " + slidermax + " °C";
    // console.log(slider2.data-slider-value);

    slider2.on("slide", function (sliderValue) {
        document.getElementById("maxtempzahl").textContent = sliderValue[0] + " °C | " + sliderValue[1] + " °C";
        slidermin = sliderValue[0];
        slidermax = sliderValue[1];
    });

    var switchStatus = false;
    $("#otherclothanlass").on('change', function () {
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

Template.Oberteil.onRendered(() => {
    var slider2 = new Slider('#ex3');

    var slider = document.getElementById("ex3").value;
    var zahl = slider.split(",");
    slidermin = zahl[0];
    slidermax = zahl[1];
    document.getElementById("maxtempzahl").textContent = slidermin + " °C | " + slidermax + " °C";

    slider2.on("slide", function (sliderValue) {
        document.getElementById("maxtempzahl").textContent = sliderValue[0] + " °C | " + sliderValue[1] + " °C";
        slidermin = sliderValue[0];
        slidermax = sliderValue[1];
    });
});

Template.Hosen.onRendered(() => {
    var slider2 = new Slider('#ex3');
    var slider = document.getElementById("ex3").value;
    var zahl = slider.split(",");
    slidermin = zahl[0];
    slidermax = zahl[1];
    document.getElementById("maxtempzahl").textContent = slidermin + " °C | " + slidermax + " °C";

    slider2.on("slide", function (sliderValue) {
        document.getElementById("maxtempzahl").textContent = sliderValue[0] + " °C | " + sliderValue[1] + " °C";
        slidermin = sliderValue[0];
        slidermax = sliderValue[1];
    });
});

Template.Schuhe.onRendered(() => {
    var slider2 = new Slider('#ex3');
    var slider = document.getElementById("ex3").value;
    var zahl = slider.split(",");
    slidermin = zahl[0];
    slidermax = zahl[1];
    document.getElementById("maxtempzahl").textContent = slidermin + " °C | " + slidermax + " °C";

    slider2.on("slide", function (sliderValue) {
        document.getElementById("maxtempzahl").textContent = sliderValue[0] + " °C | " + sliderValue[1] + " °C";
        slidermin = sliderValue[0];
        slidermax = sliderValue[1];
    });
});

Template.Accessoire.onRendered(() => {
    var slider2 = new Slider('#ex3');
    var slider = document.getElementById("ex3").value;
    var zahl = slider.split(",");
    slidermin = zahl[0];
    slidermax = zahl[1];
    document.getElementById("maxtempzahl").textContent = slidermin + " °C | " + slidermax + " °C";

    slider2.on("slide", function (sliderValue) {
        document.getElementById("maxtempzahl").textContent = sliderValue[0] + " °C | " + sliderValue[1] + " °C";
        slidermin = sliderValue[0];
        slidermax = sliderValue[1];
    });
});
