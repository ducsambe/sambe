import React, { useState } from 'react';
import { X, CreditCard, Calendar, Shield, Download } from 'lucide-react';
import { Property, Lot } from '../../types';
import toast from 'react-hot-toast';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property;
  lot?: Lot;
  onPaymentSuccess: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  property,
  lot,
  onPaymentSuccess
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'full' | 'installments'>('full');
  const [installmentPlan, setInstallmentPlan] = useState({
    downPayment: 30,
    duration: 12
  });
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const totalPrice = lot ? lot.price : property.price;
  const downPaymentAmount = (totalPrice * installmentPlan.downPayment) / 100;
  const remainingAmount = totalPrice - downPaymentAmount;
  const monthlyPayment = remainingAmount / installmentPlan.duration;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate invoice
      const invoiceData = {
        id: `INV-${Date.now()}`,
        property: property.title,
        lot: lot?.lot_number,
        amount: paymentMethod === 'full' ? totalPrice : downPaymentAmount,
        paymentMethod,
        date: new Date().toLocaleDateString('fr-FR'),
        installmentPlan: paymentMethod === 'installments' ? {
          total: totalPrice,
          downPayment: downPaymentAmount,
          monthly: monthlyPayment,
          duration: installmentPlan.duration
        } : null
      };

      // Store invoice data (in real app, this would be sent to backend)
      localStorage.setItem(`invoice-${invoiceData.id}`, JSON.stringify(invoiceData));
      
      toast.success('Paiement effectué avec succès!');
      onPaymentSuccess();
      onClose();
    } catch (error) {
      toast.error('Erreur lors du paiement');
    } finally {
      setIsProcessing(false);
    }
  };

  const generateInvoicePDF = () => {
    // In a real application, this would generate a proper PDF
    toast.success('Facture téléchargée!');
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Finaliser l'achat</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Property Summary */}
          <div className="bg-gradient-to-r from-emerald-50 to-blue-50 p-4 rounded-xl mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">{property.title}</h3>
            {lot && (
              <p className="text-sm text-gray-600 mb-1">Lot: {lot.lot_number} - {lot.area}m²</p>
            )}
            <p className="text-sm text-gray-600">{property.location}</p>
            <div className="text-2xl font-bold text-emerald-600 mt-2">
              {formatPrice(totalPrice)}
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Mode de paiement</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => setPaymentMethod('full')}
                className={`p-4 border-2 rounded-xl transition-all ${
                  paymentMethod === 'full'
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <CreditCard className="h-6 w-6 mx-auto mb-2 text-emerald-600" />
                <div className="font-semibold">Paiement intégral</div>
                <div className="text-sm text-gray-600">Payez en une seule fois</div>
                <div className="text-lg font-bold text-emerald-600 mt-2">
                  {formatPrice(totalPrice)}
                </div>
              </button>

              <button
                onClick={() => setPaymentMethod('installments')}
                className={`p-4 border-2 rounded-xl transition-all ${
                  paymentMethod === 'installments'
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Calendar className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                <div className="font-semibold">Paiement échelonné</div>
                <div className="text-sm text-gray-600">Payez en plusieurs fois</div>
                <div className="text-lg font-bold text-blue-600 mt-2">
                  {formatPrice(downPaymentAmount)} + {installmentPlan.duration} mensualités
                </div>
              </button>
            </div>
          </div>

          {/* Installment Plan Details */}
          {paymentMethod === 'installments' && (
            <div className="mb-6 p-4 bg-blue-50 rounded-xl">
              <h4 className="font-semibold mb-4">Configuration du paiement échelonné</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Acompte ({installmentPlan.downPayment}%)
                  </label>
                  <input
                    type="range"
                    min="20"
                    max="50"
                    value={installmentPlan.downPayment}
                    onChange={(e) => setInstallmentPlan(prev => ({
                      ...prev,
                      downPayment: Number(e.target.value)
                    }))}
                    className="w-full"
                  />
                  <div className="text-lg font-bold text-blue-600">
                    {formatPrice(downPaymentAmount)}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Durée (mois)
                  </label>
                  <select
                    value={installmentPlan.duration}
                    onChange={(e) => setInstallmentPlan(prev => ({
                      ...prev,
                      duration: Number(e.target.value)
                    }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    <option value={6}>6 mois</option>
                    <option value={12}>12 mois</option>
                    <option value={18}>18 mois</option>
                    <option value={24}>24 mois</option>
                    <option value={36}>36 mois</option>
                  </select>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Acompte:</span>
                    <span className="font-semibold ml-2">{formatPrice(downPaymentAmount)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Mensualité:</span>
                    <span className="font-semibold ml-2">{formatPrice(monthlyPayment)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Restant:</span>
                    <span className="font-semibold ml-2">{formatPrice(remainingAmount)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Total:</span>
                    <span className="font-semibold ml-2">{formatPrice(totalPrice)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Security Notice */}
          <div className="mb-6 p-4 bg-green-50 rounded-xl flex items-start">
            <Shield className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
            <div className="text-sm">
              <div className="font-semibold text-green-800 mb-1">Paiement sécurisé</div>
              <div className="text-green-700">
                Vos données sont protégées par un chiffrement SSL 256 bits. 
                Nous acceptons les cartes Visa, Mastercard et les virements bancaires.
              </div>
            </div>
          </div>

          {/* Payment Button */}
          <div className="flex gap-4">
            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="flex-1 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50"
            >
              {isProcessing ? 'Traitement...' : `Payer ${formatPrice(paymentMethod === 'full' ? totalPrice : downPaymentAmount)}`}
            </button>
            
            <button
              onClick={generateInvoicePDF}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-semibold transition-all duration-300 flex items-center"
            >
              <Download className="h-5 w-5 mr-2" />
              Devis PDF
            </button>
          </div>

          <div className="mt-4 text-xs text-gray-500 text-center">
            En procédant au paiement, vous acceptez nos conditions générales de vente.
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;