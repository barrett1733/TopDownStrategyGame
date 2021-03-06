"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AStar_1 = require("./AStar");
var screenMap;
document.addEventListener("DOMContentLoaded", GeneratePage);
function GeneratePage() {
    const generateButton = document.getElementById("generate");
    const runButton = document.getElementById("run");
    const mouseGridElement = document.getElementById("mousegrid");
    const gridElement = document.getElementById("grid");
    const hideStats = document.getElementById("hideStats");
    mouseGridElement.addEventListener("mousedown", MouseDownOnGridEvent);
    mouseGridElement.addEventListener("mousemove", MouseDownOnGridEvent);
    function MouseDownOnGridEvent(event) {
        if (event.buttons & 1 && screenMap !== undefined) {
            const row = Math.floor((event.offsetX / this.clientWidth) * screenMap.width);
            const column = Math.floor((event.offsetY / this.clientHeight) * screenMap.height);
            SetGrid(screenMap, row, column);
            UpdateGrid(gridElement);
            //document.getElementById("gridx").textContent = ((event.offsetX / this.clientWidth) * screenMap.width).toString();
            //document.getElementById("gridy").textContent = ((event.offsetY / this.clientHeight) * screenMap.height).toString();
        }
        //document.getElementById("mousex").textContent = event.offsetX.toString();
        //document.getElementById("mousey").textContent = event.offsetY.toString();
        //document.getElementById("clientw").textContent = this.clientWidth.toString();
        //document.getElementById("clienth").textContent = this.clientHeight.toString();
    }
    function SetGrid(map, row, column) {
        const spaceTypes = document.getElementsByName("spaceType").values();
        let selectedButton;
        for (const spaceType of spaceTypes)
            if (spaceType.checked)
                selectedButton = spaceType;
        if (selectedButton.value === "open") {
            map.grid[row][column] = 0;
        }
        else if (selectedButton.value === "blocked") {
            map.grid[row][column] = 1;
        }
        else if (selectedButton.value === "start") {
            if (map.start)
                map.grid[map.start.x][map.start.y] = 0;
            map.start = new AStar_1.GridPosition(row, column);
            map.grid[row][column] = 0;
        }
        else if (selectedButton.value === "goal") {
            if (map.goal)
                map.grid[map.goal.x][map.goal.y] = 0;
            map.goal = new AStar_1.GridPosition(row, column);
            map.grid[row][column] = 0;
        }
    }
    function UpdateGrid(element) {
        const children = Array.from(element.children);
        for (const child of children) {
            const x = +child.getAttribute("x");
            const y = +child.getAttribute("y");
            if (screenMap.start && screenMap.start.x === x && screenMap.start.y === y) {
                child.className = "gridSpace start";
            }
            else if (screenMap.goal && screenMap.goal.x === x && screenMap.goal.y === y) {
                child.className = "gridSpace goal";
            }
            else if (screenMap.grid[x][y] === 0) {
                child.className = "gridSpace open";
            }
            else if (screenMap.grid[x][y] === 1) {
                child.className = "gridSpace blocked";
            }
            else if (screenMap.grid[x][y] === 2) {
                child.className = "gridSpace path";
            }
            if (screenMap.results) {
                const result = screenMap.results.history[x][y];
                child.children.item(0).textContent = result.pos.toString();
                child.children.item(1).textContent = "g: " + Math.round(result.g * 100) / 100;
                child.children.item(2).textContent = "h: " + Math.round(result.h * 100) / 100;
                child.children.item(3).textContent = "f: " + Math.round(result.f * 100) / 100;
            }
        }
    }
    generateButton.addEventListener("click", GenerateGridEvent);
    function getNumber(el) {
        return +el.value === NaN ? 1 : +el.value;
    }
    function GenerateGridEvent() {
        const map = {
            grid: undefined,
            width: getNumber(document.getElementById("width")),
            height: getNumber(document.getElementById("height")),
            start: undefined,
            goal: undefined,
            results: undefined
        };
        const grid = [];
        for (let row = 0; row < map.width; row++) {
            grid.push([]);
            for (let column = 0; column < map.height; column++) {
                grid[row].push(0);
            }
        }
        screenMap = map;
        screenMap.grid = grid;
        GenerateGrid(gridElement, screenMap.width, screenMap.height);
    }
    function GenerateGrid(el, rows, columns) {
        while (el.lastChild) {
            el.removeChild(el.lastChild);
        }
        const gridWidth = (el.clientWidth / rows);
        const gridHeight = (el.clientHeight / columns);
        for (let column = 0; column < columns; column++)
            for (let row = 0; row < rows; row++)
                el.appendChild(GenerateGridSpace(row, column, gridWidth, gridHeight));
    }
    function GenerateGridSpace(x, y, width, height) {
        const element = document.createElement("div");
        element.style.width = width + "px";
        element.style.height = height + "px";
        element.style.marginLeft = width * x + "px";
        element.style.marginTop = height * y + "px";
        element.className = "gridSpace open";
        element.setAttribute("x", x.toString());
        element.setAttribute("y", y.toString());
        element.appendChild(document.createElement("p"));
        element.appendChild(document.createElement("p"));
        element.appendChild(document.createElement("p"));
        element.appendChild(document.createElement("p"));
        for (let childIndex = 0; childIndex < element.children.length; childIndex++) {
            const child = element.children.item(childIndex);
            child.style.visibility = hideStats.checked ? "hidden" : "visible";
        }
        return element;
    }
    runButton.addEventListener("click", () => {
        if (screenMap !== undefined) {
            ClearPath();
            const heuristicStr = document.getElementById("heuristic").value;
            let heuristic = eval(heuristicStr);
            //if (!(heuristic instanceof Function))
            //    heuristic = Diagonal;
            const neighborsStr = document.getElementById("neighbors").value;
            let neighbors = eval(neighborsStr);
            //if (!(neighbors instanceof Array))
            //    neighbors = [[-1, 1], [0, 1], [1, 1], [-1, 0], [1, 0], [-1, -1], [0, -1], [1, -1]];
            screenMap.results = AStar_1.AStar(screenMap.start, screenMap.goal, screenMap.grid, heuristic, neighbors);
            for (const space of screenMap.results.path) {
                screenMap.grid[space.x][space.y] = 2;
            }
            UpdateGrid(gridElement);
        }
    });
    function Diagonal(a, b) {
        return Math.sqrt((b.x - a.x) * (b.x - a.x) + (b.y - a.y) * (b.y - a.y));
    }
    function ClearPath() {
        const grid = screenMap;
        for (let row = 0; row < screenMap.width; row++)
            for (let column = 0; column < screenMap.height; column++)
                if (grid.grid[row][column] === 2)
                    grid.grid[row][column] = 0;
    }
    hideStats.addEventListener("click", HideStats);
    function HideStats() {
        const gridSpaces = document.getElementsByClassName("gridSpace");
        for (let spaceIndex = 0; spaceIndex < gridSpaces.length; spaceIndex++) {
            const space = gridSpaces.item(spaceIndex);
            for (let childIndex = 0; childIndex < space.children.length; childIndex++) {
                const child = space.children.item(childIndex);
                child.style.visibility = this.checked ? "hidden" : "visible";
            }
        }
    }
}
//# sourceMappingURL=Page.js.map