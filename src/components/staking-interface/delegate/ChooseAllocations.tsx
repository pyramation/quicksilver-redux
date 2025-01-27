
import React , {useEffect, useState, useRef} from 'react';
import {setStakingAmount, setStakingAllocationProp, stakingAllocationSelector} from '../../../slices/allocation';
import { useSelector, useDispatch } from 'react-redux';
import { selectedNetworkWalletSelector } from '../../../slices/selectedNetworkWallet';
import { selectedNetworkSelector} from "../../../slices/selectedNetwork";
import { validatorListSelector} from "../../../slices/validatorList";
import {quicksilverSelector} from '../../../slices/quicksilver';
import {increaseStakingStep, decreaseStakingStep} from '../../../slices/stakingActiveStep';
import './ChooseAllocations.css';

export default function ChooseAllocations() {
    const dispatch = useDispatch();
    const [allocationProp, setAllocationProp] = useState<any>({});

    const isMax = useRef(false);
    const [isMaxClicked, setisMaxClicked] = useState(false);;
    const [showMaxMsg, setShowMaxMsg] = React.useState(false);

    const {selectedValidatorList} = useSelector(validatorListSelector);
    const {stakingAmount, stakingAllocationProp} = useSelector(stakingAllocationSelector)
 
    const {networkAddress, networkBalances} = useSelector(selectedNetworkWalletSelector);
    const {selectedNetwork} = useSelector(selectedNetworkSelector);
    const {balances} = useSelector(quicksilverSelector);

    const [sum, setSum] = useState(selectedValidatorList.length);

    const [QCKBalance, setQCKBalance] = useState(0);
  const [zoneBalance, setZoneBalance] = useState(0);
  

  useEffect(() => {
    if(balances !== []) {
         let balance = balances.find((bal: any) => bal.denom === selectedNetwork.local_denom);
         if(balance) {
          console.log(balance)
          setQCKBalance((balance.amount)/1000000);
         }
     
    }

}, [balances, selectedNetwork])

useEffect(() => {

  if(networkBalances !== []) {
    let balance = networkBalances.find((bal: any) => bal.denom === selectedNetwork.base_denom);
    if(balance) {
     setZoneBalance((balance.amount)/1000000);
    }

}
}, [networkBalances])

    useEffect(() => {
        if(selectedValidatorList.length > 0) {
          let temp =  selectedValidatorList.reduce((acc: any, curr: any) => {
                    acc[curr.name] = {...curr, value: 1}
                    return acc;
            }, allocationProp);
            setAllocationProp(temp);
        }
         // @ts-expect-error
         dispatch(setStakingAmount(0))            
    }, [])

    useEffect(() => {
        console.log('Checking use Effect');
    if(isMax.current) {

     calculateMax()
 
    } 
        
    }, [stakingAmount])

    useEffect(() => {
        if(isMaxClicked) {
            calculateMax()
            setisMaxClicked(false);
        
           } 
    }, [isMaxClicked])

    const onNext = (e?: any) => {
       
        let sum = 0;
        selectedValidatorList.forEach((x: any) => {      
          
        sum = sum + allocationProp[x.name]['value'] ;  console.log(allocationProp[x.name]['value'])})
        console.log(sum);
        if(sum < 100) {
            console.log("Please allocation more atoms");
        } else if(sum > 100) {
            console.log("Please allocation less atoms");
        } else {
            console.log("please proceed");
        }
        setSum(sum);

    }

    const calculateMax = () => {
        let value = +(stakingAmount/selectedValidatorList.length);
        if(selectedValidatorList.length !== 6) {

       console.log('Amount' , stakingAmount);
       console.log('Length' , selectedValidatorList.length);
       console.log('Value', value);
       selectedValidatorList.forEach((x: any) => {      
           let newAllocationProp : any = {...allocationProp};

       newAllocationProp[x.name]['value'] = +(value/stakingAmount) * 100;
       setAllocationProp(newAllocationProp) }) ;
       onNext();
        } else {
            selectedValidatorList.forEach((x: any) => {      
                let newAllocationProp : any = {...allocationProp};
     
            newAllocationProp[x.name]['value'] = +(16.66);
            setAllocationProp(newAllocationProp) }) ;
            onNext();
        }
    }
    
    
    const onMaxClick =  (event: React.MouseEvent<HTMLElement>) => {

        let maxBal = +(zoneBalance) - 0.3;
        let temp = '0'+maxBal.toFixed(6).toString();
        if(stakingAmount != temp) {
      //    @ts-expect-error
      dispatch(setStakingAmount('0'+maxBal.toFixed(6)))

      isMax.current = true;
      setShowMaxMsg(true);
        } else {
            setisMaxClicked(true);
        }
        
  
    
   
         console.log(isMax.current);
         console.log(maxBal);
     


    }

    const handleAllocationChange = (e: any) => {
      if(e.target.value !== "") {
           // setAllocationProp({...allocationProp, [e.target.name] :{ , value: e.target.value}})
           let newAllocationProp : any = {...allocationProp};

            newAllocationProp[e.target.name]['value'] = +(e.target.value);
            setAllocationProp(newAllocationProp);
            onNext();
      }
      else {
        let newAllocationProp : any = {...allocationProp};
        newAllocationProp[e.target.name]['value'] = 1;
        setAllocationProp(newAllocationProp);
        onNext();
      }
          }
          
    const changeAmount = (e: any) => {
        
        if ( e.target.value.match(/^\d{1,}(\.\d{0,6})?$/) ){
        console.log(e.target.value);
                    //    @ts-expect-error
                  dispatch(setStakingAmount(e.target.value));
        isMax.current = false;
        setisMaxClicked(false);
        if(e.target.value !=  +(zoneBalance - 0.3).toFixed(6)) {
        setShowMaxMsg(false);
        }
    
    }
    }

    const onClickNext = (e: any) => {
                 //    @ts-expect-error
                dispatch( setStakingAllocationProp(allocationProp));
                        // @ts-expect-error
                dispatch(increaseStakingStep());
    }

    const onPrev = (e: any) => {
      
               // @ts-expect-error
               dispatch(decreaseStakingStep());
}

    const renderValidators = () => {
        return ( selectedValidatorList.map((val: any) => <>
        <div className="d-flex mt-3">
            <h5 className=" mx-2">{val.name}</h5>
            <input style={{accentColor: '#D35100'}} className="mx-2" onChange={handleAllocationChange} type="range" value={Object.keys(allocationProp).length ? allocationProp[val.name]['value'] : 1 } name={val.name} min="1" max="100"   />
            <input className="mx-2" onChange={handleAllocationChange} value={Object.keys(allocationProp).length ? allocationProp[val.name]['value']: '1' } name={val.name}  type="number" min="1" step=".5"></input>%
           </div>
            </>
                
            )
        )
    }
    return (
    <div className="allocation-pane d-flex flex-column align-items-center">
 {networkAddress && selectedNetwork !== "Select a network" && balances && <div className="wallet-details d-flex flex-column mt-3">
                <h4> My Wallet</h4>
                <h6>{networkAddress}</h6>
                <div className="row wallet-content mt-4">
                <div className="col-3 text-center">
                       <h5 className="font-bold">{zoneBalance}</h5>
                       <p> {selectedNetwork.base_denom.charAt(1).toUpperCase() + selectedNetwork.base_denom.slice(2)}</p>
                    </div>
                    <div className="col-3 text-center">
                    <h5 className="font-bold">{QCKBalance}</h5>
                    <p> {selectedNetwork.local_denom[1] + selectedNetwork.local_denom.charAt(2).toUpperCase() + selectedNetwork.local_denom.slice(3)}</p>
                        </div>
                  
                </div>
            </div> }
           {zoneBalance <= 0.5 &&  <div className="mt-3">
                You don't have enough   {selectedNetwork.base_denom.charAt(1).toUpperCase() + selectedNetwork.base_denom.slice(2)} to stake! 
            </div>}
           {(zoneBalance) > 0.5 &&  <div className="staking-pane d-flex flex-column mt-4">
                <h4>Stake</h4> 

                <div className="d-flex mt-3 align-items-center">
                    <p className="m-0 mx-3"> Number of {selectedNetwork.base_denom.charAt(1).toUpperCase() + selectedNetwork.base_denom.slice(2)} you want to stake</p>
                    <input className="mx-3" type="text" value={stakingAmount?.toString()} onChange={ changeAmount}/>
                    <button className="mx-3 p-1 max-button" onClick={onMaxClick}> MAX </button> 
                

                </div>

                {renderValidators()}
                {showMaxMsg && <p className="mb-0 mt-3">We held back 0.3 {selectedNetwork.base_denom.charAt(1).toUpperCase() + selectedNetwork.base_denom.slice(2)} to cover future transaction fees</p> }
            </div>}
            {(zoneBalance) > 0.5 &&  <div className="mt-4 text-center">
            {stakingAmount> ((zoneBalance) - 0.3) ? `The max that you can allocate is ${ ((zoneBalance) - 0.3).toFixed(6) } atom ` : ''}
            { stakingAmount > 0 && sum > 100 && <p className="mt-2"> You have allocated {sum} % of the available atoms. Please move the sliders around until you hit 100% and then you can proceed ahead. </p>}
            { stakingAmount > 0 && sum < 99.5 && <p className="mt-2"> Please allocate the remaining {100.00 - sum} % of atoms to continue </p>}
       </div>}
        <div className="button-containers mt-4 mb-4">
            <button className="prev-button mx-3" onClick={onPrev}> Previous </button>
        <button disabled={sum < 99.9  || sum  > 100 || stakingAmount > (zoneBalance - 0.3)?  true: false}  className="next-button mx-3" onClick={onClickNext}>Next</button> 
</div>
        </div> 
    );
    


}