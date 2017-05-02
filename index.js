//Giantbomb API key
//79fbb0e3b137824088774e8af118892b8cb22e6e

const key = '79fbb0e3b137824088774e8af118892b8cb22e6e';

let submit;
let search;
const months = ['January','February','March','April','May','June','July','August','September','October', 'November', 'December'];
let arrResult = [];
let pageNumAll = 0;
let pageNum = 1; //current page of results (default is 1)

window.onload = runThis;

function runThis() {
  submit = document.getElementsByClassName('submit')[0];
  search = document.getElementsByClassName('search')[0];
  submit.addEventListener('click', resetPageNum);
  submit.addEventListener('click', getData);
  submit.classList.remove('fadeOut');
  search.classList.add('searchExpand');
  search.focus();

  //animations
  submit.addEventListener('click', removePad);
}

function removePad() {
    document.getElementsByClassName('bb')[0].classList.remove('bbPadded');
}

function toggleDisplay(elem) {
  elem.classList.toggle('removeDisplay');
}

function removeElem(elem) {
  elem.parentNode.removeChild(elem);
}

function resetPageNum() {
  pageNum = 1;
  if(pageNumAll !== 0) {
    pageNumAll = 0;
  }
}

function getData() {
  let answer = search.value;
  const jsonpScript = document.createElement('script');
  jsonpScript.id = 'jsonpScriptId';
  let jsonSrc = 'https://www.giantbomb.com/api/search/?api_key=' + key;
  jsonSrc += '&format=jsonp&json_callback=storeData&query=' + answer;
  jsonSrc += '&resources=game&field_list=deck,description,image,name,original_game_rating,original_release_date,platforms';
  jsonSrc += '&page=' + pageNum;
  jsonpScript.src = jsonSrc;
  document.head.appendChild(jsonpScript);
}

//note: callback should be in global scope
function storeData(s) {
  console.log(s);
  if(s.error === 'OK') {
    arrResult = s.results;
    pageNumAll = Math.ceil(s.number_of_total_results / 10);

    //create divs for list
    if(arrResult.length > 0) {

      createList();
      if(pageNum === 1) {
        prevNextButtons(); //should I pass anything to it?
      }
    } else {
      noResults();
    }
 }
}

function noResults() {
    let queryBtns = document.getElementsByClassName('queryBtns')[0];
    if(queryBtns!== undefined) {
      removeElem(queryBtns);
    }
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
  for(let i = 0; i < arrResult.length;i++) {
    let newDiv = document.createElement('div');
    if(arrResult[i].deck === null) {
      arrResult[i].deck = "Description for this game is unavailable";
    }
    newDiv.innerHTML = '<p><h2 class="titles">' + arrResult[i].name + '</h2></p><p>' + arrResult[i].deck + '</p>';
    newDiv.classList.add('results', 'listPad', 'fadeOut');
    newDiv.id = 'newdiv' + i;
    mainDiv.appendChild(newDiv);
    //insert before query buttons
    let queryBtnsNode = document.getElementsByClassName('queryBtns')[0];
    document.body.insertBefore(mainDiv, queryBtnsNode);
    document.getElementById('newdiv' + i).addEventListener('click', newPage);
    listAnimateLoop(i);
  }
}


function listAnimateLoop(i) {
  let j = 0;
  setTimeout(function() {
    document.getElementById('newdiv' + i).classList.remove('listPad', 'fadeOut');
    j++;
    if(j < arrResult.length) {
      listAnimateLoop(i);
    }
  }, 50);
}


function prevNextButtons() {
  let queryBtns = document.getElementsByClassName('queryBtns')[0];
  if(queryBtns!== undefined) {
    removeElem(queryBtns);
  }

  //create prev/next buttons for results
  let prev = document.createElement('button');
  let next = document.createElement('button');
  prev.classList.add('prev');
  next.classList.add('next');
  prev.addEventListener('click', prevNextQuery);
  next.addEventListener('click', prevNextQuery);
  prev.innerHTML = '<i class="fa fa-arrow-left" aria-hidden="true"></i>';
  next.innerHTML = '<i class="fa fa-arrow-right" aria-hidden="true"></i>';
  let newDiv = document.createElement('div');
  newDiv.classList.add('queryBtns');
  newDiv.appendChild(prev);
  newDiv.appendChild(next);
  document.body.appendChild(newDiv);
  if(pageNum === 1) {
    toggleDisplay(document.getElementsByClassName('prev')[0]);
  }
  //document.body.getElementsByClassName('main')[0].appendChild(next);
}

