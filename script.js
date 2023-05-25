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

const mainIllustration = document.querySelector('.main--img');
const observerElms = document.querySelectorAll('[data-observe]');

//INTERSECTION OBSERVER:
const observerFun = (entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const elClasses = entry.target.dataset.observe.split(' ');
      elClasses.forEach((cl) => entry.target.classList.remove(cl));
    }
  });
};

const observerOptions = {
  threshold: 0.75,
};

const observer = new IntersectionObserver(observerFun, observerOptions);

observerElms.forEach((el) => observer.observe(el));

//FORM SUBMIT:
const form = document.getElementById('form');
const firstFormBtn = form.querySelector('button[type="button"]');
const firstFormWrapper = document.querySelector('.first-form--wrapper');
const secondFormWrapper = document.querySelector('.second-form--wrapper');
// prettier-ignore
const selectArr = [document.getElementById('choose-age'), document.getElementById('choose-cdl'), document.getElementById('choose-experience')];
const formSteps = document.querySelector('.apply-today--form-steps')
  .children[0];

const nameInput = document.getElementById('enter-name');
const phoneInput = document.getElementById('enter-number');
const emailInput = document.getElementById('enter-email');
const inputArr = [nameInput, phoneInput, emailInput];
const overlay = document.querySelector('.overlay');
const modal = document.querySelector('.modal');
const modalCloseBtn = document.querySelector('.btn--modal');
const backArrow = document.querySelector('.back-arrow');
const nameRegex = /^[a-zA-Z\s]*$/;
const phoneRegex =
  /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/;
// prettier-ignore
const emailRegex =/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

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

firstFormBtn.addEventListener('click', () => {
  let handleFirstStepErrors = 0;

  const emptySelect = selectArr.filter((select) => select.selectedIndex === 0);

  emptySelect.forEach((select) => {
    handleFieldError(select);
    handleFirstStepErrors++;
  });

  if (handleFirstStepErrors === 0) {
    formSteps.style.width = '100%';
    handleVisibility(firstFormWrapper, false);
    handleVisibility(secondFormWrapper);
    backArrow.removeAttribute('disabled');
  }
});

function closeModalHandler() {
  location.reload();
}

form.addEventListener('submit', (e) => {
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
    overlay.classList.remove('hidden');
    setTimeout(() => {
      form.submit();
    }, 1000);
  }
});

modalCloseBtn.addEventListener('click', closeModalHandler);

inputArr.forEach((inputEl) => {
  inputEl.addEventListener('focus', (e) => {
    e.target.style.borderColor = 'var(--gray-clr)';
    handleVisibility(document.getElementById(`${e.target.id}-error`), false);
  });
});

backArrow.addEventListener('click', (e) => {
  handleVisibility(secondFormWrapper, false);
  handleVisibility(firstFormWrapper);
  formSteps.style.width = '50%';
  e.target.setAttribute('disabled', '');
});

const calculateCoordsDiff = (start, end) => {
  return end - start;
};

const touchCoordsFirstForm = {
  startingCoord: 0,
  endingCoord: 0,
};

firstFormWrapper.addEventListener('touchstart', (e) => {
  touchCoordsFirstForm.startingCoord = e.changedTouches[0].clientX;
});

firstFormWrapper.addEventListener('touchend', (e) => {
  touchCoordsFirstForm.endingCoord = e.changedTouches[0].clientX;

  const coordsDifference = calculateCoordsDiff(
    touchCoordsFirstForm.startingCoord,
    touchCoordsFirstForm.endingCoord
  );

  if (-coordsDifference > firstFormWrapper.clientWidth / 2)
    firstFormBtn.dispatchEvent(new Event('click'));
});

//SECOND FORM TOUCH EVENTS

const touchCoordsSecondForm = {
  startingCoord: 0,
  endingCoord: 0,
};

secondFormWrapper.addEventListener('touchstart', (e) => {
  touchCoordsSecondForm.startingCoord = e.changedTouches[0].clientX;
});

secondFormWrapper.addEventListener('touchend', (e) => {
  touchCoordsSecondForm.endingCoord = e.changedTouches[0].clientX;

  const coordsDifference = calculateCoordsDiff(
    touchCoordsSecondForm.startingCoord,
    touchCoordsSecondForm.endingCoord
  );

  if (-coordsDifference > secondFormWrapper.clientWidth / 2)
    form.dispatchEvent(new Event('submit'));

  if (coordsDifference > secondFormWrapper.clientWidth / 2)
    backArrow.dispatchEvent(new Event('click'));
});
