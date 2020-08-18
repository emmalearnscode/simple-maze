const { Engine, Render, Runner, World, Bodies} = Matter;

const width = 600; //how big we want the world to be in px
const height = 600;
const cells = 3;

const unitLength = width/cells;

const engine = Engine.create(); // creates an engine which includes a world
const {world} = engine; // destructure the world from the engine
const render = Render.create({
    element: document.body, //where we want to show the drawing
    engine: engine,
    options: {
        wireframes: true,
        width,
        height
    }
});
Render.run(render);
Runner.run(Runner.create(), engine);




//Walls - first two numbers are center position of shape
// numbers three and four are width then height
const walls = [
    Bodies.rectangle(width/2, 0, width, 40, { isStatic: true}),
    Bodies.rectangle(width/2, height, width, 40, { isStatic: true}),
    Bodies.rectangle(0, height/2, 40, height, { isStatic: true}),
    Bodies.rectangle(width, height/2, 40, height, { isStatic: true}),
];
World.add(world, walls);

// Shuffle function
const shuffle = (arr) => {
    let counter = arr.length;

    while (counter > 0) {
        const index = Math.floor(Math.random() * counter);
        counter--;

        const temp = arr[counter];
        arr[counter] = arr[index];
        arr[index] = temp;
    }

    return arr;
};

//Grid generation
const grid = Array(cells).fill(null) //creates the outer array with three empty rows
.map(() => Array(cells).fill(false)); // fills the rows with information to create columns


// grid walls
const verticals = Array(cells).fill(null).map(() => Array(cells -1).fill(false));
const horizontals = Array(cells -1).fill(null).map(() => Array(cells).fill(false));

const startRow = Math.floor(Math.random() * cells);
const startColumn = Math.floor(Math.random() * cells);

const stepThroughCell = (row, column) => {
if (grid[row][column]) {
    return;
}
grid[row][column] = true; //Assign first cell randomly

// Assign neighbour coordinates
const neighbours = shuffle([
    [row - 1, column, "up"],
    [row, column - 1, "left"],
    [row + 1, column, "down"],
    [row, column + 1, "right"]
]);
for (let neighbour of neighbours){
    const [nextRow, nextColumn, direction] = neighbour;

    if (nextRow < 0 || nextRow >= cells || nextColumn < 0 || nextColumn >= cells){
        continue;
    }

    if (grid[nextRow][nextColumn]) {
        continue;
    }

    if (direction === "left") {
        verticals[row][column -1] = true;
    } else if (direction === "right") {
        verticals[row][column] = true;
    } else if (direction === "up") {
        horizontals[row - 1][column] = true;
    } else if (direction === "down") {
        horizontals[row][column] = true;
    }

    stepThroughCell(nextRow, nextColumn);
}


};

stepThroughCell(startRow, startColumn);

horizontals.forEach((row, rowIndex) => {
    row.forEach((open, columnIndex) => {
        if (open) {
            return;
        } 

        const wall = Bodies.rectangle(
            columnIndex * unitLength + unitLength / 2, 
            rowIndex * unitLength + unitLength,
            unitLength,
            5,
            { isStatic: true}
        );
        World.add(world, wall);
    });
});

verticals.forEach((row, rowIndex) => {
    row.forEach((open, columnIndex) => {
        if (open) {
            return;
        } 

        const wall = Bodies.rectangle(
            
            columnIndex * unitLength + unitLength, 
            rowIndex * unitLength + unitLength / 2,
            5,
            unitLength,
            { isStatic: true}
        );
        World.add(world, wall);
    });
});