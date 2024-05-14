document.addEventListener('DOMContentLoaded', function() {

  //Connecting buttons
  var companyText = document.getElementById('companyText');
  var checkButton = document.getElementById('checkButton');
  var appliedButton = document.getElementById('appliedButton');

  /* --- Check Button Listener --- */
  checkButton.addEventListener('click', async function(){

    //Making key
    let keeperKey = null;
    try{
      keeperKey = await makeKey(companyText.value);
    } catch(error){
      console.error('Error making key: ', error);
    }
    
    //Call out request function to check for a matching key
    checkKeeper(keeperKey);
    alert('Checking');
  });

  /* --- Applied Button Listener --- */
  appliedButton.addEventListener('click', async function(){

    //Making Key
    let keeperKey = null;
    try{
      keeperKey = await makeKey(companyText.value);
    } catch(error){
      console.error('Error making key: ', error);
    }

    //Getting date
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0');
    let yyyy = today.getFullYear();
    let date = mm + '/' + dd + '/' + yyyy;
    console.log("Date Applied: ", date);
    setKey(keeperKey, date);
    //Alert User of checking
    alert('Applied');
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
  let keyFound = 'No ID Found';

  //checks for path /jobs/[key]
  let pattern = /\/jobs\/([\w\d]+)[^\w\d]?/;
  let match = link.match(pattern);
  if(match){
    
    keyFound = match[1];
    console.log("Found Key: ", keyFound);
    return keyFound;
  }

  //checks for path /job/[key]
  pattern = /\/job\/([\w\d]+)[^\w\d]?/;
  match = link.match(pattern);
  if(match){
    
    keyFound = match[1];
    console.log("Found Key: ", keyFound);
    return keyFound;
  }

  //checks for jobID in link jobid=[key]
  pattern = /jobid=([a-zA-Z0-9]+)/i;
  match = link.match(pattern);
  if(match){

    keyFound = match[1];
    console.log("Found Key: ", keyFound);
    return keyFound;
  }

  //checks for jid in link jid=[key]
  pattern = /jid=([a-zA-Z0-9]+)/i;
  match = link.match(pattern);
  if(match){

    keyFound = match[1];
    console.log("Found Key: ", keyFound);
    return keyFound;
  }

  return keyFound;
}

/* -------------------------------------------------------------- */
/* -----                 MAKE KEY FUNCTION                 -----  */
async function makeKey(companyName){

  //Checking for valid input for Company Name
  if(!companyName){
    throw new Error('Company name is required');
  }

  //Wait for following function to finish executing
  let link = await getURL();
  //Need to get a unique job key
  let jKey = jobKey(link);
  //Make a key with company name and the job id
  let keeperKey = companyName + '-' + jKey;
  console.log("Key Configured: ", keeperKey);
  return keeperKey;
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

/* -------------------------------------------------------------- */
/* -----                 SET KEY FUNCTION                  -----  */
async function setKey(key, date){

  let backendURL = 'http://localhost:3000';
  let reqBody = {'KEY': key, 'DATE': date};
  let options = {
    method: 'POST',
    body: JSON.stringify(reqBody),
    headers: {
      'Content-Type': 'application/json'
    }
  };

  console.log("POST Request sent: ", reqBody);
  try{

    const response = await fetch(backendURL, options);
    const result = await response.json();
    console.log(result);
  } catch (error){
    console.error(error);
  }

}