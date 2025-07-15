'use client'
import React, { useState } from 'react';
import { Smartphone, Tv, Zap, Wifi, CreditCard, Phone } from 'lucide-react';
import { useApp } from '@/app/contexts/AppContext';
import { AirtimeModal } from '@/app/Components/Molecules/AirtimeModal';
import { BillPaymentModal } from '@/app/Components/Molecules/BillPaymentModal';

const Utilities = () => {
  const { state } = useApp();
  const [showAirtimeModal, setShowAirtimeModal] = useState(false);
  const [showBillModal, setBillModal] = useState(false);
  const [selectedService, setSelectedService] = useState<string>('');

  const airtimeProviders = [
    { id: 'mtn', name: 'MTN', icon: '📱', color: 'bg-yellow-500' },
    { id: 'airtel', name: 'Airtel', icon: '📲', color: 'bg-red-500' },
    { id: 'glo', name: 'Glo', icon: '📞', color: 'bg-green-500' },
    { id: '9mobile', name: '9mobile', icon: '📱', color: 'bg-blue-500' },
  ];

  const billServices = [
    { id: 'dstv', name: 'DSTV', icon: Tv, color: 'bg-blue-600' },
    { id: 'gotv', name: 'GOtv', icon: Tv, color: 'bg-green-600' },
    { id: 'phcn', name: 'PHCN/NEPA', icon: Zap, color: 'bg-yellow-600' },
    { id: 'internet', name: 'Internet', icon: Wifi, color: 'bg-purple-600' },
  ];

  const handleAirtimeSelect = (provider: string) => {
    setSelectedService(provider);
    setShowAirtimeModal(true);
  };

  const handleBillSelect = (service: string) => {
    setSelectedService(service);
    setBillModal(true);
  };

  interface UtilitiesPProps {
    onClose: () => void;
    exchangeRate: number | null;
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-teal-600 rounded-2xl p-8 text-white">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Utilities & Bills</h1>
            <p className="text-purple-100">Pay for airtime, data, and bills with ADA or Naira</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-2">
              <CreditCard className="w-5 h-5" />
              <span className="font-medium">Multiple Payment Options</span>
            </div>
            <p className="text-sm text-purple-100">Pay with ADA or local currency</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-2">
              <Phone className="w-5 h-5" />
              <span className="font-medium">Instant Delivery</span>
            </div>
            <p className="text-sm text-purple-100">Airtime delivered instantly</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-2">
              <Zap className="w-5 h-5" />
              <span className="font-medium">24/7 Service</span>
            </div>
            <p className="text-sm text-purple-100">Pay bills anytime, anywhere</p>
          </div>
        </div>
      </div>

      {/* Airtime & Data */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Airtime & Data
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Buy airtime and data bundles for all major networks
          </p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {airtimeProviders.map((provider) => (
              <button
                key={provider.id}
                onClick={() => handleAirtimeSelect(provider.id)}
                className="group bg-gray-50 dark:bg-gray-700 rounded-lg p-6 hover:shadow-lg transition-all duration-200 border border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-500"
              >
                <div className={`w-12 h-12 ${provider.color} rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  <span className="text-2xl">{provider.icon}</span>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  {provider.name}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Airtime & Data
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bill Payments */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Bill Payments
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Pay for electricity, cable TV, and internet services
          </p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {billServices.map((service) => {
              const Icon = service.icon;
              return (
                <button
                  key={service.id}
                  onClick={() => handleBillSelect(service.id)}
                  className="group bg-gray-50 dark:bg-gray-700 rounded-lg p-6 hover:shadow-lg transition-all duration-200 border border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-500"
                >
                  <div className={`w-12 h-12 ${service.color} rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {service.name}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Bill Payment
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Utility Payments
          </h3>
        </div>

        <div className="p-6">
          {state.transactions.filter(t => t.type === 'utility').length === 0 ? (
            <div className="text-center py-8">
              <Smartphone className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No utility payments yet
              </h4>
              <p className="text-gray-500 dark:text-gray-400">
                Your utility payments will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {state.transactions
                .filter(t => t.type === 'utility')
                .slice(0, 5)
                .map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                        <Smartphone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {transaction.description}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {transaction.timestamp.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      ₦{transaction.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showAirtimeModal && (
        <AirtimeModal 
          provider={selectedService}
          onCloseAction={() => setShowAirtimeModal(false)}
        />
      )}
      
      {showBillModal && (
        <BillPaymentModal 
          service={selectedService}
          onClose={() => setBillModal(false)}
        />
      )}
    </div>
  );
}
export default Utilities