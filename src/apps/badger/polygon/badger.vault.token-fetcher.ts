import { Injectable } from '@nestjs/common';

import { Network } from '~types/network.interface';

import { BADGER_DEFINITION } from '../badger.definition';
import { BadgerVaultTokenFetcher } from '../common/badger.vault.token-fetcher';

@Injectable()
export class PolygonBadgerVaultTokenFetcher extends BadgerVaultTokenFetcher {
  appId = BADGER_DEFINITION.id;
  groupId = BADGER_DEFINITION.groups.vault.id;
  network = Network.POLYGON_MAINNET;
  groupLabel = 'Vaults';
}
