$(document).ready(function() {
    var jocoin = 0;
    var increaseRate = 0;

    updateSyncCurrency();
    updateCurrency();
    reloadPage();

    function updateSyncCurrency() {
        syncCurrency(empty);
        setTimeout(updateSyncCurrency, 30000);
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
        $.post("/page_reload_time", { csrfmiddlewaretoken: getCookie("csrftoken") }, function (data, status) {
            console.log(data);
            if (data.buildings) {
                $("#bought_buildings").html("");
                $("#bought_buildings").append("<span>Owned Buildings</span>");
                for (var i = 0; i < data.buildings.length; i++) {
                    $("#bought_buildings").append(`<div id="bld${data.buildings[i].building_id}" class="blding" building_id="${data.buildings[i].building_id}">
                        <h1>${data.buildings[i].name}</h1>
                        <p>${data.time_buildings[data.buildings[i].building_id].desc}</p>
                        </div>`);
                    for (var j = 0; j < 5; j++) {
                        $(`#bld${data.buildings[i].building_id}`).append(`<button class="upgrade" id="buy_upgrade${j}${data.buildings[i].building_id}" upgrade_id="${j}" is_bought=0>${data.time_upgrades[j].desc}. (costs ${data.time_upgrades[j].cost * data.time_buildings[data.buildings[i].building_id].cost})</button>`);
                    }
                    for (var j = 0; j < data.buildings[i].upgrade_ids.length; j++) {
                        $(`#buy_upgrade${data.buildings[i].upgrade_ids[j]}${data.buildings[i].building_id}`).attr("is_bought", 1);
                        $(`#buy_upgrade${data.buildings[i].upgrade_ids[j]}${data.buildings[i].building_id}`).hide();
                    }
                    $(`#buy_bld${data.buildings[i].building_id}`).attr("is_bought", 1);
                }
            }
            jocoin = parseFloat(data.jocoin);
            $(".upgrade").click(function () {
                upgrade = $(this);
                syncCurrency(postUpdateUpgrade, upgrade);
            });
        });
    }
    
    function updateCurrency() {
        jocoin += increaseRate;
        $('#count').html(`Coin: ${jocoin.toFixed(1)}`);
        if (jocoin >= 1 && ($("#buy_bld0").attr("is_bought") == 0)) {
            $("#buy_bld0").parent().addClass("available");
        } else {
            $("#buy_bld0").parent().removeClass("available");
            $("#buy_bld0").disabled = true;
        }
        if (jocoin >= 1000 && ($("#buy_bld1").attr("is_bought") == 0)) {
            $("#buy_bld1").parent().addClass("available");
        } else {
            $("#buy_bld1").parent().removeClass("available");
            $("#buy_bld1").disabled = true;
        }
        if (jocoin >= 10000 && ($("#buy_bld2").attr("is_bought") == 0)) {
            $("#buy_bld2").parent().addClass("available");
        } else {
            $("#buy_bld2").parent().removeClass("available");
            $("#buy_bld2").disabled = true;
        }
        if (jocoin >= 100000 && ($("#buy_bld3").attr("is_bought") == 0)) {
            $("#buy_bld3").parent().addClass("available");
        } else {
            $("#buy_bld3").parent().removeClass("available");
            $("#buy_bld3").disabled = true;
        }
        if (jocoin >= 1000000 && ($("#buy_bld4").attr("is_bought") == 0)) {
            $("#buy_bld4").parent().addClass("available");
        } else {
            $("#buy_bld4").parent().removeClass("available");
            $("#buy_bld4").disabled = true;
        }
        setTimeout(updateCurrency, 100);
    };
    
    function syncCurrency(callback, ...args) {
        $.post("/time_update_currency", { csrfmiddlewaretoken: getCookie("csrftoken") }, function (data, status) {
            jocoin = parseFloat(data.jocoin);
            increaseRate = parseFloat(data.increase_rate);
            $('#count').html(`Coin: ${jocoin.toFixed(1)}`);
            $("title").html(`Time (${parseInt(jocoin.toFixed(1))})`);
            console.log("synced");
            callback(args);
        });
    };
    
    function postUpdateUpgrade(args) {
        $.post("/time_update_upgrade", { csrfmiddlewaretoken: getCookie("csrftoken"), "building_id": args[0].parent().attr("building_id"), "upgrade_id": args[0].attr("upgrade_id") },
            function (data, status) {
                if (data.status == 1) {
                    syncCurrency(empty);
                    reloadPage();
                } else {
                    console.log(data.error);
                }
            });
    }

    function postUpdateBuilding(args) {
        $.post("/time_update_building", { csrfmiddlewaretoken: getCookie("csrftoken"), "building_id": args[0].attr("building_id") },
            function (data, status) {
                if (data.status == 1) {
                    syncCurrency(empty);
                    reloadPage();
                } else {
                    console.log(data.error);
                }
            });
        
    }

    if ($("#begin").length) {
        $("#counter").hide();
    }

    $("#begin").click(function () {
        $.post("/begin", { csrfmiddlewaretoken: getCookie("csrftoken") }, function (data, status) {
            console.log(status);
        });
        $(this).hide();
        $("#counter").show();
        jocoin += 1;
        $('#count').html(`Coin: ${jocoin.toFixed(1)}`);
    });
    
    $(".building_button").click(function () {
        building = $(this);
        syncCurrency(postUpdateBuilding, building);
    });
});