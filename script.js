var db = firebase.firestore();
var form = document.querySelector("#form");
var loginEl = document.querySelector("#login");
form.addEventListener('submit', onSubmit);
loginEl.addEventListener('submit', login);


firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        console.log("User logged in");
        
        getQuotes().then(function(quotes) {
            quotes.sort(function(a,b){
                return b.datetime.seconds - a.datetime.seconds;
            });
            renderQuotes(quotes);
        });
    } else {

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
    var quoteHTML = quotes.map(function(quote){
        return `<div class="citat-box">
        <div class="citat">${quote.quote}</div>
        <div class="person">
            <i>-${quote.who}, ${new Intl.DateTimeFormat("sv-SE").format(quote.datetime.toDate())}</i>
        </div>
    </div>`;
    });

    wrapper.innerHTML = quoteHTML.join('');
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
    }).catch(function(error){
        console.error("Error adding doc: ", error);
    });
}

function login(event){
    event.preventDefault();
    console.log(event);
    var email = event.target[0].value;
    var password = event.target[1].value;
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
        var errorCode = error.code;
        var errorMsg = error.message;
        alert('Login failed', errorCode, errorMsg);
    });
}