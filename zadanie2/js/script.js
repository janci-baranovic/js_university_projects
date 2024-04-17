// Fields and globals

const form = document.querySelector('form');
const firstName = document.getElementById("name");
const surname = document.getElementById("surname");
const birthDate = document.getElementById("birth-date");
const age = document.getElementById("age");
const phoneNumber = document.getElementById("phone-number");
const email = document.getElementById("email");
const sex = document.getElementsByName('sex');
const activitiesSelect = document.getElementById('activities');
const facilitiesSelect = document.getElementById("facilities"); 
const timeSelect = document.getElementById("time");
const individualRadio = document.getElementById('individual');
const groupRadio = document.getElementById('group');
const groupMembersCount = document.getElementById('people-count');
const otherOptionBox = document.getElementById('other-option');
const hiddenOption = document.getElementById('hidden-option');
const noteTextArea = document.getElementById('note');
const noteCharCounter = document.getElementById('note-char-count');

let validationErrors = 0;
let finalAmount = 0;
const noteCharMax = 240;

// Helper functions

function setError(element, errorMessage) {
    element.classList.remove('success');
    element.classList.add('error');
    element.nextElementSibling.innerHTML = errorMessage;
}

function setSuccess(element) {
    element.classList.remove('error');
    element.classList.add('success');
    element.nextElementSibling.innerHTML = '';
}

function setNeutral(element) {
    element.classList.remove('error');
    element.classList.remove('success');
    element.nextElementSibling.innerHTML = '';
}

function calculateAge(birthDateValue) {
    const monthDiff = Date.now() - birthDateValue.getTime();
    const year = new Date(monthDiff).getUTCFullYear();
    return Math.abs(year - 1970);
}

const validateCharacterCount = () => {
    let numOfChar = noteTextArea.value.length;
    let counter = noteCharMax - numOfChar;
    if (counter < 0) {
        setError(noteTextArea, '');
        noteCharCounter.style.color = 'red';
        noteCharCounter.innerHTML = 'Maximálny počet znakov pre toto pole bol presiahnutý';
        return false;
    } else {
        setNeutral(noteTextArea);
    }

    if (counter < 20) {
        noteCharCounter.style.color = 'red';
    } else if (counter < 50) {
        noteCharCounter.style.color = 'orange';
    } else {
        noteCharCounter.style.color = 'black';
    }
    noteCharCounter.textContent = counter + '/240';
    return true;
}

function calculatePeopleCount() {
    let peopleCount = 1; 
    const radioButtonGroup = document.getElementById('group');
    if (radioButtonGroup.checked) {
        peopleCount = document.getElementById('people-count').value;
    }
    return peopleCount;
}

function calculatePartialSum() {
    let partialSum = 0;
    const checkBoxes = document.querySelectorAll('input[type="checkbox"]');
    for(let i = 0; i < checkBoxes.length; i++) {
        if (checkBoxes[i].checked) {
            partialSum += checkBoxes[i].value * calculatePeopleCount();
        };
    };
    return partialSum;
}

function calculateSumFromSelects() {
    let facility = facilitiesSelect.value;
    let time = timeSelect.value;
    if (facility === 'veľká stena - 15€' || facility === 'detská stena - 12€' || time === 'bez inštruktora') {
        time = 1;
    } else {
        time = time.split('-');
        timeHigh = time[1].split(':');
        timeLow = time[0].split(':');
        time = parseInt(timeHigh[0]) - parseInt(timeLow[0]);
    } 
    
    facility = facility.replace(/\D/g, '');
    facility = Array.from(facility).slice(-2);
    facility = parseInt(facility.join(''));
    return facility * time;
}

function calculateFinalAmount() {
    const partialSum = calculatePartialSum();
    const sumFromSelects = calculateSumFromSelects();
    return partialSum + sumFromSelects;
}

// Event handeling
 
const facilities = new Array();
facilities["Plavanie"] = ["25m bazén - 20€", "50m bazén - 35€", "sauna - 15€"] ;
facilities["Lezenie"] = ["bouldering - 10€", "veľká stena - 15€", "detská stena - 12€"];
facilities["Posilovanie"] = ["outdoor workout - 5€", "posilňovňa - 10€", "crossfit - 12€"];
facilities["Plavanie"].forEach(item => {
    facilitiesSelect.options[facilitiesSelect.options.length]= new Option(item); 
});

activitiesSelect.onchange = () => {
    let thisArr = facilities[activitiesSelect.value];
    facilitiesSelect.options.length = 0;   
    thisArr.forEach(item => {
        facilitiesSelect.options[facilitiesSelect.options.length]= new Option(item); 
    });
    
    timeSelect.options.length = 0;
    time[thisArr[0]].forEach(item => {
        timeSelect.options[timeSelect.options.length] = new Option(item);
    });
};

