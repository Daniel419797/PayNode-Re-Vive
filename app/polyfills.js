import { Buffer } from 'buffer';
import { createRequire } from 'module';

if (typeof window !== 'undefined') {
  window.Buffer = window.Buffer || Buffer;
  window.require = window.require || createRequire(import.meta.url);
}