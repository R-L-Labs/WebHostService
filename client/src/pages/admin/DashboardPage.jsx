import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { getClientStats, getInquiries } from '../../lib/queries';
import { Users, TrendingUp, Mail } from 'lucide-react';
import { formatDate } from '../../utils/helpers';
import { toast } from 'sonner';

export default function DashboardPage() {
  const [stats, setStats] = useState({ totalClients: 0, activeClients: 0, prospectClients: 0 });
  const [recentInquiries, setRecentInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsResult, inquiriesResult] = await Promise.all([
        getClientStats(),
        getInquiries({ limit: 5, page: 1 }),
      ]);

      if (statsResult.error) throw statsResult.error;
      if (inquiriesResult.error) throw inquiriesResult.error;

      setStats(statsResult.stats);
      setRecentInquiries(inquiriesResult.inquiries);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Clients</CardTitle>
            <Users className="w-4 h-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClients}</div>
            <p className="text-xs text-gray-600 mt-1">
              {stats.activeClients} active, {stats.prospectClients} prospects
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Clients</CardTitle>
            <TrendingUp className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.activeClients}</div>
            <p className="text-xs text-gray-600 mt-1">Paying customers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">New Inquiries</CardTitle>
            <Mail className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{recentInquiries.length}</div>
            <p className="text-xs text-gray-600 mt-1">Last 5 submissions</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Inquiries */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Inquiries</CardTitle>
          <CardDescription>Latest contact form submissions</CardDescription>
        </CardHeader>
        <CardContent>
          {recentInquiries.length === 0 ? (
            <p className="text-gray-500 text-sm">No recent inquiries</p>
          ) : (
            <div className="space-y-4">
              {recentInquiries.map((inquiry) => (
                <div
                  key={inquiry.id}
                  className="border-b border-gray-200 pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-medium">{inquiry.name}</h3>
                    <span className="text-xs text-gray-500">{formatDate(inquiry.createdAt)}</span>
                  </div>
                  <p className="text-sm text-gray-600">{inquiry.email}</p>
                  {inquiry.businessName && (
                    <p className="text-sm text-gray-500">{inquiry.businessName}</p>
                  )}
                  <p className="text-sm text-gray-700 mt-2 line-clamp-2">{inquiry.message}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
