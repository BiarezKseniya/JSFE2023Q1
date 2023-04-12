import pets from '../../assets/json/pets.json' assert { type: 'json' };

// Burger-menu

let menu = document.getElementById("menu");
let menuCover = document.getElementById("menu-cover");
let menuItems = document.querySelectorAll(".nav-list a");

function toggleMenu() {
    document.getElementById("menu-box").classList.toggle("open");
    menu.classList.toggle("open");
    document.getElementsByTagName("html")[0].classList.toggle("open");
    menuCover.classList.toggle("shadow");
}



menu.addEventListener("click", (event) => {
    toggleMenu();
})

menuCover.addEventListener("click", (event) => {
    toggleMenu();
})

menuItems.forEach(item => {

    item.addEventListener("click", (event) => {
        if (menu.classList.contains("open")) {
            event.preventDefault();
            if (!event.target.classList.contains('active')) {
                let linkLocation = event.currentTarget.href;
                toggleMenu();
                setTimeout(() => { window.location = linkLocation; }, 500);
            } else {
                toggleMenu();
            }
        }
    });

})

// Pagination

let cardsNumber = determineCardsNumber();
let pageNumber;
let petPages;

window.addEventListener('load', (event) => {
    pageNumber = 1;
    petPages = generatePets(cardsNumber);
    renderPets(petPages, pageNumber);
})

window.addEventListener('resize', (event) => {
    console.log(event);
    if (cardsNumber !== determineCardsNumber()) {
        cardsNumber = determineCardsNumber();
        petPages = generatePets(cardsNumber);
        renderPets(petPages, pageNumber);
    }
})

let pageNumberBtn = document.querySelector(".page-number");
let firstPageBtn = document.querySelector("#switch-to-final-left");
let lastPageBtn = document.querySelector("#switch-to-final-right");
let previousPageBtn = document.querySelector("#switch-left");
let nextPageBtn = document.querySelector("#switch-right");

previousPageBtn.addEventListener('click', (event) => {
    pageNumber--;
    pageNumberBtn.innerHTML = pageNumber;
    renderPets(petPages, pageNumber);
    if (pageNumber === 1) {
        previousPageBtn.setAttribute("disabled", "true");
        previousPageBtn.classList.add('inactive');
        firstPageBtn.setAttribute("disabled", "true");
        firstPageBtn.classList.add('inactive');
    };
    if (pageNumber === petPages.length - 1) {
        nextPageBtn.removeAttribute("disabled");
        nextPageBtn.classList.remove('inactive');
        lastPageBtn.removeAttribute("disabled");
        lastPageBtn.classList.remove('inactive');
    };
})

nextPageBtn.addEventListener('click', (event) => {
    pageNumber++;
    pageNumberBtn.innerHTML = pageNumber;
    renderPets(petPages, pageNumber);
    if (pageNumber === petPages.length) {
        nextPageBtn.setAttribute("disabled", "true");
        nextPageBtn.classList.add('inactive');
        lastPageBtn.setAttribute("disabled", "true");
        lastPageBtn.classList.add('inactive');
    }

    if (pageNumber === 2) {
        previousPageBtn.removeAttribute("disabled");
        previousPageBtn.classList.remove('inactive');
        firstPageBtn.removeAttribute("disabled");
        firstPageBtn.classList.remove('inactive');
    };
})

firstPageBtn.addEventListener('click', (event) => {
    if (pageNumber === petPages.length) {
        nextPageBtn.removeAttribute("disabled");
        nextPageBtn.classList.remove('inactive');
        lastPageBtn.removeAttribute("disabled");
        lastPageBtn.classList.remove('inactive');
    }
    pageNumber = 1;
    pageNumberBtn.innerHTML = pageNumber;
    renderPets(petPages, pageNumber);
    previousPageBtn.setAttribute("disabled", "true");
    previousPageBtn.classList.add('inactive');
    firstPageBtn.setAttribute("disabled", "true");
    firstPageBtn.classList.add('inactive');
})

