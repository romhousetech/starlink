'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

function AuthErrorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push('/login');
    }, 4000);
    return () => clearTimeout(timeout);
  }, [router]);

  const getErrorMessage = () => {
    switch (error) {
      case 'CredentialsSignin':
        return 'Invalid email or password. Please try again.';
      case 'SessionRequired':
        return 'You need to be signed in to access this page.';
      case 'unauthorized_access':
        return 'You do not have permission to access this resource.';
      default:
        return 'An authentication error occurred. Please try signing in again.';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Alert variant="destructive" className="max-w-md w-full">
        <AlertTitle>Authentication Error</AlertTitle>
        <AlertDescription>{getErrorMessage()}</AlertDescription>
      </Alert>

      <p className="mt-4 text-sm text-white">
        Redirecting to login page in 4 seconds...
      </p>
    </div>
  );
}

export default function AuthError() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthErrorContent />
    </Suspense>
  );
}
