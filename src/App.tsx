import { useCallback, useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import ConnectButton from "./Components/ConnectionBtn";
import {
  useWriteContract,
  useReadContract,
  useWriteContractSync,
  useTransactionConfirmations,
} from "wagmi";
import { useAppKitAccount } from "@reown/appkit/react";

import { CA, abi, token } from "./Blockchain/blockchain";
import { erc20Abi, maxUint256, parseAbi, parseEther } from "viem";

function App() {
  const [depositAmount, setDepositAmount] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const [allowance, setAllowance] = useState(0n);
  const [allowanceEnough, setAllowanceEnough] = useState(true);
  const {
    data: depositData,
    error: depositError,
    mutate,
  } = useWriteContractSync();

  const {
    data: getAllowanceData,
    error: getAllowanceError,
    mutate: getAllowanceMutate,
  } = useWriteContractSync();
  const { address, isConnected } = useAppKitAccount();
  const { data: allowanceData, error: allowanceError } = useReadContract({
    address: token,
    abi: erc20Abi,
    functionName: "allowance",
    args: [address as `0x${string}`, CA],
  });

  const getAllowance = () => {
    getAllowanceMutate({
      address: token,
      abi: erc20Abi,
      functionName: "approve",
      args: [CA, maxUint256],
    });
  };
  const handleDeposits = useCallback(async () => {
    if (depositAmount <= 0) {
      alert("increase deposit amount");
      return;
    }
    // getAllowance();

    mutate({
      address: CA,
      abi: abi.abi,
      functionName: "deposit",
      args: [parseEther(depositAmount.toString())],
    });
  }, [address, depositAmount]);

  useEffect(() => {
    if (allowanceData) {
      console.log(allowanceData);
      setAllowance(allowanceData);
    }
    console.log(allowanceData);
  }, [allowanceData]);

  useEffect(() => {
    if (getAllowanceError) {
      console.log(getAllowanceError);
    }
  }, [getAllowanceError]);
  useEffect(() => {
    if (depositData) {
      console.log({
        hash: depositData.blockHash,
        address: address,
      });
    }
  }, [depositData, address]);

  return (
    <>
      <ConnectButton />
      <div>
        <h1>Test Backend</h1>
        <div className="deposit_cont">
          <input
            type="number"
            onChange={(e) => {
              setDepositAmount(Number(e.target.value));
            }}
          />
          <button onClick={handleDeposits}>Deposit</button>
        </div>
        <div className="withdraw_cont">
          <input
            type="number"
            onChange={(e) => {
              setWithdrawAmount(Number(e.target.value));
            }}
          />
          <button>Withdraw</button>
        </div>
      </div>
    </>
  );
}

export default App;
