import React, { useState } from 'react';
import { inquiryAPI } from '../services/api';

const TrackInquiry = () => {
  const [referenceCode, setReferenceCode] = useState('');
  const [inquiry, setInquiry] = useState(null);
  const [followUps, setFollowUps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!referenceCode.trim()) {
      setError('Please enter a reference code');
      return;
    }

    setLoading(true);
    setError('');
    setInquiry(null);
    setFollowUps([]);
    setSearched(true);

    try {
      const response = await inquiryAPI.trackInquiry(referenceCode.trim());
      
      if (response.status === 'success') {
        setInquiry(response.data.inquiry);
        setFollowUps(response.data.followUps || []);
      }
    } catch (err) {
      console.error('Track inquiry error:', err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to track inquiry. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'New':
        return 'bg-blue-100 text-blue-800';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'In Action':
        return 'bg-purple-100 text-purple-800';
      case 'Done':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Track Your Inquiry</h1>
          <p className="text-gray-600">
            Enter your reference code to check the status of your inquiry
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <form onSubmit={handleSearch}>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={referenceCode}
                  onChange={(e) => setReferenceCode(e.target.value.toUpperCase())}
                  placeholder="Enter reference code (e.g., INQ1234567890)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={loading}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Searching...' : 'Track'}
              </button>
            </div>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <p className="font-medium">Error</p>
            <p>{error}</p>
          </div>
        )}

        {/* Inquiry Details */}
        {inquiry && (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            {/* Status Banner */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-white mb-1">
                    Inquiry Details
                  </h2>
                  <p className="text-blue-100 text-sm">{inquiry.referenceCode}</p>
                </div>
                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(
                    inquiry.status
                  )}`}
                >
                  {inquiry.status}
                </span>
              </div>
            </div>

            {/* Inquiry Information */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium text-gray-900">{inquiry.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Service Type</p>
                  <p className="font-medium text-gray-900">{inquiry.serviceType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Submitted On</p>
                  <p className="font-medium text-gray-900">
                    {formatDate(inquiry.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Last Updated</p>
                  <p className="font-medium text-gray-900">
                    {formatDate(inquiry.updatedAt)}
                  </p>
                </div>
              </div>
            </div>

            {/* Status Timeline */}
            {followUps.length > 0 && (
              <div className="px-6 py-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Status Updates
                </h3>
                <div className="space-y-4">
                  {followUps.map((followUp, index) => (
                    <div
                      key={index}
                      className="flex gap-4 border-l-4 border-blue-500 pl-4 py-2"
                    >
                      <div className="flex-1">
                        <p className="text-gray-800">{followUp.note}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {formatDate(followUp.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No Updates Message */}
            {followUps.length === 0 && (
              <div className="px-6 py-4">
                <p className="text-gray-600 text-center">
                  No updates available yet. We'll update you as we progress with your inquiry.
                </p>
              </div>
            )}
          </div>
        )}

        {/* No Results Message */}
        {searched && !inquiry && !loading && !error && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg text-center">
            <p>No inquiry found with this reference code. Please check and try again.</p>
          </div>
        )}

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Need help? The reference code was provided when you submitted your inquiry.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TrackInquiry;
