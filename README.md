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
- Immutables
- RxJS
- Hooks/Events?
- React UI?
- Unit tests
