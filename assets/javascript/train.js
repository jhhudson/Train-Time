// console.log("Hello");

// Initialize Firebase
var config = {
    apiKey: "AIzaSyCedNHQpDm_P3y6W0bXa9F5npSdYdQr-4E",
    authDomain: "trainproject-ccc10.firebaseapp.com",
    databaseURL: "https://trainproject-ccc10.firebaseio.com",
    projectId: "trainproject-ccc10",
    storageBucket: "trainproject-ccc10.appspot.com",
    messagingSenderId: "987618951506"
};

firebase.initializeApp(config);

var database = firebase.database();

// Initial Values
var trainName = "";
var destination = "";
var firstTrainTime = "";
var frequency = 0;

// Button for adding trains
$("#add-train").on("click", function (event) {
    
    event.preventDefault();

    // Logic for storing and retrieving the most recent user.
    trainName = $("#trainname-input").val().trim();
    destination = $("#destination-input").val().trim();
    // Grabbing the value and displaying it in 24-hr format moment(randomdate, randomformat)
    firstTrainTime = moment($("#firsttraintime-input").val(), "HH:mm").format("HH:mm");
    frequency = $("#frequencyminutes-input").val();
    
    // Code for the push to the database
    database.ref().push({

        trainName: trainName,
        destination: destination,
        firstTrainTime: firstTrainTime,
        frequency: frequency,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });

    // Clears all text boxes
    $("#trainName-input").val("");
    $("#destination-input").val("");
    $("#firstTrainTime-input").val("");
    $("#frequency-input").val("");
});

// Firebase event for adding trains to the database and row in the html when user adds an entry
database.ref().on("child_added", function (childSnapshot) {

    console.log(childSnapshot.val());

    // Store everything into a variable.
    var sv = childSnapshot.val();

    // console log the last user's data
    console.log(sv.trainName);
    console.log(sv.destination);
    console.log(sv.firstTrainTime);
    console.log(sv.frequency);

    //sec from 1970 till firstTime
    var firstTimeConverted = moment(sv.firstTrainTime, "HH:mm");
    //alert("firstTimeconverted " + firstTimeConverted);

    //minutes from first train
    var trMinutesFromFirst = moment().diff(moment(firstTimeConverted), "minutes");
    //alert("minutes from first train: " + trMinutesFromFirst);

    //minutes till next train
    var trMinutesLeft = sv.frequency - (trMinutesFromFirst % sv.frequency);
    //alert("Minutes till next train: " + trMinutesLeft);

    var nextArrival = moment().add(trMinutesLeft, "minutes").format("HH:mm");
    // alert("Next arrival " + nextArrival);
    
    var newRow = $("<tr>").append(
        $("<td>").text(sv.trainName),
        $("<td>").text(sv.destination),
        $("<td>").text(sv.frequency),
        $("<td>").text(nextArrival),
        $("<td>").text(trMinutesLeft),
    );

    // Append the new row to the table
    $("#train-schedule > tbody").append(newRow);
    
    // function (errorObject) {
    //     console.log("Errors handled: " + errorObject.code);
    // };

});
    

