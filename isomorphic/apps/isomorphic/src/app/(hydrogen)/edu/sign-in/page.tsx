import Link from 'next/link';
import { PiArrowLeftBold } from 'react-icons/pi';
import { routes } from '@/config/routes';
import { Button } from 'rizzui';
import EduSignInForm from './sign-in-form';

export default function EduSignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-2xl bg-white p-8 shadow-xl">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Welcome Back!</h2>
            <p className="mt-2 text-sm text-gray-600">
              Sign in to access your learning dashboard
            </p>
          </div>

          <EduSignInForm />

          <div className="mt-6">
            <Link href={routes.edu.dashboard}>
              <Button variant="outline" className="w-full">
                <PiArrowLeftBold className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
