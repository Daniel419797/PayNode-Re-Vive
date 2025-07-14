'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLovelace } from '@meshsdk/react';

interface ExchangeRate {
  currency: string;
  rate: number;
}

export const ExchangeRates: React.FC = () => {
  const [rates, setRates] = useState<ExchangeRate[]>([]);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const lovelace = useLovelace(); // Wallet balance in lovelace
  const adaInNgn = lovelace ? (parseInt(lovelace) / 1000000) * (rates.find(r => r.currency === 'NGN')?.rate || 0) : 0;

    

  const fetchExchangeRates = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await axios.get(
        'https://api.coingecko.com/api/v3/simple/price',
        {
          params: {
            ids: 'cardano', // You can also add more like 'bitcoin,ethereum'
            vs_currencies: 'ngn,eur,gbp',
          },
        }
      );

      const rates = response.data.cardano; // { ngn: 480, eur: 0.32, gbp: 0.27 }

      const formattedRates: ExchangeRate[] = [
        { currency: 'NGN', rate: rates.ngn },
        { currency: 'EUR', rate: rates.eur },
        { currency: 'GBP', rate: rates.gbp },
      ];

      setRates(formattedRates);
    } catch (err) {
      setError('Failed to fetch exchange rates. Please try again later.');
      console.error('Error fetching rates:', err);
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    fetchExchangeRates(); // Fetch rates on component mount
    const interval = setInterval(fetchExchangeRates, 60000); // Update every 60 seconds
    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  return (
    <div>
      <h3>Live Exchange Rates (Base: USD)</h3>
      {isLoading ? (
        <p>Loading rates...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <>
          <table style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Currency</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Rate (per 1 USD)</th>
              </tr>
            </thead>
            <tbody>
              {rates.map(({ currency, rate }) => (
                <tr key={currency}>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{currency}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{rate.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {lovelace && (
            <p>
              Your ADA Balance in NGN: {(adaInNgn).toFixed(2)} ₦{' '}
              (based on {rates.find(r => r.currency === 'NGN')?.rate.toFixed(2)} NGN per USD)
            </p>
          )}
        </>
      )}
      <button
        onClick={fetchExchangeRates}
        disabled={isLoading}
        style={{ marginTop: '10px', padding: '8px 16px' }}
      >
        {isLoading ? 'Refreshing...' : 'Refresh Rates'}
      </button>
    </div>
  );
};