lastPageBtn.addEventListener('click', (event) => {
    if (pageNumber === 1) {
        previousPageBtn.removeAttribute("disabled");
        previousPageBtn.classList.remove('inactive');
        firstPageBtn.removeAttribute("disabled");
        firstPageBtn.classList.remove('inactive');
    }
    pageNumber = petPages.length;
    pageNumberBtn.innerHTML = pageNumber;
    renderPets(petPages, pageNumber);
    nextPageBtn.setAttribute("disabled", "true");
    nextPageBtn.classList.add('inactive');
    lastPageBtn.setAttribute("disabled", "true");
    lastPageBtn.classList.add('inactive');
})

function generatePets(cardsNumber) {
    let petPages = [];
    const newPets = pets.map((pet) => {
        return { pet: pet, count: 6 };
    });

    for (let p = 0; p < Math.ceil(48 / cardsNumber); p++) {
        let petPage = [];

        for (let i = 0; i < cardsNumber; i++) {
            const maxPetCount = Math.max(...newPets.map((pet) => pet.count));
            const petsToSelect = [];
            newPets.forEach(pet => {
                if (pet.count === maxPetCount) {
                    if (!petPage.find((pagePet => pagePet.name === pet.pet.name))) {
                        petsToSelect.push(pet);
                    }
                }
            });
            const selectedPetIndex = Math.floor(Math.random() * (petsToSelect.length - 1));
            const selectedPet = petsToSelect[selectedPetIndex];
            selectedPet.count--;
            petPage.push(selectedPet.pet);
        }

        petPages.push(petPage);
    }

    return petPages;
}


function renderPets(petPages, pageNumber) {
    document.querySelectorAll(".pet-card").forEach(div => {
        div.remove();
    });
    const template = document.querySelector("#template");
    const petPage = petPages[pageNumber - 1];
    petPage.forEach(pet => {
        let clone = template.content.cloneNode(true);
        clone.querySelector(".pet-name").textContent = pet.name;
        clone.querySelector(".pet-card img").src = pet.img;
        clone.querySelector(".pet-card img").alt = pet.name;
        clone.querySelector(".pet-card").addEventListener("click", (event) => {
            openPopup(pet);
            console.log(pet);
        })
        document.querySelector(".photo-slider").append(clone);
    });

}

function determineCardsNumber() {
    let cardsNumber;
    if (window.innerWidth > 1000) {
        cardsNumber = 8;
    } else if ((window.innerWidth >= 768) && (window.innerWidth <= 1000)) {
        cardsNumber = 6;
    } else {
        cardsNumber = 3;
    }
    return cardsNumber;
}

// Pop-up window

let popUp = document.querySelector(".popup");
let modalCover = document.querySelector("#modal-cover");

function openPopup(pet) {
    popUp.style.display = "flex";
    modalCover.classList.add("popup-shadow");
    document.getElementsByTagName("html")[0].classList.add("open");
    document.querySelector(".popup img").src = pet.img;
    document.querySelector(".popup .title").innerHTML = pet.name;
    document.querySelector(".popup .subtitle").innerHTML = pet.type + ' - ' + pet.breed;
    document.querySelector(".popup .description").innerHTML = pet.description;
    document.querySelector("#age").innerHTML = pet.age;
    document.querySelector("#inoculations").innerHTML = pet.inoculations.join(", ");
    document.querySelector("#diseases").innerHTML = pet.diseases.join(", ");
    document.querySelector("#parasites").innerHTML = pet.parasites.join(", ");

}

popUp.querySelector(".close").addEventListener("click", (event) => {
    closePopup();
})

modalCover.addEventListener("click", (event) => {
    if (event.target === modalCover)
        closePopup();
})

function closePopup() {
    popUp.style.display = "none";
    modalCover.classList.remove("popup-shadow");
    document.getElementsByTagName("html")[0].classList.remove("open");
}




