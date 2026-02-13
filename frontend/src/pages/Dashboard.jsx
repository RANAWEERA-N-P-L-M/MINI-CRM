import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { inquiryAPI, handleAPIError } from '../services/api';

const Dashboard = () => {
  // Data state
  const [inquiries, setInquiries] = useState([]);
  const [pagination, setPagination] = useState({});
  
  // UI state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filter state
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: '',
    phone: '',
    referenceCode: ''
  });

  // Status colors for badges
  const statusColors = {
    'New': 'bg-gray-100 text-gray-800',
    'In Progress': 'bg-blue-100 text-blue-800',
    'Won': 'bg-green-100 text-green-800',
    'Lost': 'bg-red-100 text-red-800'
  };

  // Load inquiries when component mounts or filters change
  useEffect(() => {
    loadInquiries();
  }, [filters]);

  // Load inquiries from API
  const loadInquiries = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Clean out empty filter values
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== '')
      );
      
      const response = await inquiryAPI.getInquiries(cleanFilters);
      setInquiries(response.data.inquiries);
      setPagination(response.data.pagination);
      
    } catch (error) {
      setError(handleAPIError(error));
    } finally {
      setLoading(false);
    }
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
      page: 1 
    }));
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    setFilters(prev => ({
      ...prev,
      page: newPage
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      page: 1,
      limit: 10,
      status: '',
      phone: '',
      referenceCode: ''
    });
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Client Inquiries Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage and track client inquiries and follow-ups
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Filter Inquiries</h3>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* Status Filter */}
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">All Statuses</option>
                  <option value="New">New</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Action">In Action</option>
                  <option value="Done">Done</option>
                </select>
              </div>

              {/* Phone Search */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={filters.phone}
                  onChange={handleFilterChange}
                  placeholder="Search by phone..."
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              {/* Reference Code Search */}
              <div>
                <label htmlFor="referenceCode" className="block text-sm font-medium text-gray-700">
                  Reference Code
                </label>
                <input
                  type="text"
                  id="referenceCode"
                  name="referenceCode"
                  value={filters.referenceCode}
                  onChange={handleFilterChange}
                  placeholder="Search by reference..."
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              {/* Clear Filters */}
              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-md text-sm font-medium transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-1 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
              <div className="ml-auto pl-3">
                <button
                  onClick={() => setError('')}
                  className="inline-flex items-center p-1.5 text-red-500 hover:bg-red-100 rounded-full"
                >
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-blue-500">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              Loading inquiries...
            </div>
          </div>
        ) : (
          <>
            {/* Inquiries Table */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Inquiries ({pagination.totalInquiries || 0})
                  </h3>
                  <div className="text-sm text-gray-600">
                    Page {pagination.currentPage || 1} of {pagination.totalPages || 1}
                  </div>
                </div>

                {inquiries.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No inquiries found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {Object.values(filters).some(v => v !== '' && v !== 1 && v !== 10) 
                        ? 'Try adjusting your filters.' 
                        : 'No inquiries have been submitted yet.'
                      }
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Client
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Reference
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Service
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Created
                          </th>
                          <th className="relative px-6 py-3">
                            <span className="sr-only">Actions</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {inquiries.map((inquiry) => (
                          <tr key={inquiry._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {inquiry.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {inquiry.phone}
                              </div>
                              {inquiry.email && (
                                <div className="text-sm text-gray-500">
                                  {inquiry.email}
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                              {inquiry.referenceCode}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {inquiry.serviceType}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[inquiry.status]}`}>
                                {inquiry.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(inquiry.createdAt)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <Link
                                to={`/inquiry/${inquiry._id}`}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                View Details
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                
                {pagination.totalPages > 1 && (
                  <div className="mt-6 flex items-center justify-between">
                    <div className="flex items-center">
                      <p className="text-sm text-gray-700">
                        Showing page {pagination.currentPage} of {pagination.totalPages}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                        disabled={!pagination.hasPrevPage}
                        className="relative inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-500 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      
                      <span className="text-sm text-gray-500">
                        Page {pagination.currentPage}
                      </span>
                      
                      <button
                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                        disabled={!pagination.hasNextPage}
                        className="relative inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-500 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;