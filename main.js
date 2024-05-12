document.addEventListener('DOMContentLoaded', function() {

  var button = document.getElementById('appliedButton');
  button.addEventListener('click', async function(){

    //Wait for following function to finish executing
    let link = await getURL();
    //Then we call out request function to communicate with backend
    checkKeeper(link);
    //Alert User of checking
    alert('Saved');
  });
});

/* -------------------------------------------------------------- */
//grabs url
function getURL(){

  return new Promise((resolve, reject) => {
    chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
      let currentTabURL = encodeURIComponent(tabs[0].url);
      console.log(currentTabURL);
      resolve(currentTabURL);
    });

  });
}

/* -------------------------------------------------------------- */
//sends message to the backend
async function checkKeeper(url){

  let backendURL = 'http://localhost:3000';
  let reqBody = {'URL': url};
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
  
  console.log("URL: " + url);
  try {

    const response = await fetch(backendURL, options);
    const result = await response.json();
    console.log(result);
  } catch (error) {
    console.error(error);
  }

}