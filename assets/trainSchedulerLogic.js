/* global firebase moment */
// Steps to complete:

// 1. Initialize Firebase
// 2. Create button for adding new employees - then update the html + update the database
// 3. Create a way to retrieve employees from the employee database.
// 4. Create a way to calculate the months worked. Using difference between start and current time.
//    Then use moment.js formatting to set difference in months.
// 5. Calculate Total billed

// 1. Initialize Firebase
var config = {
    apiKey: "AIzaSyDnMIS79QI5klYeLMRFtkJxDNLnEROnBtE",
    authDomain: "train-scheduler-a0b85.firebaseapp.com",
    databaseURL: "https://train-scheduler-a0b85.firebaseio.com",
    projectId: "train-scheduler-a0b85",
    storageBucket: "train-scheduler-a0b85.appspot.com",
    messagingSenderId: "49228981702"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

// 2. Button for adding train schedule
$("#submit").on("click", function(event){
    event.preventDefault();

    //Grab inputs
    var trainName=$("#trainNameInput").val().trim();
    var destination=$("#destinationInput").val().trim();
    var trainTime=moment($("#trainTimeInput").val().trim(),"h:mm A").format("HH:mm") ;
    var frequency=$("#frequencyInput").val().trim();

    // Create local "temporary"object for holding train schedule data

    var newTrain = {
        name: trainName,
        destination: destination,
        time: trainTime,
        frequency: frequency
    };

    // Uploads train schedule data to the database
    database.ref().push(newTrain);

    // Logs everything into the console
    console.log(newTrain.name);
    console.log(newTrain.destination);
    console.log(newTrain.time);
    console.log(newTrain.frequency);

    // Clear all of the text-boxes
    $("#trainNameInput").val("");
    $("#destinationInput").val("");
    $("#trainTimeInput").val("");
    $("#frequencyInput").val("");
});

// 3. Create Firebase event for adding train schedules to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot, prevChildKey){

    console.log(childSnapshot.val());

    // Store everything into a variable.
    var trainName=childSnapshot.val().name;
    var destination=childSnapshot.val().destination;
    var trainTime=childSnapshot.val().time ;
    var frequency=childSnapshot.val().frequency;

    // Train Schedule Info
    console.log(trainName);
    console.log(destination);
    console.log(trainTime);
    console.log(frequency);

    var trainTimeConverted = moment(trainTime, "H:mm").subtract(1, "years");
    console.log(trainTimeConverted);

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("H:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(trainTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % frequency;
    console.log(tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = frequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("H:mm"));

    $("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" +
  frequency + "</td><td>" + moment(nextTrain).format("H:mm") + "</td><td>" + tMinutesTillTrain + "</td></tr>");
})