// console.log(
//     '[+] Страница Main (60) \n'+
//     '\n'+
//     '[+] Проверка верстки +7\n'+
//     '\n'+
//     '[+] верстка страницы валидная: для проверки валидности вёрстки используйте сервис https://validator.w3.org/ . +4\n'+
//     '[+] логотип в хедере состоит из текстовых элементов +1\n'+
//     '[+] страница содержит ровно один элемент <h1> +1\n'+
//     '[+] добавлен favicon +1\n'+
//     '\n'+
//     '[+]  Вёрстка соответствует макету +35\n'+
//     '\n'+
//     '[+] блок <header> +5\n'+
//     '[+] блок Not only +5\n'+
//     '[+] блок About +5\n'+
//     '[+] блок Our Friends +5\n'+
//     '[+] блок Help +5\n'+
//     '[+] блок In addition +5\n'+
//     '[+] блок <footer> +5\n'+
//     '\n'+
//     '[+] Требования к css +6\n'+
//     '\n'+
//     '[+] для позиционирования элементов блока Help использована сеточная верстка (flexbox или grid) +2\n'+
//     '[+] при уменьшении масштаба страницы браузера или увеличении ширины страницы (>1280px) вёрстка размещается по центру, а не сдвигается в сторону и не растягивается по всей ширине +2\n'+
//     '[+] фоновый цвет тянется на всю ширину страницы +2\n'+
//     '\n'+
//     '[+] Интерактивность элементов +12\n'+
//     '\n'+
//     '[+] элемент About the Shelter в навигации подсвечен и неинтерактивен, остальные элементы навигации интерактивны +2\n'+
//     '[+] каждая карточка с питомцем в блоке Our Friends интерактивна при наведении на любую область этой карточки +2\n'+
//     '[+] плавная прокрутка по якорям +2\n'+
//     '[+] выполняются все ссылочные связи согласно Перечню ссылочных связей для страницы Main +2\n'+
//     '[+] выполнена интерактивность ссылок и кнопок. Интерактивность заключается не только в изменении внешнего вида курсора, например, при помощи свойства cursor: pointer, но и в использовании и других визуальных эффектов, например, изменение цвета фона или цвета шрифта, согласно стайлгайду в макете. Если в макете стили не указаны, реализуете их по своему усмотрению, руководствуясь общим стилем макета +2\n'+
//     '[+] обязательное требование к интерактивности: плавное изменение внешнего вида элемента при наведении и клике, не влияющее на соседние элементы +2\n'+
//     '\n'+
//     '[+] Страница Pets (40)\n'+
//     '\n'+
//     '[+] Проверка верстки +7\n'+
//     '\n'+
//     '[+] верстка страницы валидная: для проверки валидности вёрстки используйте сервис https://validator.w3.org/ . +4\n'+
//     '[+] логотип в хедере состоит из текстовых элементов +1\n'+
//     '[+] страница содержит ровно один элемент <h1> +1\n'+
//     '[+] добавлен favicon +1\n'+
//     '\n'+
//     '[+] Вёрстка соответствует макету +15\n'+
//     '\n'+
//     '[+] блок <header> +5\n'+
//     '[+] блок Our Friends +5\n'+
//     '[+] блок <footer> +5\n'+
//     '\n'+
//     '[+] Требования к css +4\n'+
//     '\n'+
//     '[+] при уменьшении масштаба страницы браузера или увеличении ширины страницы (>1280px) вёрстка размещается по центру, а не сдвигается в сторону и не растягивается по всей ширине +2\n'+
//     '[+] фоновый цвет тянется на всю ширину страницы +2\n'+
//     '\n'+
//     '[+] Интерактивность элементов +14\n'+
//     '\n'+
//     '[+] элемент Our pets в навигации подсвечен и неинтерактивен, остальные элементы навигации интерактивны +2\n'+
//     '[+] доступные кнопки пагинации (вправо) активны, недоступные (влево) - неактивны (disabled) +2\n'+
//     '[+] каждая карточка с питомцем в блоке Our Friends интерактивна при наведении на любую область этой карточки +2\n'+
//     '[+] плавная прокрутка по якорям +2\n'+
//     '[+] выполняются все ссылочные связи согласно Перечню ссылочных связей для страницы Pets +2\n'+
//     '[+] выполнена интерактивность ссылок и кнопок. Интерактивность заключается не только в изменении внешнего вида курсора, например, при помощи свойства cursor: pointer, но и в использовании и других визуальных эффектов, например, изменение цвета фона или цвета шрифта, согласно стайлгайду в макете. Если в макете стили не указаны, реализуете их по своему усмотрению, руководствуясь общим стилем макета +2\n'+
//     '[+] обязательное требование к интерактивности: плавное изменение внешнего вида элемента при наведении и клике, не влияющее на соседние элементы +2'
//     )