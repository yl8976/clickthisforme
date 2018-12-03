const firestore = firebase.firestore();
const settings = {/* Settings for more complex Firestore configs... */ timestampsInSnapshots: true};
firestore.settings(settings);

// Note to self: collections come first
const docRef = firestore.doc("data/buttonClicks");
const header = document.querySelector("#header");
const theButton = document.querySelector("#theButton");
const timer = document.querySelector("#timer");

// Stopwatch
var startTime = Date.now();

// Main Button Functionality
theButton.addEventListener("click", function () {
    // Read current button value
    var currentCount = parseInt(theButton.value);

    // Reset stopwatch
    startTime = Date.now();

    // Save data to Firestore
    docRef.set({
        clickNumber: ++currentCount,
        stopwatchTime: startTime,
    }).then(function () {
        console.log("Status saved!");
    }).catch(function (error) {
        console.log("Got an error: ", error);
    });

    
})

// Realtime Updates from Firestore
getRealTimeUpdates = function () {
    docRef.onSnapshot(function (doc) {
        if (doc && doc.exists) {
            // Fetch data from Firestore
            const myData = doc.data();
            theButton.innerText = myData.clickNumber;
            theButton.value = myData.clickNumber;
            startTime = myData.stopwatchTime;

            // Calculate time since last click
            var interval = setInterval(function() {
                var elapsedTime = Date.now() - startTime;
                if (elapsedTime < 0) elapsedTime = 0;
                document.getElementById("timer").innerHTML = (elapsedTime / 1000).toFixed(2);
            }, 47);
        }
    });
}

getRealTimeUpdates();