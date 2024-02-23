import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.2/firebase-app.js';
import { getDatabase, ref, get, onValue } from 'https://www.gstatic.com/firebasejs/9.6.2/firebase-database.js';

// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyBgDR2vriErfaOSrC7QChEvV2yexqeFAMU",
    authDomain: "quasars-be893.firebaseapp.com",
    databaseURL: "https://quasars-be893-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "quasars-be893",
    storageBucket: "quasars-be893.appspot.com",
    messagingSenderId: "667170242653",
    appId: "1:667170242653:web:05324cfd8e846235520db4",
    measurementId: "G-FJZ8CMCPTC"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// reference to database
const database = getDatabase(firebaseApp);

const ctx = document.getElementById('powerChart').getContext('2d');

// initializing chart
const powerChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],  
        datasets: [{
            label: 'Power',
            data: [0],  
            borderColor:'purple',
            borderWidth: 2,
            fill: false,
            tension: 0.5
        }]
    },
    options: {
        scales: {
            x: {
                type: 'linear',  // 'linear' for time series
                position: 'bottom',
                ticks: {
                    callback: function (value, index, values) {
                        
                        return new Date(value).toLocaleTimeString();
                    }
                }
            },
            y: {
                beginAtZero: true
            }
        }
    }
});

// Reference to firebase data
const dataRef = ref(database, 'User/Power');


// max. no. of data points to display
const maxDataPoints = 10;

// initial value
get(dataRef).then((snapshot) => {
    const initialValue = snapshot.val();
    console.log('Initial Value:', initialValue);

    // updating chart data with initial value
    powerChart.data.labels = [new Date().getTime()];  
    powerChart.data.datasets[0].data = [initialValue];
    powerChart.update();
}).catch((error) => {
    console.error('Error fetching initial value:', error);
});

// checking changes in data
onValue(dataRef, (snapshot) => {
    const value = snapshot.val();

    if (value !== null) {
        // update chart data
        //const customLabel = 'Power'; // Replace this with your desired label
        const currentTime = new Date().getTime();
        powerChart.data.labels.push(currentTime);
        powerChart.data.datasets[0].data.push(value);


        // remove oldest data points if limit is reached
        while (powerChart.data.labels.length > maxDataPoints) {
            powerChart.data.labels.shift();
            powerChart.data.datasets[0].data.shift();
        }


        // Update chart
        powerChart.update();
    }
});