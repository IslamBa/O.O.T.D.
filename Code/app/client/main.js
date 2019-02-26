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
var slidermin;
var slidermax;


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
    wetter() {
        if (Profile.findOne()) { return Profile.findOne().weather.temperatur.temp_max; }
    },
    outfits() {
        if (Profile.findOne()) { return Profile.findOne().currentOutfit; }
    },
    kleider() {
        if (Profile.findOne()) { return Profile.findOne().kleider.filter(el => el.type == "shirt"); }
    }
});


Template.Oberteil.helpers({

    shirts() {
        if (Profile.findOne()) {
            var shirts = Profile.findOne().kleider.filter(el => el.type == "shirt");
            return shirts;
        }
    }
})

Template.Hosen.helpers({

    hosen() {
        if (Profile.findOne()) {
            var hosen = Profile.findOne().kleider.filter(el => el.type == "pants");
            return hosen;
        }
    }
})

Template.Schuhe.helpers({

    schuhe() {
        if (Profile.findOne()) {
            var schuhe = Profile.findOne().kleider.filter(el => el.type == "shoes");
            return schuhe;
        }
    }
})

Template.Accessoire.helpers({
    accessoires() {
        if (Profile.findOne()) {
            var accessoire = Profile.findOne().kleider.filter(el => el.type == "accessoires");
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

    //Wetteranimation
    // function animation(){

    //     var c = document.getElementById("c"),
    //             ctx = c.getContext("2d");

    //     c.width = 350;
    //     c.height = 750;

    //     var lines = [],
    //             maxSpeed = 15,
    //             spacing = 15,
    //             xSpacing = 0,
    //             n = innerWidth / spacing,
    //             colors = ["#0000ff", "#0000ff", "#0000ff", "#0000ff"],
    //             i;

    //     for (i = 0; i < n; i++){
    //         xSpacing += spacing;
    //         lines.push({
    //             x: xSpacing,
    //             y: Math.round(Math.random()*c.height),
    //             width: 2,
    //             height: Math.round(Math.random()*(innerHeight/10)),
    //             speed: Math.random()*maxSpeed + 10,
    //             color: colors[Math.floor(Math.random() * colors.length)]
    //         });
    //     }


    //     function draw(){
    //         var i;
    //         ctx.clearRect(0,0,c.width,c.height);

    //         for (i = 0; i < n; i++){
    //             ctx.fillStyle = lines[i].color;
    //             ctx.fillRect(lines[i].x, lines[i].y, lines[i].width, lines[i].height);
    //             lines[i].y += lines[i].speed;

    //             if (lines[i].y > c.height)
    //                 lines[i].y = 0 - lines[i].height;
    //         }

    //         requestAnimationFrame(draw);

    //     }

    //     draw();

    // };
    // animation();
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
            occasions: [],
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
        console.log("yo");
        Meteor.call('changeCloth', { id: "test5785", type: "shirt" }, (error, result) => {
            if (error) {
                console.log(error);
            }
            else {
                console.log(result);
            }
        });
    },
    'dblclick .divdailycloth'(event) {
        console.log(event.target);
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
    'click .addspeichern'() {
        var niederschlag = false;
        var anlaesse = [];
        alert($("#select_kleiderart").val());
        if ($("#select_kleiderart").children("option").filter(":selected").text() == "Kleiderart wählen") {
            $("#fehlertext2").text("Bitte eine Kleiderart auswählen!")
            $(".fehlermeldung2").slideDown(200, function () {
                setTimeout(function () {
                    $('.fehlermeldung2').fadeOut();
                }, 1200);
            });
        }
        else if (!$("#festlich").is(":checked") && !$("#freizeit").is(":checked") && !$("#business").is(":checked") && !$("#homewear").is(":checked") && !$("#otherclothanlass").is(":checked")) {
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
            if ($("#homewear").is(":checked")) {
                anlaesse.push("Homewear");
            }
            if ($("#otherclothanlass").is(":checked")) {
                anlaesse.push($("#hiddeninputcloth").val());
            }
            var obj = {
                tempmin: slidermin,
                tempmax: slidermax,
                niederschlag: niederschlag,
                anlaesse: anlaesse,
                kleiderart: kleiderart

            }

            Meteor.call('addCloth', obj, (error, result) => {

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
                obj.name = $('.inputnewanlass').val();
            }
            else {
                obj.name = $("#select_anlass").val();
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
    'click #otherclothanlass'() {
        if ($(this).is(':checked')) {
            $(".hiddeninputcloth").show();
            console.log("fghfg");
        }
        else {
            $(".hiddeninputcloth").hide();
        }

    },
    'click .editspeichern'() {
        var niederschlag = false;
        var anlaesse = [];
        alert($("#select_kleiderart").val());
        if ($("#select_kleiderart").children("option").filter(":selected").text() == "Kleiderart wählen") {
            $("#fehlertext2").text("Bitte eine Kleiderart auswählen!")
            $(".fehlermeldung2").slideDown(200, function () {
                setTimeout(function () {
                    $('.fehlermeldung2').fadeOut();
                }, 1200);
            });
        }
        else if (!$("#festlich").is(":checked") && !$("#freizeit").is(":checked") && !$("#business").is(":checked") && !$("#homewear").is(":checked") && !$("#otherclothanlass").is(":checked")) {
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
            if ($("#homewear").is(":checked")) {
                anlaesse.push("Homewear");
            }
            if ($("#otherclothanlass").is(":checked")) {
                anlaesse.push($("#hiddeninputcloth").val());
            }
            var obj = {
                tempmin: slidermin,
                tempmax: slidermax,
                niederschlag: niederschlag,
                anlaesse: anlaesse,
                kleiderart: kleiderart

            }

            Meteor.call('addCloth', obj, (error, result) => {

            });

        }

    }
})

Template.Oberteil.events({
    'click #otherclothanlass'() {
        if ($(this).is(':checked')) {
            $(".hiddeninputcloth").show();
            console.log("fghfg");
        }
        else {
            $(".hiddeninputcloth").hide();
        }

    },
    'click .editspeichern'() {
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
        else if (!$("#festlich").is(":checked") && !$("#freizeit").is(":checked") && !$("#business").is(":checked") && !$("#homewear").is(":checked") && !$("#otherclothanlass").is(":checked")) {
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
            if ($("#homewear").is(":checked")) {
                anlaesse.push("Homewear");
            }
            if ($("#otherclothanlass").is(":checked")) {
                anlaesse.push($("#hiddeninputcloth").val());
            }
            var obj = {
                tempmin: slidermin,
                tempmax: slidermax,
                niederschlag: niederschlag,
                anlaesse: anlaesse,
                kleiderart: kleiderart

            }

            Meteor.call('addCloth', obj, (error, result) => {

            });

        }

    }
})


Template.AddClothes.onRendered(() => {
    var slider2 = new Slider('#ex2');

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
    var slider = new Slider('#ex3');
    slider.on("slide", function (sliderValue) {
        document.getElementById("maxtempzahl").textContent = sliderValue[0] + " °C | " + sliderValue[1] + " °C";
    });
});

Template.Hosen.onRendered(() => {
    var slider = new Slider('#ex3');
    slider.on("slide", function (sliderValue) {
        document.getElementById("maxtempzahl").textContent = sliderValue[0] + " °C | " + sliderValue[1] + " °C";
    });
});

Template.Schuhe.onRendered(() => {
    var slider = new Slider('#ex3');
    slider.on("slide", function (sliderValue) {
        document.getElementById("maxtempzahl").textContent = sliderValue[0] + " °C | " + sliderValue[1] + " °C";
    });
});

Template.Accessoire.onRendered(() => {
    var slider = new Slider('#ex3');
    slider.on("slide", function (sliderValue) {
        document.getElementById("maxtempzahl").textContent = sliderValue[0] + " °C | " + sliderValue[1] + " °C";
    });
});
