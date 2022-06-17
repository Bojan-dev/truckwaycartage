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
