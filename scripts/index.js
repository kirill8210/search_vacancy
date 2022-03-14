const optionBtnOrder = document.querySelector('.option__btn_order');
const optionBtnPeriod = document.querySelector('.option__btn_period');
const optionListOrder = document.querySelector('.option__list_order');
const optionListPeriod = document.querySelector('.option__list_period');
const topCityBtn = document.querySelector('.top__city');
const city = document.querySelector('.city');
const cityClose = document.querySelector('.city__close');
const cityRegionList = document.querySelector('.city__region-list');
const overlayVacancy = document.querySelector('.overlay_vacancy');
const resultList = document.querySelector('.result__list');
const formSearch = document.querySelector('.bottom__search');
const h1 = document.querySelector('h1');
const orderBy = document.querySelector('#order_by');
const searchPeriod = document.querySelector('#search_period');

let data = [];

const getData = ({search, id, country, city} = {}) => {
    const URL = 'https://enigmatic-coast-00144.herokuapp.com/api/vacancy';

    let url = `${URL}/${id ? id : ''}`;

    if (search){
        url = `${URL}?search=${search}`;
    }

    if (city){
        url = `${URL}?city=${city}`;
    }

    if (country){
        url = `${URL}?country=${country}`;
    }

    return  fetch(url).then(response => response.json());
};

const declOfNum = (n, titles) => {
    return n + ' ' + titles[n % 10 === 1 && n % 100 !== 11 ?
        0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2];
};

const createCard = (vacancy) =>{
    const {
        title,
        id,
        compensation,
        workSchedule,
        employer,
        address,
        description,
        date,
    } = vacancy;

    const card = document.createElement('li');
    card.classList.add('result__item');

    card.insertAdjacentHTML('afterbegin', `    
        <article class="vacancy">
            <h2 class="vacancy__title">
                <a class="vacancy__open-modal" href="#" data-vacancy="${id}">${title}</a>
            </h2>
            <p class="vacancy__compensation">${compensation}</p>
            <p class="vacancy__work-schedule">${workSchedule}</p>
            <div class="vacancy__employer">
                <p class="vacancy__employer-title">${employer}</p>
                <p class="vacancy__employer-address">${address}</p>
            </div>
            <p class="vacancy__description">${description}</p>
            <p class="vacancy__date">
            <time datetime="${date}">${date}</time>
            </p>
            <div class="vacancy__wrapper-btn">
                <a class="vacancy__response vacancy__open-modal" href="#" data-vacancy="${id}">Откликнуться</a>
                <button class="vacancy__contacts">Показать контакты</button>
            </div>
        </article>    
    `);

    return card;
};

const renderCards = (data) =>{
    resultList.textContent = '';
    const cards = data.map(createCard);
    resultList.append(...cards);
};

const filterData = () =>{
    const date = new Date();
    date.setDate(date.getDate() - searchPeriod.value);
    return data.filter(item => new Date(item.date).getTime() > date);
};

const sortData = () =>{
    switch (orderBy.value) {
        case 'down':
            data.sort((a, b) => a.minCompensation > b.minCompensation ? 1 : -1);
            break;
        case 'up':
            data.sort((a, b) => b.minCompensation > a.minCompensation ? 1 : -1);
            break;
        default:
            data.sort((a, b) => new Date(a.date).getTime() > new Date(b.date).getTime() ? 1 : -1);
    }

    return filterData();
};

const optionHandler = () =>{
    optionBtnOrder.addEventListener('click', () =>{
        optionListOrder.classList.toggle('option__list_active');
        optionListPeriod.classList.remove('option__list_active');
    });

    optionListOrder.addEventListener('click', (e) =>{
        const target = e.target;

        if (target.classList.contains('option__item')){
            optionBtnOrder.textContent = target.textContent;
            orderBy.value = target.dataset.sort;
            const newData = sortData();
            renderCards(newData);
            optionListOrder.classList.remove('option__list_active');
            for (const el of optionListOrder.querySelectorAll('.option__item')){
                if (el === target){
                    el.classList.add('option__item_active');
                } else {
                    el.classList.remove('option__item_active')
                }
            }
        }
    });

    optionBtnPeriod.addEventListener('click', () =>{
        optionListPeriod.classList.toggle('option__list_active');
        optionListOrder.classList.remove('option__list_active');
    });

    optionListPeriod.addEventListener('click', (e) =>{
        const target = e.target;

        if (target.classList.contains('option__item')){
            optionBtnPeriod.textContent = target.textContent;
            searchPeriod.value = target.dataset.date;
            const tempData = filterData();
            renderCards(tempData);
            optionListPeriod.classList.remove('option__list_active');
            for (const el of optionListPeriod.querySelectorAll('.option__item')){
                if (el === target){
                    el.classList.add('option__item_active');
                } else {
                    el.classList.remove('option__item_active')
                }
            }
        }
    });
};

