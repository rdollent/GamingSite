///Giantbomb API key
//79fbb0e3b137824088774e8af118892b8cb22e6e

const key = '79fbb0e3b137824088774e8af118892b8cb22e6e';

function getData(s) {
  console.log(s);
}

window.onload = runThis;

function runThis() {
  const submit = document.getElementById('submit');
  const search = document.getElementById('search');
  submit.addEventListener('click', clickThis);


  
  function clickThis() {
    let ans = search.value;
    const jsonpScript = document.createElement('script');
    jsonpScript.src = `https://www.giantbomb.com/api/search/?api_key=${key}&format=jsonp&json_callback=getData&query=${ans}&resources=game`;
    document.head.appendChild(jsonpScript);

  }
    




}

