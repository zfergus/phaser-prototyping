function init_readme_btn(){
    var btn = window.document.getElementById("readme-btn");

    btn.addEventListener("click", function() {
        this.classList.toggle("active");
        var readme = window.document.getElementById("readme");
        if (readme.style.maxHeight) {
            readme.style.maxHeight = null;
        } else {
            readme.style.maxHeight = "none";
        }
    });
}
