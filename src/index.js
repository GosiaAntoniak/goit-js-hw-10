import './css/styles.css';
import _debounce from 'lodash.debounce';
import { Notify } from 'notiflix';
import fetchCountries from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const searchBox = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

searchBox.addEventListener('input', _debounce(inputListener, DEBOUNCE_DELAY));

function inputListener(event) {
  countryList.innerHTML = null;
  countryInfo.innerHTML = null;
  const searchValue = event.target.value;
  if (searchValue.length > 0) {
    fetchAndRenderCountries(searchValue);
  }
}

function createBackButton(searchValue) {
  const backButton = document.createElement('button');
  backButton.textContent = 'Cofnij';
  backButton.classList.add('back-btn');
  countryList.prepend(backButton);
  backButton.addEventListener('click', () => {
    countryList.innerHTML = null;
    countryInfo.innerHTML = null;
    fetchAndRenderCountries(searchValue);
  });
}

function fetchAndRenderCountries(searchValue) {
  fetchCountries(searchValue)
    .then((searchResult) => {
      renderCountryList(searchResult);
      const items = document.querySelectorAll('.country-list__item');
      items.forEach((item) => item.addEventListener('click', (event) => {
        const name = item.querySelector('#countryName').innerHTML;
        const foundedName = searchResult.find(exact => exact.name === name);
        getMoreInfo(foundedName);
        createBackButton(searchValue);
      }));
    })
    .catch((error) => {
      console.log(error);
      Notify.failure('Oops, there is no country with that name');
    });
}


function renderCountryList(countries) {
  if (countries.length >= 2 && countries.length <= 10) {

    countryList.innerHTML = null;
    countryInfo.innerHTML = null;
    const markup = countries.map((country) => {
      const markupText = `<li class='name country-list__item'><img src='${country.flags.svg}' class='name__img'><p id='countryName'>${country.name}</p></li>`;
      return markupText;
    }).join(' ');
    const markupReplaced = markup.replaceAll('undefined', '');
    countryList.innerHTML = markupReplaced;

  } else if (countries.length === 1) {

    countryList.innerHTML = null;
    const markup = countries.map((country) => {
      const parsedLanguages = country.languages.map(lang => lang.name).join(', ');
      return `<ul class='country-info__list'>
      <li class='name'><img src='${country.flags.svg}' class='name__img' alt='Flag of ${country.name}'><p class='country-info__name'><b>${country.name}</b></p></li>
      <li class='country-info__item'><b>Capital:</b> ${country.capital}</li>
      <li class='country-info__item'><b>Population:</b> ${country.population}</li>
      <li class='country-info__item'><b>Languages:</b> ${parsedLanguages}</li></ul>`;
    }).join(' ');
    const markupReplaced = markup.replaceAll('undefined', '');
    countryInfo.innerHTML = markupReplaced;
  }
}


function getMoreInfo(country) {
  console.log(country);
  countryList.innerHTML = null;
  const parsedLanguages = country.languages.map(lang => lang.name).join(', ');
  const markup = `<ul class='country-info__list'>
      <li class='name'><img src='${country.flags.svg}' class='name__img' alt='Flag of ${country.name}'><p class='country-info__name'><b>${country.name}</b></p></li>
      <li class='country-info__item'><b>Capital:</b> ${country.capital}</li>
      <li class='country-info__item'><b>Population:</b> ${country.population}</li>
      <li class='country-info__item'><b>Languages:</b> ${parsedLanguages}</li></ul>`;
  const markupReplaced = markup.replaceAll('undefined', '');
  return countryInfo.innerHTML = markupReplaced;
}




