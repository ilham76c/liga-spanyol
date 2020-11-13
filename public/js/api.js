var base_url = "https://api.football-data.org/v2/";

const header = {     
    'X-Auth-Token': '89d8558f7fef4854b05735ea59829932'
};

// blok kode yang akan dipanggil jika fetch berhasil
function status(response) {
    
    if (response.status !== 200) {
        // console.log(response);
        console.log("Error : " + response.status);
        // Method reject() akan membuat blok catch terpanggil
        return Promise.reject(new Error(response.statusText));
    } else {
        // Mengubah suatu objek menjadi Promise agar bisa "di-then-kan"
        return Promise.resolve(response);        
    }
}

// blok kode untuk memparsing json menjadi array Javacript
function json(response) {
    return response.json();
}

// blok kode untuk meng-handle kesalahan di blok catch
function error(error) {
    let body_content = document.getElementById("body-content");
    body_content.innerHTML = `    
    <br>
    <div class="container text-white text-center pt-5">
        <p>
            Data match tidak tersedia untuk sementara.
            <br>
            Cobalah memuat ulang halaman ini atau coba lagi nanti.
        </p>
    </div> 
    `;    
    console.error("Error : " + error);
}

function getMatches() {
    if ("caches" in window) {
        caches.match(base_url + "competitions/2014/matches?status=SCHEDULED")
            .then(function(response) {
                if (response) {
                    response.json().then(function(data) {

                        let articleHTML = "";                        
                        data.matches.forEach(function(match) {                               
                            articleHTML += renderMatch(match);                                                     
                        });
                        // Sisipkan komponen card ke dalam elemen dengan id #content
                        document.getElementById("matches").innerHTML = articleHTML;
                    });
                } else {
                    fetch(base_url + "competitions/2014/matches?status=SCHEDULED", {
                        headers: header                        
                    })
                    .then(status)
                    .then(json)
                    .then(function(data) {                            
                        let articleHTML = "";
                        data.matches.forEach(function(match) {                            
                            articleHTML += renderMatch(match);                                         
                        });
                        document.getElementById("matches").innerHTML = articleHTML;            
                    });
                }                
            })
            .catch(error);            
    }     
}



function getMatchesById() {
    return new Promise(function(resolve, reject) {
        let url_params = new URLSearchParams(window.location.search);
        let id_param = url_params.get("id");

        if ("caches" in window) {
            caches.match(base_url + "matches/" + id_param)
                .then(function(response) {
                    if (response) {
                        response.json().then(function(data) {                            
                            // Sisipkan komponen ke dalam elemen dengan id #body-content
                            document.getElementById("body-content").innerHTML = renderMatchById(data.match);
                            // Kirim objek data hasil parsing json agar bisa disimpan ke indexed db
                            resolve(data);
                        });
                    } 
                });
        } 

        fetch(base_url + "matches/" + id_param, {            
            headers: header
            // mode: 'no-cors'
            // credentials: 'include'
        })
        .then(status)
        .then(json)
        .then(function(data) {                                    
            document.getElementById("body-content").innerHTML = renderMatchById(data.match);
            resolve(data);
        })
        .catch(error);
    });
}


function getSavedMatches() {
    getAll().then(function(matches) {
        let articleHTML = '';
        
        if (matches.length !== 0) {
            matches.forEach(function(data) {                        
                articleHTML += renderSavedMatches(data.match);            
            });              
        } else {
            articleHTML = `
            <div class="container text-white text-center">
                <h5>Tidak ada match yang tersimpan.</h5>
            </div>    
            `;
        }
        
        // Sisipkan komponen card ke dalam elemen dengan id #body-content
        document.getElementById("body-content").innerHTML = articleHTML;
    });
}

function getStandings() {
    if ("caches" in window) {
        caches.match(base_url + "competitions/2014/standings")
        .then(function(response) {
                if (response) {
                    response.json().then(function(data) {                        
                        let articleHTML = "";                        
                        data.standings[0].table.forEach(function(standing) {   
                            // console.log(article);                            
                            articleHTML += renderStanding(standing);                                                    
                        });                
                        // Sisipkan komponen card ke dalam elemen dengan id #standings
                        document.getElementById("standings").innerHTML = renderStandingTable(articleHTML);
                    });
                } else {
                    fetch(base_url + "competitions/2014/standings", {
                        headers: header                        
                    })
                    .then(status)
                    .then(json)
                    .then(function(data) {                           
                        let articleHTML = "";
                        data.standings[0].table.forEach(function(standing) { 
                            articleHTML += renderStanding(standing);                       
                        });                       
                        // Sisipkan komponen card ke dalam elemen dengan id #standings
                        document.getElementById("standings").innerHTML = renderStandingTable(articleHTML);
                    });
                }                
            })
            .catch(error);            
    } 
}

