import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { inquiriesAPI } from '../../utils/api';
import { getStatusColor, formatDateTime } from '../../utils/helpers';
import { toast } from 'sonner';

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const { data } = await inquiriesAPI.getAll({ limit: 20, page: 1 });
      setInquiries(data.data.inquiries || []);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
      toast.error('Failed to load inquiries');
    } finally {
      setLoading(false);
    }
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
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Inquiries ({inquiries.length})</CardTitle>
          <CardDescription>Contact form submissions from your website</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {inquiries.length === 0 ? (
              <p className="text-center py-8 text-gray-500">No inquiries found</p>
            ) : (
              inquiries.map((inquiry) => (
                <div
                  key={inquiry.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
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
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={getStatusColor(inquiry.status)}>{inquiry.status}</Badge>
                      <span className="text-xs text-gray-500">
                        {formatDateTime(inquiry.createdAt)}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-sm text-gray-700">{inquiry.message}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
