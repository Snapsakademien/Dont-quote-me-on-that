var db = firebase.firestore();
var form = document.querySelector("#form");
var loginEl = document.querySelector("#login");
var citatFormBtn = document.querySelector(".btn-addQuote");
citatFormBtn.addEventListener('click', function(){toggleElement(form)});
form.addEventListener('submit', onSubmit);
loginEl.addEventListener('submit', login);

citatFormBtn.style.display = "none";
loginEl.style.display = "none";
form.style.display = "none";


firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        console.log("User logged in");
        loginEl.style.display = "none";
        citatFormBtn.style.display = "block";
        
        updateQuotes();
    } else {
        citatFormBtn.style.display = "none";
        loginEl.style.display = "block";
        console.log("User logged out");

    }
  });

  function getQuotes(){
      return db.collection("quotes").get().then(function(querySnapshot){
        return querySnapshot.docs.map(function(doc,i){
            return doc.data();
        });
      });
  }

  function renderQuotes(quotes){
    var wrapper = document.querySelector("#quotes");
    var quoteHTML = quotes.map(function(quote, i){
        return `<div class="citat-box" id="${i}">
        <div class="citat"><a class="link" href="#${i}">#${i}</a>${quote.quote}</div>
        <div class="person">
            <i>-${quote.who}, ${new Intl.DateTimeFormat("sv-SE").format(quote.datetime.toDate())}</i>
        </div>
    </div>`;
    });

    wrapper.innerHTML = quoteHTML.join('');
  }

  function updateQuotes(){
    getQuotes().then(function(quotes) {
        quotes.sort(function(a,b){
            return b.datetime.seconds - a.datetime.seconds;
        });
        renderQuotes(quotes);
    });
  }


//Form submissions

function onSubmit(e){
    e.preventDefault();

    console.log("Submitting form...");
    db.collection("quotes").add({
        quote: e.target[0].value,
        who: e.target[1].value,
        datetime: firebase.firestore.Timestamp.fromDate(new Date())
    }).then(function(docref){
        console.log(docref + " successfully added.");
        updateQuotes();
    }).catch(function(error){
        alert('Could not submit. Are you logged in?');
        console.error("Error adding doc: ", error);
    });
    
    e.target[0].value = "";
    e.target[1].value = "";
}

function login(event){
    event.preventDefault();
    console.log(event);
    var email = event.target[0].value;
    var password = event.target[1].value;
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
        var errorCode = error.code;
        var errorMsg = error.message;
        alert("Login failed. Try again. Bitch. I've got all day.");
    });
}

function toggleElement(el){
    el.style.display = el.style.display === "none" ? "block": "none";
}

// Install Service Workers because PWAs are cool
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('/sw.js').then(function(registration) {
        // Registration was successful
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      }, function(err) {
        // registration failed :(
        console.log('ServiceWorker registration failed: ', err);
      });
    });
  }
