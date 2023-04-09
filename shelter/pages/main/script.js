import pets from '../../assets/json/pets.json' assert { type: 'json' };



const scrollDirectionRight = true;
const scrollDirectionLeft = false;
let scrollInProgress = false;
let cardsNumber = determineCardsNumber();
let currentState = [];
let previousState = {
    pets: [],
    position: null
};

window.addEventListener('load', (event) => {
    scrollPetCards(scrollDirectionRight, true);
})

window.addEventListener('resize', (event) => {
    if (cardsNumber !== determineCardsNumber()) {
        cardsNumber = determineCardsNumber();
        currentState = [];
        previousState.pets = [];
        scrollPetCards(null, true);
    }
})

function determineCardsNumber() {
    let cardsNumber;
    if (window.innerWidth > 1000) {
        cardsNumber = 3;
    } else if ((window.innerWidth >= 768) && (window.innerWidth <= 1000)) {
        cardsNumber = 2;
    } else {
        cardsNumber = 1;
    }
    return cardsNumber;
}

function scrollPetCards(direction, noDelay = false) {
    scrollInProgress = true;

    if (direction === previousState.position && previousState.pets.length) {
        let temp = [...currentState];
        currentState = [...previousState.pets];
        previousState.pets = [...temp];
        previousState.position = !direction;
    } else {
        previousState.pets = [...currentState];
        previousState.position = !direction;
        let filteredPets = pets.filter(pet => {
            return !previousState.pets.find(prevPet => prevPet.name === pet.name);
        });
        currentState = [];
        for (let i = 0; i < cardsNumber; i++) {
            let index = Math.floor(Math.random() * (filteredPets.length - 1));
            currentState.push(filteredPets[index]);
            filteredPets.splice(index, 1);
        }
    }

    let oldPetCard = document.querySelectorAll(".pet-card") || [];
    oldPetCard.forEach(div => {
        div.style.opacity = 0;
    });

    setTimeout(() => {
        oldPetCard.forEach(div => {
            div.remove();
        });
        const template = document.querySelector("#template");
        for (let j = 0; j < currentState.length; j++) {
            let clone = template.content.cloneNode(true);
            clone.querySelector(".pet-name").textContent = currentState[j].name;
            clone.querySelector(".pet-card img").src = currentState[j].img;
            clone.querySelector(".pet-card img").alt = currentState[j].name;
            clone.lastElementChild.style.opacity = noDelay ? 1 : 0;
            document.querySelector(".photo-slider").append(clone);
        }
        setTimeout(() => {
            document.querySelectorAll(".pet-card").forEach(card => card.style.opacity = 1);
            scrollInProgress = false;
        }, 10);
    }, noDelay ? 0 : 500);
}

let leftArrow = document.querySelector(".arrow-icon.left");
let rightArrow = document.querySelector(".arrow-icon.right");

leftArrow.addEventListener("click", (event) => {
    if (!scrollInProgress) {
        scrollPetCards(scrollDirectionLeft);
    };
})

rightArrow.addEventListener("click", (event) => {
    if (!scrollInProgress) {
        scrollPetCards(scrollDirectionRight);
    };
})

let menu = document.getElementById("menu");
let modalCover = document.getElementById("modal-cover");
let menuItems = document.querySelectorAll(".nav-list a");

function toggleMenu() {
    document.getElementById("menu-box").classList.toggle("open");
    menu.classList.toggle("open");
    document.getElementsByTagName("html")[0].classList.toggle("open");
    modalCover.classList.toggle("shadow");
}

menu.addEventListener("click", (event) => {
    toggleMenu();
})

modalCover.addEventListener("click", (event) => {
    toggleMenu();
})

menuItems.forEach(item => {

    item.addEventListener("click", (event) => {
        if (menu.classList.contains("open")) {
            event.preventDefault();
            let linkLocation = event.currentTarget.href;
            toggleMenu();
            setTimeout(() => { window.location = linkLocation; }, 500);
        }
    });

})






