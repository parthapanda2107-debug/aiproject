/* ===============================
GLOBAL HELPER
================================= */
function $(id) {
    return document.getElementById(id);
}

/* ===============================
PARTICLE BACKGROUND (FIXED)
================================= */
const bgCanvas = $("bgCanvas");
const bgCtx = bgCanvas.getContext("2d");

function resizeCanvas() {
    bgCanvas.width = window.innerWidth;
    bgCanvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

let particles = Array.from({ length: 80 }, () => ({
    x: Math.random() * bgCanvas.width,
    y: Math.random() * bgCanvas.height,
    r: Math.random() * 2 + 1,
    dx: (Math.random() - 0.5),
    dy: (Math.random() - 0.5)
}));

function animateBG() {
    bgCtx.fillStyle = "#0b0f1a";
    bgCtx.fillRect(0, 0, bgCanvas.width, bgCanvas.height);

    particles.forEach(p => {
        p.x += p.dx;
        p.y += p.dy;

        if (p.x < 0 || p.x > bgCanvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > bgCanvas.height) p.dy *= -1;

        bgCtx.beginPath();
        bgCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        bgCtx.fillStyle = "#00f5ff";
        bgCtx.fill();
    });

    requestAnimationFrame(animateBG);
}
animateBG();

/* ===============================
NAV TOGGLE
================================= */
$("navToggle").onclick = () => {
    document.querySelector(".nav").classList.toggle("active");
};

/* ===============================
ROADMAP TOGGLE (SIMPLEST WORKING VERSION)
================================= */
function toggleRoadmap(skill) {
    const el = document.getElementById("roadmap-" + skill);
    
    if (!el) {
        console.error("Roadmap not found for:", skill);
        return;
    }

    // Close all other roadmaps first
    document.querySelectorAll(".smc-roadmap").forEach(r => {
        r.classList.remove("show");
    });

    // Toggle THIS roadmap
    el.classList.toggle("show");

    // Find ALL buttons for this skill and update them
    const allButtons = document.querySelectorAll(`[onclick="toggleRoadmap('${skill}')"], [onclick*="${skill}"]`);
    allButtons.forEach(btn => {
        if (el.classList.contains("show")) {
            btn.innerHTML = "❌ Hide Roadmap";
        } else {
            btn.innerHTML = "🗺️ View Roadmap";
        }
    });
}

// Make globally available
window.toggleRoadmap = toggleRoadmap;

/* ===============================
TABS SYSTEM
================================= */
document.querySelectorAll(".level-tab").forEach(btn => {
    btn.onclick = () => {
        document.querySelectorAll(".level-tab").forEach(b => b.classList.remove("active"));
        document.querySelectorAll(".roadmap-level").forEach(l => l.classList.remove("active"));

        btn.classList.add("active");
        $(btn.dataset.level).classList.add("active");
    };
});

document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.onclick = () => {
        document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
        document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));

        btn.classList.add("active");
        $(btn.dataset.tab).classList.add("active");
    };
});

document.querySelectorAll(".ds-tab").forEach(btn => {
    btn.onclick = () => {
        document.querySelectorAll(".ds-tab").forEach(b => b.classList.remove("active"));
        document.querySelectorAll(".ds-content").forEach(c => c.classList.remove("active"));

        btn.classList.add("active");
        $("ds-" + btn.dataset.ds).classList.add("active");
    };
});

/* ===============================
SORTING VISUALIZER
================================= */
const sortCanvas = $("sortCanvas");
const sortCtx = sortCanvas.getContext("2d");

let arr = [];
let sorting = false;

function generateArray() {
    arr = Array.from({ length: 50 }, () => Math.floor(Math.random() * 300) + 20);
    drawArray();
}
generateArray();

function drawArray(active = []) {
    sortCtx.clearRect(0, 0, sortCanvas.width, sortCanvas.height);

    arr.forEach((val, i) => {
        sortCtx.fillStyle = active.includes(i) ? "#ff6b6b" : "#00f5ff";
        sortCtx.fillRect(i * 20, sortCanvas.height - val, 15, val);
    });
}

function sleep(ms) {
    return new Promise(res => setTimeout(res, ms));
}

async function bubbleSort() {
    sorting = true;
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length - i - 1; j++) {
            drawArray([j, j + 1]);
            await sleep(50);

            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
        }
    }
    sorting = false;
}

$("startSort").onclick = () => {
    if (!sorting) bubbleSort();
};
$("shuffle").onclick = generateArray;
$("resetSort").onclick = generateArray;

