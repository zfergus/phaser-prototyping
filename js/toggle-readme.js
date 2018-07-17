/*
Script to hide and show the design docs (#readme) section.
*/

function init_readme_btn() {
    init_btn("readme-btn", "readme");
}

function init_change_log_btn() {
    init_btn("changes-btn", "changes");
}

function init_btn(btnId, elementId) {
    window.document.getElementById(btnId).addEventListener("click", function() {
        this.classList.toggle("active");
        var e = window.document.getElementById(elementId);
        e.style.maxHeight = e.style.maxHeight ? null : "none";
    });
}