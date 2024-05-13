document.addEventListener('DOMContentLoaded', function() {

  var button = document.getElementById('appliedButton');
  button.addEventListener('click', async function(){

    //Wait for following function to finish executing
    let link = await getURL();
    //Need to get a unique job key
    let key = jobKey(link);
    //Then we call out request function to communicate with backend
    checkKeeper(key);
    //Alert User of checking
    alert('Saved');
  });
});

/* -------------------------------------------------------------- */
/* -----                     GETURL FUNCTION               -----  */
function getURL(){

  return new Promise((resolve, reject) => {
    chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
      let currentTabURL = tabs[0].url;
      resolve(currentTabURL);
    });

  });
}

/* -------------------------------------------------------------- */
/* -----                     JOBKEY FUNCTION               -----  */
function jobKey(link){

  console.log("JOB KEY URL:", link);
  const pattern = /\/jobs\/([\w\d]+)[^\w\d]?/;
  const match = link.match(pattern);

  if (match) {
    const identifier = match[1];
    console.log(identifier);
    return identifier;
  }

  return 'No ID Found';
}

/* -------------------------------------------------------------- */
/* -----               CHECK KEEPER FUNCTION               -----  */
async function checkKeeper(key){

  //sends message to the backend
  let backendURL = 'http://localhost:3000';
  let reqBody = {'KEY': key};
  /* GET Request 
  let options = {
	  method: 'GET',
	  headers: {
		  'Content-Type': 'application/json'
	  }
  };
  */
  let options = {
    method: 'POST',
    body: JSON.stringify(reqBody),
    headers: {
      'Content-Type': 'application/json'
    }
  };
  
  console.log("POST Request sent: KEY: " + key);
  try {

    const response = await fetch(backendURL, options);
    const result = await response.json();
    console.log(result);
  } catch (error) {
    console.error(error);
  }

}