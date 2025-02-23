import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/auth';
import { redirect } from 'next/navigation';

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  // Check if user is logged in
  if (!session?.user) {
    redirect('/login');
  }

  // Check if user has proper role (ADMIN or STAFF)
  if (session.user.role !== 'ADMIN' && session.user.role !== 'STAFF') {
    redirect('/error?error=unauthorized_access');
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <p>Welcome, {session.user.name}</p>
      <p className="text-sm text-gray-600">Role: {session.user.role}</p>
      {/* Admin content accessible to both ADMIN and STAFF */}
    </div>
  );
}
