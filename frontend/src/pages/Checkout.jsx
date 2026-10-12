import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Plus, CreditCard, QrCode, Banknote, ShieldAlert, CheckCircle, ArrowRight } from 'lucide-react';
import axiosClient from '../api/axiosClient';
import { useCart } from '../context/CartContext';
import PriceDisplay from '../components/PriceDisplay';
import LoadingSpinner from '../components/LoadingSpinner';

const Checkout = () => {
  const { cart, fetchCart } = useCart();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('CAMPUS_PAY_SIMULATED');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // New address modal / inline form state
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newRecipient, setNewRecipient] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newAddressLine, setNewAddressLine] = useState('');
  const [newCity, setNewCity] = useState('Chennai');
  const [newState, setNewState] = useState('Tamil Nadu');
  const [newPostalCode, setNewPostalCode] = useState('600025');

  const loadAddresses = async () => {
    try {
      const res = await axiosClient.get('/api/addresses');
      if (res.success && res.data) {
        setAddresses(res.data);
        if (res.data.length > 0) {
          const defaultAddr = res.data.find((a) => a.default) || res.data[0];
          setSelectedAddressId(defaultAddr.id);
        } else {
          setShowAddressForm(true);
        }
      }
    } catch (err) {
      console.error('Failed to load addresses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  const handleCreateAddress = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosClient.post('/api/addresses', {
        recipientName: newRecipient,
        phone: newPhone,
        addressLine: newAddressLine,
        city: newCity,
        state: newState,
        postalCode: newPostalCode,
        isDefault: addresses.length === 0,
      });
      if (res.success && res.data) {
        setAddresses([res.data, ...addresses]);
        setSelectedAddressId(res.data.id);
        setShowAddressForm(false);
        setNewRecipient('');
        setNewPhone('');
        setNewAddressLine('');
      }
    } catch (err) {
      alert(err.message || 'Failed to save address');
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      alert('Please select or add a delivery address.');
      return;
    }
    if (!cart.items || cart.items.length === 0) {
      alert('Your cart is empty.');
      navigate('/catalog');
      return;
    }

    setSubmitting(true);
    try {
      const res = await axiosClient.post('/api/orders', {
        addressId: selectedAddressId,
        paymentMethod: paymentMethod,
      });

      if (res.success && res.data) {
        await fetchCart(); // Refresh cart state (should now be empty)
        navigate(`/order-confirmation/${res.data.orderNumber}`, { state: { order: res.data } });
      }
    } catch (err) {
      alert(err.message || 'Order processing failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Preparing campus checkout..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="pb-6 border-b border-slate-200">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Checkout & Order Placement</h1>
        <p className="text-sm text-slate-500">Review hostel delivery details and simulated payment confirmation</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-8">
        {/* Left: Address & Payment Workflow */}
        <div className="lg:col-span-2 space-y-8">
          {/* Step 1: Shipping Address Selection */}
          <section className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <MapPin size={18} className="text-campus-600" />
                1. Select Delivery Destination
              </h2>
              <button
                onClick={() => setShowAddressForm(!showAddressForm)}
                className="text-xs font-semibold text-campus-600 hover:text-campus-700 flex items-center gap-1"
              >
                <Plus size={14} />
                <span>{showAddressForm ? 'Cancel' : 'Add New Address'}</span>
              </button>
            </div>

            {showAddressForm && (
              <form onSubmit={handleCreateAddress} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <h3 className="text-xs font-bold uppercase text-slate-700">Add Campus or Hostel Address</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Recipient Full Name"
                    value={newRecipient}
                    onChange={(e) => setNewRecipient(e.target.value)}
                    className="campus-input text-xs"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Mobile Phone Number"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="campus-input text-xs"
                    required
                  />
                </div>
                <input
                  type="text"
                  placeholder="Hostel Block, Room No., or Department Building"
                  value={newAddressLine}
                  onChange={(e) => setNewAddressLine(e.target.value)}
                  className="campus-input text-xs"
                  required
                />
                <div className="grid grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="City"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="campus-input text-xs"
                    required
                  />
                  <input
                    type="text"
                    placeholder="State"
                    value={newState}
                    onChange={(e) => setNewState(e.target.value)}
                    className="campus-input text-xs"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Postal Code"
                    value={newPostalCode}
                    onChange={(e) => setNewPostalCode(e.target.value)}
                    className="campus-input text-xs"
                    required
                  />
                </div>
                <button type="submit" className="campus-btn-primary !py-2 text-xs font-semibold">
                  Save Address
                </button>
              </form>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  onClick={() => setSelectedAddressId(addr.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedAddressId === addr.id
                      ? 'border-campus-600 bg-campus-50/50 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-slate-900">{addr.recipientName}</span>
                    {selectedAddressId === addr.id && (
                      <CheckCircle size={16} className="text-campus-600" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-snug">{addr.addressLine}</p>
                  <p className="text-xs text-slate-500 mt-1">{addr.city}, {addr.state} - {addr.postalCode}</p>
                  <p className="text-xs text-slate-400 mt-1 font-mono">Ph: {addr.phone}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Step 2: Payment Method (Simulated) */}
          <section className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <CreditCard size={18} className="text-campus-600" />
              2. Simulated Payment Method
            </h2>

            {/* Clear Educational Disclaimer Banner */}
            <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 flex items-center gap-3 text-amber-800 text-xs">
              <ShieldAlert size={20} className="flex-shrink-0 text-amber-600" />
              <p>
                <span className="font-bold">Educational Simulation:</span> This capstone project does not require or collect real credit cards or bank accounts. All options simulate transactions for faculty evaluation.
              </p>
            </div>

            <div className="space-y-3">
              {/* Option 1: Campus Pay Simulated Wallet */}
              <label
                className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'CAMPUS_PAY_SIMULATED'
                    ? 'border-campus-600 bg-campus-50/50 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="CAMPUS_PAY_SIMULATED"
                    checked={paymentMethod === 'CAMPUS_PAY_SIMULATED'}
                    onChange={() => setPaymentMethod('CAMPUS_PAY_SIMULATED')}
                    className="text-campus-600 focus:ring-campus-500"
                  />
                  <div>
                    <span className="text-sm font-bold text-slate-900">Campus Pay Simulated Wallet</span>
                    <p className="text-xs text-slate-500">Instant educational mock wallet (Auto-approved for viva demo)</p>
                  </div>
                </div>
                <CreditCard size={20} className="text-campus-600" />
              </label>

              {/* Option 2: Simulated UPI */}
              <label
                className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'UPI_SIMULATED'
                    ? 'border-campus-600 bg-campus-50/50 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="UPI_SIMULATED"
                    checked={paymentMethod === 'UPI_SIMULATED'}
                    onChange={() => setPaymentMethod('UPI_SIMULATED')}
                    className="text-campus-600 focus:ring-campus-500"
                  />
                  <div>
                    <span className="text-sm font-bold text-slate-900">Simulated Campus UPI</span>
                    <p className="text-xs text-slate-500">Mock student UPI VPA: student@campuspay</p>
                  </div>
                </div>
                <QrCode size={20} className="text-indigo-600" />
              </label>

              {/* Option 3: COD */}
              <label
                className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'CASH_ON_DELIVERY'
                    ? 'border-campus-600 bg-campus-50/50 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="CASH_ON_DELIVERY"
                    checked={paymentMethod === 'CASH_ON_DELIVERY'}
                    onChange={() => setPaymentMethod('CASH_ON_DELIVERY')}
                    className="text-campus-600 focus:ring-campus-500"
                  />
                  <div>
                    <span className="text-sm font-bold text-slate-900">Cash on Hostel Delivery</span>
                    <p className="text-xs text-slate-500">Pay physically upon room drop-off</p>
                  </div>
                </div>
                <Banknote size={20} className="text-emerald-600" />
              </label>
            </div>
          </section>
        </div>

        {/* Right: Checkout Summary */}
        <aside className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-5">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Order Review
            </h2>

            {/* Items review snippet */}
            <div className="space-y-3 max-h-56 overflow-y-auto pr-1 divide-y divide-slate-100">
              {cart.items.map((item) => (
                <div key={item.id} className="pt-2 first:pt-0 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-700">{item.quantity}x</span>
                    <span className="text-slate-900 truncate max-w-[150px]">{item.productName}</span>
                  </div>
                  <PriceDisplay amount={item.lineTotal} className="font-semibold text-slate-800" />
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-200 space-y-2.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <PriceDisplay amount={cart.subtotal} className="font-semibold text-slate-800" />
              </div>
              <div className="flex justify-between">
                <span>Campus Delivery</span>
                {cart.shippingFee > 0 ? (
                  <PriceDisplay amount={cart.shippingFee} className="font-semibold text-slate-800" />
                ) : (
                  <span className="text-emerald-600 font-bold">Free</span>
                )}
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-bold text-slate-900">
                <span>Grand Total</span>
                <PriceDisplay amount={cart.totalAmount} className="text-lg font-extrabold text-campus-700" />
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={submitting || !selectedAddressId}
              className="w-full campus-btn-primary !py-3.5 font-bold text-sm shadow-md"
            >
              <span>{submitting ? 'Creating Order...' : 'Complete Order'}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Checkout;
