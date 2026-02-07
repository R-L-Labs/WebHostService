import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { getUsers } from '../../lib/queries';
import { resetPassword } from '../../lib/auth';
import { formatDate } from '../../utils/helpers';
import { toast } from 'sonner';
import { KeyRound, Mail } from 'lucide-react';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resettingUserId, setResettingUserId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { users: data, error } = await getUsers();
      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleSendResetEmail = async (user) => {
    if (!confirm(`Send password reset email to ${user.email}?`)) return;

    setResettingUserId(user.id);
    try {
      const { error } = await resetPassword(user.email);
      if (error) throw error;
      toast.success(`Password reset email sent to ${user.email}`);
    } catch (error) {
      console.error('Error sending reset email:', error);
      toast.error('Failed to send password reset email');
    } finally {
      setResettingUserId(null);
    }
  };

  const getRoleColor = (role) => {
    return role === 'SUPER_ADMIN'
      ? 'bg-purple-100 text-purple-800'
      : 'bg-blue-100 text-blue-800';
  };

  if (loading) {
    return <div>Loading users...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Users</h2>
          <p className="text-gray-600">Manage admin users and reset passwords</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users ({users.length})</CardTitle>
          <CardDescription>View all admin users and manage their passwords</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-sm text-gray-600">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-gray-600">Email</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-gray-600">Role</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-gray-600">Created</th>
                  <th className="text-left py-3 px-4 font-medium text-sm text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-500">
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="font-medium">{user.firstName} {user.lastName}</div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">{user.email}</td>
                      <td className="py-3 px-4">
                        <Badge className={getRoleColor(user.role)}>{user.role}</Badge>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="py-3 px-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSendResetEmail(user)}
                          disabled={resettingUserId === user.id}
                        >
                          <Mail className="w-4 h-4 mr-2" />
                          {resettingUserId === user.id ? 'Sending...' : 'Send Reset Email'}
                        </Button>
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
