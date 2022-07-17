/// <reference path="../../lib/openrct2.d.ts" />

const isQueue = (elm: TileElement): boolean =>
    elm.type == 'footpath' && elm.isQueue;
const orphan_queue_ride_id = -1;

export class QueueManager {
  queues: Record<number, Array<FootpathElement>>;
  current_highlight: number|null = null;

  constructor() {
    this.queues = {};

    const add_queue = (queue: TileElement) => {
      queue = queue as FootpathElement;
      const ride_id = queue.ride === null ? -1 : queue.ride;
      if (!(ride_id in this.queues)) {
        this.queues[ride_id] = [];
      }
      this.queues[ride_id].push(queue);
    };

    for (let x = 0; x < map.size.x; x++) {
      for (let y = 0; y < map.size.y; y++) {
        const tile = map.getTile(x, y);
        tile.elements.filter(isQueue).map(add_queue);
      }
    }
  }

  get currentSurface(): number|null {
    if (this.current_highlight === null || this.current_highlight == -1) {
      return null;
    }
    return this.queues[this.current_highlight][0].surfaceObject;
  }

  set currentSurface(surface_id: number|null) {
    if (surface_id === null || this.current_highlight === null ||
        this.current_highlight == -1 || this.currentSurface == surface_id) {
      return;
    }
    this.queues[this.current_highlight].forEach(
        (path: FootpathElement) => path.surfaceObject = surface_id);
  }

  get currentRailings(): number|null {
    if (this.current_highlight === null || this.current_highlight == -1) {
      return null;
    }
    return this.queues[this.current_highlight][0].railingsObject;
  }

  set currentRailings(railings_id: number|null) {
    if (railings_id === null || this.current_highlight === null ||
        this.current_highlight == -1 || this.currentRailings == railings_id) {
      return;
    }
    this.queues[this.current_highlight].forEach(
        (path: FootpathElement) => path.railingsObject = railings_id);
  }

  highlight_orphans() {
    this.toggle_ride_highlight(orphan_queue_ride_id);
  }

  unhighlight() {
    if (this.current_highlight !== null) {
      this.queues[this.current_highlight].map(queue => queue.isGhost = false);
    }
    this.current_highlight = null;
  }

  toggle_ride_highlight(ride_id: number) {
    this.unhighlight();
    if (!(ride_id in this.queues)) {
      return;
    }
    this.queues[ride_id].map(queue => queue.isGhost = true);
    this.current_highlight = ride_id;
  }

  has_highlight() {
    return this.current_highlight !== null;
  }

  toggle_visibility() {
    if (this.current_highlight === null) {
      return;
    }
    this.queues[this.current_highlight].map(
        (queue: FootpathElement) => queue.isHidden = !queue.isHidden);
  }
}
