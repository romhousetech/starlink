'use client';

import { useState, useEffect } from 'react';
import {
  createUser,
  getUsers,
  updateUser,
  resetUserPassword,
  deleteUser,
} from '@/app/actions/userActions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import toast, { Toaster } from 'react-hot-toast';
import { Eye, EyeOff, Trash2 } from 'lucide-react';

export default function UserManagementPage() {
  const [users, setUsers] = useState<
    { id: string; name: string; email: string; role: 'ADMIN' | 'STAFF' }[]
  >([]);
  const [editingUser, setEditingUser] = useState<{
    id: string;
    name: string;
    email: string;
    role: 'ADMIN' | 'STAFF';
  } | null>(null);
  const [resetUser, setResetUser] = useState<{ id: string } | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'ADMIN' | 'STAFF'>('STAFF');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [showAddUserDialog, setShowAddUserDialog] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'STAFF',
  });

  useEffect(() => {
    async function fetchUsers() {
      const data = await getUsers();
      setUsers(data);
    }
    fetchUsers();
  }, []);

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      toast.error('All fields are required');
      return;
    }
    try {
      const createdUser = await createUser(
        newUser.name,
        newUser.email,
        newUser.password,
        newUser.role as 'ADMIN' | 'STAFF'
      );
      setUsers([...users, createdUser]);
      setShowAddUserDialog(false);
      setNewUser({ name: '', email: '', password: '', role: 'STAFF' });
      toast.success('User created successfully');
    } catch (error) {
      toast.error('Failed to create user');
    }
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;
    await updateUser(editingUser.id, name, email, role);
    setUsers(
      users.map((u) =>
        u.id === editingUser.id ? { ...u, name, email, role } : u
      )
    );
    setEditingUser(null);
    toast.success('User updated successfully');
  };

  const handleResetPassword = async () => {
    if (!resetUser || !newPassword) return;
    await resetUserPassword(resetUser.id, newPassword);
    setResetUser(null);
    setNewPassword('');
    toast.success('Password reset successfully');
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    await deleteUser(userToDelete.id);
    setUsers(users.filter((user) => user.id !== userToDelete.id));
    setUserToDelete(null);
    toast.success('User deleted successfully');
  };

  return (
    <div className="p-6">
      <Toaster position="top-center" reverseOrder={false} />
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      <Button onClick={() => setShowAddUserDialog(true)} className="mb-4">
        Add User
      </Button>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell className="flex gap-2">
                {/* Edit User */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      onClick={() => {
                        setEditingUser(user);
                        setName(user.name);
                        setEmail(user.email);
                        setRole(user.role);
                      }}
                    >
                      Edit
                    </Button>
                  </DialogTrigger>
                  {editingUser && (
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit User</DialogTitle>
                      </DialogHeader>
                      <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Name"
                      />
                      <Input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                      />
                      <select
                        value={role}
                        onChange={(e) =>
                          setRole(e.target.value as 'ADMIN' | 'STAFF')
                        }
                        className="p-2 border rounded bg-gray-900 text-white"
                      >
                        <option value="STAFF">Staff</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                      <Button onClick={handleUpdateUser}>Save</Button>
                    </DialogContent>
                  )}
                </Dialog>

                {/* Reset Password */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button onClick={() => setResetUser(user)}>
                      Reset Password
                    </Button>
                  </DialogTrigger>
                  {resetUser && (
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Reset Password</DialogTitle>
                      </DialogHeader>
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="New Password"
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-2 text-gray-500"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff size={20} />
                          ) : (
                            <Eye size={20} />
                          )}
                        </button>
                      </div>
                      <Button onClick={handleResetPassword}>
                        Update Password
                      </Button>
                    </DialogContent>
                  )}
                </Dialog>

                {/* Delete User */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={() => setUserToDelete(user)}
                    >
                      Delete
                      <Trash2 size={16} />
                    </Button>
                  </AlertDialogTrigger>
                  {userToDelete && (
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you sure you want to delete{' '}
                          <span className="font-bold">{userToDelete.name}</span>
                          ?
                        </AlertDialogTitle>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel
                          onClick={() => setUserToDelete(null)}
                        >
                          Cancel
                        </AlertDialogCancel>
                        <Button
                          variant="destructive"
                          onClick={handleDeleteUser}
                        >
                          Delete
                        </Button>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  )}
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* add user */}
      <Dialog open={showAddUserDialog} onOpenChange={setShowAddUserDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Name"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          />
          <Input
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          />
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={newUser.password}
            onChange={(e) =>
              setNewUser({ ...newUser, password: e.target.value })
            }
          />
          <select
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            className="p-2 border rounded bg-gray-900 text-white"
          >
            <option value="STAFF">Staff</option>
            <option value="ADMIN">Admin</option>
          </select>
          <Button onClick={handleAddUser}>Create User</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
