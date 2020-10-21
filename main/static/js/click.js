$(document).ready(function() {
    var usd = 0;
    var increaseRate = 1;
    var clicks = 0;
    
    $("#clicker").click(function () {
        clicks++;
        updateCurrency();
    });
    updateSyncCurrency();
    reloadPage();

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
        $.post("/page_reload_click", { csrfmiddlewaretoken: getCookie("csrftoken") }, function (data, status) {
            console.log(data);
            if (data.buildings) {
                $("#buildings").html("");
                for (var i = 0; i < data.buildings.length; i++) {
                    $("#buildings").append(`<div id="bld${data.buildings[i].building_id}" building_id="${data.buildings[i].building_id}">
                        <h1>${data.buildings[i].name}</h1>
                        <button class="upgrade" id="buy_upgrade0" upgrade_id="0" is_bought=0>+0.2 per click(costs 10, unlocked at $120)</button>
                        <button class="upgrade" id="buy_upgrade1" upgrade_id="1" is_bought=0>+0.3 per click(costs 12, unlocked at $160)</button>
                        <button class="upgrade" id="buy_upgrade2" upgrade_id="2" is_bought=0>+0.4 per click(costs 15, unlocked at $220)</button>
                        <button class="upgrade" id="buy_upgrade3" upgrade_id="3" is_bought=0>+0.5 per click(costs 25, unlocked at $300)</button>
                        <button class="upgrade" id="buy_upgrade4" upgrade_id="4" is_bought=0>+0.6 per click(costs 50, unlocked at $500)</button>
                    </div>`);
                    for (var j = 0; j < data.buildings[i].upgrade_ids.length; j++) {
                        $(`#buy_upgrade${data.buildings[i].upgrade_ids[j]}`).attr("is_bought", 1);
                        $(`#buy_upgrade${data.buildings[i].upgrade_ids[j]}`).hide();
                    }
                    $(`#buy_bld${i}`).attr("is_bought", 1);
                }
            }
            usd = parseFloat(data.usd);
            $(".upgrade").click(function () {
                upgrade = $(this)
                $.post("/click_update_upgrade", { csrfmiddlewaretoken: getCookie("csrftoken"), "building_id": $(this).parent().attr("building_id"), "upgrade_id": $(this).attr("upgrade_id") },
                    function (data, status) {
                        if (data.status == 1) {
                            upgrade.hide();
                            reloadPage();
                            syncCurrency();
                        }
                    });
            });
        });
    }
    
    function updateCurrency() {
        usd += increaseRate;
        $('#count').html(usd.toFixed(1));
        if (usd >= 10 && ($("#buy_bld0").attr("is_bought") == 0)) {
            $("#buy_bld0").parent().show();
        } else {
            $("#buy_bld0").parent().hide();
        }
        if (usd >= 2500 && ($("#buy_bld1").attr("is_bought") == 0)) {
            $("#buy_bld1").parent().show();
        } else {
            $("#buy_bld1").parent().hide();
        }
        if (usd >= 100000 && ($("#buy_bld2").attr("is_bought") == 0)) {
            $("#buy_bld2").parent().show();
        } else {
            $("#buy_bld2").parent().hide();
        }
        if (usd >= 1000000 && ($("#buy_bld3").attr("is_bought") == 0)) {
            $("#buy_bld3").parent().show();
        } else {
            $("#buy_bld3").parent().hide();
        }
        if (usd >= 10000000 && ($("#buy_bld4").attr("is_bought") == 0)) {
            $("#buy_bld4").parent().show();
        } else {
            $("#buy_bld4").parent().hide();
        }
        if (usd >= 100000000 && ($("#buy_bld5").attr("is_bought") == 0)) {
            $("#buy_bld5").parent().show();
        } else {
            $("#buy_bld5").parent().hide();
        }
    };

    function syncCurrency() {
        $.post("/click_update_currency", { csrfmiddlewaretoken: getCookie("csrftoken"), "clicks": clicks }, function (data, status) {
            usd = parseFloat(data.usd);
            increaseRate = parseFloat(data.increase_rate);
            console.log("synced");
            $('#count').html(usd);
        });
        clicks = 0;
    };

    $(".building_button").click(function () {
        syncCurrency();
        building = $(this);
        $.post("/click_update_building", { csrfmiddlewaretoken: getCookie("csrftoken"), "building_id": $(this).attr("building_id") },
        function (data, status) {
            console.log(data.status);
            if (data.status == 1) {
                building.parent().hide();
                reloadPage();
                syncCurrency();
            }
        });
    });
});