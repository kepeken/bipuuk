import React from 'react';
import { Branch, height, isBranch, isLeaf, Tree } from './tree';

// Pi is wrong!
const TAU = Math.PI * 2;
const { cos, sin } = Math;

function adjacentPairs<T>(array: T[]): [T, T][] {
  return array.map((value, index, array) => [
    value,
    array[(index + 1) % array.length],
  ]);
}

interface ReadonlyWeakMap<K extends object, V> {
  get(key: K): V | undefined;
  has(key: K): boolean;
}

export class System {
  private readonly root: Tree;
  private mass: number;
  private attenuation: number;
  private positions: ReadonlyWeakMap<Tree, number>;
  private velocities: ReadonlyWeakMap<Tree, number>;

  constructor(root: Tree) {
    this.mass = 1e6;
    this.attenuation = 0.74;

    const positions = new WeakMap<Tree, number>();
    const velocities = new WeakMap<Tree, number>();

    if (isLeaf(root)) {
      this.root = root;
      this.positions = positions;
      this.velocities = velocities;
      return;
    }

    let curr: Branch[] = [root];
    positions.set(root, 1 / 4);
    velocities.set(root, 0);

    while (curr.length) {
      const next: Branch[] = [];

      curr = curr.filter((a) => isBranch(a.left) || isBranch(a.right));

      for (const [a, b] of adjacentPairs(curr)) {
        const pa = positions.get(a)!;
        const pb = positions.get(b)!;
        let delta = normalize(pa - pb);
        if (delta === 0) delta = 1;
        if (isBranch(a.right) && isBranch(b.left)) {
          positions.set(a.right, normalize(pa - delta / 4));
          positions.set(b.left, normalize(pb + delta / 4));
          velocities.set(a.right, 0);
          velocities.set(b.left, 0);
          next.push(a.right, b.left);
        } else if (isBranch(a.right)) {
          positions.set(a.right, normalize(pa - delta / 2));
          velocities.set(a.right, 0);
          next.push(a.right);
        } else if (isBranch(b.left)) {
          positions.set(b.left, normalize(pb + delta / 2));
          velocities.set(b.left, 0);
          next.push(b.left);
        }
      }

      curr = next;
    }

    this.root = root;
    this.positions = positions;
    this.velocities = velocities;
  }

  private calculateForces(): WeakMap<Tree, number> {
    const forces = new WeakMap<Tree, number>();

    if (isLeaf(this.root)) {
      return forces;
    }

    let curr: Branch[] = [this.root];

    while (curr.length) {
      const next: Branch[] = [];
      const actives: Branch[] = [];

      curr = curr.filter((a) => isBranch(a.left) || isBranch(a.right));

      for (const a of curr) {
        if (isBranch(a.left)) {
          actives.push(a.left);
          next.push(a.left);
        }
        actives.push(a);
        if (isBranch(a.right)) {
          actives.push(a.right);
          next.push(a.right);
        }
      }

      for (const [a, b] of adjacentPairs(actives)) {
        const pa = this.positions.get(a)!;
        const pb = this.positions.get(b)!;
        const delta = normalize(pa - pb);
        forces.set(a, (forces.get(a) ?? 0) + 1 / delta ** 2);
        forces.set(b, (forces.get(b) ?? 0) - 1 / delta ** 2);
      }

      curr = next;
    }

    return forces;
  }

  private updateStates(forces: WeakMap<Tree, number>): void {
    const positions = new WeakMap<Tree, number>();
    const velocities = new WeakMap<Tree, number>();

    const queue: [Tree, number][] = [];
    queue.push([this.root, 0]);
    while (queue.length) {
      let [node, delta] = queue.shift()!;
      if (isLeaf(node)) continue;
      let pos = this.positions.get(node)!;
      let vel = this.velocities.get(node)!;
      const force = forces.get(node)!;

      vel = (vel + force / this.mass) * this.attenuation;
      if (node !== this.root) delta += vel;
      pos += delta;

      positions.set(node, pos);
      velocities.set(node, vel);
      queue.push([node.left, delta]);
      queue.push([node.right, delta]);
    }

    this.positions = positions;
    this.velocities = velocities;
  }

