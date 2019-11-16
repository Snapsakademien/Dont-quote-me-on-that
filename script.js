// Used for  UI updates
var loggedIn;
var db = firebase.firestore();
var form = document.querySelector("#form");
form.addEventListener('submit', onSubmit);


function login(email, password){
    firebase.auth().singInWithEmailAndPassword(email, password).catch(function(error) {
        var errorCode = error.code;
        var errorMsg = error.message;
    });
}

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        loggedIn = true;
        var quotes = getQuotes();
        renderQuotes(quotes);
    } else {
        loggedIn = false;
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


getQuotes().then(function(quotes) {
    quotes.sort(function(a,b){
        return b.datetime.seconds - a.datetime.seconds;
    });
    renderQuotes(quotes);
});

function onSubmit(e){
    e.preventDefault();
    console.log(e);
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