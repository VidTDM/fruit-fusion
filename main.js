if (!localStorage.getItem('highscore')) localStorage.setItem('highscore', '0');
const highscore = document.querySelector('.highscore');
highscore.innerHTML = `Highscore: ${localStorage.getItem('highscore')}`

const {
    Engine,
    Render,
    Bodies,
    Body,
    Bounds,
    World,
    Events,
    Common,
    Mouse,
    MouseConstraint,
    Query,
} = Matter;

// Render Intial Things
const engine = Engine.create();
const render = Render.create({
    element: document.body,
    engine: engine,
    options: { wireframes: false },
});
const mouse = Mouse.create(render.canvas);
const mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: { render: { visible: false } },
});
mouseConstraint.collisionFilter.mask = 0;

const ground = Bodies.rectangle(400, 600, 810, 60, {
    label: "static",
    isStatic: true,
    render: { fillStyle: "#ffdc80" },
});
const wallOptions = {
    label: "static",
    isStatic: true,
    render: { fillStyle: "#29a3ba" },
};
const wall = Bodies.rectangle(0, 600, 400, 1200, wallOptions);
const wall2 = Bodies.rectangle(800, 600, 400, 1200, wallOptions);
const heightLimit = Bodies.rectangle(400, 200, 400, 5, {
    label: "static",
    isStatic: true,
    isSensor: true,
    render: { fillStyle: "white" },
});
const cherry = Bodies.circle(400, 100, 10, {
    label: "cherry",
    isStatic: true,
    render: { fillStyle: "#ec3453" },
});
World.add(engine.world, [
    mouseConstraint,
    wall,
    wall2,
    ground,
    heightLimit,
    cherry,
]);

Engine.run(engine);
Render.run(render);

const parentDiv = document.createElement("div");
const scoreDiv = document.createElement("div");
parentDiv.setAttribute("class", "canvas-parent");
scoreDiv.setAttribute("class", "score");
scoreDiv.innerText = "0";
parentDiv.appendChild(render.canvas);
parentDiv.appendChild(scoreDiv);
document.body.appendChild(parentDiv);

// Key Controls
document.addEventListener("keydown", (e) => {
    const fruit = Query.region(engine.world.bodies, {
        min: { x: 0, y: 100 },
        max: { x: 800, y: 100 },
    }).filter((body) => body.label !== "static")[0];
    if (!fruit) return;
    switch (e.key) {
        case " ":
            swooshAudio.cloneNode(true).play();
            Body.setStatic(fruit, false);
            setTimeout(
                () =>
                    World.add(
                        engine.world,
                        Bodies.circle(
                            ...STARTING_BODIES[
                                Math.floor(
                                    Math.random() * STARTING_BODIES.length
                                )
                            ]
                        )
                    ),
                2000
            );
            break;
        case "ArrowLeft":
            Body.translate(fruit, { x: -10, y: 0 });
            break;
        case "ArrowRight":
            Body.translate(fruit, { x: 10, y: 0 });
            break;
    }
});

