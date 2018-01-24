"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AStar_1 = require("./AStar");
var screenMap;
document.addEventListener("DOMContentLoaded", GeneratePage);
function GeneratePage() {
    const generateButton = document.getElementById("generate");
    const runButton = document.getElementById("run");
    const mouseGridElement = document.getElementById("mousegrid");
    mouseGridElement.addEventListener("mousedown", MouseDownOnGridEvent);
    mouseGridElement.addEventListener("mousemove", MouseDownOnGridEvent);
    function MouseDownOnGridEvent(event) {
        if (event.buttons & 1 && screenMap !== undefined) {
            const row = Math.floor((event.offsetX / this.clientWidth) * screenMap.width);
            const column = Math.floor((event.offsetY / this.clientHeight) * screenMap.height);
            SetGrid(screenMap, row, column);
            UpdateGrid(document.getElementById("grid"));
            document.getElementById("gridx").textContent = ((event.offsetX / this.clientWidth) * screenMap.width).toString();
            document.getElementById("gridy").textContent = ((event.offsetY / this.clientHeight) * screenMap.height).toString();
        }
        document.getElementById("mousex").textContent = event.offsetX.toString();
        document.getElementById("mousey").textContent = event.offsetY.toString();
        document.getElementById("clientw").textContent = this.clientWidth.toString();
        document.getElementById("clienth").textContent = this.clientHeight.toString();
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
        const grid = screenMap;
        const children = Array.from(element.children);
        for (const child of children) {
            const x = +child.getAttribute("x");
            const y = +child.getAttribute("y");
            if (grid.start && grid.start.x === x && grid.start.y === y) {
                child.className = "gridSpace start";
            }
            else if (grid.goal && grid.goal.x === x && grid.goal.y === y) {
                child.className = "gridSpace goal";
            }
            else if (grid.grid[x][y] === 0) {
                child.className = "gridSpace open";
            }
            else if (grid.grid[x][y] === 1) {
                child.className = "gridSpace blocked";
            }
            else if (grid.grid[x][y] === 2) {
                child.className = "gridSpace path";
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
            path: undefined
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
        GenerateGrid(document.getElementById("grid"), screenMap.width, screenMap.height);
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
        return element;
    }
    runButton.addEventListener("click", () => {
        if (screenMap !== undefined) {
            ClearPath(document.getElementById("grid"));
            const path = AStar_1.AStar(screenMap.start, screenMap.goal, screenMap.grid, Diagonal);
            for (const space of path) {
                screenMap.grid[space.x][space.y] = 2;
            }
            UpdateGrid(document.getElementById("grid"));
        }
    });
    function Diagonal(a, b) {
        return Math.sqrt(a.x * b.x + a.y * b.y);
    }
    function ClearPath(element) {
        const grid = screenMap;
        const children = Array.from(element.children);
        for (const child of children) {
            const x = +child.getAttribute("x");
            const y = +child.getAttribute("y");
            if (grid.grid[x][y] === 2) {
                child.className = "gridSpace open";
            }
        }
    }
}
//# sourceMappingURL=Page.js.map