function resizeGridItem(item){
  grid = document.getElementsByClassName("grid")[0];
  rowHeight = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-auto-rows'));
  rowGap = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-row-gap'));
  rowSpan = Math.ceil((item.querySelector('.content').getBoundingClientRect().height+rowGap)/(rowHeight+rowGap));
    item.style.gridRowEnd = "span "+rowSpan;
}

function resizeAllGridItems(){
  onDomLoad();
  allItems = document.getElementsByClassName("temple");
  for(x=0;x<allItems.length;x++){
    resizeGridItem(allItems[x]);
  }
}

function resizeInstance(instance){
  item = instance.elements[0];
  resizeGridItem(item);
}

window.onload = resizeAllGridItems();
window.addEventListener("resize", resizeAllGridItems);

allItems = document.getElementsByClassName("temple");
for(x=0;x<allItems.length;x++){
  imagesLoaded( allItems[x], resizeInstance);
}

// Function to update content based on selected language
function updateContent(langData) {
  document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      element.textContent = langData[key];
  });
}

// Function to set the language preference
function setLanguagePreference(lang) {
  localStorage.setItem('language', lang);
  location.reload();
}

// Function to fetch language data
async function fetchLanguageData(lang) {
  const response = await fetch(`static/js/${lang}.json`);
  return response.json();
}

// Function to change language
async function changeLanguage(lang) {
  await setLanguagePreference(lang);
  
  const langData = await fetchLanguageData(lang);
  updateContent(langData);
}

// Call updateContent() on page load
async function onDomLoad() {
  const userPreferredLanguage = localStorage.getItem('language') || 'en';
  const langData = await fetchLanguageData(userPreferredLanguage);

  const langCheckbox = document.getElementById('langchk');
  langCheckbox.checked = (userPreferredLanguage === 'ka');

  // Event listener for the language toggle switch
  langCheckbox.addEventListener('change', async () => {
      const newLanguage = langCheckbox.checked ? 'ka' : 'en';
      await changeLanguage(newLanguage);
  });
  updateContent(langData);
}


document.querySelectorAll('.audio-player').forEach(player => {
  const audio = player.querySelector('.audioElement');
  const button = player.querySelector('.playPauseButton');

  audio.src = player.getAttribute('data-audio-src');

  button.addEventListener('click', () => {
    const audTimeout = setTimeout(() => {
      button.classList.remove('active');
    }, audio.duration * 1000);
    if (audio.paused) {
        audio.play();
        button.classList.add('active');
    } else {
        clearTimeout(audTimeout);
        audio.pause();
        button.classList.remove('active');
    }
  });

  audio.addEventListener('play', () => {
      document.querySelectorAll('.audio-player').forEach(otherPlayer => {
          if (otherPlayer !== player) {
              const otherAudio = otherPlayer.querySelector('.audioElement');
              const otherButton = otherPlayer.querySelector('.playPauseButton');
              otherAudio.pause();
              const audTimeout = setTimeout(() => {
                otherButton.classList.remove('active');
              }, 0);
          }
      });
  });
});