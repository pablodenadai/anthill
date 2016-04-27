# Anthill

**Work in progress.**

> A naive ant colony simulation.

*This project was __heavily__ influenced by [andreasjansson/ants_simulation](https://github.com/andreasjansson/ants_simulation).*

## How it works

The ants form a subsumption architecture by having a number of reactive rules govern their behaviour. The rules are ordered by precedence, and once a rule has applied, no other rules can apply. These are the rules (ordered by precedence, descending):

1. If you carry food and you are at the ant hill: Drop the food and get a new, random, direction of movement.
2. If you carry food and you are next to the ant hill: Drop pheromone and set direction on the ant hill.
3. If you carry food and you are standing on pheromone: Drop pheromone and set direction on the pheromone in front of you (if any).
4. If you carry food: Set direction on the ant hill and drop pheromone.
5. If you have found food: Pick up the food, drop pheromone, and set direction on the ant hill.
6. If you are standing on pheromone: Set direction on the pheromone in front of you (if any).
7. Sense distant pheromone, and if you sense any, set direction on it.

Ants don't always follow the rules regarding their movement, sometimes
they just walk randomly.

Configuration parameters can be found in the `engine/src/ts/Config.ts` file.

## Rethinking the rules

> WIP

- OK (use radians) Each ant has 2 sensing points to act as the antenna
  - OK (use radians) Ant checks the strength of the trail at each of those sensors
    - OK (use radians) If the left is stronger than the right, then it turns left, if the right is stronger, turn right, if they are the same go straight
  - OK (use radians) If there is no trail at each antenna, the ant will go straight, and randomly turn every so often
- Each ant has one point in the middle that acts as the "mouth"
  - The mouth sensor is always checking for food at it's position
    - If the ant hits a food source, it eats, then grabs food and turns 180 degrees and begins to move straight which should follow the trail it laid when finding the food
- If the ants position matches the colony hole, it drops the food it's carrying
- If enough food is gathered new ants are born

There are a few other small rules like an ant won't turn left or right too many times in a row because it will cause them to get stuck in a spiral.

## Resources

#### Books
- [Ant Colony Optimization](https://econ.ubbcluj.ro/~rodica.lung/taco/literatura/aco/Ant%20Colony%20Optimization%20Dorigo%20carte.pdf) by Marco Dorigo and  Thomas Stutzle

#### Articles
- [Ant Colony Optimization For Hackers](http://www.theprojectspot.com/tutorial-post/ant-colony-optimization-for-hackers/10) by Lee Jacobson

#### GitHub Repos
- [andreasjansson/ants_simulation](https://github.com/andreasjansson/ants_simulation)
- [gserrano/anthill](https://github.com/gserrano/anthill)

#### Live Implementation
- [Ants](http://www.enviee.com/joel/ants/) by Joel Schulbach [[Reddit thread](https://www.reddit.com/r/javascript/comments/2r6gzk/javascript_canvas_ant_simulator/)]

## TODO

#### Known Issues
- Ants get stuck in pheromone
- Ants should always leave pheromone track
- Ants should follow pheromone back to anthill

#### Features
- Immutables + Redux + RxJS
- Hooks/Events
- React UI
- Unit tests
- Speed
