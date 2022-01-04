'use strict';

let favourites = [];

let seriesResult = [];

let searchedSerie = '';

const apiUrl = 'https://api.jikan.moe/v3/search/anime?q=';


//CREAMOS UNA FUNCION PARA RECOGER LOS DATOS

const getApiData = () => {
    fetch(`${apiUrl}${searchedSerie}`)//servidor de la api abierta y escuchar lo que ha escrito la usuaria
        .then(response => response.json())
        .then(data => {
            seriesResult = data.results;//guardamos en seriesResult los datos recibidos de la api
            console.log(seriesResult);
            paintSeries();
            addListenerCard()
        })

}

//PINTAMOS LOS RESULTADOS DE LA BÚSQUEDA

const resultsSection = document.querySelector(".js-resultsSection");
const getSeriesHtmlCode = (serie) =>//esta función crea el html para organizar los resultados dentro de tarjetas.
{
    let htmlCode = `<article class= "card js-cardFavourite ">`;
    htmlCode += `<img src = "${serie.image_url}" class= "card__img" alt = "Serie: ${serie.title}" data-id="${serie.mal_id}">`
    htmlCode += `<h3 class= "serie_title"> ${serie.title}</h3 >`;
    htmlCode += `</article>`;

    return htmlCode;

}
const paintSeries = () => {
    let seriesCode = '';
    /*const clickedSerie = parseInt(ev.target.dataset.id);*/
    for (const serie of seriesResult) {
        /*if (favourites.indexOf(clickedSerie)) {
            console.log('funciona el indexof');*/
        seriesCode += getSeriesHtmlCode(serie);

    }
    resultsSection.innerHTML += seriesCode;
}





//Listening to buttons

const inputBox = document.querySelector('.js-input_search');

//SEARCH
const searchBtn = document.querySelector('.js-button_search')

function handlerSearchBtn() {
    searchedSerie = inputBox.value;
    getApiData();
    addListenerCard();
};
searchBtn.addEventListener('click', handlerSearchBtn);


//Escoger favoritos

const favouriteSection = document.querySelector('.js-favouriteSection');

function addListenerCard() {
    const allListeners = document.querySelectorAll('.js-cardFavourite');
    for (const listener of allListeners) {
        listener.addEventListener("click", addFavouriteSerie);
    }
};


const addFavouriteSerie = ev => {
    const clickedSerie = parseInt(ev.target.dataset.id);

    let foundFavourite;
    for (const favourite of favourites) {
        if (favourite.id === clickedSerie) {
            foundFavourite = favourite;
        }
    }

    if (foundFavourite === undefined) {
        //Busco la serie clicada
        let foundSerie;
        for (const serie of seriesResult) {

            if (serie.mal_id === clickedSerie) {
                foundSerie = serie;
            }
        }
        // Añado la serie a la columna de favoritos
        favourites.push({
            id: foundSerie.mal_id,
            title: foundSerie.title,
            image_url: foundSerie.image_url,
        });

    } else {
        console.log('esta repetido', foundFavourite);
    }
    setInLocalStorage();
    paintFavouriteCard();
};


const getFavouritesHtmlCode = (favourite) => {
    let htmlCodeFavourite = `<article class= "favourite-card js-cardFavourite ">`;
    htmlCodeFavourite += `<img src = "${favourite.image_url}" class= "card__img" alt = "Serie: ${favourite.title}" data-id="${favourite.id}">`
    htmlCodeFavourite += `<h3 class= "serie_title"> ${favourite.title}</h3 >`;
    htmlCodeFavourite += `<input type="button" class="js-remove" value="X" data-id="${favourite.id}">`;
    htmlCodeFavourite += `</article>`;

    return htmlCodeFavourite;

}


function paintFavouriteCard() {
    let favouriteCode = '';
    if (favourites.length === 0) {
        favouriteSection.innerHTML = '<h2>Favoritos</h2>';
    } else {
        for (const favourite of favourites) {
            favouriteCode += getFavouritesHtmlCode(favourite);

            favouriteSection.innerHTML = '<h2>Favoritos</h2>';

            favouriteSection.innerHTML += favouriteCode;

        }
    }
    addListenerRemoveBtn();
}
/*Resaltar favorito

Element.classList.add("border-favourite");*/

//Borrar favoritos


function handleDeleteFavourite(event) {
    //Obtener el id de la serie clicada
    const clickedFavourite = event.target.dataset.id;
    console.log(favourites.length);
    if (favourites.length === 1) {
        favourites.splice(0, 1);

    } else {
        for (let index = 0; index < favourites.length; index++) {
            console.log(favourites[index].id)
            if (clickedFavourite == favourites[index].id) {

                favourites.splice(index, 1);
            }
        }
    }

    paintFavouriteCard();
};

function addListenerRemoveBtn() {
    const allListenersRemoveBtn = document.querySelectorAll('.js-remove');
    for (const listenerRemoveBtn of allListenersRemoveBtn) {
        listenerRemoveBtn.addEventListener("click", handleDeleteFavourite);

    }
    console.log('click en borrar');
};


//RESET
const resetBtn = document.querySelector('.js-resetBtn')

function handlerResetBtn(event) {
    event.preventDefault();
    inputBox.value = '';
    resultsSection.innerHTML = '<h2>Resultados</h2>';

}

resetBtn.addEventListener("click", handlerResetBtn);


//LOCAL STORAGE

const getFromLocalStorage = () => {
    const localStorageFavourites = JSON.parse(localStorage.getItem('favourites'));
    if (localStorageFavourites !== null) {
        favourites = localStorageFavourites;
        paintFavouriteCard();
    }
};

const setInLocalStorage = () => {
    const stringifyfavourites = JSON.stringify(favourites);
    localStorage.setItem('favourites', stringifyfavourites);
};

//Ejecutar local storage

getFromLocalStorage();