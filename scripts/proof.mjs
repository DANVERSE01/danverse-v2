import { mkdir } from 'fs/promises';
import { resolve } from 'path';

const dir = resolve('docs', 'proof');
await mkdir(dir, { recursive: true });
console.log(dir);
