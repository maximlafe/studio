import { Inject, Injectable } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { RewardRateUnit } from '~app-toolkit/helpers/master-chef/master-chef.contract-position-helper';
import {
  GetMasterChefDataPropsParams,
  GetMasterChefTokenBalancesParams,
  MasterChefTemplateContractPositionFetcher,
} from '~position/template/master-chef.template.contract-position-fetcher';
import { Network } from '~types/network.interface';

import { YieldYakChef, YieldYakContractFactory } from '../contracts';
import { YIELD_YAK_DEFINITION } from '../yield-yak.definition';

@Injectable()
export class AvalancheYieldyakFarmContractPositionFetcher extends MasterChefTemplateContractPositionFetcher<YieldYakChef> {
  appId = YIELD_YAK_DEFINITION.id;
  groupId = YIELD_YAK_DEFINITION.groups.farm.id;
  network = Network.AVALANCHE_MAINNET;
  groupLabel = 'Farms';
  chefAddress = '0x0cf605484a512d3f3435fed77ab5ddc0525daf5f';
  rewardRateUnit = RewardRateUnit.BLOCK;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(YieldYakContractFactory) private readonly contractFactory: YieldYakContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): YieldYakChef {
    return this.contractFactory.yieldYakChef({ address, network: this.network });
  }

  async getPoolLength(contract: YieldYakChef) {
    return contract.poolLength();
  }

  async getStakedTokenAddress(contract: YieldYakChef, poolIndex: number) {
    return contract.poolInfo(poolIndex).then(v => v.token);
  }

  async getRewardTokenAddress() {
    return ZERO_ADDRESS;
  }

  async getTotalAllocPoints({ contract }: GetMasterChefDataPropsParams<YieldYakChef>): Promise<BigNumberish> {
    return contract.totalAllocPoint();
  }

  async getTotalRewardRate({ contract }: GetMasterChefDataPropsParams<YieldYakChef>): Promise<BigNumberish> {
    return contract.rewardsPerSecond();
  }

  async getPoolAllocPoints({
    contract,
    definition,
  }: GetMasterChefDataPropsParams<YieldYakChef>): Promise<BigNumberish> {
    return contract.poolInfo(definition.poolIndex).then(v => v.allocPoint);
  }

  async getStakedTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<YieldYakChef>): Promise<BigNumberish> {
    return contract.userInfo(contractPosition.dataProps.poolIndex, address).then(v => v.amount);
  }

  async getRewardTokenBalance({
    address,
    contract,
    contractPosition,
  }: GetMasterChefTokenBalancesParams<YieldYakChef>): Promise<BigNumberish> {
    return contract.pendingRewards(contractPosition.dataProps.poolIndex, address);
  }
}
