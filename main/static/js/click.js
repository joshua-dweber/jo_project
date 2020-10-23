$(document).ready(function() {
    var usd = 0;
    var increaseRate = 1;
    var clicks = 0;
    var randy_1 = Math.random() * 80;
    var randy_2 = Math.random() * 80;
    
    $("#clicker").click(function () {
        clicks++;
        updateCurrency();
        randy_1 = Math.random() * 80;
        randy_2 = Math.random() * 80;
        document.querySelector('#clicker').style.setProperty('--r-margin', 'auto auto '+ randy_1+'% '+ randy_2+'%');
        console.log(randy_1, randy_2);
    });

    updateSyncCurrency();
    reloadPage();

    function updateSyncCurrency() {
        syncCurrency(empty);
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

    function empty() { return undefined; }; 

    function reloadPage() {
        $.post("/page_reload_click", { csrfmiddlewaretoken: getCookie("csrftoken") }, function (data, status) {
            console.log(data);
            if (data.buildings) {
                $("#buildings").html("");
                for (var i = 0; i < data.buildings.length; i++) {
                    $("#buildings").append(`<div id="bld${data.buildings[i].building_id}" building_id="${data.buildings[i].building_id}">
                        <h1>${data.buildings[i].name}</h1>
                        <p>${data.click_buildings[data.buildings[i].building_id].desc}</p>
                    </div>`);
                    for (var j = 0; j < 5; j++) {
                        $(`#bld${data.buildings[i].building_id}`).append(`<button class="upgrade" id="buy_upgrade${j}${data.buildings[i].building_id}" upgrade_id="${j}" is_bought=0>${data.click_upgrades[j].desc}. It costs ${data.click_upgrades[j].cost * data.click_buildings[data.buildings[i].building_id].cost}</button><br>`);
                    }
                    for (var j = 0; j < data.buildings[i].upgrade_ids.length; j++) {
                        $(`#buy_upgrade${data.buildings[i].upgrade_ids[j]}${data.buildings[i].building_id}`).attr("is_bought", 1);
                        $(`#buy_upgrade${data.buildings[i].upgrade_ids[j]}${data.buildings[i].building_id}`).hide();
                    }
                    $(`#buy_bld${data.buildings[i].building_id}`).attr("is_bought", 1);
                }
            }
            usd = parseFloat(data.usd);
            $(".upgrade").click(function () {
                upgrade = $(this)
                syncCurrency(postUpdateUpgrade, upgrade);
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
    };

    function syncCurrency(callback, ...args) {
        $.post("/click_update_currency", { csrfmiddlewaretoken: getCookie("csrftoken"), "clicks": clicks }, function (data, status) {
            usd = parseFloat(data.usd);
            increaseRate = parseFloat(data.increase_rate);
            if (data.status == 0) {
                $("body").html(data.error);
                return callback(args);
            }
            $('#count').html(usd.toFixed(1));
            $("title").html(`Click (${parseInt(usd.toFixed(1))})`);
            console.log("synced");
            clicks = 0;
            callback(args);
        });
    };

    function postUpdateUpgrade(args) {
        $.post("/click_update_upgrade", { csrfmiddlewaretoken: getCookie("csrftoken"), "building_id": args[0].parent().attr("building_id"), "upgrade_id": args[0].attr("upgrade_id") },
            function (data, status) {
                if (data.status == 1) {
                    args[0].hide();
                    syncCurrency(empty);
                    reloadPage();
                } else {
                    console.log(data.error);
                }
            });
    }

    function postUpdateBuilding(args) {
        $.post("/click_update_building", { csrfmiddlewaretoken: getCookie("csrftoken"), "building_id": args[0].attr("building_id") },
            function (data, status) {
                if (data.status == 1) {
                    args[0].parent().hide();
                    syncCurrency(empty);
                    reloadPage();
                } else {
                    console.log(data.error);
                }
            });
    }

    $(".building_button").click(function () {
        building = $(this);
        syncCurrency(postUpdateBuilding, building);
    });
});