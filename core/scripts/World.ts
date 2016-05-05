import { EventEmitter } from 'fbemitter';

import { Entity } from './common/Entity';
import { Events } from './common/Events';
import { Rectangle } from './common/Rectangle';
import { Collection } from './common/Collection';

import { AntHill } from './AntHill';
import { AntCollection } from './AntCollection';
import { FoodCollection } from './FoodCollection';
import { PheromoneCollection } from './PheromoneCollection';

import { CONFIG } from './Config';

export class World {
  public rectangle: Rectangle;

  public antHill: AntHill;
  public foodCollection: FoodCollection;
  public pheromoneCollection: PheromoneCollection;
  public antCollection: AntCollection;

  public emitter: EventEmitter;

  constructor () {
    this.rectangle = CONFIG.WORLD.RECTANGLE;
    this.emitter = new EventEmitter();

    this.antHill = new AntHill();
    this.foodCollection = new FoodCollection();
    this.pheromoneCollection = new PheromoneCollection();
    this.antCollection = new AntCollection(
      this.antHill,
      this.foodCollection,
      this.pheromoneCollection
    );

    this.bindEvents([
      this.antCollection,
      this.foodCollection,
      this.pheromoneCollection
    ]);
  };

  bindEvents (collections: Array<Collection>) {
    _.forEach(collections, (collection: Collection) => {
      collection.emitter.addListener(Events.Create, (entity: Entity) => this.emitter.emit(Events.Create, entity));
      collection.emitter.addListener(Events.Update, (entity: Entity) => this.emitter.emit(Events.Update, entity));
      collection.emitter.addListener(Events.Delete, (entity: Entity) => this.emitter.emit(Events.Delete, entity));
    });
  }

  start () {
    this.emitter.emit(Events.Create, this.antHill);

    this.foodCollection.create();
    this.antCollection.create();
  }
}