/* ===============================
STACK
================================= */
let stack = [];
const sCtx = $("stackCanvas").getContext("2d");

function drawStack() {
    sCtx.clearRect(0, 0, 600, 420);
    stack.forEach((v, i) => {
        sCtx.fillStyle = "#00f5ff";
        sCtx.fillRect(250, 350 - i * 40, 100, 35);
        sCtx.fillStyle = "#ae2121";
        sCtx.fillText(v, 290, 375 - i * 40);
    });
}

function stackPush() {
    const v = $("stackInput").value;
    if (!v) return;
    stack.push(v);
    drawStack();
    $("stackInput").value = "";
}

function stackPop() {
    stack.pop();
    drawStack();
}

function stackPeek() {
    $("stackMsg").innerText = stack.length ? "Top: " + stack.at(-1) : "Empty";
}

function stackClear() {
    stack = [];
    drawStack();
}

/* ===============================
QUEUE
================================= */
let queue = [];
const qCtx = $("queueCanvas").getContext("2d");

function drawQueue() {
    qCtx.clearRect(0, 0, 600, 420);
    queue.forEach((v, i) => {
        qCtx.fillStyle = "#ffd93d";
        qCtx.fillRect(50 + i * 60, 200, 50, 40);
        qCtx.fillStyle = "#000";
        qCtx.fillText(v, 65 + i * 60, 225);
    });
}

function queueEnqueue() {
    const v = $("queueInput").value;
    if (!v) return;
    queue.push(v);
    drawQueue();
    $("queueInput").value = "";
}

function queueDequeue() {
    queue.shift();
    drawQueue();
}

function queueFront() {
    $("queueMsg").innerText = queue.length ? "Front: " + queue[0] : "Empty";
}

function queueClear() {
    queue = [];
    drawQueue();
}

/* ===============================
LINKED LIST
================================= */
let ll = [];
const llCtx = $("llCanvas").getContext("2d");

function drawLL() {
    llCtx.clearRect(0, 0, 600, 420);
    ll.forEach((v, i) => {
        llCtx.fillStyle = "#9d4edd";
        llCtx.fillRect(50 + i * 80, 200, 60, 40);
        llCtx.fillStyle = "#fff";
        llCtx.fillText(v, 70 + i * 80, 225);

        if (i < ll.length - 1) {
            llCtx.fillText("→", 110 + i * 80, 225);
        }
    });
}

function llAddFront() {
    const v = $("llInput").value;
    if (!v) return;
    ll.unshift(v);
    drawLL();
    $("llInput").value = "";
}

function llAddEnd() {
    const v = $("llInput").value;
    if (!v) return;
    ll.push(v);
    drawLL();
    $("llInput").value = "";
}

function llDeleteFront() {
    ll.shift();
    drawLL();
}

function llDeleteEnd() {
    ll.pop();
    drawLL();
}

function llClear() {
    ll = [];
    drawLL();
}

/* ===============================
HASH TABLE (FIXED SYNTAX)
================================= */
let ht = {};
const htCtx = $("htCanvas").getContext("2d");

function drawHT() {
    htCtx.clearRect(0, 0, 600, 420);
    let i = 0;
    for (let k in ht) {
        htCtx.fillStyle = "#00c896";
        htCtx.fillRect(50, 50 + i * 50, 200, 40);
        htCtx.fillStyle = "#000";
        htCtx.fillText(k + ": " + ht[k], 60, 75 + i * 50); // FIXED: Proper string concatenation
        i++;
    }
}

function htInsert() {
    const k = $("htKey").value;
    const v = $("htVal").value;
    if (!k) return;
    ht[k] = v;
    drawHT();
    $("htKey").value = "";
    $("htVal").value = "";
}

function htGet() {
    const k = $("htSearch").value;
    $("htMsg").innerText = ht[k] ?? "Not Found";
}

function htClear() {
    ht = {};
    drawHT();
}

/* ===============================
MIN HEAP
================================= */
let heap = [];
const hCtx = $("heapCanvas").getContext("2d");

function drawHeap() {
    hCtx.clearRect(0, 0, 600, 420);
    heap.forEach((v, i) => {
        hCtx.fillStyle = "#ff6b6b";
        hCtx.fillRect(250, 50 + i * 50, 80, 40);
        hCtx.fillStyle = "#fff";
        hCtx.fillText(v, 280, 75 + i * 50);
    });
}

