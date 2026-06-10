import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../contractInfo';

export function useContractWrite() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const executeContractFunction = useCallback(async (functionName, ...args) => {
    setLoading(true);
    setError(null);
    try {
      if (typeof window.ethereum === 'undefined') {
        throw new Error('MetaMask not installed. Please install MetaMask to continue.');
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      // Call the contract function
      const tx = await contract[functionName](...args);
      
      // Wait for transaction to be mined
      const receipt = await tx.wait();
      
      return {
        success: true,
        txHash: tx.hash,
        receipt,
      };
    } catch (err) {
      const message = err.message || 'An error occurred';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const getContractBalance = useCallback(async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const balance = await provider.getBalance(CONTRACT_ADDRESS);
      return ethers.formatEther(balance);
    } catch (err) {
      console.error('Error fetching balance:', err);
      throw err;
    }
  }, []);

  const withdrawFunds = useCallback(async () => {
    return executeContractFunction('withdrawFunds');
  }, [executeContractFunction]);

  return {
    loading,
    error,
    withdrawFunds,
    getContractBalance,
    executeContractFunction,
  };
}
