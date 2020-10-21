$(document).ready(function() {
    updateSyncCurrency();
    updateCurrency();
    reloadPage();

    var jocoin = 0;
    var increaseRate = 0;

    function updateSyncCurrency() {
        syncCurrency();
        setTimeout(updateSyncCurrency, 10000);
    }

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

    function reloadPage() {
        $.post("/page_reload_time", { csrfmiddlewaretoken: getCookie("csrftoken") }, function (data, status) {
            console.log(data);
            if (data.buildings) {
                $("#buildings").html("");
                for (var i = 0; i < data.buildings.length; i++) {
                    $("#buildings").append(`<div id="bld${data.buildings[i].building_id}" building_id="${data.buildings[i].building_id}">
                        <h1>${data.buildings[i].name}</h1>
                        <button class="upgrade" id="buy_upgrade0" upgrade_id="0" is_bought=0>0.2</button>
                        <button class="upgrade" id="buy_upgrade1" upgrade_id="1" is_bought=0>0.3</button>
                        <button class="upgrade" id="buy_upgrade2" upgrade_id="2" is_bought=0>0.4</button>
                        <button class="upgrade" id="buy_upgrade3" upgrade_id="3" is_bought=0>0.5</button>
                        <button class="upgrade" id="buy_upgrade4" upgrade_id="4" is_bought=0>0.6</button>
                    </div>`);
                    for (var j = 0; j < data.buildings[i].upgrade_ids.length; j++) {
                        $(`#buy_upgrade${data.buildings[i].upgrade_ids[j]}`).attr("is_bought", 1);
                        $(`#buy_upgrade${data.buildings[i].upgrade_ids[j]}`).hide();
                    }
                    $(`#buy_bld${i}`).attr("is_bought", 1);
                }
            }
            jocoin = parseFloat(data.jocoin);
            $(".upgrade").click(function () {
                $.post("/time_update_upgrade", { csrfmiddlewaretoken: getCookie("csrftoken"), "building_id": $(this).parent().attr("building_id"), "upgrade_id": $(this).attr("upgrade_id") },
                    function (data, status) {
                        if (data.status == 1) {
                            $(this).hide();
                            reloadPage();
                            syncCurrency();
                        }
                    });
            });
        });
    }
    
    function updateCurrency() {
        jocoin += increaseRate;
        $('#count').html(jocoin.toFixed(1));
        if (jocoin >= 1 && ($("#buy_bld0").attr("is_bought") == 0)) {
            $("#buy_bld0").parent().show();
        } else {
            $("#buy_bld0").parent().hide();
        }
        if (jocoin >= 1000 && ($("#buy_bld1").attr("is_bought") == 0)) {
            $("#buy_bld1").parent().show();
        } else {
            $("#buy_bld1").parent().hide();
        }
        if (jocoin >= 10000 && ($("#buy_bld2").attr("is_bought") == 0)) {
            $("#buy_bld2").parent().show();
        } else {
            $("#buy_bld2").parent().hide();
        }
        if (jocoin >= 100000 && ($("#buy_bld3").attr("is_bought") == 0)) {
            $("#buy_bld3").parent().show();
        } else {
            $("#buy_bld3").parent().hide();
        }
        if (jocoin >= 1000000 && ($("#buy_bld4").attr("is_bought") == 0)) {
            $("#buy_bld4").parent().show();
        } else {
            $("#buy_bld4").parent().hide();
        }
        if (jocoin >= 10000000 && ($("#buy_bld5").attr("is_bought") == 0)) {
            $("#buy_bld5").parent().show();
        } else {
            $("#buy_bld5").parent().hide();
        }
        setTimeout(updateCurrency, 100);
    };

    function syncCurrency() {
        $.post("/time_update_currency", { csrfmiddlewaretoken: getCookie("csrftoken") }, function (data, status) {
            $('#count').html(data.jocoin);
            jocoin = parseFloat(data.jocoin);
            increaseRate = parseFloat(data.increase_rate);
        });
    };

    $("#begin").click(function () {
        $.post("/begin", { csrfmiddlewaretoken: getCookie("csrftoken") }, function (data, status) {
            console.log(status);
        });
        $(this).hide();
        jocoin += 1
    });

    $(".building_button").click(function () {
        $.post("/time_update_building", { csrfmiddlewaretoken: getCookie("csrftoken"), "building_id": $(this).attr("building_id") },
        function (data, status) {
            if (data.status == 1) {
                $(this).parent().hide();
                reloadPage();
                syncCurrency();
            }
        });
    });
});