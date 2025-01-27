import React, {useEffect} from 'react';
import NetworkSelection from './NetworkSelection';
import ChooseValidators from './ChooseValidators';
import ChooseAllocations from './ChooseAllocations';
import ChoosExistingDelegations from './ChooseExistingDelegations';
import ConnectWallet from './ConnectWallet';
import { useSelector, useDispatch } from 'react-redux'
import {stakingActiveStep} from '../../../slices/stakingActiveStep';
import { selectedNetworkSelector} from "../../../slices/selectedNetwork";
import { _loadValsAsync , validatorListSelector, setSelectedValidatorList} from "../../../slices/validatorList";
import { selectedNetworkWalletSelector } from '../../../slices/selectedNetworkWallet';
import {_loadExistingValsAsync} from '../../../slices/existingDelegations';
import SummaryExistingDelegations from './SummaryExistingDelegations';
import SummaryValidators from './SummaryValidators';
import CongratulationsPane from './CongratulationsPane';



export default function Delegate() {
    const dispatch = useDispatch();
    const {selectedNetwork} = useSelector(selectedNetworkSelector);
    const {networkAddress} = useSelector(selectedNetworkWalletSelector);
    const {validatorList, selectedValidatorList} = useSelector(validatorListSelector);

    useEffect(() => {
        if (selectedNetwork !== "Select a network") {
            console.log(selectedNetwork.chain_id)
                  // @ts-expect-error
         dispatch(_loadValsAsync(selectedNetwork.chain_id));
        //          // @ts-expect-error
        //  dispatch(_loadExistingValsAsync(networkAddress, selectedNetwork.chain_id))
        }
      }, [selectedNetwork])





 


    const activeStep = useSelector(stakingActiveStep);
    return (
        <>
        {activeStep === 1 && <ConnectWallet/>}
        {activeStep === 2 && <NetworkSelection/>}
        {activeStep === 3 && <ChooseValidators  />}
        {activeStep === 4 && <ChooseAllocations/>}
        {activeStep === 5 && <SummaryValidators/>}
        {activeStep === 6 && <ChoosExistingDelegations/>}
        {activeStep === 7 && <SummaryExistingDelegations/>}
        {activeStep === 8 && <CongratulationsPane/>}
        </>
    )
}