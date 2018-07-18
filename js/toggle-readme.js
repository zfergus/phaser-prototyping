/*
Script to hide and show the design docs (#readme) section.
*/

"use strict";

function getqsv(param) {
    var qs = window.location.search.substring(1);
    var v = qs.split('&');
    for (var i = 0; i < v.length; i++) {
        var p = v[i].split('=');
        if (p['0'] == param) {
            return p['1'];
        }
    }
    return null;
}

function updateqs(param, value) {
    var url = '';
    var qs = window.location.search.substring(1);
    // Match regex in middle of string
    if (qs.search(new RegExp(param + "=.*&")) >= 0) {
        qs = qs.replace(new RegExp(param + "=.*&"), param + "=" + value + "&");
    }
    // Match end of string
    else if (qs.search(new RegExp(param + "=.*$")) >= 0) {
        qs = qs.replace(new RegExp(param + "=.*$"), param + "=" + value);
    }
    // New param, add it to the end
    else {
        qs += (qs === "" ? "" : "&") + param + "=" + value;
    }
    var new_url = url + '?' + qs;
    history.replaceState(null, null, new_url);
}

function init_readme_btn() {
    init_btn("readme-btn", "readme");
}

function init_change_log_btn() {
    init_btn("changes-btn", "changes");
}

function init_btn(btnId, elementId) {
    var btn = window.document.getElementById(btnId);
    btn.addEventListener("click", function() {
        this.classList.toggle("active");
        var e = window.document.getElementById(elementId);
        e.style.maxHeight = e.style.maxHeight ? null : "none";
        updateqs(elementId, e.style.maxHeight ? "visible" : "hidden");
    });
    var is_visible = getqsv(elementId);
    if (is_visible === null) {
        updateqs(elementId, "hidden");
    } else if (is_visible === "visible") {
        btn.click.apply(btn);
    }
}