function renderSavedMatches(match) {
    let tgl = match.utcDate.split("T");
    return `
        <div class="mx-4 row white yrav-min-w-fit">
            <div class="col s12 m12 l4 yrav-min-w-fit">
            <div class="row valign-wrapper">
                    <div class="col s4 m6 l4 text-center">
                        <p class="mb-0">
                            <b>
                            ${tgl[0]}
                                <br>
                                ${tgl[1].substr(0,5)}
                            </b>
                        </p>
                    </div>
                    <div class="col l4 text-center">
                        <img src="img/laliga.png" alt="logo" style="max-height: 30px;">
                    </div>
                    <div class="col s4 m6 l4 text-center">
                        <p class="mb-0">
                            <b> 
                                Matchday ${match.matchday}
                                <br>
                                HOME
                            </b>
                        </p>
                    </div>
                </div>
            </div>
            <a href="match.html?saved=true&id=${match.id}" style="text-decoration: none; color: black;">
            <div class="col s12 m12 l8">
                <div class="row text-center">
                    <div class="col s5 m5 l5 mt-3">
                        <div class="d-flex justify-content-end flex-wrap-reverse blue pt-1 white">
                            <h6 class="mb-0">
                                <b>${match.homeTeam.name}</b>                                    
                            </h6>
                            <img class="px-1" src="https://crests.football-data.org/${match.homeTeam.id}.svg" alt="logo" style="max-height: 35px;">
                        </div>
                    </div>
                    <div class="col s2 m2 l2">
                        <p class="mb-0 mt-2">
                            <b>VS</b>
                        </p>                          
                    </div>
                    <div class="col s5 m5 l5">
                        <div class="d-flex justify-content-start flex-wrap blue pt-1 white">
                            <img class="px-1" src="https://crests.football-data.org/${match.awayTeam.id}.svg" alt="logo" style="max-height: 35px;">
                            <h6 class="mb-0">
                                <b>${match.awayTeam.name}</b>
                            </h6>
                        </div>                        
                    </div>
                </div>
            </div>
            </a>
        </div>
        `;
}

function getSavedMatchesById() {
    let url_params = new URLSearchParams(window.location.search);
    let id_param = url_params.get("id");
    console.log(id_param);
    getById(id_param).then(function(data) {                    
        let tgl = data.match.utcDate.split("T");
        let articleHTML = `
        <div id="jumbotron" class="container bg-cover text-white">
            <div class="container px-2 d-flex flex-column w-100 h-100 justify-content-center align-items-center">
            <div class="d-flex flex-column justify-content-evenly align-items-center h-50">
                    <div class="d-flex flex-column align-items-center">
                    <img src="img/laliga.png" alt="logo" style="max-height: 40px;">
                        <p>Matchday ${data.match.matchday}</p>
                    </div>

                    <h6 class="mx-auto">
                        <b>${tgl[0]}</b>
                    </h6>
                </div>
                <div class="d-flex w-100 h-50 align-items-start w-100 justify-content-center flex-grow-1">

                    <div class="d-flex align-items-center justify-content-center text-center flex-wrap-reverse flex-item">
                        <h4 class="mx-auto">${data.match.homeTeam.name}</h4>
                        <img class="px-1" src="https://crests.football-data.org/${data.match.homeTeam.id}.svg" alt="logo" style="max-height: 70px;">
                    </div>

                    <div class="d-flex flex-column justify-content-center align-items-center min-w-fit px-1 mt-1">
                        <h6 class="m-0">
                            <b>KICK OFF</b>
                        </h6>
                        <h6>
                            <b>${tgl[1].substr(0,5)}</b>
                        </h6>
                    </div>

                    <div class="d-flex align-items-center justify-content-center text-center flex-wrap flex-item">
                        <img class="px-1" src="https://crests.football-data.org/${data.match.awayTeam.id}.svg" alt="logo" style="max-height: 70px;">
                        <h4 class="mx-auto">${data.match.awayTeam.name}</h4>
                    </div>
                </div>
            </div>
        </div>

        <div class="container">
            <div class="row">
                <div class="d-flex">
                    <ul class="tabs">
                        <li class="tab col s12">
                            <a href="#">Match Information</a>
                        </li>                            
                    </ul>
                </div>
                <div class="col s12 white">
                    <div class="d-flex flex-wrap">                        
                        
                        <div class="card col s12 m6 l3">
                            <div class="card-content">
                                <span class="card-title">HOME TEAM</span>
                                <div class="d-flex align-items-center justify-content-start">
                                    <img class="px-1" src="https://crests.football-data.org/${data.match.homeTeam.id}.svg" alt="logo" style="max-height: 30px;">
                                    <span class="grey-text">${data.match.homeTeam.name}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="card col s12 m6 l3">
                            <div class="card-content black-text">
                                <span class="card-title">AWAY TEAM</span>
                                <div class="d-flex align-items-center justify-content-start">
                                    <img class="px-1" src="https://crests.football-data.org/${data.match.awayTeam.id}.svg" alt="logo" style="max-height: 30px;">
                                    <span class="grey-text">${data.match.awayTeam.name}</span>
                                </div>
                            </div>

                        </div>
                        
                        <div class="card col s12 m6 l3">
                            <div class="card-content">
                                <span class="card-title">REFEREE</span>
                                <p class="grey-text">Valentín Pizarro</p>
                                <p class="grey-text">José Garrido</p>
                                <p class="grey-text">Iván Masso Granado</p>
                            </div>
                        </div>
                        
                        <div class="card col s12 m6 l3">
                            <div class="card-content">
                                <span class="card-title">VENUE</span>
                                <p class="grey-text">${data.match.venue}</p>
                                
                            </div>
                        </div>
                        
                    </div>
                </div>                    
            </div>
        </div>
        `;
        document.getElementById("body-content").innerHTML = articleHTML;
    });
}

