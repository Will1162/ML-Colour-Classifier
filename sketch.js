let model;
let state = "collection";
let r, g, b, guessResults;

function setup()
{
	createCanvas(250, 200);
	background(40);
	stroke(255);

	let options = 
	{
		inputs: ["r", "g", "b"],
		outputs: ["label"],
		task: "classification",
		debug: true
	};

	model = ml5.neuralNetwork(options);

	// TRAINING NEW MODEL

	// for (let i = 0; i < trainingData.length; i++)
	// {
	// 	let inputs = 
	// 	{
	// 		r: trainingData[i].r,
	// 		g: trainingData[i].g,
	// 		b: trainingData[i].b
	// 	};
	
	// 	let target = 
	// 	{
	// 		label: trainingData[i].l
	// 	};
		
	// 	model.addData(inputs, target);
	// }


	// LOAD EXISTING MODEL
	const modelInfo = {
		model: 'model/model.json',
		metadata: 'model/model_meta.json',
		weights: 'model/model.weights.bin'
	  };
	
	  model.load(modelInfo, modelLoaded);
}

function modelLoaded()
{
	console.log('model loaded');
	state = 'prediction';
}

function keyPressed()
{
	if (key == "t")
	{
		state = "training";
		model.normalizeData();

		let options = 
		{
			epochs: 100,
			learningRate: 0.25
		};

		model.train(options, whileTraining, finishedTraining);
	}
}

function whileTraining(epoch, loss)
{
	console.log(epoch);
}

function finishedTraining()
{
	console.log("Finished training");
	state = "prediction";
}

function guess(red, green, blue)
{
	model.classify({r: red, g: green, b: blue}, gotResults);
}

function gotResults(error, results)
{
	if (error)
	{
		console.error(error);
		return;
	}

	guessResults = results;
	drawBars();

	document.getElementById("guess").innerText = results[0].label;
	document.getElementById("confidence").innerText = Math.round(results[0].confidence * 100) + "%";
}

function updateColour()
{
	r = parseInt(document.getElementById("sliderR").value);
	g = parseInt(document.getElementById("sliderG").value);
	b = parseInt(document.getElementById("sliderB").value);

	document.getElementsByClassName("sliderText")[0].innerText = r;
	document.getElementsByClassName("sliderText")[1].innerText = g;
	document.getElementsByClassName("sliderText")[2].innerText = b;
	
	document.body.style.background = "rgb(" + r + "," + g + "," + b + ")";

	guess(r, g, b);
}

function drawBars()
{
	background(40);
	//background(r,g,b);

	let barWidth = 20;
	let barSpacing = 3;

	for (let i = 0; i < 11; i++)
	{
		switch (guessResults[i].label)
		{
			case "Red":
				fill(255,0,0);
				rect((barWidth + barSpacing) * 0, height, barWidth, -height * guessResults[i].confidence);
				break;
			case "Orange":
				fill(255,165,0);
				rect((barWidth + barSpacing) * 1, height, barWidth, -height * guessResults[i].confidence);
				break;
			case "Yellow":
				fill(255,255,0);
				rect((barWidth + barSpacing) * 2, height, barWidth, -height * guessResults[i].confidence);
				break;
			case "Green":
				fill(0,255,0);
				rect((barWidth + barSpacing) * 3, height, barWidth, -height * guessResults[i].confidence);
				break;
			case "Blue":
				fill(0,0,255);
				rect((barWidth + barSpacing) * 4, height, barWidth, -height * guessResults[i].confidence);
				break;
			case "Purple":
				fill(127,0,255);
				rect((barWidth + barSpacing) * 5, height, barWidth, -height * guessResults[i].confidence);
				break;
			case "Pink":
				fill(255,0,255);
				rect((barWidth + barSpacing) * 6, height, barWidth, -height * guessResults[i].confidence);
				break;
			case "Brown":
				fill(139,69,19);
				rect((barWidth + barSpacing) * 7, height, barWidth, -height * guessResults[i].confidence);
				break;
			case "Black":
				fill(0,0,0);
				rect((barWidth + barSpacing) * 8, height, barWidth, -height * guessResults[i].confidence);
				break;
			case "Grey":
				fill(127,127,127);
				rect((barWidth + barSpacing) * 9, height, barWidth, -height * guessResults[i].confidence);
				break;
			case "White":
				fill(255,255,255);
				rect((barWidth + barSpacing) * 10, height, barWidth, -height * guessResults[i].confidence);
				break;
		}
	}
}