function prevNextQuery() {
  //goals:
  //prev/next buttons
  //considerations: is current page the first page?
  //how many pages in total?
  //detect whether you're in first or last page, and create buttons accordingly.
  //should you create buttons everytime? probably not!
  //separate function?
  //use &page in API call
  
  let prev = document.getElementsByClassName('prev')[0];
  if(this.className === 'prev') {
     pageNum--;
    if(pageNum <= pageNumAll && pageNumAll !== 0) {
      getData();
    }
  }
  if(this.className === 'next') {
    pageNum++;
    if(pageNum <= pageNumAll && pageNumAll !== 0) {
      getData();
      if(pageNum === pageNumAll) {
        this.classList.toggle('removeDisplay');
      }
      if(prev.classList.contains('removeDisplay')){
        toggleDisplay(prev);
      }
    }
  }
  if(pageNum === 1) {
    
  }
  setTimeout(backToTop, 400);
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
  let btnBack = document.getElementsByClassName('back-button')[0];
  if(btnBack === undefined) {
    let btnBack = document.createElement('button');
    btnBack.classList.add('back-button', 'fadeOut');
    btnBack.innerHTML = '<i class="fa fa-arrow-left" aria-hidden="true"></i>';
    document.body.getElementsByClassName('bb')[0].appendChild(btnBack);
    document.getElementsByClassName('back-button')[0].addEventListener('click', rebuildList);
  } else {
    toggleDisplay(btnBack); //btn.remove();
  }
}

function removeBackButton() {
  //remove back button
  let btnBack = document.getElementsByClassName('back-button')[0];
  toggleDisplay(btnBack); //btn.remove();

}

function newPage() {
  removeList();
  toggleDisplay(document.getElementsByClassName('queryBtns')[0]);
  createBackButton();
  backToTop();
  
  let i = (this.id).slice(-1, this.id.length);
  let mainDiv = document.createElement('div');
  mainDiv.classList.add('main', 'listPad', 'fadeOut');
  let newDiv = document.createElement('div');
  let newDesc = arrResult[i].description;
  
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
  if(arrResult[i].image !== null) {
    gameImg = '<img src=' + arrResult[i].image.thumb_url + ' class="gamePic">';
  } else {
    gameImg = '';
  }
  
  ///date for Release date
  let gameDate;
  if(arrResult[i].original_release_date === null) {
   let gameDate = "Release info not available";
 } else {
  let parsedDate = Date.parse(arrResult[i].original_release_date);
  let release = new Date(parsedDate);
  let d = release.getDate();
  let m = months[release.getMonth()];
  let y = release.getFullYear();
  gameDate = m + ' ' + d + ', ' + y;
 }
  
  ///Platform
  let platforms = [];
  let gameSystems = '';
  
  if(arrResult[i].platforms !== null) {
    for(let j = 0; j < arrResult[i].platforms.length;j++) {
      platforms.push(arrResult[i].platforms[j].name);
    }
    gameSystems = platforms.join(', ');
  }

   
  newDiv.innerHTML = gameImg 
    + '<div class="gameName"><h1>' + arrResult[i].name + '</h1></div>'
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
  let screenHeight = Math.max(window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight);
  let documentHeight = document.body.scrollHeight;

  let topAnchor = document.createElement('anchor');
  topAnchor.classList.add('backToTop', 'fadeOut');
  topAnchor.innerHTML = '<i class="fa fa-arrow-up" aria-hidden="true"></i>'
  topAnchor.addEventListener('click', backToTop);
  
  let aTop;
  window.onscroll = function() {
    aTop = document.getElementsByClassName('backToTop')[0];
    if(window.pageYOffset >= screenHeight && aTop === undefined) {
      mainDiv.appendChild(topAnchor);
      setTimeout(function() {
        aTop.classList.remove('fadeOut');
      },100);
    }
    if(window.pageYOffset < screenHeight && aTop !== undefined) {
      aTop.classList.add('fadeOut');
      aTop.parentNode.removeChild(aTop);
    }
  }
}

function rebuildList() {
  let x = document.getElementsByClassName('main')[0];
  if(x !== null && typeof(x) !== 'undefined') {
    removeList();
    removeBackButton();
    toggleDisplay(document.getElementsByClassName('queryBtns')[0])
    createList();
    window.onscroll = null;
  }
}

function backToTop() {
  document.body.scrollTop = document.documentElement.scrollTop = 0;
  let aTop = document.getElementsByClassName('backToTop')[0];
  if(aTop !== undefined) {
    aTop.parentNode.removeChild(aTop); //aTop.remove();
  }
}

//need:
//break down into pages,
//try to use methods, passing of arguments, DOM manipulation, objects, classList.toggle, display:none, button background:none
//maybe:
//trailer playing in background
//




