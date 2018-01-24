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