function heapInsert() {
    const v = parseInt($("heapInput").value);
    if (!v) return;
    heap.push(v);
    heap.sort((a, b) => a - b);
    drawHeap();
    $("heapInput").value = "";
}

function heapExtractMin() {
    heap.shift();
    drawHeap();
}

function heapClear() {
    heap = [];
    drawHeap();
}

/* ===============================
QUIZ (FIXED SYNTAX)
================================= */
let quiz = [], qIndex = 0, score = 0;

function startQuiz() {
    $("quizSetup").style.display = "none";
    $("quizActive").style.display = "block";

    quiz = [];
    for (let i = 1; i <= 5; i++) {
        quiz.push({
            q: "Question " + i,
            options: ["A", "B", "C", "D"],
            ans: Math.floor(Math.random() * 4)
        });
    }
    qIndex = 0;
    score = 0;
    showQuestion();
}

function showQuestion() {
    const q = quiz[qIndex];
    $("quizQuestionBox").innerText = q.q;
    $("quizOptions").innerHTML = "";

    q.options.forEach((opt, i) => {
        const btn = document.createElement("button");
        btn.innerText = opt;
        btn.onclick = () => checkAnswer(i);
        $("quizOptions").appendChild(btn); // FIXED: Consistent $()
    });
}

function checkAnswer(i) {
    if (i === quiz[qIndex].ans) score++;
    qIndex++;

    if (qIndex < quiz.length) {
        showQuestion();
    } else {
        endQuiz();
    }
}

function endQuiz() {
    $("quizActive").style.display = "none";
    $("quizResults").style.display = "block";
    $("finalScore").innerText = score + "/" + quiz.length; // FIXED: Proper string concatenation
}

/* ===============================
BINARY TREE (BST VISUALIZATION)
================================= */
let tree = null;
const tCtx = $("treeCanvas").getContext("2d");

function insertNode(root, val) {
    if (!root) return { val, left: null, right: null };
    if (val < root.val) root.left = insertNode(root.left, val);
    else root.right = insertNode(root.right, val);
    return root;
}

function buildTree() {
    const values = $("treeData").value.split(",").map(v => parseInt(v.trim()));
    tree = null;
    values.forEach(v => {
        if (!isNaN(v)) tree = insertNode(tree, v);
    });
    drawTree();
}

function drawTree(node = tree, x = 500, y = 50, gap = 120) {
    tCtx.clearRect(0, 0, 1000, 480);

    function draw(node, x, y, gap) {
        if (!node) return;

        tCtx.fillStyle = "#00f5ff";
        tCtx.beginPath();
        tCtx.arc(x, y, 20, 0, Math.PI * 2);
        tCtx.fill();

        tCtx.fillStyle = "#000";
        tCtx.font = "14px Arial";
        tCtx.textAlign = "center";
        tCtx.fillText(node.val, x, y + 6);

        if (node.left) {
            tCtx.beginPath();
            tCtx.moveTo(x, y);
            tCtx.lineTo(x - gap, y + 80);
            tCtx.strokeStyle = "#fff";
            tCtx.lineWidth = 2;
            tCtx.stroke();
            draw(node.left, x - gap, y + 80, gap / 1.5);
        }

        if (node.right) {
            tCtx.beginPath();
            tCtx.moveTo(x, y);
            tCtx.lineTo(x + gap, y + 80);
            tCtx.stroke();
            draw(node.right, x + gap, y + 80, gap / 1.5);
        }
    }

    tCtx.lineWidth = 1;
    tCtx.textAlign = "left";
    draw(node, x, y, gap);
}

$("buildTree").onclick = buildTree;

/* ===============================
GRAPH BFS / DFS
================================= */
const gCtx = $("graphCanvas").getContext("2d");

let graph = {};
let nodes = [];

function generateGraph() {
    nodes = Array.from({ length: 6 }, (_, i) => ({
        id: i,
        x: Math.random() * 800 + 100,
        y: Math.random() * 300 + 50
    }));

    graph = {};
    nodes.forEach(n => graph[n.id] = []);

    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            if (Math.random() > 0.6) {
                graph[i].push(j);
                graph[j].push(i);
            }
        }
    }

    drawGraph();
}

