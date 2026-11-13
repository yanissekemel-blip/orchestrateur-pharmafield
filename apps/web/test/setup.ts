import { cleanup } from '@testing-library/react';
import { MotionGlobalConfig } from 'motion/react';
import { afterEach } from 'vitest';

// Exit animations would otherwise keep elements mounted between assertions.
MotionGlobalConfig.skipAnimations = true;

afterEach(() => cleanup());
