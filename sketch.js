// Jonas STIRNEMANN
//26-05-2020


function create2dArray(columns, row) 
{
	let arr = new Array(columns);

	for (let i = 0; i < arr.length; i++) 
	{
		arr[i] = new Array(row);
	}
	return arr;
}
    
let gGrid;
let gCol;
let gRow;
let gResolution = 30;
let sliderResolution;
    
function setup() 
{
	let div = createCanvas(windowWidth * 95 / 100, windowHeight * 95 / 100);
	div.center(); 

	gCol = floor(width / gResolution);
	gRow = floor(height / gResolution);
    
	gGrid = create2dArray(gCol, gRow);

	//Fill the board with random numbers
	for (let i = 0; i < gCol; i++) 
	{
		for (let j = 0; j < gRow; j++) 
		{
			gGrid[i][j] = floor(chance.weighted([0, 1], [50, 50]));
		}
	}

	//sliderResolution  = createSlider(0, 100, 50, 5);
}
    
function draw() 
{
	background('rgba(1, 1, 1, 0.5)');

	for (let i = 0; i < gCol; i++) 
	{
		for (let j = 0; j < gRow; j++) 
		{
			let x = i * gResolution;
			let y = j * gResolution;
			if (gGrid[i][j] == 1) 
			{
				fill('rgb(108, 190, 160)');
				stroke(0);
				rect(x, y, gResolution - 1, gResolution - 1);
			}
		}
	}

	let bufferGrid = create2dArray(gCol, gRow);

	//process the buffer based on the actual grid
	for (let i = 0; i < gCol; i++) 
	{
		for (let j = 0; j < gRow; j++)
		{
			let tileLiveState = gGrid[i][j];
		
			// Count live mates
			let neighbors = countNeighbors(gGrid, i, j);
			
			if (tileLiveState == 0 && neighbors == 3) //Dead + 3 mates
	    		{
				bufferGrid[i][j] = 1; //Spawn-Respawn
			}
			else if (tileLiveState == 1 && (neighbors < 2 || neighbors > 3)) //alive + ( less than 2 mates or more than 3 mates)
			{
				bufferGrid[i][j] = 0; //Kill.
			} 
			else //Other
			{
				bufferGrid[i][j] = tileLiveState; //Keep the state
	    		}
		}
	}

	gGrid = bufferGrid;
}
    
function countNeighbors(gGrid, x, y)
{
	let sumOfNeighbors = 0;
	for (let i = -1; i < 2; i++) 
	{
		for (let j = -1; j < 2; j++) 
		{
			let col = (x + i + gCol) % gCol;
			let row = (y + j + gRow) % gRow;
			sumOfNeighbors += gGrid[col][row];
		}
	}
	sumOfNeighbors -= gGrid[x][y];
	return sumOfNeighbors;
}