function drawGraph(visited = []) {
    gCtx.clearRect(0, 0, 1000, 480);

    // edges
    nodes.forEach(n => {
        graph[n.id].forEach(nei => {
            gCtx.beginPath();
            gCtx.moveTo(n.x, n.y);
            gCtx.lineTo(nodes[nei].x, nodes[nei].y);
            gCtx.strokeStyle = "#555";
            gCtx.lineWidth = 2;
            gCtx.stroke();
        });
    });

    // nodes
    nodes.forEach(n => {
        gCtx.beginPath();
        gCtx.arc(n.x, n.y, 20, 0, Math.PI * 2);
        gCtx.fillStyle = visited.includes(n.id) ? "#ff6b6b" : "#00f5ff";
        gCtx.fill();
        gCtx.strokeStyle = "#fff";
        gCtx.lineWidth = 2;
        gCtx.stroke();

        gCtx.fillStyle = "#000";
        gCtx.font = "16px Arial";
        gCtx.textAlign = "center";
        gCtx.fillText(n.id, n.x, n.y + 6);
    });

    gCtx.textAlign = "left";
    gCtx.lineWidth = 1;
}

async function bfs() {
    let visited = [];
    let queue = [0];

    while (queue.length) {
        let node = queue.shift();
        if (!visited.includes(node)) {
            visited.push(node);
            drawGraph(visited);
            await sleep(500);
            queue.push(...graph[node].filter(n => !visited.includes(n)));
        }
    }
}

async function dfs(node = 0, visited = []) {
    if (visited.includes(node)) return;

    visited.push(node);
    drawGraph(visited);
    await sleep(500);

    for (let nei of graph[node]) {
        await dfs(nei, visited);
    }
}

$("newGraph").onclick = generateGraph;
$("runBFS").onclick = bfs;
$("runDFS").onclick = () => dfs();

/* ===============================
NETWORK VISUALIZATION
================================= */
const nCtx = $("networkCanvas").getContext("2d");

let netNodes = [];
let netEdges = [];

function generateNetwork() {
    netNodes = Array.from({ length: 8 }, (_, i) => ({
        id: i,
        x: Math.random() * 800 + 100,
        y: Math.random() * 300 + 50,
        dx: (Math.random() - 0.5) * 2,
        dy: (Math.random() - 0.5) * 2
    }));

    netEdges = [];
    for (let i = 0; i < netNodes.length; i++) {
        for (let j = i + 1; j < netNodes.length; j++) {
            if (Math.random() > 0.7) {
                netEdges.push([i, j]);
            }
        }
    }
}

function animateNetwork() {
    nCtx.clearRect(0, 0, 1000, 480);

    // move nodes
    netNodes.forEach(n => {
        n.x += n.dx;
        n.y += n.dy;

        if (n.x < 50 || n.x > 950) n.dx *= -1;
        if (n.y < 50 || n.y > 430) n.dy *= -1;
    });

    // edges
    netEdges.forEach(([a, b]) => {
        nCtx.beginPath();
        nCtx.moveTo(netNodes[a].x, netNodes[a].y);
        nCtx.lineTo(netNodes[b].x, netNodes[b].y);
        nCtx.strokeStyle = "#444";
        nCtx.lineWidth = 1;
        nCtx.stroke();
    });

    // nodes
    netNodes.forEach(n => {
        nCtx.beginPath();
        nCtx.arc(n.x, n.y, 15, 0, Math.PI * 2);
        nCtx.fillStyle = "#00f5ff";
        nCtx.fill();
        nCtx.strokeStyle = "#fff";
        nCtx.lineWidth = 2;
        nCtx.stroke();
    });

    requestAnimationFrame(animateNetwork);
}

$("generateNetwork").onclick = generateNetwork;
$("addNode").onclick = () => {
    netNodes.push({
        id: netNodes.length,
        x: Math.random() * 800 + 100,
        y: Math.random() * 300 + 50,
        dx: (Math.random() - 0.5) * 2,
        dy: (Math.random() - 0.5) * 2
    });
};

generateNetwork();
animateNetwork();

// Make stack/queue functions globally available for HTML onclick
window.stackPush = stackPush;
window.stackPop = stackPop;
window.stackPeek = stackPeek;
window.stackClear = stackClear;
window.queueEnqueue = queueEnqueue;
window.queueDequeue = queueDequeue;
window.queueFront = queueFront;
window.queueClear = queueClear;
window.llAddFront = llAddFront;
window.llAddEnd = llAddEnd;
window.llDeleteFront = llDeleteEnd;
window.llClear = llClear;
window.htInsert = htInsert;
window.htGet = htGet;
window.htClear = htClear;
window.heapInsert = heapInsert;
window.heapExtractMin = heapExtractMin;
window.heapClear = heapClear;
window.startQuiz = startQuiz;
window.buildTree = buildTree;