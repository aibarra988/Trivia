var intervalId;
var clockRunning = false;

var game = {
    time: 20,
    triviaQuestions: [
        {
            question: "What is the sole purpose of the robot that Rick created in the breakfast table",
            answerIndex: 1,
            choices: ["Make eggs", "Pass the butter", "Conquer dimensions", "Annoy Jerry"]
        },
        {
            question: "What is the name of the 'real world' dimension that humanity lives in?",
            answerIndex: 0,
            choices: ["C-137", "Milky Way", "Earth Dimension", "Carl's Jr."]
        },
        {
            question: "In S3E1, Rick divulges that the reason for his adventures is to...",
            answerIndex: 3,
            choices: ["Rule the universe", "McDonald's Szechuan Sauce", "Destroy corporations", "Make more episodes"]
        },
        {
            question: "What movie was the character's from Rick and Morty loosely based off of?",
            answerIndex: 1,
            choices: ["E.T", "Back to the Future", "Alien", "The Terminator"]
        },
        {
            question: "In the episode with Mr. Meeseeks, Jerry drives them to a breaking point with a request to...",
            answerIndex: 3,
            choices: ["Fix his marriage", "Make him smarter", "Have Rick's approval", "Improve his putt swing"]
        },
        {
            question: "What is Rick's famous catchphrase?",
            answerIndex: 2,
            choices: ["Shut the door!", "Lovely Jubbly", "Wubbalubbadubdub", "Make it so"]
        },
        {
            question: "In the episode with Jemaine Clement of Flight of the Conchords, his character name is...",
            answerIndex: 2,
            choices: ["Brain Twister", "Mobius", "Fart", "Gassy Face"]
        }
    ],
    rightAnswers: [],
    wrongAnswers: [],
    unansweredQuestions: 0,
    count: function() {
        game.time--;
        game.makeTimerHTML(game.time);
        
        if (game.time === 0) {
            game.stop();
            
            // submit all answers
            game.checkAnswers();
            
            // display the results of the game
            $("#results").empty();
            game.makeResultsHTML();
        }
    },
    start: function() {
        if (!clockRunning) {
            game.time = 20;
            intervalId = setInterval(game.count, 1000);
            clockRunning = true;
            game.makeTimerHTML(game.time);
            game.makeQuestionHTML();
        }
    },
    stop: function() {
        clearInterval(intervalId);
        clockRunning = false;
    },
    makeTimerHTML: function(time) {
        if (typeof time === 'number') {
            $("#time-remaining").text("Time remaining: " + time).show();
        }
    },
    makeQuestionHTML: function() {
        $(".container").css("background-color", "#4c00e6");
        $(".container").css( "opacity", .9);
        $("#results").empty().hide();
        $("#questions").empty().show();

        game.triviaQuestions.forEach(function(round, idx) {
            var form = $("<form>");
            form.attr("class", "question-form");
            form.attr("data-question-number", idx);
            var question = $("<p>").attr("id", "question");
            question.text(round.question);
            
            round.choices.forEach(function(item, idx) {
                // FIXME: figure out how to get a single choice with radio buttons
                var input = $("<input>");
                input.attr("type", "radio");
                input.attr("class", "choice");
                input.attr("name", "choice");
                input.attr("value", idx);
                form.append(input);
                
                var label = $("<label>");
                label.attr("for", idx);
                label.text(item);
                form.append(label);
            });
            form.prepend(question);

            $("#questions").append(form);
        });
    },
    makeResultsHTML: function() {
        $("#questions").empty().hide();
        $("#results").empty().show();
        
        var resultsDiv = $("<div>");
        var resultsHeader = $("<h1>").text("Results");
        var correctSpan = $("<span>").text("Correct Answers: " + game.rightAnswers.length).append("<br>");
        var incorrectSpan = $("<span>").text("Incorrect Answers: " + game.wrongAnswers.length).append("<br>");
        var unansweredSpan = $("<span>").text("Unanswered: " + game.unansweredQuestions).append("<br>");
        var resetButton = $("<button>").attr("id", "reset").text("Try Again").append("<br>");
        
        resultsDiv.append(resultsHeader);
        resultsDiv.append(correctSpan);
        resultsDiv.append(incorrectSpan);
        resultsDiv.append(unansweredSpan);
        resultsDiv.append(resetButton);
        $("#results").append(resultsDiv);
    },
    checkAnswers: function() {
        // submit form
        $(".question-form").submit();
    },
};

$("#start-game").click(function() {
    $("#start-game").hide();
    game.start();
});

$(document).on("submit", ".question-form", function(event) {
    event.preventDefault();

    var questionIndex = parseInt($(this).attr("data-question-number"));
    var answerIndex = parseInt($(this).find("input:checked").val());
    
    if (answerIndex.toString() === "NaN") {
        game.unansweredQuestions++;
    } else if (answerIndex === game.triviaQuestions[questionIndex].answerIndex) {
        // if the answer was right, keep track of it for stats
        game.rightAnswers.push({
            questionIndex: questionIndex
        });
    } else {
        // if the answer was wrong, keep track of it for stats
        console.log("Wrong answer!");
        game.wrongAnswers.push({
            questionIndex: questionIndex,
            answerIndex: answerIndex
        });
    }
});

$(document).on("click", "#reset", function(event) {
    event.preventDefault();
    game.rightAnswers = [];
    game.wrongAnswers = []; 
    game.unansweredQuestions = 0;
    game.makeQuestionHTML();
    game.start();
});