/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var displaylang;
var flagConsole = false,
	battery = navigator.battery || navigator.webkitBattery || navigator.mozBattery,
    interval;

function onSuccessCallback(locale) {
	 displaylang = locale.language.slice(0,2);
}

function onErrorCallback(error) {
	console.log("An error occurred " + error.message);
}

function displayWeekDay(date) {
    var str_day = document.getElementById('str_day'),
        get_day = date.getDay(),
        str_allday;
    	switch (displaylang) {
    		case 'fr':
    	        arr_day = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
    	        arr_month = ["Jan", "Fev", "Mar", "Avr", "Mai", "Jui", "Jul","Aou", "Sep", "Oct", "Nov", "Dec" ];
    			break;
    		default:
    	        arr_day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    	        arr_month = ["Jan", "Fab", "Mar", "Apr", "May", "Jul", "Jun","Aug", "Sep", "Oct", "Nov", "Dec" ];
    			break;
    	}
        get_date = date.getDate();
        month = date.getMonth();

    if (get_date < 10) {
        get_date = "0" + get_date;
    }

    str_allday = arr_day[get_day] + " " + get_date + " " + arr_month[month];
    str_day.innerHTML = str_allday;
}

function get24hchrono(i) {
	i = String(i);
	if (i < 10) {
		html = '<div class="n0"></div><div class="n'+i+'"></div>';
	} else {
		html = '<div class="n'+i.charAt(0)+'"></div><div class="n'+i.charAt(1)+'"></div>';
	}
	return html;
}
function displayTime() {
    var str_hours = document.getElementById('str_hours'),
        str_console = document.getElementById('str_console'),
        str_console2 = document.getElementById('str_console2'),
        str_minutes = document.getElementById('str_minutes'),
        str_secondes = document.getElementById('str_secondes'),
        str_ampm = document.getElementById('str_ampm'),
        date;

    try{
        date  = tizen.time.getCurrentDateTime();
    }catch(e) {
        alert(e.message);
    }

    displayWeekDay(date);

    hours = date.getHours();
    str_hours.innerHTML = get24hchrono(date.getHours());
    str_minutes.innerHTML = get24hchrono(date.getMinutes());
    str_seconds.innerHTML = get24hchrono(date.getSeconds());
    
    if (flagConsole) {
        str_console.style.visibility = 'visible';
        str_console2.style.visibility = 'visible';
        flagConsole = false;
    } else {
        str_console.style.visibility = 'hidden';
        str_console2.style.visibility = 'hidden';
        flagConsole = true;
    }
}

function initDigitalWatch() {
    document.getElementsByTagName('body')[0].style.backgroundImage = "url('/images/bg.png')";
    interval = setInterval(displayTime, 500);
}

function ambientDigitalWatch() {
    clearInterval(interval);
    document.getElementsByTagName('body')[0].style.backgroundImage = "none";
    displayTime();
    document.getElementById('str_console').style.visibility = 'visible';
}

function getBatteryState() {
    var battery_level = Math.floor(battery.level * 10),
        battery_fill = document.getElementById('battery_fill');

    battery_level = battery_level + 1;
    battery_fill.style.width = battery_level + "%";

}

function bindEvents() {
    battery.addEventListener('chargingchange', getBatteryState);
    battery.addEventListener('chargingtimechange', getBatteryState);
    battery.addEventListener('dischargingtimechange', getBatteryState);
    battery.addEventListener('levelchange', getBatteryState);

    // add eventListener for timetick
    window.addEventListener('timetick', function() {
        ambientDigitalWatch();
    });

    // add eventListener for ambientmodechanged
    window.addEventListener('ambientmodechanged', function(e) {
        console.log("ambientmodechanged : " + e.detail.ambientMode);
        if (e.detail.ambientMode === true) {
            // rendering ambient mode case
            ambientDigitalWatch();

        } else {
            // rendering normal case
            initDigitalWatch();
        }
    });
}

window.onload = function() {
	tizen.systeminfo.getPropertyValue("LOCALE",onSuccessCallback,onErrorCallback);
    document.addEventListener('tizenhwkey', function(e) {
        if (e.keyName === "back") {
            try {
                tizen.application.getCurrentApplication().exit();
            } catch (ignore) {}
        }
    });
    displayTime();
    initDigitalWatch();
    bindEvents();
};