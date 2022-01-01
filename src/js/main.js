'use strict';

let favourites = [];

let seriesResult = [];

let searchedSerie = '';

const apiUrl = 'https://api.jikan.moe/v3/search/anime?q=';


//CREAMOS UNA FUNCION PARA RECOGER LOS DATOS

const getApiData = () => {
    fetch(`${apiUrl}${searchedSerie}`)//servidor de la api abierta
        .then(response => response.json())
        .then(data => {
            seriesResult = data.results;
            console.log(seriesResult);
            paintSeries();
            addListenerCard();
        })

}

//PINTAMOS LOS RESULTADOS DE LA BÚSQUEDA

const resultsSection = document.querySelector(".js-resultsSection");

const getSeriesHtmlCode = (serie) => {
    let htmlCode = `<article class= "card js-cardFavourite">`;
    htmlCode += `<img src = "${serie.image_url}" class= "card__img" alt = "Serie: ${serie.title}">`
    htmlCode += `<h3 class= "serie_title"> ${serie.title}</h3 >`;
    htmlCode += `</article>`;
    return htmlCode;

}
const paintSeries = () => {
    let seriesCode = '';
    for (const serie of seriesResult) {
        seriesCode += getSeriesHtmlCode(serie);
    }
    resultsSection.innerHTML += seriesCode;
}





//Listening to buttons

const inputBox = document.querySelector('.js-input_search');

//SEARCH
const searchBtn = document.querySelector('.js-button_search')

function handlerSearchBtn() {
    console.log('search');
    searchedSerie = inputBox.value;
    getApiData();

}
searchBtn.addEventListener("click", handlerSearchBtn);

//Escoger favoritos

const favouriteSection = document.querySelector('.js-favouriteSection');

function addFavouriteCard() {
    if (favourites.indexOf(this.innerHTML) === -1) {
        favourites.push(this.innerHTML);

    } else {
        console.log('ya está');
    }
    paintFavouriteCard();
    addBorderTo();
}


function paintFavouriteCard() {
    favouriteSection.innerHTML = '<h2>Favoritos</h2>';
    for (let i = 0; i < favourites.length; i++) {
        favouriteSection.innerHTML += favourites[i];
        favouriteSection.innerHTML += '<input class="button" type="button" value="X" onclick="deleteFavourite(' + i + ')"/>';
    }

}

function addBorderTo() {
    document.querySelectorAll('.js-cardFavourite').style.border = '2px solid red';
}

//Borrar favoritos

function deleteFavourite(index) {
    favourites.splice(index, 1);
    paintFavouriteCard();
}

function addListenerCard() {
    const allListeners = document.querySelectorAll('.js-cardFavourite');
    for (const listener of allListeners) {
        listener.addEventListener("click", addFavouriteCard);
    }
}




//RESET
const resetBtn = document.querySelector('.js-resetBtn')

function handlerResetBtn() {
    console.log('click');
    inputBox.value = '';
    resultsSection.innerHTML = '<h2>Resultados</h2>';

}

resetBtn.addEventListener("click", handlerResetBtn);


//LOCAL STORAGE

const setInLocalStorage = () => {
    const stringifyFavourites = JSON.stringify(favourites);
    localStorage.setItem('favourites', stringifyFavourites);
};


//EJECUTAR LA FUNCIÓN
// getApiData(); si lo escribo aquí me da error en la consola