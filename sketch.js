let codeSelection = 0; // Variable to store the user's code choice
let canvas; // p5 canvas
let optionInput; // Input for options
let coordinatesInput1, coordinatesInput2; // Inputs for coordinates
let inputContainer; // Container for inputs
let submitButton; // Button to submit coordinates

// Define p5 setup function
function setup() {
  // Create canvas and set its size
  canvas = createCanvas(600, 600);
  canvas.position(0, 0);

  // Create HTML elements for the menu
  let menuContainer = createDiv();
  menuContainer.position(10, height + 10);

  let menuLabel = createP('Select an option:');
  menuLabel.style('color', 'black'); // Set text color to black
  menuLabel.parent(menuContainer);

  let code1Button = createButton('1: Random Grid');
  code1Button.mousePressed(selectCode1);
  code1Button.parent(menuContainer);

  let code2Button = createButton('2: User-Defined Obstacles');
  code2Button.mousePressed(selectCode2);
  code2Button.parent(menuContainer);

  // Create option input
  optionInput = createInput('');
  optionInput.position(10, height + 70);
  optionInput.hide();

  // Create coordinates input container
  inputContainer = createDiv();
  inputContainer.position(10, height + 100);
  inputContainer.hide();

  let menuLabel1 = createP('Enter Starting Coordinates (X Y)');
  menuLabel1.style('color', 'black');
  menuLabel1.parent(inputContainer);
  let menuLabel2 = createP('Enter Ending Coordinates (X Y)');
  menuLabel2.style('color', 'black');
  menuLabel2.parent(inputContainer);

  coordinatesInput1 = createInput('0 0');
  coordinatesInput1.size(80);
  coordinatesInput1.parent(inputContainer);

  coordinatesInput2 = createInput('49 49');
  coordinatesInput2.size(80);
  coordinatesInput2.parent(inputContainer);

  submitButton = createButton('Submit');
  submitButton.mousePressed(handleSubmit);
  submitButton.parent(inputContainer);
  submitButton.hide();
}

// Define functions for code selection
function selectCode1() {
  codeSelection = 1;
  setupCode1();
  optionInput.hide();
  inputContainer.hide();
  submitButton.hide();
}

function selectCode2() {
  codeSelection = 2;
  setupCode2();
  optionInput.hide();
  inputContainer.show();
  submitButton.show();
}

// Define p5 draw function
function draw() {
  // Clear canvas
//  background(0);

  // Depending on code selection, call the appropriate code
  if (codeSelection === 1) {
	runCode1();
  } else if (codeSelection === 2) {
	runCode2();
  }
}

// Define functions for Code 1
let col, rows, grid, openset, closedset, start, end, w, h, path;

function removeFromArray(givarray, element) {
  for (var i = givarray.length - 1; i >= 0; i--) {
	if (givarray[i] === element) {
	  givarray.splice(i, 1);
	}
  }
}

function heuristic(a, b) {
  var d = dist(a.i, a.j, b.i, b.j);
  return d;
}

function spot(i, j) {
  this.i = i;
  this.j = j;
  this.f = 0;
  this.g = 0;
  this.h = 0;
  this.neighbours = [];
  this.previous = undefined;
  this.wall = false;

  if (random(1) < 0.5) {
	this.wall = true;
  }

  this.show = function (col) {
	fill(col);
	if (this.wall) {
	  fill(0);
	}
	noStroke();
	rect(this.i * w, this.j * h, w - 1, h - 1);
  };

  this.addNeighbours = function (grid) {
	var i = this.i;
	var j = this.j;
	if (i < col - 1) {
	  this.neighbours.push(grid[i + 1][j]);
	}
	if (i > 0) {
	  this.neighbours.push(grid[i - 1][j]);
	}
	if (j < rows - 1) {
	  this.neighbours.push(grid[i][j + 1]);
	}
	if (j > 0) {
	  this.neighbours.push(grid[i][j - 1]);
	}

	// to add diagonal movement
	if (i > 0 && j > 0) {
	  this.neighbours.push(grid[i - 1][j - 1]);
	}
	if (i < col - 1 && j > 0) {
	  this.neighbours.push(grid[i + 1][j - 1]);
	}
	if (i > 0 && j < rows - 1) {
	  this.neighbours.push(grid[i - 1][j + 1]);
	}
	if (i < col - 1 && j < rows - 1) {
	  this.neighbours.push(grid[i + 1][j + 1]);
	}
  };
}

