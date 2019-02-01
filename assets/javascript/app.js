// Initialize Firebase
var config = {
  apiKey: "AIzaSyDFBjEYuvV34AKi2d5KHpIyzLR6ifpjdQk",
  authDomain: "train-scheduler-dd1f9.firebaseapp.com",
  databaseURL: "https://train-scheduler-dd1f9.firebaseio.com",
  projectId: "train-scheduler-dd1f9",
  storageBucket: "train-scheduler-dd1f9.appspot.com",
  messagingSenderId: "19232104717"
};
firebase.initializeApp(config);

  let trainName = "";
  let destination= "";
  let frequency = "";
  let firstTrainTime = 0;
  let nextArrival = "";
  let minutesAway = 0;
  
  $("#run-search").on("click", function(event) {
    // Don't refresh the page!
    event.preventDefault();

    // YOUR TASK!!!
    // Code in the logic for storing and retrieving the most recent user.
    // Don't forget to provide initial data to your Firebase database.
    trainName = $("#name-input")
      .val()
      .trim();
    destination = $("#destination-input")
      .val()
      .trim();
    frequency = $("#frequency-input")
      .val()
      .trim();
    firstTrainTime = $("#firstTrainTime-input")
      .val()
      .trim();

    database.ref().push({
      trainName: trainName,
      destination: destination,
      frequency: frequency,
      firstTrainTime: firstTrainTime,
      daded: firebase.database.ServerValue.TIMESTAMP
    });
  });


// Create a variable to reference the database
var database = firebase.database();


  database.ref().on(
    "value",
    function(snapshot) {    
      $("#name-input").append(snapshot.val().trainName);
      $("#destination-input").append(snapshot.val().destination);
      $("#frequency-input").append(snapshot.val().frequency);
      $("#firstTrainTime-unput").append(snapshot.val().firstTrainTime);

    //   $("#full-member-list").append(
    //     "<div class='well'><span class='member-name'> " +
    //       childSnapshot.val().name +
    //       " </span><span class='member-email'> " +
    //       childSnapshot.val().role +
    //       " </span><span class='member-age'> " +
    //       childSnapshot.val().startDate +
    //       " </span><span class='member-comment'> " +
    //       childSnapshot.val().monthlyRate +
    //       " </span></div>"
    //   );

    },
    function(errorObject) {
      console.log("The read failed: " + errorObject.code);
    }
    
  );
  
  firebase.database().ref().on("child_added", function (snapshot) {

    let convertedFirstTrainTime = moment(snapshot.val().firstTrainTime, "HH:mm");
    console.log('First Train Time ' + convertedFirstTrainTime);
    let diffTime = moment().diff(moment(convertedFirstTrainTime), "minutes");
    console.log(diffTime);
    let tRemainder = diffTime % snapshot.val().frequency;
    console.log('Time Remaining ' + tRemainder);
    let minutesAway = snapshot.val().frequency - tRemainder;
    console.log('Minutes Away ' + minutesAway);

    nextArrival = moment(moment().add(minutesAway, "minutes")).format("hh:mm");
    
    console.log('Next Arrival ' + nextArrival);
    

    $("#train-table").append("<tr>");
    $("#train-table").append("<td>" + snapshot.val().trainName);
    $("#train-table").append("<td>" + snapshot.val().destination);
    $("#train-table").append("<td>" + snapshot.val().frequency);
    $("#train-table").append("<td>" + nextArrival);
    $("#train-table").append("<td>" + minutesAway);
    $("#train-table").append("<hr>");  
})

  
  

