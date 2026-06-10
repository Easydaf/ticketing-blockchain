import { useState, useEffect } from 'react';
import { useContractWrite } from '../hooks/useContractWrite';

export default function FundsManagement() {
  const [balance, setBalance] = useState(null);
  const [balanceLoading, setBalanceLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [txStatus, setTxStatus] = useState(null);
  const [txHash, setTxHash] = useState(null);

  const { loading, error, withdrawFunds, getContractBalance } = useContractWrite();

  // Fetch contract balance on component mount
  useEffect(() => {
    fetchBalance();
  }, []);

  const fetchBalance = async () => {
    setBalanceLoading(true);
    try {
      const bal = await getContractBalance();
      setBalance(bal);
    } catch (err) {
      console.error('Failed to fetch balance:', err);
      setBalance(null);
    } finally {
      setBalanceLoading(false);
    }
  };

  const handleWithdrawClick = () => {
    setShowConfirmModal(true);
    setTxStatus(null);
    setTxHash(null);
  };

  const handleConfirmWithdraw = async () => {
    setTxStatus('pending');
    try {
      const result = await withdrawFunds();
      setTxStatus('success');
      setTxHash(result.txHash);
      setShowConfirmModal(false);
      
      // Refresh balance after withdrawal
      setTimeout(() => {
        fetchBalance();
      }, 2000);
    } catch (err) {
      setTxStatus('error');
      console.error('Withdrawal failed:', err);
    }
  };

  const handleCancelWithdraw = () => {
    setShowConfirmModal(false);
    setTxStatus(null);
    setTxHash(null);
  };

  const isWithdrawDisabled = balanceLoading || loading || !balance || parseFloat(balance) === 0;

  return (
    <>
      <div className="glass-card p-6 border-t-4 border-yellow-500">
        <p className="text-gray-400 font-semibold text-sm">Saldo Kontrak</p>
        <div className="flex justify-between items-end mt-2">
          <div>
            {balanceLoading ? (
              <p className="text-2xl font-bold text-white animate-pulse">Loading...</p>
            ) : balance !== null ? (
              <p className="text-4xl font-bold text-white">
                {parseFloat(balance).toFixed(4)}{' '}
                <span className="text-lg text-gray-400">ETH</span>
              </p>
            ) : (
              <p className="text-2xl font-bold text-red-400">Error</p>
            )}
          </div>
          <button
            onClick={handleWithdrawClick}
            disabled={isWithdrawDisabled}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${
              isWithdrawDisabled
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-yellow-600 text-white hover:bg-yellow-700'
            }`}
          >
            {loading ? 'Withdrawing...' : 'Tarik Dana'}
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="glass-card p-8 w-96 shadow-lg">
            <h2 className="text-2xl font-bold text-white mb-4">Konfirmasi Penarikan Dana</h2>

            <div className="bg-white/5 p-4 rounded-lg mb-6 border border-white/10">
              <p className="text-gray-400 text-sm mb-1">Jumlah yang akan ditarik:</p>
              <p className="text-3xl font-bold text-yellow-400">
                {balance} ETH
              </p>
            </div>

            {txStatus === 'pending' && (
              <div className="flex items-center gap-2 mb-6 text-blue-400">
                <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm font-semibold">Processing transaction...</span>
              </div>
            )}

            {txStatus === 'success' && txHash && (
              <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <p className="text-green-400 text-sm font-semibold mb-2">✓ Penarikan berhasil!</p>
                <p className="text-gray-400 text-xs break-all">
                  Hash: <span className="text-green-300">{txHash}</span>
                </p>
              </div>
            )}

            {txStatus === 'error' && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-red-400 text-sm font-semibold">✗ Penarikan gagal</p>
                <p className="text-gray-400 text-xs mt-1">{error || 'Unknown error occurred'}</p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleCancelWithdraw}
                disabled={loading}
                className="flex-1 bg-gray-700 text-white font-semibold py-2 rounded-lg hover:bg-gray-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {txStatus === 'success' ? 'Tutup' : 'Batal'}
              </button>
              {txStatus !== 'success' && (
                <button
                  onClick={handleConfirmWithdraw}
                  disabled={loading || txStatus === 'error'}
                  className="flex-1 bg-yellow-600 text-white font-semibold py-2 rounded-lg hover:bg-yellow-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : 'Konfirmasi'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Success/Error Toast (temporary notification when modal closes) */}
      {txStatus === 'success' && !showConfirmModal && (
        <div className="fixed bottom-4 right-4 bg-green-500/90 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-pulse">
          <span>✓ Penarikan dana berhasil diproses!</span>
        </div>
      )}
    </>
  );
}
