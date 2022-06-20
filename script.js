const mainHeaderSpans = document.querySelectorAll('.h1--span');
const formSeparationLine = document.querySelector(
  '.apply-today--separation-line'
);

const applyTodayContainer = document.getElementById('apply-today--container');

formSeparationLine.style.height = `${applyTodayContainer.clientHeight}px`;

const textForHeader = 'FAMILY-LIFESTYLE!';

mainHeaderSpans.forEach((headerSpan) => {
  let index = 0;
  let headerText = '';

  const headerInterval = setInterval(() => {
    headerText += textForHeader[index];
    headerSpan.textContent = headerText;
    index++;

    if (index === textForHeader.length) clearInterval(headerInterval);
  }, 250);
});

//FORM SUBMIT:
const firstForm = document.getElementById('apply-today--form-first');
const secondForm = document.getElementById('apply-today--form-second');
const ageSelect = document.getElementById('choose-age');
const cdlSelect = document.getElementById('choose-cdl');
const experienceSelect = document.getElementById('choose-experience');
const selectArr = [ageSelect, cdlSelect, experienceSelect];
const formSteps = document.querySelector('.apply-today--form-steps')
  .children[0];
const backArrow = document.querySelector('.back-arrow');

const handleVisibility = (el, visible = true) => {
  if (visible) {
    el.classList.remove('hidden');
    el.classList.add('block');
    return;
  }
  el.classList.remove('block');
  el.classList.add('hidden');
};

selectArr.forEach((selectEl) => {
  selectEl.addEventListener('change', (e) => {
    if (e.target.selectedIndex !== 0)
      e.target.style.borderColor = 'var(--gray-clr)';
    handleVisibility(document.getElementById(`${e.target.id}-error`), false);
  });
});

const handleFieldError = (field) => {
  field.style.borderColor = 'var(--main-clr)';
  handleVisibility(document.getElementById(`${field.id}-error`));
};

const formsData = {
  firstform: false,
  firstFormData: {},
  secondForm: false,
  secondFormData: {},
};

firstForm.addEventListener('submit', (e) => {
  e.preventDefault();

  let handleFirstStepErrors = 0;

  if (ageSelect.selectedIndex === 0) {
    handleFieldError(ageSelect);
    handleFirstStepErrors++;
  }
  if (cdlSelect.selectedIndex === 0) {
    handleFieldError(cdlSelect);
    handleFirstStepErrors++;
  }
  if (experienceSelect.selectedIndex === 0) {
    handleFieldError(experienceSelect);
    handleFirstStepErrors++;
  }

  if (handleFirstStepErrors === 0) {
    formSteps.style.width = '100%';
    handleVisibility(e.target, false);
    handleVisibility(secondForm);
    backArrow.removeAttribute('disabled');
    formsData.firstform = true;
    formsData.firstFormData.age = ageSelect.value;
    formsData.firstFormData.cdl = cdlSelect.value;
    formsData.firstFormData.experience = experienceSelect.value;
  }
});

const nameRegex = /^[a-zA-Z\s]*$/;
const phoneRegex =
  /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/;
// prettier-ignore
const emailRegex =/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const nameInput = document.getElementById('enter-name');
const phoneInput = document.getElementById('enter-number');
const emailInput = document.getElementById('enter-email');
const inputArr = [nameInput, phoneInput, emailInput];
const overlay = document.querySelector('.overlay');
const modal = document.querySelector('.modal');

inputArr.forEach((inputEl) => {
  inputEl.addEventListener('focus', (e) => {
    e.target.style.borderColor = 'var(--gray-clr)';
    handleVisibility(document.getElementById(`${e.target.id}-error`), false);
  });
});

const sendData = async () => {
  overlay.classList.remove('hidden');
  modal.innerHTML = `<img class="loading" src="imgs/loading-icon.png" alt="Loading..." />`;
  try {
    const request = await fetch(
      `https://guerro-49b06-default-rtdb.firebaseio.com/applications.json`,
      {
        method: 'POST',
        body: JSON.stringify({
          name: formsData.secondFormData.name,
          phone: formsData.secondFormData.phone,
          email: formsData.secondFormData.email,
          age: formsData.firstFormData.age,
          cdl: formsData.firstFormData.cdl,
          experience: formsData.firstFormData.experience,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!request.ok) throw new Error(`Something's wrong, try again later!`);

    modal.innerHTML = ``;
    modal.insertAdjacentHTML(
      'afterbegin',
      `<h3>Application is successfully submitted!</h3>
    <button class="bkg--red btn--modal">Close</button>`
    );

    const modalCloseBtn = document.querySelector('.btn--modal');

    modalCloseBtn.addEventListener('click', closeModalHandler);
  } catch (err) {
    modal.innerHTML = err.message;
  }
};

secondForm.addEventListener('submit', (e) => {
  e.preventDefault();

  let handleSecondStepErrors = 0;

  if (!nameRegex.test(nameInput.value) || nameInput.value.length < 5) {
    handleFieldError(nameInput);
    handleSecondStepErrors++;
  }

  if (!phoneRegex.test(phoneInput.value)) {
    handleFieldError(phoneInput);
    handleSecondStepErrors++;
  }

  if (!emailRegex.test(emailInput.value)) {
    handleFieldError(emailInput);
    handleSecondStepErrors++;
  }

  if (handleSecondStepErrors === 0) {
    formsData.secondForm = true;
    formsData.secondFormData.name = nameInput.value;
    formsData.secondFormData.phone = phoneInput.value;
    formsData.secondFormData.email = emailInput.value;
    sendData();
  }
});

backArrow.addEventListener('click', (e) => {
  if (formsData.firstform === true) {
    handleVisibility(secondForm, false);
    handleVisibility(firstForm);
    formSteps.style.width = '50%';
    e.target.setAttribute('disabled', '');
  }
});

secondForm.addEventListener('touchstart', (e) => console.log('sss'));

function closeModalHandler() {
  location.reload();
}
