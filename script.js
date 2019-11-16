// Used for  UI updates
var loggedIn;

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
      var db = firebase.firestore();
      return db.collection("quotes").get().then(function(querySnapshot){
        return querySnapshot.docs.map(function(doc,i){
            return doc.data();
        });
      });
  }

  function renderQuotes(quotes){
    console.log(quotes.length);
    var wrapper = document.querySelector(".wrapper");
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

  function postQuote(quote, name){

  }

getQuotes().then(function(quotes) {
    renderQuotes(quotes);
});
