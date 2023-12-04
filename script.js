const myStopwatches = {};
const storage = JSON.parse(localStorage.getItem(0)) || {}
const myButtons = {};
const symbols = {"start" : ["fa-regular", "fa-circle-play"], "stop":["fa-regular", "fa-circle-pause"], "reset":["fa-solid", "fa-rotate-right"], "delete":["fa-solid", "fa-circle-xmark"]}

class StopWatch {
    constructor(task, name, id){
        this.id = task.id || id;
        this.name = task.name || name;
        this.startTime = task.startTime || 0;
        this.duration = task.duration || 0;
        this.timer = task.timer || false;
    }

    stopWatch(){
        if(this.timer) {
            this.duration = Date.now() - this.startTime;
            this.update();
            setTimeout(this.stopWatch.bind(this), 10);
        }
    }

    update(){
        let hour = Math.floor(this.duration / (1000 * 60 * 60));
        let min = Math.floor((this.duration / (1000 * 60)) % 60);
        let sec = Math.floor((this.duration / 1000) % 60);
        let count = Math.floor((this.duration / 10)).toString();

        document.getElementById('hr' + this.id).innerHTML = hour < 10 ? "0" + hour : hour;
        document.getElementById('min' + this.id).innerHTML = min < 10 ? "0" + min : min;
        document.getElementById('sec' + this.id).innerHTML = sec < 10 ? "0" + sec : sec;
        document.getElementById('count' + this.id).innerHTML = count < 10 ? "0" + count : count.slice(count.length - 2, count.length);
    }

    reset(){
        this.timer = false;
        this.duration = 0;
        document.getElementById('hr' + this.id).innerHTML = "00";
        document.getElementById('min' + this.id).innerHTML = "00";
        document.getElementById('sec' + this.id).innerHTML = "00";
        document.getElementById('count' + this.id).innerHTML = "00";
    }
    delete(){
        this.timer = false;
        document.getElementById('container' + this.id).remove();
        delete(myStopwatches[this.id])
    }
}


function createTask(task) {
    const timeStamp = task.id || Date.now();
    const name = task.name || task || "Task";
    const containerDiv = document.createElement("div");
    containerDiv.id = "container" + timeStamp;
    containerDiv.classList.add("container");

    const h1 = document.createElement("h1");
    h1.textContent = name;
    if(name.length > 10) {
        h1.style.fontSize = "2rem";
        h1.style.margin = "1.5rem 0";
        h1.style.overflowY = "scroll";
    };
    const spanStopWatch = document.createElement("span");
    h1.appendChild(spanStopWatch);

    const timeDiv = document.createElement("div");
    timeDiv.id = "time";

    const spans = ["hr", "min", "sec", "count"].map((id) => {
        const span = document.createElement("span");
        span.classList.add("digit");
        span.id = id + timeStamp;
        span.textContent = "00";
        return span;
    });

    const txtSpans = ["Hr", "Min", "Sec"].map((txt) => {
        const span = document.createElement("span");
        span.classList.add("txt");
        span.textContent = txt;
        return span;
    });

    spans.forEach((span, index) => {
        timeDiv.appendChild(span);
        if (index < txtSpans.length) {
            timeDiv.appendChild(txtSpans[index]);
        }
    });

    const buttonsDiv = document.createElement("div");
    buttonsDiv.id = "buttons";

    const buttonLabels = ["start", "stop", "reset", 'delete'].map((label) => {
        const button = document.createElement("i");
        button.classList.add("btn");
        button.classList.add(label);
        button.classList.add(symbols[label][0]);
        button.classList.add(symbols[label][1]);
        button.id = label + timeStamp;
        myButtons[button.id] = button;
        return button;
    });

    
    buttonLabels.forEach((button) => {
        buttonsDiv.appendChild(button);
    });
    
    containerDiv.appendChild(h1);
    containerDiv.appendChild(timeDiv);
    containerDiv.appendChild(buttonsDiv);
    document.getElementById('timers').appendChild(containerDiv);
    
    myButtons['start' + timeStamp].addEventListener('click', function () {
        let myStopWatch = myStopwatches[timeStamp];
        if (myStopWatch.timer != true) {
            myStopWatch.timer = true;
            myStopWatch.startTime = Date.now() - myStopWatch.duration;
            myStopWatch.stopWatch();
            storage[timeStamp] = myStopwatches[timeStamp];
            localStorage.setItem(0, JSON.stringify(storage));
            checkVisibility(timeStamp);
        }
    });

    myButtons['stop' + timeStamp].addEventListener('click', function(){
        let myStopWatch = myStopwatches[timeStamp];
        if (myStopWatch.timer) {
            myStopWatch.timer = false;
            storage[timeStamp] = myStopwatches[timeStamp];
            localStorage.setItem(0, JSON.stringify(storage))
            checkVisibility(timeStamp);
        }
    })

    myButtons['reset' + timeStamp].addEventListener('click', function(){
        myStopwatches[timeStamp].reset();
        storage[timeStamp] = myStopwatches[timeStamp];
        localStorage.setItem(0, JSON.stringify(storage))
        checkVisibility(timeStamp);
    })

    myButtons['delete' + timeStamp].addEventListener('click', function() {
        myStopwatches[timeStamp].delete();
        delete storage[timeStamp];
        localStorage.setItem(0, JSON.stringify(storage))
    })

    myStopwatches[timeStamp] = new StopWatch(task, name, timeStamp);
    myStopwatches[timeStamp].update();
    myStopwatches[timeStamp].stopWatch();
    checkVisibility(timeStamp);
    if (!storage[timeStamp]) {
        storage[timeStamp] = myStopwatches[timeStamp];
        localStorage.setItem(0, JSON.stringify(storage))
    }
}

function checkVisibility(timeStamp) {
    document.getElementById('stop' + timeStamp).style.display = myStopwatches[timeStamp].timer ? "initial" : "none";
    document.getElementById('start' + timeStamp).style.display = myStopwatches[timeStamp].timer ? "none" : "initial";
}

const input = document.getElementById("name");
input.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        createTask(input.value);
        input.inputMode = "none";
        input.value = "";
        window.scrollTo(0, document.body.scrollHeight);
        input.style.display = "none";
        document.getElementById("plus").style.display = "initial";
        setTimeout(() => {input.inputMode = "text"}, 10)
    }
})

function addTask(button){
    input.style.display = "initial";
    button.style.display = "none";
}

var keys = Object.keys(storage)
for (let i = 0; i < keys.length; i++) {
    createTask(storage[keys[i]]);
}