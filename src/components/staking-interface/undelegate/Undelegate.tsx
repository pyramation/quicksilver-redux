import React, {useState, useEffect} from 'react';
import { selectedNetworkWalletSelector } from '../../../slices/selectedNetworkWallet';
import { useSelector, useDispatch } from 'react-redux'
import {quicksilverSelector} from '../../../slices/quicksilver';
import {  setModalOpen } from '../../../slices/connectWalletModal';
import { selectedNetworkSelector } from "../../../slices/selectedNetwork";
import { fetchUnbondings, unbondingsSelector } from "../../../slices/unbonding";
import { coins } from "@cosmjs/launchpad"
import './Undelegate.css';
import { normalize } from 'path';
export default function Undelegate() {
    const {networkAddress} = useSelector(selectedNetworkWalletSelector);
    const {isQSWalletConnected, balances, quicksilverClient, quicksilverAddress} = useSelector(quicksilverSelector);
    const {selectedNetwork} = useSelector(selectedNetworkSelector);
    const {withdrawals} = useSelector(unbondingsSelector);
    const [unstakingAmount, setUnstakingAmount] = useState(0.1);
    const [QCKBalance, setQCKBalance] = useState(0);
    const dispatch = useDispatch();
    const onButtonClick = () => {
      // @ts-expect-error
    dispatch(setModalOpen());
  }
      const changeAmount = (e: any) => {
                    setUnstakingAmount(e.target.value);
    }
    useEffect(() => {
      setUnstakingAmount(0.1);
     
  }, [])

  useEffect(() => {
    if(selectedNetwork && quicksilverAddress)
       // @ts-expect-error
    dispatch(fetchUnbondings(selectedNetwork.chain_id, quicksilverAddress))
}, [selectedNetwork, quicksilverAddress])

  useEffect(() => {
    if(balances !== []) {
         let balance = balances.find((bal: any) => bal.denom === selectedNetwork.local_denom);
         if(balance) {
          console.log(balance)
          setQCKBalance((balance.amount)/1000000);
         } else
         {
           setQCKBalance(0);
         }
    }
}, [balances, selectedNetwork])
    const Unbond =  async (actionID: any) => {
        let msg =  {typeUrl: "/quicksilver.interchainstaking.v1.MsgRequestRedemption",
        value: {
        chainId: selectedNetwork.chain_id,
        fromAddress: quicksilverAddress,
        value: {
          "denom": selectedNetwork.local_denom,
          "amount": "" + (unstakingAmount * 1000000)
        },
        destinationAddress: networkAddress
      }
    }
        const broadcastResult = await quicksilverClient.signAndBroadcast(
           quicksilverAddress,
            [msg],
           {
              "gas": "200000",
              "amount": [
                {
                  "denom": "uqck",
                  "amount": "5000"
                }
              ]
            },
            'MEMO'
          );
          console.log(broadcastResult);
      }
    return (
        <>
        {!isQSWalletConnected && <div>
          <div className="connect-wallet-pane d-flex flex-column align-items-center ">
                <h4 className="sub-heading"> Hey there! </h4>
                <h1 className="mt-3"> Connect your wallet to get started! </h1>
                <button  onClick={onButtonClick} className="connect-wallet-button mt-5"> Connect Wallet </button>
                </div>
        </div>}
        {withdrawals > 0 && <p> {withdrawals.length}</p>}
        {isQSWalletConnected && selectedNetwork === "Select a network" && <div className='text-center'>
        <h2 className="mt-4">Choose your network </h2>
        <p className="mt-2">Choose the network from the dropdown in the Navbar</p>SummaryExistingDelegationsæ./retd
          </div>}
          {withdrawals && <p> {withdrawals.length}</p>}
        {isQSWalletConnected && selectedNetwork !== "Select a network" && <div className='unbonding-interface'>
        <div className='mt-5'>
        <h3 className="mt-5 mb-5 text-center">Unbond your qAtom tokens in exchange for Atom </h3>
        <h5 className='text-center mt-4'> Available  {selectedNetwork.local_denom[1] + selectedNetwork.local_denom.charAt(2).toUpperCase() + selectedNetwork.local_denom.slice(3)}: <span> {QCKBalance}   {selectedNetwork.local_denom[1] + selectedNetwork.local_denom.charAt(2).toUpperCase() + selectedNetwork.local_denom.slice(3)}</span></h5>
        </div>
        <div className="d-flex mt-3 align-items-center justify-content-center">
                    <p className="m-0 mx-3"> Number of  {selectedNetwork.local_denom[1] + selectedNetwork.local_denom.charAt(2).toUpperCase() + selectedNetwork.local_denom.slice(3)} you want to unbond:</p>
                    <input className="mx-3" type="number" value={unstakingAmount}  placeholder="0" min={0} onChange={ changeAmount}/>
                    {/* <button className="mx-3 p-1 max-button"> MAX </button>  */}
                </div>
                <div className="d-flex justify-content-center">
        <button className="unbond text-center mt-5 " onClick={ () => Unbond(0)}> UNBOND </button>
        </div>
        </div>}
        </>
    )
}