const time = new Array();  
time["25m bazén - 20€"] = ["6:00-07:00", "7:00-08:00", "8:00-09:00", "9:00-10:00", "8:00-12:00"];
time["50m bazén - 35€"] = ["8:00-10:00", "10:00-12:00", "14:00-16:00", "16:00-18:00", "14:00-18:00"];
time["sauna - 15€"] = ["16:00-17:00", "17:00-18:00", "18:00-19:00", "19:00-20:00", "18:00-22:00"];
time["bouldering - 10€"] = ["s inštruktorom - 6€", "bez inštruktora"];
time["veľká stena - 15€"] = ["top rope", "lead", "free"];
time["detská stena - 12€"] = ["top rope", "lead"];
time["outdoor workout - 5€"] = ["8:00-09:00", "9:00-10:00", "10:00-11:00", "11:00-12:00", "8:00-12:00"];
time["posilňovňa - 10€"] = ["7:00-10:00", "13:00-16:00", "16:00-19:00", "14:00-18:00"];
time["crossfit - 12€"] = ["8:00-12:00", "12:00-16:00", "16:00-20:00", "10:00-16:00"];
time["25m bazén - 20€"].forEach(item => {
    timeSelect.options[timeSelect.options.length]= new Option(item); 
});

facilitiesSelect.onchange = () => {
    let thisArr = time[facilitiesSelect.value];
    timeSelect.options.length = 0;     
    thisArr.forEach(item =>{
        timeSelect.options[timeSelect.options.length]= new Option(item); 
    });
};

const validateOtherOption = () => {
    if (hiddenOption.value === '') {
        setError(hiddenOption, 'Toto pole nesmie ostať prázdne');
        return false;
    } else {
        setSuccess(hiddenOption);
    }
    return true;
}

otherOptionBox.addEventListener('click', () => {
    if (otherOptionBox.checked) {
        setNeutral(hiddenOption);
        hiddenOption.parentNode.classList.remove('hidden');
        hiddenOption.addEventListener('blur', validateOtherOption);
    } else {
        hiddenOption.parentNode.classList.add('hidden');
    }
});

groupRadio.addEventListener("change", () => {
    setNeutral(groupMembersCount);
    groupMembersCount.parentNode.classList.remove('hidden');
    groupMembersCount.addEventListener('blur', validateGroupMembersCount);
});

individualRadio.addEventListener('change', () => {
    groupMembersCount.parentNode.classList.add('hidden');
});

const validateGroupMembersCount = () => {
    if (groupMembersCount.value === '') {
        setError(groupMembersCount, "Toto pole nesmie ostať prázdne");
        return false;
    } else {
        setSuccess(groupMembersCount);
    }
    return true;
}

function validateEmptyRadio() {
    if (!sex[0].checked && !sex[1].checked) {
        const errorMessage = document.getElementById('radio-error');
        errorMessage.innerHTML = "Musíte vybrať jednu z možností";
        errorMessage.style.display = 'block';
    }
}

const isAgeValidWithBirthDate = () => {
    if (age.value != calculateAge(new Date(birthDate.value))) {
        setError(age, "Vek sa nezhoduje s dátumom narodenia");
        return false;
    } else {
        setSuccess(age);
    }
    return true;
}

const validatePhoneNumber = () => {
    const phoneNumberValue = phoneNumber.value.trim();
    const invalidPhoneNumberFormatMessage = 'Tel. číslo nie je vo validnom formáte';
    const phoneNumberRegex = new RegExp('^9[0-9]{8}$');

    if (phoneNumberValue !== '') {
        if (phoneNumberRegex.test(phoneNumberValue)) {
            setSuccess(phoneNumber);
        } else {
            setError(phoneNumber, invalidPhoneNumberFormatMessage);
        }
    } else {
        setNeutral(phoneNumber);
    }
}

const isValidEmail = email => {
    const emailRegex = new RegExp('^[a-zA-Z0-9.!#$%&\'*+/=?^_`{|}~-]{3,}@[a-zA-Z0-9-]+([.][a-zA-Z0-9]+){1,}[.][a-zA-Z0-9]{2,4}$');
    if (emailRegex.test(email)) {
        return true;
    } else {
        return false;
    }
}

const validateEmail = () => {
    const emailValue = email.value.trim();
    const invalidEmailErrorMessage = 'Email nie je validný';

    if (!isValidEmail(emailValue)) {
        setError(email, invalidEmailErrorMessage);
        return false;
    } else {
        setSuccess(email);
        return true;
    }
}

const isInputEmpty = event => {
    const inputFieldValue = event.target.value.trim();
    const emptyInputErrorMessage = 'Toto pole nesmie zostať prázdne';

    if (inputFieldValue === '') {
        setError(event.target, emptyInputErrorMessage);
    } else {
        setSuccess(event.target);
    }
}

