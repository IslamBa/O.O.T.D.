import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

Template.register.events({
    'submit form'(event, template){
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
    'submit form'(event, template){
        event.preventDefault();
        var username = $("#login-username").val();
        var passwort = $("#login-password").val();
        
        Meteor.loginWithPassword(username, passwort);
    }
});

Template.content.events({
    'click .btnLogout'(event){
        Meteor.logout();
    }
});
