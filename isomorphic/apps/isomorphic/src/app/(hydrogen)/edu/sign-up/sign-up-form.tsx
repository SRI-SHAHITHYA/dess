'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SubmitHandler } from 'react-hook-form';
import { PiArrowRightBold } from 'react-icons/pi';
import { Password, Button, Input, Text } from 'rizzui';
import { Form } from '@core/ui/form';
import { routes } from '@/config/routes';
import { z } from 'zod';
import { authAPI, fetchCsrfToken } from '@/services/api';
import toast from 'react-hot-toast';

// Validation schema matching backend requirements
const signUpSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  email: z.string().email({ message: 'Must be a valid email address' }),
  password: z
    .string()
    .min(10, { message: 'Password must be at least 10 characters long' })
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}\[\]:;"'<>,.?/\\~-]).*$/,
      {
        message:
          'Password must contain uppercase, lowercase, number, and special character',
      }
    ),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type SignUpSchema = z.infer<typeof signUpSchema>;

const initialValues: SignUpSchema = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
};

export default function EduSignUpForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit: SubmitHandler<SignUpSchema> = async (data) => {
    setIsLoading(true);
    try {
      // Fetch CSRF token first
      await fetchCsrfToken();

      // Attempt registration
      const response = await authAPI.register({
        name: data.name,
        email: data.email,
        password: data.password,
        role: 'learner', // Default role for edu platform
      });

      toast.success(response.message || 'Registration successful!');

      // Redirect to sign-in page
      router.push(routes.edu.signIn);
    } catch (error: any) {
      console.error('Registration error:', error);
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.errors?.[0]?.msg ||
        error.message ||
        'Registration failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Form<SignUpSchema>
        validationSchema={signUpSchema}
        onSubmit={onSubmit}
        useFormProps={{
          mode: 'onChange',
          defaultValues: initialValues,
        }}
      >
        {({ register, formState: { errors } }) => (
          <div className="space-y-5">
            <Input
              type="text"
              size="lg"
              label="Full Name"
              placeholder="Enter your full name"
              className="[&>label>span]:font-medium"
              inputClassName="text-sm"
              {...register('name')}
              error={errors.name?.message}
            />
            <Input
              type="email"
              size="lg"
              label="Email"
              placeholder="Enter your email"
              className="[&>label>span]:font-medium"
              inputClassName="text-sm"
              {...register('email')}
              error={errors.email?.message}
            />
            <Password
              label="Password"
              placeholder="Enter your password"
              size="lg"
              className="[&>label>span]:font-medium"
              inputClassName="text-sm"
              {...register('password')}
              error={errors.password?.message}
            />
            <Password
              label="Confirm Password"
              placeholder="Confirm your password"
              size="lg"
              className="[&>label>span]:font-medium"
              inputClassName="text-sm"
              {...register('confirmPassword')}
              error={errors.confirmPassword?.message}
            />
            <div className="text-xs text-gray-500">
              <p className="mb-1">Password must include:</p>
              <ul className="ml-4 list-disc space-y-0.5">
                <li>At least 10 characters</li>
                <li>One uppercase letter</li>
                <li>One lowercase letter</li>
                <li>One number</li>
                <li>One special character</li>
              </ul>
            </div>
            <Button
              className="w-full"
              type="submit"
              size="lg"
              isLoading={isLoading}
            >
              <span>Create Account</span>{' '}
              {!isLoading && <PiArrowRightBold className="ms-2 mt-0.5 h-6 w-6" />}
            </Button>
          </div>
        )}
      </Form>
      <Text className="mt-6 text-center leading-loose text-gray-500 lg:mt-8 lg:text-start">
        Already have an account?{' '}
        <Link
          href={routes.edu.signIn}
          className="font-semibold text-gray-700 transition-colors hover:text-blue"
        >
          Sign In
        </Link>
      </Text>
    </>
  );
}
