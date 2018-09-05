user = {
    username: "Islam",
    pass: "123",
    userID: "abc123"
};

var username = "";
var pass = "";

$("#btnLogin").click(function(){
     username = $("#inputUsername").val();
     pass = $("#inputPassword").val();
    checkLogin();
});

function checkLogin(){
    if(username == user.username && pass == user.pass){
        alert("passt");
        window.localStorage.setItem("loggedIn", true);
        window.localStorage.setItem("userID", user.userID);
        window.location.href = "home.html";
    }
    else{
        alert("falsche daten");
    }
}