/*
console.log(
    '[+] Страница Main (60) \n' +
    '\n' +
    '[+] Проверка верстки +7\n' +
    '\n' +
    '[+] верстка страницы валидная: для проверки валидности вёрстки используйте сервис https://validator.w3.org/ . +4\n' +
    '[+] логотип в хедере состоит из текстовых элементов +1\n' +
    '[+] страница содержит ровно один элемент <h1> +1\n' +
    '[+] добавлен favicon +1\n' +
    '\n' +
    '[+]  Вёрстка соответствует макету +35\n' +
    '\n' +
    '[+] блок <header> +5\n' +
    '[+] блок Not only +5\n' +
    '[+] блок About +5\n' +
    '[+] блок Our Friends +5\n' +
    '[+] блок Help +5\n' +
    '[+] блок In addition +5\n' +
    '[+] блок <footer> +5\n' +
    '\n' +
    '[+] Требования к css +6\n' +
    '\n' +
    '[+] для позиционирования элементов блока Help использована сеточная верстка (flexbox или grid) +2\n' +
    '[+] при уменьшении масштаба страницы браузера или увеличении ширины страницы (>1280px) вёрстка размещается по центру, а не сдвигается в сторону и не растягивается по всей ширине +2\n' +
    '[+] фоновый цвет тянется на всю ширину страницы +2\n' +
    '\n' +
    '[+] Интерактивность элементов +12\n' +
    '\n' +
    '[+] элемент About the Shelter в навигации подсвечен и неинтерактивен, остальные элементы навигации интерактивны +2\n' +
    '[+] каждая карточка с питомцем в блоке Our Friends интерактивна при наведении на любую область этой карточки +2\n' +
    '[+] плавная прокрутка по якорям +2\n' +
    '[+] выполняются все ссылочные связи согласно Перечню ссылочных связей для страницы Main +2\n' +
    '[+] выполнена интерактивность ссылок и кнопок. Интерактивность заключается не только в изменении внешнего вида курсора, например, при помощи свойства cursor: pointer, но и в использовании и других визуальных эффектов, например, изменение цвета фона или цвета шрифта, согласно стайлгайду в макете. Если в макете стили не указаны, реализуете их по своему усмотрению, руководствуясь общим стилем макета +2\n' +
    '[+] обязательное требование к интерактивности: плавное изменение внешнего вида элемента при наведении и клике, не влияющее на соседние элементы +2\n' +
    '\n' +
    '[+] Страница Pets (40)\n' +
    '\n' +
    '[+] Проверка верстки +7\n' +
    '\n' +
    '[+] верстка страницы валидная: для проверки валидности вёрстки используйте сервис https://validator.w3.org/ . +4\n' +
    '[+] логотип в хедере состоит из текстовых элементов +1\n' +
    '[+] страница содержит ровно один элемент <h1> +1\n' +
    '[+] добавлен favicon +1\n' +
    '\n' +
    '[+] Вёрстка соответствует макету +15\n' +
    '\n' +
    '[+] блок <header> +5\n' +
    '[+] блок Our Friends +5\n' +
    '[+] блок <footer> +5\n' +
    '\n' +
    '[+] Требования к css +4\n' +
    '\n' +
    '[+] при уменьшении масштаба страницы браузера или увеличении ширины страницы (>1280px) вёрстка размещается по центру, а не сдвигается в сторону и не растягивается по всей ширине +2\n' +
    '[+] фоновый цвет тянется на всю ширину страницы +2\n' +
    '\n' +
    '[+] Интерактивность элементов +14\n' +
    '\n' +
    '[+] элемент Our pets в навигации подсвечен и неинтерактивен, остальные элементы навигации интерактивны +2\n' +
    '[+] доступные кнопки пагинации (вправо) активны, недоступные (влево) - неактивны (disabled) +2\n' +
    '[+] каждая карточка с питомцем в блоке Our Friends интерактивна при наведении на любую область этой карточки +2\n' +
    '[+] плавная прокрутка по якорям +2\n' +
    '[+] выполняются все ссылочные связи согласно Перечню ссылочных связей для страницы Pets +2\n' +
    '[+] выполнена интерактивность ссылок и кнопок. Интерактивность заключается не только в изменении внешнего вида курсора, например, при помощи свойства cursor: pointer, но и в использовании и других визуальных эффектов, например, изменение цвета фона или цвета шрифта, согласно стайлгайду в макете. Если в макете стили не указаны, реализуете их по своему усмотрению, руководствуясь общим стилем макета +2\n' +
    '[+] обязательное требование к интерактивности: плавное изменение внешнего вида элемента при наведении и клике, не влияющее на соседние элементы +2'
)
*/