function setupCode1() {
  col = 50;
  rows = 50;
  grid = new Array(col);
  openset = [];
  closedset = [];
  w = width / col;
  h = height / rows;

  for (var i = 0; i < col; i++) {
	grid[i] = new Array(rows);
  }

  for (var i = 0; i < col; i++) {
	for (var j = 0; j < rows; j++) {
	  grid[i][j] = new spot(i, j);
	}
  }

  for (var i = 0; i < col; i++) {
	for (var j = 0; j < rows; j++) {
	  grid[i][j].addNeighbours(grid);
	}
  }

  start = grid[0][0];
  end = grid[col - 1][rows - 1];
  start.wall = false;
  end.wall = false;

  openset.push(start);
}

function runCode1() {
  // Code 1 logic
  if (openset.length > 0) {
	var winner = 0;
	for (var i = 0; i < openset.length; i++) {
	  if (openset[i].f < openset[winner].f) {
		winner = i;
	  }
	}

	var current = openset[winner];
	if (current === end) {
	  noLoop();
	  console.log('DONE!');
	}
	removeFromArray(openset, current);
	closedset.push(current);

	var neighbours = current.neighbours;
	for (var i = 0; i < neighbours.length; i++) {
	  var neighbour = neighbours[i];

	  if (!closedset.includes(neighbour) && !neighbour.wall) {
		var tempg = current.g + 1;

		var newpath = false;
		if (openset.includes(neighbour)) {
		  if (tempg < neighbour.g) {
			neighbour.g = tempg;
			newpath = true;
		  }
		} else {
		  neighbour.g = tempg;
		  newpath = true;
		  openset.push(neighbour);
		}
		if (newpath) {
		  neighbour.h = heuristic(neighbour, end);
		  neighbour.f = neighbour.g + neighbour.h;
		  neighbour.previous = current;
		}
	  }
	}
  } else {
	console.log('no solution');
    noLoop();
	return;
  }

  background(0);

  for (var i = 0; i < col; i++) {
	for (var j = 0; j < rows; j++) {
	  grid[i][j].show(color(255));
	}
  }

  for (var i = 0; i < closedset.length; i++) {
	closedset[i].show(color(255, 0, 0));
  }

  for (var i = 0; i < openset.length; i++) {
	openset[i].show(color(0, 255, 0));
  }

  path = [];
  var temp = current;
  path.push(temp);
  while (temp.previous) {
	path.push(temp.previous);
	temp = temp.previous;
  }

  for (var i = 0; i < path.length; i++) {
	path[i].show(color(0, 0, 255));
  }
}

// Define functions for Code 2
let col2, rows2, grid2, openset2, closedset2, start2, end2, w2, h2, path2;
let isSubmitted = false;

function removeFromArray2(givarray, element) {
  for (var i = givarray.length - 1; i >= 0; i--) {
	if (givarray[i] == element) {
	  givarray.splice(i, 1);
	}
  }
}

function heuristic2(a, b) {
  var d = dist(a.i, a.j, b.i, b.j);
  return d;
}

function spot2(i, j, wall) {
  this.i = i;
  this.j = j;
  this.f = 0;
  this.g = 0;
  this.h = 0;
  this.neighbours = [];
  this.previous = undefined;
  this.wall = wall;

  this.show = function (col) {
	fill(col);
	if (this.wall) {
	  fill(0);
	} else if (this === start2) {
	  fill(255, 165, 0); // Purple for start
	} else if (this === end2) {
	  fill(255, 0, 255); // Yellow for end
	}
	noStroke();
	rect(this.i * w2, this.j * h2, w2 - 1, h2 - 1);
  };

  this.addNeighbours = function (grid) {
	var i = this.i;
	var j = this.j;
	if (i < col2 - 1) {
	  this.neighbours.push(grid[i + 1][j]);
	}
	if (i > 0) {
	  this.neighbours.push(grid[i - 1][j]);
	}
	if (j < rows2 - 1) {
	  this.neighbours.push(grid[i][j + 1]);
	}
	if (j > 0) {
	  this.neighbours.push(grid[i][j - 1]);
	}

	// to add diagonal movement
	if (i > 0 && j > 0) {
	  this.neighbours.push(grid[i - 1][j - 1]);
	}
	if (i < col2 - 1 && j > 0) {
	  this.neighbours.push(grid[i + 1][j - 1]);
	}
	if (i > 0 && j < rows2 - 1) {
	  this.neighbours.push(grid[i - 1][j + 1]);
	}
	if (i < col2 - 1 && j < rows2 - 1) {
	  this.neighbours.push(grid[i + 1][j + 1]);
	}
  };
}