function renderMatch(match) {
    let tgl = match.utcDate.split("T");
    return `
        <div class="mx-4 row white yrav-min-w-fit">
            <div class="col s12 m12 l4 yrav-min-w-fit">
                <div class="row valign-wrapper">
                    <div class="col s4 m6 l4 text-center">
                        <p class="mb-0">
                            <b>
                                ${tgl[0]}
                                <br>
                                ${tgl[1].substr(0,5)}
                            </b>
                        </p>
                    </div>
                    <div class="col l4 text-center">
                        <img src="img/laliga.png" alt="logo" style="max-height: 30px;">
                    </div>
                    <div class="col s4 m6 l4 text-center">
                        <p class="mb-0">
                            <b> 
                                Matchday ${match.matchday}                             
                            </b>
                        </p>
                    </div>
                </div>
            </div>
            <a href="match.html?id=${match.id}" style="text-decoration: none; color: black;">
            <div class="col s12 m12 l8">
                <div class="row text-center">
                    <div class="col s5 m5 l5 mt-3">
                        <div class="d-flex justify-content-end flex-wrap-reverse blue pt-1 white">
                            <h6 class="mb-0">
                                <b>${match.homeTeam.name}</b>                                    
                            </h6>
                            <img class="px-1" src="https://crests.football-data.org/${match.homeTeam.id}.svg" alt="logo" style="max-height: 35px;">                                
                        </div>
                    </div>
                    <div class="col s2 m2 l2">
                        <p class="mb-0 mt-2">
                            <b>VS</b>
                        </p>                          
                    </div>
                    <div class="col s5 m5 l5">
                        <div class="d-flex justify-content-start flex-wrap blue pt-1 white">
                            <img class="px-1" src="https://crests.football-data.org/${match.awayTeam.id}.svg" alt="logo" style="max-height: 35px;">
                            <h6 class="mb-0">
                                <b>${match.awayTeam.name}</b>
                            </h6>
                        </div>                        
                    </div>
                </div>
            </div>
            </a>
        </div>  
        `;
}

function renderStanding(standing) {
    let form = standing.form.split(",");
    return `                               
    <tr>
    <td>
            <h6 class="m-auto">
                <b>${standing.position}</b>
            </h6>
        </td>
        <td class="d-flex align-items-center"><img src="https://crests.football-data.org/${standing.team.id}.svg" alt="logo" style="max-height: 30px;"></td>
        <td class="text-left"><b>${standing.team.name}</b></td>
        <td class="text-center">
            <b>${standing.points}</b>
        </td>
        <td>${standing.playedGames}</td>
        <td>${standing.won}</td>
        <td>${standing.draw}</td>
        <td>${standing.lost}</td>
        <td>${standing.goalsFor}</td>
        <td>${standing.goalsAgainst}</td>                                
        <td>${standing.goalDifference}</td>
        <td class="text-center">
            <img src="img/${form[0]}.png" style="max-height: 15px;">
            <img src="img/${form[1]}.png" style="max-height: 15px;">
            <img src="img/${form[2]}.png" style="max-height: 15px;">
            <img src="img/${form[3]}.png" style="max-height: 15px;">
            <img src="img/${form[4]}.png" style="max-height: 15px;">
        </td>
    </tr>                                                                                                                    
    `;
}