  private calculateMomentum(): number {
    let sum = 0;
    const queue: Tree[] = [];
    queue.push(this.root);
    while (queue.length) {
      let node = queue.shift()!;
      if (isLeaf(node)) continue;
      const vel = this.velocities.get(node)!;
      sum += this.mass * vel ** 2;
      queue.push(node.left);
      queue.push(node.right);
    }
    return sum;
  }

  tick(): this {
    const forces = this.calculateForces();
    this.updateStates(forces);
    return this;
  }

  stabilize(): this {
    const threshold = 0.1;
    const limit = 10000;
    for (let i = 0; i < limit; i++) {
      this.tick();
      const p = this.calculateMomentum();
      if (p < threshold) break;
    }
    return this;
  }

  render(): JSX.Element {
    const r = radius(height(this.root));
    const w = r * 2;
    const h = r * 2;

    if (isLeaf(this.root)) {
      return <></>;
    }

    const path = new Path();
    let curr: Branch[] = [this.root];
    let depth = 0;
    while (curr.length) {
      const next: Branch[] = [];
      curr = curr.filter((node) => isBranch(node.left) || isBranch(node.right));
      for (const node of curr) {
        const r0 = radius(depth);
        const r1 = radius(depth + 1);
        const t0 = this.positions.get(node)!;
        path.warp(r0, r1, t0);
        if (isBranch(node.left) && isBranch(node.right)) {
          const tl = this.positions.get(node.left)!;
          const tr = this.positions.get(node.right)!;
          path.weft(r1, tr, tl);
          next.push(node.left, node.right);
        } else if (isBranch(node.left)) {
          const tl = this.positions.get(node.left)!;
          path.weft(r1, t0, tl);
          next.push(node.left);
        } else if (isBranch(node.right)) {
          const tr = this.positions.get(node.right)!;
          path.weft(r1, tr, t0);
          next.push(node.right);
        }
      }
      curr = next;
      depth += 1;
    }

    return (
      <svg width={w} height={h} viewBox={`${-w / 2} ${-h / 2} ${w} ${h}`}>
        <circle cx={0} cy={0} r={radius(0)} stroke="black" fill="none" />
        <path
          d={path.build()}
          strokeLinecap="round"
          stroke="black"
          fill="none"
        />
      </svg>
    );
  }
}

class Path {
  private d: string[];

  constructor() {
    this.d = [];
  }

  build(): string {
    return this.d.join(' ');
  }

  // (r0, t) から (r1, t) まで直線を描く。
  warp(r0: number, r1: number, t: number): void {
    const [x0, y0] = polar(r0, t);
    const [x1, y1] = polar(r1, t);
    this.d.push(`M ${x0} ${y0}`);
    this.d.push(`L ${x1} ${y1}`);
  }

  // 中心 (0, 0)、半径 r で t0 から t1 まで時計回りに弧を描く。
  weft(r: number, t0: number, t1: number): void {
    const [x0, y0] = polar(r, t0);
    const [x1, y1] = polar(r, t1);
    const large = normalize(t1 - t0) >= 0.5;
    const clockwise = true;
    this.d.push(`M ${x0} ${y0}`);
    this.d.push(`A ${r} ${r} ${TAU * t0} ${+large} ${+clockwise} ${x1} ${y1}`);
  }
}

// 偏角を [0, 1) に正規化する。
function normalize(turn: number): number {
  return ((turn % 1) + 1) % 1;
}

function radius(depth: number): number {
  return 40 + 20 * depth;
}

function polar(r: number, t: number): [number, number] {
  const x = r * cos(TAU * t);
  const y = r * sin(TAU * t);
  return [x, y];
}