const isBirthDateSmallerThanToday = event => {
    let birthDateValue = new Date(event.target.value);
    if (birthDateValue > Date.now()) {
        setError(birthDate, "Dátum nesmie byť neskorší ako dnešný");
    } else {
        age.value = calculateAge(birthDateValue);
        age.classList.remove('error');
        age.nextElementSibling.innerHTML = '';
    }
}

firstName.addEventListener('blur', isInputEmpty);
surname.addEventListener('blur', isInputEmpty);
birthDate.addEventListener('blur', isInputEmpty);
age.addEventListener('blur', isInputEmpty);
email.addEventListener('blur', validateEmail);

age.addEventListener('change', isAgeValidWithBirthDate);
age.addEventListener('blur', isAgeValidWithBirthDate);
birthDate.addEventListener('blur', isBirthDateSmallerThanToday);

phoneNumber.addEventListener('blur', validatePhoneNumber);

noteTextArea.addEventListener('input', validateCharacterCount);

const validateInputs = () => {

    const firstNameValue = firstName.value.trim();
    const surnameValue = surname.value.trim();
    const birthDateValue = birthDate.value.trim();
    const ageValue = age.value.trim();
    const emptyInputErrorMessage = 'Toto pole nesmie zostať prázdne';

    if (firstNameValue === '') {
        setError(firstName, emptyInputErrorMessage);
        return false;
    } else {
        setSuccess(firstName);
    }

    if (surnameValue === '') {
        setError(surname, emptyInputErrorMessage);
        return false;
    } else {
        setSuccess(surname);
    }

    if (birthDateValue === '') {
        setError(birthDate, emptyInputErrorMessage);
        return false;
    } else {
        setSuccess(birthDate);
    }

    if (ageValue === '') {
        setError(age, emptyInputErrorMessage);
        return false;
    } else {
        setSuccess(age);
    }

    if (!validateEmail()) return false;

    if(!isAgeValidWithBirthDate()) return false;

    if (groupRadio.checked) {
        if (!validateGroupMembersCount()) return false;
    }
    
    if (otherOptionBox.checked) {
        if (!validateOtherOption()) return false;
    }
    
    validateEmptyRadio();

    if (!validateCharacterCount()) return false;

    return true;
}

const createMyElement = (element, text, className) => {
    const myElement = document.createElement(element);
    myElement.innerHTML = text;
    myElement.classList.add(className);
    return myElement;
}

const submitMytForm = () => {
    form.submit();
    const newContent = document.getElementsByClassName('modal')[0];
    newContent.innerHTML = 'Ďakujeme za vašu objednávku';
    newContent.classList.add('flex');
}

const createModal = () => {
    const partialSum = calculatePartialSum();
    const peopleCount = calculatePeopleCount();
    const activity = document.getElementById('activities').value;
    const facility = document.getElementById('facilities').value;

    const modalWindow = createMyElement('div', '', 'modal'); 
    const modalHeader = createMyElement('h1', 'Prehľad vašej objednávky');
    const activityDescription =createMyElement('p', `Zvolili ste aktivitu <strong>${activity}</strong> so zariadením <strong>${facility}</strong>`);
    const peopeCountDescription = createMyElement('p', `Zadaný počet ľudí: <strong>${peopleCount}<strong>`);
    const partialSumDescription = createMyElement('p', `Cena vybavenia pre <strong>${peopleCount}</strong> ľudí: <strong>${partialSum}€</strong>`);
    const finalSum = createMyElement('p', `Celkovo zaplatíte <strong>${calculateFinalAmount()}€</strong>`);
    const submitButton = createMyElement('button', 'Potvrdiť objednávku', 'submitButton');

    submitButton.addEventListener('click', submitMytForm);

    modalWindow.appendChild(modalHeader);
    modalWindow.appendChild(activityDescription);
    modalWindow.appendChild(peopeCountDescription);
    if (partialSum !== 0) {
        modalWindow.appendChild(partialSumDescription);
    }
    modalWindow.appendChild(finalSum);
    modalWindow.appendChild(submitButton);
    document.body.appendChild(modalWindow);
}

const megaFatalError = document.getElementsByClassName('mega-fatal-error');

form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!validateInputs()) {
        megaFatalError[0].classList.remove('hidden');
    } else {
        megaFatalError[0].classList.add('hidden');
        document.getElementsByClassName('overlay')[0].classList.remove('hidden');
        createModal();
    }
});

document.addEventListener('click', (event) => {
    if (event.target.classList.contains('overlay')) {
        document.getElementsByClassName('overlay')[0].classList.add('hidden');
        document.getElementsByClassName('modal')[0].remove();
    }
});