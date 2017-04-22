// var inquirer = require('inquirer');
// var fs = require(fs);
var ClozeCard = require('./ClozeCard.js');
var BasicCard = require('./BasicCard.js');

var inquirer = require('inquirer');
var fs = require('fs');

//style this up

inquirer.prompt([
	{
		name: 'command',
		message: 'Would you like to create or view?',
		type: 'list',
		choices: [
		{
			name: 'add-flashcard'
		}, {
			name: 'show-flash-cards'
		}]	
}]).then(function(answer) {

		if(answer.command === 'add-flashcard') {
			addCard();
		}
		else if (answer.command === 'show-flash-cards'){
			showCards();
		}
});

function addCard() {

	inquirer.prompt([
	{
		name: 'cardType',
		message: 'Would you like to create a basic or cloze flas card?',
		type: 'list',

		choices: [
		{
			name: 'cloze'
		},{
			name: 'basic'
		}]
	}]).then(function(answer) {

		if(answer.cardType === 'basic') {
			inquirer.prompt(
				[{
					name: 'front',
					message: 'Question?',

					validate: function(input) {
						if (input === "") {
							console.log('Input a valid string');
							return false;
						}
						else {
							return true;
						}
					}
				}, {

					name: 'back',
					message: 'Answer?',

					validate: function(input) {
						if (input === "") {
							console.log('Input a valid string');
							return false;
						}
						else {
							return true;
						}
					}

				}]).then(function(answer) {

					var newBasicCard = new BasicCard(answer.front, answer.back);
					newBasicCard.create();
					whatsNext();
				});
		}
		else if (answer.cardType === 'cloze') {

			inquirer.prompt ([
			{
				name: 'text',
				message: 'please provide the full statement.',

				validate: function(input) {
					if (input === "") {
						console.log('Input a valid string');
						return false;
					}
					else {
						return true;
					}
				}
			}, {
				name: 'cloze',
				message: 'what is the portion of the statement you want to cloze?',

				validate: function(input) {
					if (input === "") {
						console.log('Input a valid string');
						return false;
					}
					else {
						return true;
					}
				}
			}]).then(function(answer) {

				var text = answer.text;
				var cloze = answer.cloze;

				if (text.includes(cloze)) {
					var newCloze = new ClozeCard(text, cloze);
					newCloze.create();
					whatsNext();
				}
				else {
					console.log('invalid cloze portion');
					addCard();
				}
;
			})

		}

	});
};

function whatsNext() {

	inquirer.prompt([
		{
			name: 'nextAction',
			message: 'what would you like to do?',
			type: 'list',

			choices: [
			{
				name: 'create-card',
			}, {
				name: 'show-all-cards',
			}]
		}]).then(function(answer) {

			if (answer.nextAction === 'create-card') {
				addCard();
			}
			else if (answer.nextAction === 'show-all-cards') {
				showCards();
			}
			else {
				return;
			}
		});
};

function showCards() {

	fs.readFile('./log.txt', 'utf8', function(err, data) {

		if(err) {
			console.log("Error : " + err);
		}

		var questions = data.split(";");
		var notBlank = function(value) {
			return value;
		}

		questions = questions.filter(notBlank);
		var count = 0;
		showQuestion(questions, count);

	});
};

function showQuestion(array, index) {
	question = array[index];

	var parsedQuestion = JSON.parse(question);
	var questionText;
	var correctResponse;

	if (parsedQuestion.type === 'basic') {
		questionText = parsedQuestion.front;
		correctResponse = parsedQuestion.back;
	}
	else if (parsedQuestion.type === 'cloze') {
		questionText = parsedQuestion.clozeDeleted;
		correctResponse = parsedQuestion.cloze;
	}
	inquirer.prompt(
		[{
			name: 'response',
			message: questionText
		}]).then(function(answer) {
			if (answer.response === correctResponse) {
				console.log('Correct!');
				if (index < array.length -1) {
					showQuestion(array, index + 1);
				}
			}
			else {
				console.log('Wrong!');
				if (index < array.length - 1) {
					showQuestion(array, index + 1 );
				}
			}
	});
};

