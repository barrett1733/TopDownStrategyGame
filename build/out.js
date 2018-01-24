/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const AStar_1 = __webpack_require__(1);
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

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class GridPosition {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    equals(a) {
        return a.x === this.x && a.y === this.y;
    }
    toString() {
        return "(" + this.x + ", " + this.y + ")";
    }
}
exports.GridPosition = GridPosition;
class Node {
    constructor(pos, g, parent) {
        this.pos = pos;
        this.g = g;
        this.h = 0;
        this.parent = parent;
    }
    get f() {
        return this.g + this.h;
    }
    toString() {
        return "(" + this.pos.toString() + " g: " + this.g + " h: " + this.h + " f: " + this.f + ")";
    }
}
function smallestFIndex(list) {
    let smallest = 0;
    for (let index = 1; index < list.length; index++) {
        if (list[smallest].f > list[index].f)
            smallest = index;
    }
    return smallest;
}
function generateEdges(parent, grid, maxX, maxY) {
    const edges = [];
    const directions = [
        [-1, 1, 1.41], [0, 1, 1], [1, 1, 1.41],
        [-1, 0, 1], [1, 0, 1],
        [-1, -1, 1.41], [0, -1, 1], [1, -1, 1.41]
    ];
    for (const dir of directions) {
        const posx = parent.pos.x + dir[0];
        const posy = parent.pos.y + dir[1];
        if (posx >= 0 && posx < maxX && posy >= 0 && posy < maxY && grid[posx][posy] !== 1) {
            edges.push(new Node(new GridPosition(posx, posy), parent.g + dir[2], parent));
        }
    }
    return edges;
}
function has(edge, list) {
    for (const node of list) {
        if (node.pos.equals(edge.pos))
            return true;
    }
    return false;
}
function constructPath(end) {
    const path = [];
    while (end !== undefined) {
        path.push(end.pos);
        end = end.parent;
    }
    return path;
}
function AStar(start, goal, grid, dist) {
    const open = [new Node(start, 0)];
    const closed = [];
    const maxX = grid.length;
    const maxY = grid[0].length;
    while (open.length > 0) {
        const qIndex = smallestFIndex(open);
        const q = open[qIndex];
        open.splice(qIndex, 1);
        const edges = generateEdges(q, grid, maxX, maxY);
        for (const edge of edges) {
            if (edge.pos.equals(goal)) {
                return constructPath(edge);
            }
            edge.h = dist(edge.pos, goal);
            if (has(edge, closed))
                continue;
            if (has(edge, open)) {
                const node = open.find((value) => {
                    return value.pos.equals(edge.pos);
                });
                if (edge.f < node.f) {
                    node.g = edge.g;
                    node.h = edge.h;
                }
            }
            else
                open.push(edge);
        }
        closed.push(q);
    }
}
exports.AStar = AStar;
//# sourceMappingURL=AStar.js.map

/***/ })
/******/ ]);
//# sourceMappingURL=out.js.map