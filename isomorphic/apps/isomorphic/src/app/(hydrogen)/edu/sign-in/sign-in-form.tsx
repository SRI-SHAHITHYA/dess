'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SubmitHandler } from 'react-hook-form';
import { PiArrowRightBold } from 'react-icons/pi';
import { Checkbox, Password, Button, Input, Text } from 'rizzui';
import { Form } from '@core/ui/form';
import { routes } from '@/config/routes';
import { loginSchema, LoginSchema } from '@/validators/login.schema';
import { authAPI, fetchCsrfToken } from '@/services/api';
import toast from 'react-hot-toast';

const initialValues: LoginSchema = {
  email: '',
  password: '',
  rememberMe: false,
};

export default function EduSignInForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit: SubmitHandler<LoginSchema> = async (data) => {
    setIsLoading(true);
    try {
      // Fetch CSRF token first
      await fetchCsrfToken();

      // Attempt login
      const response = await authAPI.login({
        email: data.email,
        password: data.password,
      });

      toast.success(response.message || 'Login successful!');

      // Redirect to categories page
      router.push(routes.edu.categories);
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Login failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Form<LoginSchema>
        validationSchema={loginSchema}
        onSubmit={onSubmit}
        useFormProps={{
          mode: 'onChange',
          defaultValues: initialValues,
        }}
      >
        {({ register, formState: { errors } }) => (
          <div className="space-y-5">
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
            <div className="flex items-center justify-between pb-2">
              <Checkbox
                {...register('rememberMe')}
                label="Remember Me"
                variant="flat"
                className="[&>label>span]:font-medium"
              />
            </div>
            <Button
              className="w-full"
              type="submit"
              size="lg"
              isLoading={isLoading}
            >
              <span>Sign in</span>{' '}
              {!isLoading && <PiArrowRightBold className="ms-2 mt-0.5 h-6 w-6" />}
            </Button>
          </div>
        )}
      </Form>
      <Text className="mt-6 text-center leading-loose text-gray-500 lg:mt-8 lg:text-start">
        Don&apos;t have an account?{' '}
        <Link
          href={routes.edu.signUp}
          className="font-semibold text-gray-700 transition-colors hover:text-blue"
        >
          Sign Up
        </Link>
      </Text>
    </>
  );
}
