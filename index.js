//Giantbomb API key
//79fbb0e3b137824088774e8af118892b8cb22e6e

const key = '79fbb0e3b137824088774e8af118892b8cb22e6e';

let submit;
let search;
const months = ['January','February','March','April','May','June','July','August','September','October', 'November', 'December'];


window.onload = runThis;

function runThis() {
  submit = document.getElementsByClassName('submit')[0];
  search = document.getElementsByClassName('search')[0];
  submit.addEventListener('click', getData);
  submit.classList.remove('fadeOut');
  search.classList.add('searchExpand');
  search.focus();
  
  function getData() {
    let answer = search.value;
    const jsonpScript = document.createElement('script');
    jsonpScript.id = 'jsonpScriptId';
    let jsonSrc = 'https://www.giantbomb.com/api/search/?api_key=' + key;
    jsonSrc += '&format=jsonp&json_callback=storeData&query=' + answer;
    jsonSrc += '&resources=game&field_list=deck,description,image,name,original_game_rating,original_release_date,platforms';
    jsonpScript.src = jsonSrc;
    document.head.appendChild(jsonpScript);
  }
  
  //animations
  submit.addEventListener('click', removePad);
  
  function removePad() {
    document.getElementsByClassName('bb')[0].classList.remove('bbPadded');
  }
  
}

let arrResults = [];

//note: callback should be in global scope
function storeData(s) {
  if(s.error === 'OK') {
    arrResults = s.results;
   
    //create divs for list
    if(arrResults.length > 0) {
      createList();
    } else {
      noResults();
    }

 }
}

function noResults() {
    removeList();
    let mainDiv = document.createElement('div');
    mainDiv.classList.add('main', 'fadeOut', 'listPad');
    let newDiv = document.createElement('div');
    newDiv.innerHTML = '<h2>Your search yielded no results. Please try again.</h2>';
    mainDiv.appendChild(newDiv);
    document.body.appendChild(mainDiv);
    setTimeout(function() {
          document.getElementsByClassName('main')[0].classList.remove('listPad','fadeOut');
    },200);
}

function createList() {
  removeList();
  let mainDiv = document.createElement('div');
  mainDiv.classList.add('main');
  for(let i = 0; i < arrResults.length;i++) {
    let newDiv = document.createElement('div');
    newDiv.innerHTML = '<p><h2 class="titles">' + arrResults[i].name + '</h2></p><p>' + arrResults[i].deck + '</p>';
    newDiv.classList.add('results', 'listPad', 'fadeOut');
    newDiv.id = 'newdiv' + i;
    mainDiv.appendChild(newDiv);
    document.body.appendChild(mainDiv);
    document.getElementById('newdiv' + i).addEventListener('click', newPage);
    let j = 0;
    function myLoop() {
      setTimeout(function() {
        document.getElementById('newdiv' + i).classList.remove('listPad', 'fadeOut');
        j++;
        if(j < arrResults.length) {
          myLoop();
        }
      }, 100);
    }
    myLoop();
  }
  
  let btn = document.getElementsByClassName('back-button')[0];
  console.dir(btn);
  if(btn !== undefined) {
    document.body.childNodes[1].removeChild(btn); //btn.remove();
  }
}

function removeList() {
  let x = document.getElementsByClassName('main')[0];
  let y = document.getElementById('jsonpScriptId');
  if(x !== null && typeof(x) !== 'undefined') {
    document.body.removeChild(x); //x.remove();
  }
  if(y !== null && typeof(y) !== 'undefined') {
    document.head.removeChild(y); //y.remove();
  }
}

function createBackButton() {
  let btnBack = document.createElement('button');
  btnBack.classList.add('back-button', 'fadeOut');
  btnBack.innerHTML = '<i class="fa fa-arrow-left" aria-hidden="true"></i>';
  document.body.getElementsByClassName('bb')[0].appendChild(btnBack);
  document.getElementsByClassName('back-button')[0].addEventListener('click', rebuildList);
}

