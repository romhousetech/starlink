'use client';

import * as React from 'react';
import { format, differenceInDays } from 'date-fns';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import toast, { Toaster } from 'react-hot-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import {
  getSubscribers,
  deleteSubscriber,
} from '@/app/actions/subscribersActions';

export type Subscriber = {
  id: string;
  starlinkId: string;
  serialNumber: string;
  longitude: number;
  latitude: number;
  country: string;
  state: string;
  active: boolean;
  subscriptionEndDate: Date | null;
};

export default function SubscribersPage() {
  const [data, setData] = React.useState<Subscriber[]>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);

  const router = useRouter();

  // Fetch subscribers data
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const subscribers = await getSubscribers();
        // Ensure state is always a string
        const formattedSubscribers = subscribers.map((sub) => ({
          ...sub,
          state: sub.state ?? '', // Replace null with an empty string
        }));
        setData(formattedSubscribers);
      } catch (error) {
        toast.error('Failed to fetch subscribers');
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteSubscriber(id);
      setData(data.filter((subscriber) => subscriber.id !== id));
      toast.success('Subscriber deleted successfully');
    } catch (error) {
      toast.error('Failed to delete subscriber');
    }
    setIsDeleteDialogOpen(false);
    setDeleteId(null);
  };

  const confirmDelete = (id: string) => {
    setDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  const columns: ColumnDef<Subscriber>[] = [
    {
      accessorKey: 'starlinkId',
      header: 'Starlink ID',
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('starlinkId')}</div>
      ),
    },
    {
      accessorKey: 'serialNumber',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Serial Number
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: 'country',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Country
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: 'state',
      header: 'State',
    },
    {
      accessorKey: 'longitude',
      header: 'Longitude',
    },
    {
      accessorKey: 'latitude',
      header: 'Latitude',
    },
    {
      accessorKey: 'active',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div
          className={`capitalize ${
            row.getValue('active') ? 'text-green-500' : 'text-red-500'
          }`}
        >
          {row.getValue('active') ? 'Active' : 'Inactive'}
        </div>
      ),
    },
    {
      accessorKey: 'subscriptionEndDate',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Subscription End
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const endDate = row.getValue('subscriptionEndDate') as Date | null;
        if (!endDate) return <div>Not activated</div>;

        const daysRemaining = differenceInDays(new Date(endDate), new Date());
        const formattedDate = format(new Date(endDate), 'PP');

        return (
          <div
            className={`${
              daysRemaining <= 0 ? 'text-red-500' : 'text-green-500'
            }`}
          >
            {formattedDate} ({daysRemaining} days{' '}
            {daysRemaining <= 0 ? 'expired' : 'remaining'})
          </div>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() =>
              router.push(`/admin/subscribers/edit/${row.original.id}`)
            }
          >
            Edit
          </Button>
          <Button
            variant="outline"
            onClick={() => confirmDelete(row.original.id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Input
            placeholder="Filter starlink ID..."
            value={
              (table.getColumn('starlinkId')?.getFilterValue() as string) ?? ''
            }
            onChange={(event) =>
              table.getColumn('starlinkId')?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <Button onClick={() => router.push('/admin/subscribers/add')}>
            Add Subscriber
          </Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Delete Confirmation Dialog */}
        <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                subscriber.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteId && handleDelete(deleteId)}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
