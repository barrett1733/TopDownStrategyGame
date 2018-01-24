export interface AStarResults {
    history: Node[][];
    path: GridPosition[];
}

export type Distance = (a: GridPosition, b: GridPosition) => number;

export class GridPosition {
    public constructor(public x: number, public y: number) { }
    public equals(a: GridPosition): boolean {
        return a.x === this.x && a.y === this.y;
    }
    public toString(): string {
        return "(" + this.x + ", " + this.y + ")";
    }
}

export class Node {
    public pos: GridPosition;
    public g: number;
    public h: number;
    public parent: Node;

    public constructor(pos: GridPosition, g: number, parent?: Node) {
        this.pos = pos;
        this.g = g;
        this.h = 0;
        this.parent = parent;
    }

    public get f(): number {
        return this.g + this.h;
    }

    public toString(): string {
        return this.pos.toString() + " g: " + Math.round(this.g * 100) / 100 + " h: " + Math.round(this.h * 100) / 100 + " f: " + Math.round(this.f * 100) / 100;
    }
}

function smallestFIndex(list: Node[]): number {
    let smallest = 0;
    for (let index = 1; index < list.length; index++) {
        if (list[smallest].f > list[index].f)
            smallest = index;
    }
    return smallest;
}

function generateEdges(parent: Node, grid: number[][], maxX: number, maxY: number, neighbors: number[][]): Node[] {
    const edges = [];
    for (const dir of neighbors) {
        const posx = parent.pos.x + dir[0];
        const posy = parent.pos.y + dir[1];
        if (posx >= 0 && posx < maxX && posy >= 0 && posy < maxY && grid[posx][posy] !== 1) {
            edges.push(new Node(new GridPosition(posx, posy), parent.g, parent));
        }
    }
    return edges;
}

function has(edge: Node, list: Node[]): boolean {
    for (const node of list) {
        if (node.pos.equals(edge.pos))
            return true;
    }
    return false;
}

function constructPath(end: Node): GridPosition[] {
    const path = [];
    while (end !== undefined) {
        path.push(end.pos);
        end = end.parent;
    }
    return path;
}

export function AStar(start: GridPosition, goal: GridPosition, grid: number[][], dist: Distance, neighbors: number[][]): AStarResults {
    const historyGrid: Node[][] = [];
    for (let row = 0; row < grid.length; row++) {
        historyGrid.push([]);
        for (let column = 0; column < grid[row].length; column++) {
            historyGrid[row].push(new Node(new GridPosition(row, column), 0));
        }
    }

    const open = [new Node(start, 0)];
    const closed = [];
    const maxX = grid.length;
    const maxY = grid[0].length;
    while (open.length > 0) {
        const qIndex = smallestFIndex(open);
        const q = open[qIndex];
        open.splice(qIndex, 1);
        const edges = generateEdges(q, grid, maxX, maxY, neighbors);

        for (const edge of edges) {
            if (edge.pos.equals(goal)) {
                return {
                    path: constructPath(edge),
                    history: historyGrid
                };
            }
            edge.g = dist(edge.pos, q.pos);
            edge.h = dist(edge.pos, goal);
            if (has(edge, closed))
                continue;

            if (has(edge, open)) {
                const node = open.find((value: Node) => {
                    return value.pos.equals(edge.pos);
                });
                if (edge.f < node.f) {
                    node.g = edge.g;
                    node.h = edge.h;
                    historyGrid[edge.pos.x][edge.pos.y].g = edge.g;
                    historyGrid[edge.pos.x][edge.pos.y].h = edge.h;
                }
            }
            else {
                open.push(edge);
                historyGrid[edge.pos.x][edge.pos.y].g = edge.g;
                historyGrid[edge.pos.x][edge.pos.y].h = edge.h;
            }
        }

        closed.push(q);
    }
    return {
        path: [],
        history: historyGrid
    };
}