function newPage() {
  removeList();
  createBackButton();
  backToTop();
  
  let i = (this.id).slice(-1, this.id.length);
  let mainDiv = document.createElement('div');
  mainDiv.classList.add('main', 'listPad', 'fadeOut');
  let newDiv = document.createElement('div');
  let newDesc = arrResults[i].description;
  
  ///modify description
  if(newDesc !== null) {
    newDesc = newDesc.replace(/\s(href=")[^"]+"/g, '')
                     .replace(/(<a)\s/g, "<span ")
                     .replace(/(<\/a>)/g, "</span>")
                     .replace(/\s(class=")[^"]+"/g, '')
                     .replace(/(width:\s\d+px)/gi, 'width:80% ');
  } else {
    newDesc = "<h2> There is no data for this game </h2>";
  }
  ////////////////////////////
  
  //image
  let gameImg;
  if(arrResults[i].image !== null) {
    gameImg = '<img src=' + arrResults[i].image.thumb_url + ' class="gamePic">';
  } else {
    gameImg = '';
  }
  
  ///date for Release date
  let parsedDate = Date.parse(arrResults[i].original_release_date);
  let release = new Date(parsedDate);
  let d = release.getDate();
  let m = months[release.getMonth()];
  let y = release.getFullYear();
  let gameDate = m + ' ' + d + ', ' + y;
  
  ///Platform
  let platforms = [];
  let gameSystems = '';
  
  if(arrResults[i].platforms !== null) {
    for(let j = 0; j < arrResults[i].platforms.length;j++) {
      platforms.push(arrResults[i].platforms[j].name);
    }
    gameSystems = platforms.join(', ');
  }

   
  newDiv.innerHTML = gameImg 
    + '<div class="gameName"><h1>' + arrResults[i].name + '</h1></div>'
    + '<p class="release"><strong>Release Date:</strong><br>' + gameDate + '</p>'
    + '<p class="platforms"><strong>Platforms:</strong><br>' + gameSystems + '</p>'
    + newDesc;
  document.body.appendChild(mainDiv);
  mainDiv.appendChild(newDiv);

  //check to see if there are any <a> anchor tags
  //let tags = document.getElementsByTagName('a');
  //for(let i = 0; i < tags.length;i++) {
  //console.log(tags);
  //  
  //}


  setTimeout(function() {
    document.getElementsByClassName('main')[0].classList.remove('listPad', 'fadeOut');
    document.getElementsByClassName('back-button')[0].classList.remove('fadeOut');
  },200);
  
  ///back to top scroll
  let screenHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  let documentHeight = document.body.scrollHeight;

  let topAnchor = document.createElement('anchor');
  topAnchor.classList.add('backToTop', 'fadeOut');
  topAnchor.innerHTML = '<i class="fa fa-arrow-up" aria-hidden="true"></i>'
  topAnchor.addEventListener('click', backToTop);
  let aStatus = false;
  window.onscroll = function() {
    if(window.pageYOffset >= screenHeight && !aStatus && document.getElementsByClassName('backToTop')[0] === undefined) {
      mainDiv.appendChild(topAnchor);
      aStatus = true;
      setTimeout(function() {
        document.getElementsByClassName('backToTop')[0].classList.remove('fadeOut');
      },200);
    } else if(window.pageYOffset < screenHeight && aStatus && document.getElementsByClassName('backToTop')[0] !== undefined){
      setTimeout(function() {
        document.getElementsByClassName('backToTop')[0].classList.add('fadeOut');
      },100);
      setTimeout(function() {
        document.body.removeChild(document.getElementsByClassName('backToTop')[0]); //document.getElementsByClassName('backToTop')[0].remove();
      },200);
      aStatus = false;
    }
  }
}

function rebuildList() {
  let x = document.getElementsByClassName('main')[0];
  if(x !== null && typeof(x) !== 'undefined') {
    removeList();
    createList();
  }
}

function backToTop() {
  document.body.scrollTop = document.documentElement.scrollTop = 0;
  let aTop = document.getElementsByClassName('backToTop');
  if(aTop[0] !== undefined) {
    document.body.removeChild(aTop); //aTop.remove();
  }
}

//need:
//break down into pages,
//try to use methods, passing of arguments, DOM manipulation
//maybe:
//trailer playing in background




