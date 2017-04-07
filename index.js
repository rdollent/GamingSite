//Giantbomb API key
//79fbb0e3b137824088774e8af118892b8cb22e6e

const key = '79fbb0e3b137824088774e8af118892b8cb22e6e';
let answer;

window.onload = runThis;

function runThis() {
  const submit = document.getElementById('submit');
  const search = document.getElementById('search');
  submit.addEventListener('click', getData);
  
  function getData() {
    answer = search.value;
    const jsonpScript = document.createElement('script');
    jsonpScript.id = 'jsonpScriptId'
    jsonpScript.src = `https://www.giantbomb.com/api/search/?api_key=${key}&format=jsonp&json_callback=storeData&query=${answer}&resources=game`;//&field_list=id,name,deck,image,original_release_date,platforms`;
    document.head.appendChild(jsonpScript);
  }
}

let arrResults = [];
//note: callback should be in global scope
function storeData(s) {
  console.log(s);
  if(s.error === "OK") {  
    arrResults = s.results;
    console.log(arrResults);
    //create divs for list
    createList();
 }
}

function createList() {
  removeList();
  let mainDiv = document.createElement('div');
  mainDiv.id = 'mainDiv';
  for(let i = 0; i < arrResults.length;i++) {
    let newDiv = document.createElement('div');
    newDiv.innerHTML = `<p><h2 class="titles">${arrResults[i].name}</h2></p><p>${arrResults[i].deck}</p>`;
    newDiv.className = 'results';
    newDiv.id = `newdiv${i}`;
    mainDiv.appendChild(newDiv);
    document.body.appendChild(mainDiv);
    document.getElementById(`newdiv${i}`).addEventListener('click', newPage);
  }
  let btn = document.getElementById('back-button');
  if(btn !== null) {
    btn.remove();
  }
}

function removeList() {
  let x = document.getElementById('mainDiv');
  let y = document.getElementById('jsonpScriptId');
  if(x !== null && typeof(x) !== 'undefined') {
    x.remove(); //document.body.removeChild(x);
  }
  if(y !== null && typeof(y) !== 'undefined') {
    y.remove(); //document.head.removeChild(y);  
  }
}

function createBackButton() {
  let btnBack = document.createElement('button');
  btnBack.id = 'back-button';
  btnBack.innerHTML = '<- Back to Results';
  document.body.appendChild(btnBack);
  document.getElementById('back-button').addEventListener('click', rebuildList);
}

function newPage() {
  removeList();
  createBackButton();
  let i = (this.id).slice(-1, this.id.length);
  let mainDiv = document.createElement('div');
  mainDiv.id = 'mainDiv';
  let newDiv = document.createElement('div');
  let newDesc = arrResults[i].description;
  
  ///modify description 
  newDesc = newDesc.replace(/\s(href=")[^"]+"/g, '');
  newDesc = newDesc.replace(/(<a)\s/g, "<span ");
  newDesc = newDesc.replace(/(<\/a>)/g, "</span>");
  newDesc = newDesc.replace(/\s(class=")[^"]+"/g, '');
  console.log(newDesc); 
  ////////////////////////////
  
  newDiv.innerHTML = newDesc;
  document.body.appendChild(mainDiv);
  mainDiv.appendChild(newDiv);

  //let tags = document.getElementsByTagName('a');
  //for(let i = 0; i < tags.length;i++) {
  //  
  //}
  //console.log(tags);
}

function rebuildList() {
  let x = document.getElementById('mainDiv');
  if(x !== null && typeof(x) !== 'undefined') {
    removeList();
    createList();
  }
}
