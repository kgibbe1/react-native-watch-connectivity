import {IntegrationTest} from '../IntegrationTest';

import {assert} from './util';
import {getReachability, watchEvents} from 'react-native-watch-connectivity';
import {TestFnOpts} from './index';

export class ReachabilityIntegrationTest extends IntegrationTest {
  constructor() {
    super('Reachability');
    this.registerTest('Reachable', 'reachable', this.testReachable);
    this.registerTest(
      'Wait for reachability',
      'unreachable',
      this.testWaitForReachability,
    );
    this.registerTest(
      'Wait for unreachability',
      'reachable',
      this.testWaitForUnreachability,
    );
  }

  testReachable = async () => {
    const reachable = await getReachability();
    if (!reachable) {
      // The tests cannot even be executed if watch not reachable
      throw new Error('Watch should reachable');
    }
  };

  testWaitForReachability = async ({log}: TestFnOpts) => {
    const reachable = await getReachability();
    log('checking that watch is unreachable: ' + JSON.stringify(reachable));
    assert(!reachable, 'should not be reachable to begin with');

    await new Promise((resolve) => {
      log(
        'waiting for watch to become reachable... you should open the watch app',
      );
      watchEvents.once('reachability', (reachable1) => {
        if (reachable1) {
          resolve();
        }
      });
    });
  };

  testWaitForUnreachability = async ({log}: TestFnOpts) => {
    const reachable = await getReachability();
    log('checking that watch is reachable: ' + JSON.stringify(reachable));
    assert(reachable, 'should be reachable to begin with');

    await new Promise((resolve) => {
      log(
        'waiting for watch to become unreachable... you should close the watch app',
      );
      watchEvents.once('reachability', (reachable1) => {
        if (!reachable1) {
          resolve();
        }
      });
    });
  };
}
