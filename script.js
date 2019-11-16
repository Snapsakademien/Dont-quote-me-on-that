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
      db.collection("quotes").get().then(function(querySnapshot){
        return querySnapshot.map(function(doc){
            return doc.data();
        });
      });

  }

  function renderQuotes(quotes){

  }

  function postQuote(quote, name){

  }

  getQuotes();