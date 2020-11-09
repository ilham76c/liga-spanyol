document.addEventListener("DOMContentLoaded", function() {
    // var d = new Date('03292014'.replace(
    //     /(\d\d)(\d\d)(\d\d\d\d)/, '$3-$1-$2'
    // ));
    // console.log(d);
    let page = window.location.hash.substr(1);
    if (page == "") page = "match";

    var elems = document.querySelectorAll(".sidenav");
    M.Sidenav.init(elems);    

    loadPage(page);
    function loadPage(page) {
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4) {
                let content = document.querySelector("#body-content");

                if (page === "match") {
                    getMatches();
                } else if (page === "saved") {
                    getSavedMatches();                    
                } else if (page === "standing") {
                    getStandings();
                }

                if (this.status == 200) {
                    content.innerHTML = xhttp.responseText;
                } else if (this.status == 404) {
                    content.innerHTML = "<p>Halaman tidak ditemukan..</p>";
                } else {
                    content.innerHTML = "<p>Upss.. Halaman tidak dapat diakses..";
                }
            }
        };
        xhttp.open("GET", "../pages/" + page + ".html", true);
        xhttp.send();
    }

    loadNav();
    function loadNav() {
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4) {
                if (this.status != 200) return;

                document.querySelectorAll(".topnav, .sidenav").forEach(function(elm) {
                    elm.innerHTML = xhttp.responseText;
                });
                document.querySelectorAll("nav li > a").forEach(function(elm) {
                    elm.addEventListener("click", function(event) {

                        // Tutup sidenav
                        var sidenav = document.querySelector(".sidenav");
                        M.Sidenav.getInstance(sidenav).close();

                        removeClass(page);
                        page = event.target.getAttribute("href").substr(1);
                        loadPage(page);
                        addClass(page);
                    });
                });
            }    
        };     
        xhttp.open("GET", "../nav.html", true);
        xhttp.send();
    }
    function addClass(id) {
        let element = document.getElementById(id);
        if (element !== null) {
            element.classList.add("active");    
        }        
    } 
    function removeClass(id) { 
        let element = document.getElementById(id);
        if (element !== null) {            
            element.classList.remove("active");
        }
    }
});