function setupCode2() {
  col2 = 50;
  rows2 = 50;
  grid2 = new Array(col2);
  openset2 = [];
  closedset2 = [];
  w2 = width / col2;
  h2 = height / rows2;
  path2 = [];
  isSubmitted = false;

  for (var i = 0; i < col2; i++) {
	grid2[i] = new Array(rows2);
  }

  for (var i = 0; i < col2; i++) {
	for (var j = 0; j < rows2; j++) {
	  grid2[i][j] = new spot2(i, j, false);
	}
  }

  for (var i = 0; i < col2; i++) {
	for (var j = 0; j < rows2; j++) {
	  grid2[i][j].addNeighbours(grid2);
	}
  }
}

function showGrid(grid) {
	background(0);

	for (var i = 0; i < col2; i++) {
			for (var j = 0; j < rows2; j++) {
				grid2[i][j].show(color(255));
			}
	}
}

function runCode2() {
	showGrid(grid);
  // Code 2 logic
  if (isSubmitted) {
	if (openset2.length > 0) {
	  var winner = 0;
	  for (var i = 0; i < openset2.length; i++) {
		if (openset2[i].f < openset2[winner].f) {
		  winner = i;
		}
	  }

	  var current = openset2[winner];
	  if (current === end2) {
		noLoop();
		console.log('DONE!');
	  }
	  removeFromArray2(openset2, current);
	  closedset2.push(current);

	  var neighbours = current.neighbours;
	  for (var i = 0; i < neighbours.length; i++) {
		var neighbour = neighbours[i];

		if (!closedset2.includes(neighbour) && !neighbour.wall) {
		  var tempg = current.g + 1;

		  var newpath = false;
		  if (openset2.includes(neighbour)) {
			if (tempg < neighbour.g) {
			  neighbour.g = tempg;
			  newpath = true;
			}
		  } else {
			neighbour.g = tempg;
			newpath = true;
			openset2.push(neighbour);
		  }
		  if (newpath) {
			neighbour.h = heuristic2(neighbour, end2);
			neighbour.f = neighbour.g + neighbour.h;
			neighbour.previous = current;
		  }
		}
	  }
	} else {
	  console.log('no solution');
	  noLoop();
	  return;
	}

		showGrid(grid);

	// Visualize open set in green
	for (var i = 0; i < openset2.length; i++) {
	  openset2[i].show(color(0, 255, 0));
	}

	// Visualize closed set in red
	for (var i = 0; i < closedset2.length; i++) {
	  closedset2[i].show(color(255, 0, 0));
	}

	path2 = [];
	var temp = current;
	path2.push(temp);
	while (temp.previous) {
	  path2.push(temp.previous);
	  temp = temp.previous;
	}

	for (var i = 0; i < path2.length; i++) {
	  path2[i].show(color(0, 0, 255));
	}
  }
}

function handleSubmit() {
  var coords1 = coordinatesInput1.value();
  var coordsArray1 = split(coords1, ' ');
  var startX = int(coordsArray1[0]);
  var startY = int(coordsArray1[1]);

  if (
	startX >= 0 &&
	startX < col2 &&
	startY >= 0 &&
	startY < rows2 &&
	!grid2[startX][startY].wall
  ) {
	var coords2 = coordinatesInput2.value();
	var coordsArray2 = split(coords2, ' ');
	var endX = int(coordsArray2[0]);
	var endY = int(coordsArray2[1]);

	if (
	  endX >= 0 &&
	  endX < col2 &&
	  endY >= 0 &&
	  endY < rows2 &&
	  !grid2[endX][endY].wall
	) {
	  start2 = grid2[startX][startY];
	  end2 = grid2[endX][endY];
	  start2.wall = false;
	  end2.wall = false;

	  openset2 = [];
	  openset2.push(start2);
	  closedset2 = [];
	  isSubmitted = true;
	} else {
	  console.log('Invalid ending coordinates or obstacles!');
	}
  } else {
	console.log('Invalid starting coordinates or obstacles!');
  }
}

// Define mouseDragged function for user-defined obstacles in Code 2
function mouseDragged() {
  var i = floor(mouseX / w2);
  var j = floor(mouseY / h2);
  if (i >= 0 && i < rows2 && j >= 0 && j < col2) {
	grid2[i][j].wall = true;
	grid2[i][j].addNeighbours(grid2);
  }
}