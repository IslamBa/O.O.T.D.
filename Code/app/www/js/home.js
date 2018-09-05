if (window.localStorage.getItem("loggedIn")) {
    $("#main").show();

    $("#btnLogout").click(function(){
        window.localStorage.removeItem("loggedIn");
        window.location.href ="index.html";
    });
}
else {
    window.location.href ="index.html";
}