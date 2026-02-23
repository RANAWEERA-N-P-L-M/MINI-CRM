import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { inquiryAPI, handleAPIError } from '../services/api';

const InquiryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Data state
  const [inquiry, setInquiry] = useState(null);
  const [followUps, setFollowUps] = useState([]);
  
  // UI state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Form states
  const [statusUpdate, setStatusUpdate] = useState('');
  const [followUpForm, setFollowUpForm] = useState({
    note: '',
    nextFollowUpDate: ''
  });
  const [showFollowUpForm, setShowFollowUpForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Status colors for badges
  const statusColors = {
    'New': 'bg-gray-100 text-gray-800',
    'In Progress': 'bg-blue-100 text-blue-800',
    'In Action': 'bg-green-100 text-green-800',
    'Done': 'bg-purple-100 text-purple-800'
  };

  // Load inquiry details when component mounts
  useEffect(() => {
    loadInquiryDetails();
  }, [id]);

  // Load inquiry and follow-ups from API
  const loadInquiryDetails = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await inquiryAPI.getInquiry(id);
      setInquiry(response.data.inquiry);
      setFollowUps(response.data.followUps);
      setStatusUpdate(response.data.inquiry.status);
      
    } catch (error) {
      setError(handleAPIError(error));
    } finally {
      setLoading(false);
    }
  };

  // Handle status update
  const handleStatusUpdate = async () => {
    if (statusUpdate === inquiry.status) return;
    
    try {
      setSubmitting(true);
      setError('');
      
      await inquiryAPI.updateInquiry(id, statusUpdate);
      setSuccess('Status updated successfully!');
      
      // Reload inquiry details
      await loadInquiryDetails();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
      
    } catch (error) {
      setError(handleAPIError(error));
    } finally {
      setSubmitting(false);
    }
  };

  // Handle follow-up form changes
  const handleFollowUpChange = (e) => {
    const { name, value } = e.target;
    setFollowUpForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle follow-up submission
  const handleFollowUpSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      setError('');
      
      await inquiryAPI.addFollowUp(id, followUpForm);
      setSuccess('Follow-up added successfully!');
      
      // Reset form and hide it
      setFollowUpForm({ note: '', nextFollowUpDate: '' });
      setShowFollowUpForm(false);
      
      // Reload inquiry details
      await loadInquiryDetails();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
      
    } catch (error) {
      setError(handleAPIError(error));
    } finally {
      setSubmitting(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format date for input field
  const formatDateForInput = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16); // YYYY-MM-DDTHH:MM format
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-blue-500">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
          Loading inquiry details...
        </div>
      </div>
    );
  }

  if (error && !inquiry) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Inquiry</h3>
            <p className="text-red-700">{error}</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>
          
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Inquiry Details</h1>
              <p className="mt-1 text-sm text-gray-600">
                Reference: {inquiry?.referenceCode}
              </p>
            </div>
            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${statusColors[inquiry?.status]}`}>
              {inquiry?.status}
            </span>
          </div>
        </div>

        
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
              </svg>
              <p className="ml-3 text-sm font-medium text-green-800">{success}</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" />
              </svg>
              <p className="ml-3 text-sm font-medium text-red-800">{error}</p>
              <button
                onClick={() => setError('')}
                className="ml-auto pl-3"
              >
                <svg className="w-4 h-4 text-red-500 hover:text-red-700" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
                </svg>
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Inquiry Information */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Client Information</h3>
                
                <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Name</dt>
                    <dd className="mt-1 text-sm text-gray-900">{inquiry?.name}</dd>
                  </div>
                  
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Phone</dt>
                    <dd className="mt-1 text-sm text-gray-900">{inquiry?.phone}</dd>
                  </div>
                  
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                    <dd className="mt-1 text-sm text-gray-900">{inquiry?.email || 'Not provided'}</dd>
                  </div>
                  
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Service Type</dt>
                    <dd className="mt-1 text-sm text-gray-900">{inquiry?.serviceType}</dd>
                  </div>
                  
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">Message</dt>
                    <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{inquiry?.message}</dd>
                  </div>
                  
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Created</dt>
                    <dd className="mt-1 text-sm text-gray-900">{inquiry?.createdAt ? formatDate(inquiry.createdAt) : ''}</dd>
                  </div>
                  
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                    <dd className="mt-1 text-sm text-gray-900">{inquiry?.updatedAt ? formatDate(inquiry.updatedAt) : ''}</dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Follow-ups */}
            <div className="mt-6 bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Follow-ups ({followUps.length})</h3>
                  <button
                    onClick={() => setShowFollowUpForm(!showFollowUpForm)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Add Follow-up
                  </button>
                </div>

                {/* Follow-up Form */}
                {showFollowUpForm && (
                  <form onSubmit={handleFollowUpSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="note" className="block text-sm font-medium text-gray-700">
                          Follow-up Note *
                        </label>
                        <textarea
                          id="note"
                          name="note"
                          required
                          rows={3}
                          value={followUpForm.note}
                          onChange={handleFollowUpChange}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="Enter your follow-up note..."
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="nextFollowUpDate" className="block text-sm font-medium text-gray-700">
                          Next Follow-up Date *
                        </label>
                        <input
                          type="datetime-local"
                          id="nextFollowUpDate"
                          name="nextFollowUpDate"
                          required
                          value={followUpForm.nextFollowUpDate}
                          onChange={handleFollowUpChange}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                      
                      <div className="flex space-x-3">
                        <button
                          type="submit"
                          disabled={submitting}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                          {submitting ? 'Adding...' : 'Add Follow-up'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowFollowUpForm(false);
                            setFollowUpForm({ note: '', nextFollowUpDate: '' });
                          }}
                          className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md text-sm font-medium"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </form>
                )}

                {/* Follow-ups List */}
                {followUps.length === 0 ? (
                  <div className="text-center py-6">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No follow-ups</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Add a follow-up to track communication with this client.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {followUps.map((followUp, index) => (
                      <div key={followUp._id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="text-sm text-gray-900 whitespace-pre-wrap">{followUp.note}</p>
                            <div className="mt-2 text-xs text-gray-500">
                              <p>Added: {formatDate(followUp.createdAt)}</p>
                              <p>Next follow-up: {formatDate(followUp.nextFollowUpDate)}</p>
                            </div>
                          </div>
                          <div className="ml-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              #{followUps.length - index}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Status Management */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Status Management</h3>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                      Current Status
                    </label>
                    <select
                      id="status"
                      value={statusUpdate}
                      onChange={(e) => setStatusUpdate(e.target.value)}
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="New">New</option>
                      <option value="In Progress">In Progress</option>
                      <option value="In Action">In Action</option>
                      <option value="Done">Done</option>
                    </select>
                  </div>
                  
                  <button
                    onClick={handleStatusUpdate}
                    disabled={statusUpdate === inquiry?.status || submitting}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Updating...' : 'Update Status'}
                  </button>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Quick Info</h4>
                    <dl className="space-y-2">
                      <div>
                        <dt className="text-xs font-medium text-gray-500">Reference Code</dt>
                        <dd className="text-xs text-gray-900 font-mono">{inquiry?.referenceCode}</dd>
                      </div>
                      <div>
                        <dt className="text-xs font-medium text-gray-500">Days Since Created</dt>
                        <dd className="text-xs text-gray-900">
                          {inquiry?.createdAt ? Math.ceil((new Date() - new Date(inquiry.createdAt)) / (1000 * 60 * 60 * 24)) : 0} days
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InquiryDetail;