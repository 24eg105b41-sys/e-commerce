import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Plus, Trash2, ShieldCheck, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axiosClient from '../api/axiosClient';
import LoadingSpinner from '../components/LoadingSpinner';

const Profile = () => {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add Address Form
  const [showAddForm, setShowAddForm] = useState(false);
  const [recipientName, setRecipientName] = useState('');
  const [phone, setPhone] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [city, setCity] = useState('Chennai');
  const [state, setState] = useState('Tamil Nadu');
  const [postalCode, setPostalCode] = useState('600025');

  const fetchAddresses = async () => {
    try {
      const res = await axiosClient.get('/api/addresses');
      if (res.success && res.data) setAddresses(res.data);
    } catch (err) {
      console.error('Failed to load addresses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleCreateAddress = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosClient.post('/api/addresses', {
        recipientName,
        phone,
        addressLine,
        city,
        state,
        postalCode,
        isDefault: addresses.length === 0,
      });
      if (res.success && res.data) {
        setAddresses([res.data, ...addresses]);
        setShowAddForm(false);
        setRecipientName('');
        setPhone('');
        setAddressLine('');
      }
    } catch (err) {
      alert(err.message || 'Failed to add address');
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm('Delete this address?')) return;
    try {
      await axiosClient.delete(`/api/addresses/${id}`);
      setAddresses(addresses.filter((a) => a.id !== id));
    } catch (err) {
      alert(err.message || 'Could not delete address');
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading profile details..." />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="pb-6 border-b border-slate-200">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Student Profile & Settings</h1>
        <p className="text-sm text-slate-500">Manage your university credentials and saved delivery addresses</p>
      </div>

      {/* Account Info Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-campus-600 text-white flex items-center justify-center font-extrabold text-2xl shadow-sm">
            {user?.fullName?.charAt(0) || 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">{user?.fullName}</h2>
              <span className="campus-badge bg-campus-50 text-campus-700 border border-campus-200 text-[10px]">
                {user?.role === 'ROLE_ADMIN' ? 'System Administrator' : 'Verified Student'}
              </span>
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
              <Mail size={13} />
              <span>{user?.email}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Addresses Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <MapPin size={18} className="text-campus-600" />
              Saved Campus & Hostel Addresses
            </h2>
            <p className="text-xs text-slate-500">Used for single-click order checkout and dorm delivery</p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="campus-btn-primary !py-1.5 !px-3 text-xs font-semibold"
          >
            <Plus size={14} />
            <span>{showAddForm ? 'Cancel' : 'Add Address'}</span>
          </button>
        </div>

        {showAddForm && (
          <form onSubmit={handleCreateAddress} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <h3 className="text-xs font-bold uppercase text-slate-700">Add New Address</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Recipient Name"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                className="campus-input text-xs"
                required
              />
              <input
                type="text"
                placeholder="Mobile Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="campus-input text-xs"
                required
              />
            </div>
            <input
              type="text"
              placeholder="Hostel Block, Room No., Lab, or Campus Street"
              value={addressLine}
              onChange={(e) => setAddressLine(e.target.value)}
              className="campus-input text-xs"
              required
            />
            <div className="grid grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="campus-input text-xs"
                required
              />
              <input
                type="text"
                placeholder="State"
                value={state}
                onChange={(e) => setNewState(e.target.value)}
                className="campus-input text-xs"
                required
              />
              <input
                type="text"
                placeholder="Postal Code"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className="campus-input text-xs"
                required
              />
            </div>
            <button type="submit" className="campus-btn-primary !py-2 text-xs font-semibold">
              Save Address
            </button>
          </form>
        )}

        {addresses.length === 0 ? (
          <p className="text-xs text-slate-500 italic">No saved addresses. Add your hostel or home address above.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {addresses.map((a) => (
              <div key={a.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 relative">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{a.recipientName}</span>
                  <button
                    onClick={() => handleDeleteAddress(a.id)}
                    className="text-slate-400 hover:text-rose-600 p-1"
                    title="Delete"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
                <p className="text-xs text-slate-600">{a.addressLine}</p>
                <p className="text-xs text-slate-500">{a.city}, {a.state} - {a.postalCode}</p>
                <p className="text-xs text-slate-400 font-mono">Ph: {a.phone}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
