var intervalId;
var clockRunning = false;

var game = {
    time: 4,
    triviaQuestions: [
        {
            question: "What country is Juarez in?",
            answerIndex: 2,
            choices: ["Answer A", "Answer B", "Answer C", "Answer D"]
        },
        {
            question: "What country is Algiers?",
            answerIndex: 2,
            choices: ["Answer A", "Answer B", "Answer C", "Answer D"]
        },
        {
            question: "What country is Oslo in?",
            answerIndex: 2,
            choices: ["Answer A", "Answer B", "Answer C", "Answer D"]
        },
        {
            question: "What country is Hamburg?",
            answerIndex: 2,
            choices: ["Answer A", "Answer B", "Answer C", "Answer D"]
        }
    ],
    rightAnswers: [],
    wrongAnswers: [],
    makeTimerHTML: function(time) {
        if (typeof time === 'number') {
            $("#time-remaining").text("Time remaining: " + time);
        }
    },
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
            game.time = game.time === 0 ? 4 : game.time;
            intervalId = setInterval(game.count, 1000);
            clockRunning = true;
            game.makeTimerHTML();
            game.makeQuestionHTML();
        }
    },
    stop: function() {
        clearInterval(intervalId);
        clockRunning = false;
    },
    makeQuestionHTML: function() {
        $("#questions").empty();

        game.triviaQuestions.forEach(function(round, idx) {
            var form = $("<form>");
            form.attr("class", "question-form");
            form.attr("data-question-number", idx);
            var question = $("<p>");
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
        $("#results").empty();
        $("#time-remaining").empty();
        $("#questions").empty();
        $("#results").show();  
        
        var resultsDiv = $("<div>");
        var resultsHeader = $("<h1>").text("Results").append("<br>");
        var correctSpan = $("<span>").text("Correct Answers: ", game.rightAnswers.length).append("<br>");
        var incorrectSpan = $("<span>").text("Incorrect Answers: ", game.wrongAnswers.length).append("<br>");
        var resetButton = $("<button>").attr("id", "reset").text("Try Again").append("<br>");

        
        resultsDiv.append(resultsHeader);
        resultsDiv.append(correctSpan);
        resultsDiv.append(incorrectSpan);
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
    
    // check if the answer given was the right answer
    if (answerIndex === game.triviaQuestions[questionIndex].answerIndex) {
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
    console.log("ayyy");
    game.makeQuestionHTML();
    game.start();
});