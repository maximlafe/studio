import { Injectable } from '@nestjs/common';

import { Network } from '~types/network.interface';

import { BEETHOVEN_X_DEFINITION } from '../beethoven-x.definition';
import { BeethovenXPoolTokenFetcher } from '../common/beethoven-x.pool.token-fetcher';

@Injectable()
export class OptimismBeethovenXPoolTokenFetcher extends BeethovenXPoolTokenFetcher {
  subgraphUrl = 'https://backend-optimism.beets-ftm-node.com/';
  vaultAddress = '0xba12222222228d8ba445958a75a0704d566bf2c8';
  appId = BEETHOVEN_X_DEFINITION.id;
  groupId = BEETHOVEN_X_DEFINITION.groups.pool.id;
  network = Network.OPTIMISM_MAINNET;
  groupLabel = 'Pools';
}
