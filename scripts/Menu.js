function toggleMenu(elem) {
  if (elem.classList.contains('expanded')) {
    elem.classList.remove('expanded');
  } else {
    elem.classList.add('expanded');
  }
}

function toggleElem(elem) {
  if (elem.style.display == 'none') {
    elem.style.display = 'block';
  } else {
    elem.style.display = 'none';
  }
}

debugMenu.addEventListener('click', function () {
  toggleMenu(debugMenu);
});

gaugesMenu.addEventListener('click', function () {
  toggleMenu(gaugesMenu);
});

debugToggle.addEventListener('click', function () {
  toggleElem(modal);
});

rpmToggle.addEventListener('click', function () {
  toggleElem(rpm);
  toggleElem(rpmGauge);
  toggleElem(rpmScale);
});

socToggle.addEventListener('click', function () {
  toggleElem(soc);
  toggleElem(socBG);
});

tempsToggle.addEventListener('click', function () {
  toggleElem(temps);
});
