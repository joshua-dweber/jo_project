$(document).ready(function() {
    updateCurrency()

    var jocoin = 0;

    // https://stackoverflow.com/questions/22063612/adding-csrftoken-to-ajax-request
    function getCookie(c_name) {
        if (document.cookie.length > 0) {
            c_start = document.cookie.indexOf(c_name + "=");
            if (c_start != -1) {
                c_start = c_start + c_name.length + 1;
                c_end = document.cookie.indexOf(";", c_start);
                if (c_end == -1) c_end = document.cookie.length;
                return unescape(document.cookie.substring(c_start, c_end));
            }
        }
        return "";
    }

    function updateCurrency() {
        $.post("/time_update_currency", { csrfmiddlewaretoken: getCookie("csrftoken") }, function (data, status) {
            $('#count').html(data.jocoin)
            jocoin = data.jocoin
        });
        if (jocoin > 25) {
            $("#plus1").show()
        }
        if (jocoin > 100) {
            $("#plus3").show()
        }
        if (jocoin > 1000) {
            $("#plus5").show()
        }
        if (jocoin > 10000) {
            $("#plus10").show()
        }
        if (jocoin > 50000) {
            $("#plus15").show()
        }
        setTimeout(updateCurrency, 1000);
    }

    $("#begin").click(function () {
        $.post("/time_update_upgrade", { csrfmiddlewaretoken: getCookie("csrftoken"), "upgrade_id": 0 }, function (data, status) {
            console.log(status);
        });
        $(this).hide();
    });

    $("#plus1").click(function () {
        $.post("/time_update_upgrade", { csrfmiddlewaretoken: getCookie("csrftoken"), "upgrade_id": 1 }, function (data, status) {
            console.log(status);
        });
        $(this).hide();
    });
    $("#plus3").click(function () { 
        $.post("/time_update_upgrade", { csrfmiddlewaretoken: getCookie("csrftoken"), "upgrade_id": 2 }, function (data, status) {
            console.log(status);
        });
        $(this).hide();
    });
    $("#plus5").click(function () {
        $.post("/time_update_upgrade", { csrfmiddlewaretoken: getCookie("csrftoken"), "upgrade_id": 3 }, function (data, status) {
            console.log(status);
        });
        $(this).hide();
    });
    $("#plus10").click(function () {
        $.post("/time_update_upgrade", { csrfmiddlewaretoken: getCookie("csrftoken"), "upgrade_id": 4 }, function (data, status) {
            console.log(status);
        });
        $(this).hide();
    });
    $("#plus15").click(function () {
        $.post("/time_update_upgrade", { csrfmiddlewaretoken: getCookie("csrftoken"), "upgrade_id": 5 }, function (data, status) {
            console.log(status);
        });
        $(this).hide();
    });
    $("#plus25").click(function () {
        $.post("/time_update_upgrade", { csrfmiddlewaretoken: getCookie("csrftoken"), "upgrade_id": 6 }, function (data, status) {
            console.log(status);
        });
        $(this).hide();
    });
    // function updateUpgrades() {
    //     $.post("/update_upgrade", { csrfmiddlewaretoken: getCookie("csrftoken") });
    //     return false;
    // }

    // https://stackoverflow.com/questions/46889772/how-to-send-data-from-javascript-to-python
});
