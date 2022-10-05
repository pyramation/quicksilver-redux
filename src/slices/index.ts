import { combineReducers } from 'redux'

import networkReducer from './networks'
import selectedNetworkReducer from './selectedNetwork'
import quicksilverReducer from './quicksilver'
import selectedNetworkWalletReducer from './selectedNetworkWallet'
import validatorListReducer from './validatorList'
import stakingActiveStepReducer from './stakingActiveStep'
import stakingAllocationReducer from './allocation';
import existingDelegationsReducer from './existingDelegations';
import connectWalletModalReducer from './connectWalletModal'
import poolsReducer from './pools'
import unbondingReducer from './unbonding';

export type RootState = ReturnType<typeof rootReducer>

const rootReducer = combineReducers({
  networks: networkReducer,
  selectedNetwork: selectedNetworkReducer,
  quicksilver: quicksilverReducer,
  selectedNetworkWallet: selectedNetworkWalletReducer,
  validatorList: validatorListReducer,
  stakingActiveStep: stakingActiveStepReducer,
  stakingAllocation: stakingAllocationReducer,
  existingDelegations: existingDelegationsReducer,
  connectWalletModal: connectWalletModalReducer,
  osmosisPools: poolsReducer,
  unbondings: unbondingReducer
})

export default rootReducer;