import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { getInquiries, updateInquiry, deleteInquiry, createClient } from '../../lib/queries';
import { getStatusColor, formatDateTime } from '../../utils/helpers';
import { toast } from 'sonner';
import {
  X, Mail, Phone, Building2, MessageSquare, Calendar,
  CheckCircle, XCircle, Trash2, PhoneCall, RefreshCw, Package
} from 'lucide-react';

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const { inquiries: data, error } = await getInquiries({ limit: 50, page: 1 });
      if (error) throw error;
      setInquiries(data || []);
      if (isRefresh) toast.success('Inquiries refreshed');
    } catch (error) {
      console.error('Error fetching inquiries:', error);
      toast.error('Failed to load inquiries');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => fetchInquiries(true);

  const openInquiryModal = (inquiry) => {
    setSelectedInquiry(inquiry);
  };

  const closeInquiryModal = () => {
    setSelectedInquiry(null);
  };

  const updateInquiryStatus = async (status) => {
    if (!selectedInquiry) return;

    setUpdating(true);
    try {
      const { inquiry: updated, error } = await updateInquiry(selectedInquiry.id, { status });
      if (error) throw error;

      toast.success(`Inquiry marked as ${status.toLowerCase()}`);

      // Update local state
      setInquiries(inquiries.map(inq =>
        inq.id === selectedInquiry.id ? { ...inq, status } : inq
      ));
      setSelectedInquiry({ ...selectedInquiry, status });
    } catch (error) {
      console.error('Error updating inquiry:', error);
      toast.error('Failed to update inquiry');
    } finally {
      setUpdating(false);
    }
  };

  const handleAccept = async () => {
    if (!selectedInquiry) return;

    setUpdating(true);
    try {
      // Create a client from the inquiry data
      const now = new Date().toISOString();
      const { client, error: clientError } = await createClient({
        id: crypto.randomUUID(),
        business_name: selectedInquiry.businessName || selectedInquiry.name,
        contact_name: selectedInquiry.name,
        email: selectedInquiry.email,
        phone: selectedInquiry.phone || null,
        interested_packages: selectedInquiry.interestedPackage || null,
        status: 'PROSPECT',
        updated_at: now,
      });
      if (clientError) throw clientError;

      // Mark the inquiry as converted
      const { error: updateError } = await updateInquiry(selectedInquiry.id, { status: 'CONVERTED' });
      if (updateError) throw updateError;

      toast.success(`Inquiry accepted! Client "${client.businessName}" has been created.`);

      // Update local state
      setInquiries(inquiries.map(inq =>
        inq.id === selectedInquiry.id ? { ...inq, status: 'CONVERTED' } : inq
      ));
      setSelectedInquiry({ ...selectedInquiry, status: 'CONVERTED' });
    } catch (error) {
      console.error('Error accepting inquiry:', error);
      toast.error('Failed to accept inquiry');
    } finally {
      setUpdating(false);
    }
  };
  const handleDecline = () => updateInquiryStatus('DISMISSED');
  const handleMarkContacted = () => updateInquiryStatus('CONTACTED');
  const handleMarkQualified = () => updateInquiryStatus('QUALIFIED');

  const handleDelete = async () => {
    if (!selectedInquiry) return;
    if (!confirm('Are you sure you want to delete this inquiry? This cannot be undone.')) return;

    try {
      const { error } = await deleteInquiry(selectedInquiry.id);
      if (error) throw error;
      toast.success('Inquiry deleted');
      setInquiries(inquiries.filter(inq => inq.id !== selectedInquiry.id));
      closeInquiryModal();
    } catch (error) {
      console.error('Error deleting inquiry:', error);
      toast.error('Failed to delete inquiry');
    }
  };

  const getStatusDescription = (status) => {
    const descriptions = {
      NEW: 'New inquiry - needs review',
      CONTACTED: 'You have reached out to this lead',
      QUALIFIED: 'Confirmed as a potential client',
      CONVERTED: 'Successfully converted to a client',
      DISMISSED: 'Declined or not a good fit',
    };
    return descriptions[status] || status;
  };

  if (loading) {
    return <div>Loading inquiries...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Inquiries</h2>
          <p className="text-gray-600">Manage contact form submissions</p>
        </div>
        <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
          <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Inquiries ({inquiries.length})</CardTitle>
          <CardDescription>Click on an inquiry to view details and take action</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {inquiries.length === 0 ? (
              <p className="text-center py-8 text-gray-500">No inquiries found</p>
            ) : (
              inquiries.map((inquiry) => (
                <div
                  key={inquiry.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => openInquiryModal(inquiry)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{inquiry.name}</h3>
                      <p className="text-sm text-gray-600">{inquiry.email}</p>
                      {inquiry.phone && (
                        <p className="text-sm text-gray-600">{inquiry.phone}</p>
                      )}
                      {inquiry.businessName && (
                        <p className="text-sm text-gray-700 font-medium mt-1">
                          {inquiry.businessName}
                        </p>
                      )}
                      {inquiry.interestedPackage && (
                        <p className="text-xs text-primary-600 mt-1">
                          Interested in: {inquiry.interestedPackage}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={getStatusColor(inquiry.status)}>{inquiry.status}</Badge>
                      <span className="text-xs text-gray-500">
                        {formatDateTime(inquiry.createdAt)}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-sm text-gray-700 line-clamp-2">{inquiry.message}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Inquiry Details Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-start p-6 border-b">
              <div>
                <h3 className="text-xl font-semibold">{selectedInquiry.name}</h3>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className={getStatusColor(selectedInquiry.status)}>
                    {selectedInquiry.status}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    {getStatusDescription(selectedInquiry.status)}
                  </span>
                </div>
              </div>
              <button
                onClick={closeInquiryModal}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Contact Information */}
              <div>
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Contact Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Mail className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <a
                        href={`mailto:${selectedInquiry.email}`}
                        className="font-medium text-primary-600 hover:text-primary-800"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {selectedInquiry.email}
                      </a>
                    </div>
                  </div>
                  {selectedInquiry.phone && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Phone className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Phone</p>
                        <a
                          href={`tel:${selectedInquiry.phone}`}
                          className="font-medium text-primary-600 hover:text-primary-800"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {selectedInquiry.phone}
                        </a>
                      </div>
                    </div>
                  )}
                  {selectedInquiry.businessName && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Business Name</p>
                        <p className="font-medium">{selectedInquiry.businessName}</p>
                      </div>
                    </div>
                  )}
                  {selectedInquiry.interestedPackage && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                        <Package className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Interested In</p>
                        <p className="font-medium text-primary-700">{selectedInquiry.interestedPackage}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Message */}
              <div>
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Message
                </h4>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 flex-1">
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedInquiry.message}</p>
                  </div>
                </div>
              </div>

              {/* Status Actions */}
              {selectedInquiry.status !== 'DISMISSED' && selectedInquiry.status !== 'CONVERTED' && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                    Update Status
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedInquiry.status === 'NEW' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleMarkContacted}
                        disabled={updating}
                      >
                        <PhoneCall className="w-4 h-4 mr-2" />
                        Mark as Contacted
                      </Button>
                    )}
                    {(selectedInquiry.status === 'NEW' || selectedInquiry.status === 'CONTACTED') && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleMarkQualified}
                        disabled={updating}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Mark as Qualified
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {/* Timestamps */}
              <div className="border-t pt-4">
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span>Submitted: {formatDateTime(selectedInquiry.createdAt)}</span>
                  {selectedInquiry.updatedAt !== selectedInquiry.createdAt && (
                    <>
                      <span className="text-gray-300">|</span>
                      <span>Updated: {formatDateTime(selectedInquiry.updatedAt)}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-between items-center p-6 border-t bg-gray-50">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDelete}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
              <div className="flex gap-3">
                <Button variant="outline" onClick={closeInquiryModal}>
                  Close
                </Button>
                {selectedInquiry.status !== 'DISMISSED' && selectedInquiry.status !== 'CONVERTED' && (
                  <>
                    <Button
                      variant="outline"
                      onClick={handleDecline}
                      disabled={updating}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Decline
                    </Button>
                    <Button
                      onClick={handleAccept}
                      disabled={updating}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Accept
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
