if (window.localStorage.getItem("loggedIn")) {
    alert("geht");
    $("#main").show();

    $("#btnLogout").click(function(){
        window.localStorage.removeItem("loggedIn");
        window.location.href ="index.html";
    });


}
else {
    alert("geht nicht");
    window.location.href ="index.html";
}