const cityHandler = () =>{
    topCityBtn.addEventListener('click', () =>{
        city.classList.toggle('city_active');
    });

    cityRegionList.addEventListener('click', async (e) =>{
        const target = e.target;

        if (target.classList.contains('city__link')){
            const hash = new URL(target.href).hash.substring(1);
            const option = {
                [hash]: target.textContent,
            };
            console.log(option);
            data = await getData(option);
            //console.log(data);
            const newData = sortData();
            renderCards(newData);
            topCityBtn.textContent = target.textContent;
            city.classList.remove('city_active');
        }
    });

    cityClose.addEventListener('click', (e) =>{
        city.classList.remove('city_active');
    });
};

const createModal = (data) => {
    const {
        address,
        title,
        compensation,
        description,
        employer,
        employment,
        experience,
        skills,
    } = data;

    const modal = document.createElement('div');
    modal.classList.add('modal');

    const closeBtnEl = document.createElement('button');
    closeBtnEl.classList.add('modal__close');
    closeBtnEl.textContent = '✕';

    const titleEl = document.createElement('h2');
    titleEl.classList.add('modal__title');
    titleEl.textContent = title;

    const compensationEl = document.createElement('p');
    compensationEl.classList.add('modal__compensation');
    compensationEl.textContent = compensation;

    const employerEl = document.createElement('p');
    employerEl.classList.add('modal__employer');
    employerEl.textContent = employer;

    const addressEl = document.createElement('p');
    addressEl.classList.add('modal__address');
    addressEl.textContent = address;

    const experienceEl = document.createElement('p');
    experienceEl.classList.add('modal__experience');
    experienceEl.textContent = experience;

    const employmentEl = document.createElement('p');
    employmentEl.classList.add('modal__employment');
    employmentEl.textContent = employment;

    const descriptionEl = document.createElement('p');
    descriptionEl.classList.add('modal__description');
    descriptionEl.textContent = description;

    const skillsEl = document.createElement('div');
    skillsEl.classList.add('modal__skills', 'skills');


    const skillsTitleEl = document.createElement('h3');
    skillsTitleEl.classList.add('skills__title');
    skillsTitleEl.textContent = 'Подробнее:';

    const skillsListEl = document.createElement('ul');
    skillsListEl.classList.add('skills__list');

    for (const skill of skills) {
        const skillsItemEl = document.createElement('li');
        skillsItemEl.classList.add('skills__item');
        skillsTitleEl.textContent = skill;
        skillsListEl.append(skillsItemEl)
    }

    skillsEl.append(skillsTitleEl, skillsListEl);

    const responseBtnEl = document.createElement('button');
    responseBtnEl.classList.add('modal__response');
    responseBtnEl.textContent = 'Отправить резюме';

    modal.append(
        closeBtnEl,
        titleEl,
        compensationEl,
        employerEl,
        addressEl,
        experienceEl,
        employmentEl,
        descriptionEl,
        skillsEl,
        responseBtnEl,
    );
    return modal;
};

const modalHandler = () =>{
    let modal = null;
    resultList.addEventListener('click', async (e) =>{
        const target = e.target;

        if (target.dataset.vacancy){
            e.preventDefault();
            overlayVacancy.classList.add('overlay_active');
            const data =  await getData({id: target.dataset.vacancy});
            modal = createModal(data);
            overlayVacancy.append(modal);
        }
    });

    overlayVacancy.addEventListener('click', (e) =>{
        const target = e.target;

        if (target === overlayVacancy || target.classList.contains('modal__close')){
            overlayVacancy.classList.remove('overlay_active');
            modal.remove();
        }
    });
};

const searchHandler = () =>{
    formSearch.addEventListener('submit', async (e) =>{
        e.preventDefault();
        const textSearch = formSearch.search.value;

        if (textSearch.length > 2){
            formSearch.search.style.borderColor = '';
            data = await getData({search: textSearch});
            console.log(data);
            const newData = sortData();
            renderCards(newData);
            h1.textContent = `${declOfNum(data.length, ['вакансия', 'вакансии', 'вакансий'])} "${textSearch}"`;
            formSearch.reset();
        } else {
            formSearch.search.style.borderColor = 'red';
            setTimeout(() =>{
                formSearch.search.style.borderColor = '';
            }, 1500)
        }
    });
};

const init = async () =>{
    data = await getData();
    const newData = sortData();
    renderCards(newData);

    optionHandler();

    cityHandler();

    modalHandler();

    searchHandler();
};

init();