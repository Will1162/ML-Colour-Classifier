let model;
let state = "collection";

function setup()
{
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

	document.getElementById("guess").innerText = results[0].label;
	document.getElementById("confidence").innerText = Math.round(results[0].confidence * 100) + "%";
}

function updateColour()
{
	let r = parseInt(document.getElementById("sliderR").value);
	let g = parseInt(document.getElementById("sliderG").value);
	let b = parseInt(document.getElementById("sliderB").value);

	document.getElementsByClassName("sliderText")[0].innerText = r;
	document.getElementsByClassName("sliderText")[1].innerText = g;
	document.getElementsByClassName("sliderText")[2].innerText = b;
	
	document.body.style.background = "rgb(" + r + "," + g + "," + b + ")";

	guess(r, g, b);
}