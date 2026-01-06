import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { clientsAPI } from '../../utils/api';
import { getStatusColor, formatDate } from '../../utils/helpers';
import { toast } from 'sonner';

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const { data } = await clientsAPI.getAll({ limit: 20, page: 1 });
      setClients(data.data.clients || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast.error('Failed to load clients');
    } finally {
      setLoading(false);
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
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Clients ({clients.length})</CardTitle>
          <CardDescription>View and manage all your clients</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-sm text-gray-600">Business</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-gray-600">Contact</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-gray-600">Email</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-gray-600">Package</th>
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
                    <tr key={client.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="font-medium">{client.businessName}</div>
                      </td>
                      <td className="py-3 px-4">{client.contactName}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{client.email}</td>
                      <td className="py-3 px-4 text-sm">{client.package?.name || 'None'}</td>
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
    </div>
  );
}