// Collisions
Events.on(engine, "collisionStart", (e) => {
    for (const pair of e.pairs) {
        const bodyA = pair.bodyA;
        const bodyB = pair.bodyB;
        if (bodyA.label !== bodyB.label) { // Detect Game Over
            if (
                (bodyA === heightLimit || bodyB === heightLimit) &&
                (bodyA.position.y > heightLimit.position.y ||
                    bodyB.position.y > heightLimit.position.y)
            ) {
                alert(`Game Over\n\nYour score was ${scoreDiv.innerHTML}`);
                const highscore = Number(localStorage.getItem('highscore'));
                if (highscore < Number(scoreDiv.innerHTML))
                    localStorage.setItem('highscore', scoreDiv.innerHTML)
            }
        } else { // Merge Fruits
            const collisionPointX = (bodyA.position.x + bodyB.position.x) / 2;
            const collisionPointY = (bodyA.position.y + bodyB.position.y) / 2;
            if (bodyA.label === "cherry" && bodyB.label === "cherry") {
                World.remove(engine.world, [bodyA, bodyB]);
                World.add(
                    engine.world,
                    Bodies.circle(
                        collisionPointX,
                        collisionPointY,
                        ...STRAWBERRY
                    )
                );
                scoreDiv.innerHTML = (Number(scoreDiv.innerHTML) + 2).toString();
            } else if (
                bodyA.label === "strawberry" &&
                bodyB.label === "strawberry"
            ) {
                World.remove(engine.world, [bodyA, bodyB]);
                World.add(
                    engine.world,
                    Bodies.circle(collisionPointX, collisionPointY, ...GRAPE)
                );
                scoreDiv.innerHTML = (Number(scoreDiv.innerHTML) + 4).toString();
            } else if (bodyA.label === "grape" && bodyB.label === "grape") {
                World.remove(engine.world, [bodyA, bodyB]);
                World.add(
                    engine.world,
                    Bodies.circle(collisionPointX, collisionPointY, ...DEKOPON)
                );
                scoreDiv.innerHTML = (Number(scoreDiv.innerHTML) + 6).toString();
            } else if (bodyA.label === "dekopon" && bodyB.label === "dekopon") {
                World.remove(engine.world, [bodyA, bodyB]);
                World.add(
                    engine.world,
                    Bodies.circle(collisionPointX, collisionPointY, ...ORANGE)
                );
                scoreDiv.innerHTML = (Number(scoreDiv.innerHTML) + 8).toString();
            } else if (bodyA.label === "orange" && bodyB.label === "orange") {
                World.remove(engine.world, [bodyA, bodyB]);
                World.add(
                    engine.world,
                    Bodies.circle(collisionPointX, collisionPointY, ...APPLE)
                );
                scoreDiv.innerHTML = (Number(scoreDiv.innerHTML) + 10).toString();
            } else if (bodyA.label === "apple" && bodyB.label === "apple") {
                World.remove(engine.world, [bodyA, bodyB]);
                World.add(
                    engine.world,
                    Bodies.circle(collisionPointX, collisionPointY, ...PEAR)
                );
                scoreDiv.innerHTML = (Number(scoreDiv.innerHTML) + 12).toString();
            } else if (bodyA.label === "pear" && bodyB.label === "pear") {
                World.remove(engine.world, [bodyA, bodyB]);
                World.add(
                    engine.world,
                    Bodies.circle(collisionPointX, collisionPointY, ...PEACH)
                );
                scoreDiv.innerHTML = (Number(scoreDiv.innerHTML) + 14).toString();
            } else if (bodyA.label === "peach" && bodyB.label === "peach") {
                World.remove(engine.world, [bodyA, bodyB]);
                World.add(
                    engine.world,
                    Bodies.circle(
                        collisionPointX,
                        collisionPointY,
                        ...PINEAPPLE
                    )
                );
                scoreDiv.innerHTML = (Number(scoreDiv.innerHTML) + 16).toString();
            } else if (
                bodyA.label === "pineapple" &&
                bodyB.label === "pineapple"
            ) {
                World.remove(engine.world, [bodyA, bodyB]);
                World.add(
                    engine.world,
                    Bodies.circle(collisionPointX, collisionPointY, ...MELON)
                );
                scoreDiv.innerHTML = (Number(scoreDiv.innerHTML) + 18).toString();
            } else if (bodyA.label === "melon" && bodyB.label === "melon") {
                World.remove(engine.world, [bodyA, bodyB]);
                World.add(
                    engine.world,
                    Bodies.circle(
                        collisionPointX,
                        collisionPointY,
                        ...WATERMELON
                    )
                );
                scoreDiv.innerHTML = (Number(scoreDiv.innerHTML) + 20).toString();
            } else if (
                bodyA.label === "watermelon" &&
                bodyB.label === "watermelon"
            ) {
                World.remove(engine.world, [bodyA, bodyB]);
                World.add(
                    engine.world,
                    Bodies.circle(collisionPointX, collisionPointY, ...CHERRY)
                );
                scoreDiv.innerHTML = (Number(scoreDiv.innerHTML) + 22).toString();
            }
            plopAudio.cloneNode(true).play();
        }
    }
});