function renderMatchById(match) {
    let tgl = match.utcDate.split("T");
    return `
        <div id="jumbotron" class="container bg-cover text-white py-1">
            <div class="container px-2 d-flex flex-column w-100 h-100 justify-content-center align-items-center">
                <div class="d-flex flex-column justify-content-evenly align-items-center h-50">
                    <div class="d-flex flex-column align-items-center">
                        <img src="img/laliga.png" alt="logo" style="max-height: 40px;">
                        <p>Matchday ${match.matchday}</p>
                    </div>

                    <h6 class="mx-auto">
                        <b>${tgl[0]}</b>
                    </h6>
                </div>
                <div class="d-flex w-100 h-50 align-items-start w-100 justify-content-center flex-grow-1">

                    <div class="d-flex align-items-center justify-content-center text-center flex-wrap-reverse flex-item">
                        <h4 class="mx-auto flow-text">${match.homeTeam.name}</h4>
                        <img class="px-1" src="https://crests.football-data.org/${match.homeTeam.id}.svg" alt="logo" style="max-height: 70px;">
                    </div>

                    <div class="d-flex flex-column justify-content-center align-items-center min-w-fit px-1 mt-1">
                        <h6 class="m-0">
                            <b>KICK OFF</b>
                        </h6>
                        <h6>
                            <b>${tgl[1].substr(0,5)}</b>
                        </h6>
                    </div>

                    <div class="d-flex align-items-center justify-content-center text-center flex-wrap flex-item">
                        <img class="px-1" src="https://crests.football-data.org/${match.awayTeam.id}.svg" alt="logo" style="max-height: 70px;">
                        <h4 class="mx-auto flow-text">${match.awayTeam.name}</h4>
                    </div>
                </div>
            </div>
        </div>

        <div class="container">
            <div class="row">
                <div class="d-flex">
                    <ul class="tabs">
                        <li class="tab col s12">
                            <a href="#">Match Information</a>
                        </li>                            
                    </ul>
                </div>
                <div class="col s12 white">
                    <div class="d-flex flex-wrap">                        
                        
                        <div class="card col s12 m6 l3">
                            <div class="card-content">
                                <span class="card-title">HOME TEAM</span>
                                <div class="d-flex align-items-center justify-content-start">
                                    <img class="px-1" src="https://crests.football-data.org/${match.homeTeam.id}.svg" alt="logo" style="max-height: 30px;">
                                    <span class="grey-text">${match.homeTeam.name}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="card col s12 m6 l3">
                            <div class="card-content black-text">
                                <span class="card-title">AWAY TEAM</span>
                                <div class="d-flex align-items-center justify-content-start">
                                    <img class="px-1" src="https://crests.football-data.org/${match.awayTeam.id}.svg" alt="logo" style="max-height: 30px;">
                                    <span class="grey-text">${match.awayTeam.name}</span>
                                </div>
                            </div>

                        </div>
                        
                        <div class="card col s12 m6 l3">
                            <div class="card-content">
                                <span class="card-title">REFEREE</span>
                                <p class="grey-text">Valentín Pizarro</p>
                                <p class="grey-text">José Garrido</p>
                                <p class="grey-text">Iván Masso Granado</p>
                            </div>
                        </div>
                        
                        <div class="card col s12 m6 l3">
                            <div class="card-content">
                                <span class="card-title">VENUE</span>
                                <p class="grey-text">${match.venue}</p>                                
                            </div>
                        </div>
                        
                    </div>
                </div>                    
            </div>
        </div>
        `;
}

function renderStandingTable(standings) {
    return ` 
        <div class="d-flex white p-2">
            <table class="responsive-table">
                <thead>
                    <tr>
                        <th data-toggle="tooltip" data-placement="top" title="Position">Pos</th>
                        <th colspan="2">Team</th>
                        <th class="text-center">Points</th>
                        <th data-toggle="tooltip" data-placement="top" title="Matched Played">M</th>
                        <th data-toggle="tooltip" data-placement="top" title="Wins">W</th>
                        <th data-toggle="tooltip" data-placement="top" title="Draw">D</th>
                        <th data-toggle="tooltip" data-placement="top" title="Losses">L</th>
                        <th data-toggle="tooltip" data-placement="top" title="Goals For">GF</th>
                        <th data-toggle="tooltip" data-placement="top" title="Goals Against">GA</th>
                        <th data-toggle="tooltip" data-placement="top" title="Goal Difference">GD</th>
                        <th class="text-center">Form</th>
                    </tr>
                </thead>
                <tbody>
                    ${standings}
                </tbody>
            </table>
        </div>
        `;
}