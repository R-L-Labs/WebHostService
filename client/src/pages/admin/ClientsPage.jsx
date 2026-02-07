import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { getClients, updateClient, getPackages, getPaymentsByClient, createPayment, deletePayment } from '../../lib/queries';
import { getStatusColor, formatDate, formatDateTime, formatPrice, getPaymentMethodLabel } from '../../utils/helpers';
import { toast } from 'sonner';
import {
  X, ExternalLink, Mail, Phone, Building2, Package, FileText, Calendar,
  DollarSign, Plus, Trash2, CreditCard, RefreshCw
} from 'lucide-react';

const CLIENT_STATUSES = [
  { value: 'PROSPECT', label: 'Prospect', description: 'Potential client' },
  { value: 'ACTIVE', label: 'Active', description: 'Currently working with' },
  { value: 'INACTIVE', label: 'Inactive', description: 'Not currently active' },
  { value: 'CANCELLED', label: 'Cancelled', description: 'No longer a client' },
];

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [packages, setPackages] = useState([]);
  const [updatingPackage, setUpdatingPackage] = useState(false);
  const [selectedPackages, setSelectedPackages] = useState([]);

  // Payments state
  const [payments, setPayments] = useState([]);
  const [paymentSummary, setPaymentSummary] = useState({ totalPaid: 0, totalPending: 0, count: 0 });
  const [loadingPayments, setLoadingPayments] = useState(false);
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [savingPayment, setSavingPayment] = useState(false);

  // New payment form state
  const [newPayment, setNewPayment] = useState({
    amount: '',
    description: '',
    paymentDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'OTHER',
    status: 'PENDING',
    notes: '',
  });

  useEffect(() => {
    fetchClients();
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const { packages: pkgs, error } = await getPackages();
      if (error) throw error;
      setPackages(pkgs);
    } catch (error) {
      console.error('Error fetching packages:', error);
    }
  };

  const fetchClients = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const { clients: clientList, error } = await getClients({ limit: 20, page: 1 });
      if (error) throw error;
      setClients(clientList);
      if (isRefresh) toast.success('Clients refreshed');
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast.error('Failed to load clients');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => fetchClients(true);

  const fetchPayments = async (clientId) => {
    setLoadingPayments(true);
    try {
      const { payments: paymentList, error } = await getPaymentsByClient(clientId);
      if (error) throw error;
      setPayments(paymentList);

      // Calculate summary from payments
      const totalPaid = paymentList
        .filter(p => p.status === 'PAID')
        .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
      const totalPending = paymentList
        .filter(p => p.status === 'PENDING')
        .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
      setPaymentSummary({ totalPaid, totalPending, count: paymentList.length });
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast.error('Failed to load payments');
    } finally {
      setLoadingPayments(false);
    }
  };

  const openClientModal = (client) => {
    setSelectedClient(client);
    fetchPayments(client.id);
    // Initialize selected packages from client's interestedPackages
    const interested = client.interestedPackages ? client.interestedPackages.split(', ').filter(p => p) : [];
    setSelectedPackages(interested);
  };

  const closeClientModal = () => {
    setSelectedClient(null);
    setPayments([]);
    setPaymentSummary({ totalPaid: 0, totalPending: 0, count: 0 });
    setShowAddPayment(false);
    resetPaymentForm();
    setSelectedPackages([]);
  };

  const resetPaymentForm = () => {
    setNewPayment({
      amount: '',
      description: '',
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMethod: 'OTHER',
      status: 'PENDING',
      notes: '',
    });
  };

  const handleAddPayment = async (e) => {
    e.preventDefault();

    if (!newPayment.amount || parseFloat(newPayment.amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setSavingPayment(true);
    try {
      const { error } = await createPayment({
        client_id: selectedClient.id,
        amount: parseFloat(newPayment.amount),
        description: newPayment.description,
        payment_date: newPayment.paymentDate,
        payment_method: newPayment.paymentMethod,
        status: newPayment.status,
        notes: newPayment.notes,
      });
      if (error) throw error;
      toast.success('Payment added successfully');
      setShowAddPayment(false);
      resetPaymentForm();
      fetchPayments(selectedClient.id);
    } catch (error) {
      console.error('Error adding payment:', error);
      toast.error(error.message || 'Failed to add payment');
    } finally {
      setSavingPayment(false);
    }
  };

  const handleDeletePayment = async (paymentId) => {
    if (!confirm('Are you sure you want to delete this payment?')) return;

    try {
      const { error } = await deletePayment(paymentId);
      if (error) throw error;
      toast.success('Payment deleted');
      fetchPayments(selectedClient.id);
    } catch (error) {
      console.error('Error deleting payment:', error);
      toast.error('Failed to delete payment');
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (!selectedClient || newStatus === selectedClient.status) return;

    setUpdatingStatus(true);
    try {
      const { error } = await updateClient(selectedClient.id, { status: newStatus });
      if (error) throw error;
      toast.success(`Client status updated to ${newStatus}`);

      // Update local state
      const updatedClient = { ...selectedClient, status: newStatus };
      setSelectedClient(updatedClient);
      setClients(clients.map(c => c.id === selectedClient.id ? updatedClient : c));
    } catch (error) {
      console.error('Error updating client status:', error);
      toast.error('Failed to update status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const togglePackage = async (packageName) => {
    if (!selectedClient) return;

    const newSelection = selectedPackages.includes(packageName)
      ? selectedPackages.filter(p => p !== packageName)
      : [...selectedPackages, packageName];

    setSelectedPackages(newSelection);
    setUpdatingPackage(true);

    try {
      const interestedPackages = newSelection.join(', ');
      const { error } = await updateClient(selectedClient.id, { interested_packages: interestedPackages });
      if (error) throw error;

      const updatedClient = {
        ...selectedClient,
        interestedPackages,
      };

      setSelectedClient(updatedClient);
      setClients(clients.map(c => c.id === selectedClient.id ? updatedClient : c));
    } catch (error) {
      console.error('Error updating client packages:', error);
      toast.error('Failed to update packages');
      // Revert selection on error
      setSelectedPackages(selectedPackages);
    } finally {
      setUpdatingPackage(false);
    }
  };

  if (loading) {
    return <div>Loading clients...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Clients</h2>
          <p className="text-gray-600">Manage your client base</p>
        </div>
        <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
          <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Clients ({clients.length})</CardTitle>
          <CardDescription>Click on a client to view details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-sm text-gray-600">Business</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-gray-600">Contact</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-gray-600">Email</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-gray-600">Packages</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-gray-600">Created</th>
                </tr>
              </thead>
              <tbody>
                {clients.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-500">
                      No clients found
                    </td>
                  </tr>
                ) : (
                  clients.map((client) => (
                    <tr
                      key={client.id}
                      className="border-b hover:bg-gray-50 cursor-pointer"
                      onClick={() => openClientModal(client)}
                    >
                      <td className="py-3 px-4">
                        <div className="font-medium">{client.businessName}</div>
                      </td>
                      <td className="py-3 px-4">{client.contactName}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{client.email}</td>
                      <td className="py-3 px-4 text-sm">{client.interestedPackages || 'None'}</td>
                      <td className="py-3 px-4">
                        <Badge className={getStatusColor(client.status)}>{client.status}</Badge>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {formatDate(client.createdAt)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Client Details Modal */}
      {selectedClient && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-start p-6 border-b">
              <div>
                <h3 className="text-xl font-semibold">{selectedClient.businessName}</h3>
                <div className="flex items-center gap-3 mt-2">
                  <select
                    value={selectedClient.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    disabled={updatingStatus}
                    className={`text-sm font-medium px-3 py-1 rounded-full border-0 cursor-pointer ${getStatusColor(selectedClient.status)}`}
                  >
                    {CLIENT_STATUSES.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                  {updatingStatus && <span className="text-sm text-gray-500">Updating...</span>}
                </div>
              </div>
              <button
                onClick={closeClientModal}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Website Link - Prominent */}
              {selectedClient.website && (
                <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-primary-700">Client Website</p>
                      <a
                        href={selectedClient.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-800 font-medium flex items-center gap-2 mt-1"
                      >
                        {selectedClient.website}
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => window.open(selectedClient.website, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Visit Site
                    </Button>
                  </div>
                </div>
              )}

              {/* Contact Information */}
              <div>
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Contact Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Contact Name</p>
                      <p className="font-medium">{selectedClient.contactName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Mail className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <a
                        href={`mailto:${selectedClient.email}`}
                        className="font-medium text-primary-600 hover:text-primary-800"
                      >
                        {selectedClient.email}
                      </a>
                    </div>
                  </div>
                  {selectedClient.phone && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Phone className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Phone</p>
                        <a
                          href={`tel:${selectedClient.phone}`}
                          className="font-medium text-primary-600 hover:text-primary-800"
                        >
                          {selectedClient.phone}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Package Information */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                    Interested Packages
                  </h4>
                  {updatingPackage && <span className="text-sm text-gray-500">Saving...</span>}
                </div>
                <div className="space-y-2">
                  {packages.map((pkg) => (
                    <label
                      key={pkg.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedPackages.includes(pkg.name)
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedPackages.includes(pkg.name)}
                        onChange={() => togglePackage(pkg.name)}
                        disabled={updatingPackage}
                        className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                      />
                      <div className="flex items-center gap-3">
                        <Package className="w-5 h-5 text-gray-600" />
                        <div>
                          <span className="font-medium">{pkg.name}</span>
                          <span className="text-gray-500 ml-2">- {formatPrice(pkg.price)}</span>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">Select all packages the client is interested in</p>
              </div>

              {/* Payments Section */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                    Payments
                  </h4>
                  <Button size="sm" onClick={() => setShowAddPayment(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Payment
                  </Button>
                </div>

                {/* Payment Summary */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-xs text-green-600 font-medium">Total Paid</p>
                    <p className="text-lg font-bold text-green-700">
                      {formatPrice(paymentSummary.totalPaid)}
                    </p>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-xs text-yellow-600 font-medium">Pending</p>
                    <p className="text-lg font-bold text-yellow-700">
                      {formatPrice(paymentSummary.totalPending)}
                    </p>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <p className="text-xs text-gray-600 font-medium">Total Payments</p>
                    <p className="text-lg font-bold text-gray-700">{paymentSummary.count}</p>
                  </div>
                </div>

                {/* Add Payment Form */}
                {showAddPayment && (
                  <div className="bg-gray-50 border rounded-lg p-4 mb-4">
                    <div className="flex justify-between items-center mb-4">
                      <h5 className="font-medium">Add New Payment</h5>
                      <button
                        onClick={() => {
                          setShowAddPayment(false);
                          resetPaymentForm();
                        }}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <form onSubmit={handleAddPayment} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="amount">Amount ($)</Label>
                          <Input
                            id="amount"
                            type="number"
                            step="0.01"
                            min="0"
                            value={newPayment.amount}
                            onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
                            placeholder="0.00"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="paymentDate">Date</Label>
                          <Input
                            id="paymentDate"
                            type="date"
                            value={newPayment.paymentDate}
                            onChange={(e) => setNewPayment({ ...newPayment, paymentDate: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="paymentMethod">Payment Method</Label>
                          <select
                            id="paymentMethod"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={newPayment.paymentMethod}
                            onChange={(e) => setNewPayment({ ...newPayment, paymentMethod: e.target.value })}
                          >
                            <option value="CASH">Cash</option>
                            <option value="CHECK">Check</option>
                            <option value="CREDIT_CARD">Credit Card</option>
                            <option value="BANK_TRANSFER">Bank Transfer</option>
                            <option value="PAYPAL">PayPal</option>
                            <option value="VENMO">Venmo</option>
                            <option value="ZELLE">Zelle</option>
                            <option value="OTHER">Other</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="status">Status</Label>
                          <select
                            id="status"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={newPayment.status}
                            onChange={(e) => setNewPayment({ ...newPayment, status: e.target.value })}
                          >
                            <option value="PENDING">Pending</option>
                            <option value="PAID">Paid</option>
                            <option value="REFUNDED">Refunded</option>
                            <option value="FAILED">Failed</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Input
                          id="description"
                          value={newPayment.description}
                          onChange={(e) => setNewPayment({ ...newPayment, description: e.target.value })}
                          placeholder="e.g., Website design deposit"
                        />
                      </div>
                      <div className="flex gap-2 justify-end">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setShowAddPayment(false);
                            resetPaymentForm();
                          }}
                        >
                          Cancel
                        </Button>
                        <Button type="submit" disabled={savingPayment}>
                          {savingPayment ? 'Saving...' : 'Add Payment'}
                        </Button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Payments List */}
                {loadingPayments ? (
                  <p className="text-gray-500 text-sm">Loading payments...</p>
                ) : payments.length === 0 ? (
                  <div className="text-center py-6 bg-gray-50 rounded-lg">
                    <DollarSign className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">No payments recorded</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {payments.map((payment) => (
                      <div
                        key={payment.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border">
                            <CreditCard className="w-5 h-5 text-gray-600" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{formatPrice(payment.amount)}</span>
                              <Badge className={getStatusColor(payment.status)}>
                                {payment.status}
                              </Badge>
                            </div>
                            <div className="text-xs text-gray-500">
                              {formatDate(payment.paymentDate)} - {getPaymentMethodLabel(payment.paymentMethod)}
                              {payment.description && ` - ${payment.description}`}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeletePayment(payment.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                          title="Delete payment"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Notes */}
              {selectedClient.notes && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                    Notes
                  </h4>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-gray-600" />
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedClient.notes}</p>
                  </div>
                </div>
              )}

              {/* Timestamps */}
              <div className="border-t pt-4">
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span>Created: {formatDateTime(selectedClient.createdAt)}</span>
                  <span className="text-gray-300">|</span>
                  <span>Updated: {formatDateTime(selectedClient.updatedAt)}</span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
              <Button variant="outline" onClick={closeClientModal}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
