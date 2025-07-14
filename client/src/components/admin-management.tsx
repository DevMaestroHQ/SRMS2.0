import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserPlus, Key, Shield, User, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { authManager } from "@/lib/auth";
import { apiRequest } from "@/lib/queryClient";
import type { AdminRegistration, ChangePassword } from "@shared/schema";
import { adminRegistrationSchema, changePasswordSchema } from "@shared/schema";

export default function AdminManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const registerForm = useForm<AdminRegistration>({
    resolver: zodResolver(adminRegistrationSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const passwordForm = useForm<ChangePassword>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: AdminRegistration) => 
      apiRequest("/api/admin/register", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      toast({
        title: "Admin Created",
        description: "New admin user has been created successfully.",
      });
      registerForm.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to create admin user.",
        variant: "destructive",
      });
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: (data: ChangePassword) => 
      apiRequest("/api/admin/change-password", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      toast({
        title: "Password Updated",
        description: "Your password has been changed successfully.",
      });
      passwordForm.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Password Change Failed",
        description: error.message || "Failed to update password.",
        variant: "destructive",
      });
    },
  });

  const onRegisterSubmit = (data: AdminRegistration) => {
    registerMutation.mutate(data);
  };

  const onPasswordSubmit = (data: ChangePassword) => {
    changePasswordMutation.mutate(data);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-3 mb-8">
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center">
            <Shield className="h-6 w-6 text-white" />
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Admin Management</h2>
          <p className="text-slate-600 dark:text-slate-400">Manage admin users and passwords</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Register New Admin */}
        <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-medium text-slate-900 dark:text-white flex items-center">
              <UserPlus className="h-5 w-5 mr-2 text-blue-600" />
              Add New Admin
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Form {...registerForm}>
              <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                <FormField
                  control={registerForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Full Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter full name"
                          className="h-11 px-4 text-base border border-slate-300 dark:border-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-md"
                        />
                      </FormControl>
                      <FormMessage className="text-red-600 text-sm" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={registerForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="admin@university.edu"
                          className="h-11 px-4 text-base border border-slate-300 dark:border-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-md"
                        />
                      </FormControl>
                      <FormMessage className="text-red-600 text-sm" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={registerForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          placeholder="Create password"
                          className="h-11 px-4 text-base border border-slate-300 dark:border-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-md"
                        />
                      </FormControl>
                      <FormMessage className="text-red-600 text-sm" />
                    </FormItem>
                  )}
                />
                
                <div className="pt-2">
                  <Button 
                    type="submit" 
                    disabled={registerMutation.isPending}
                    className="w-full h-11 text-base font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                  >
                    {registerMutation.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Create Admin
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-medium text-slate-900 dark:text-white flex items-center">
              <Key className="h-5 w-5 mr-2 text-green-600" />
              Change Password
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Form {...passwordForm}>
              <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                <FormField
                  control={passwordForm.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Current Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          placeholder="Enter current password"
                          className="h-11 px-4 text-base border border-slate-300 dark:border-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-md"
                        />
                      </FormControl>
                      <FormMessage className="text-red-600 text-sm" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={passwordForm.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        New Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          placeholder="Enter new password"
                          className="h-11 px-4 text-base border border-slate-300 dark:border-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-md"
                        />
                      </FormControl>
                      <FormMessage className="text-red-600 text-sm" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={passwordForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Confirm Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          placeholder="Confirm new password"
                          className="h-11 px-4 text-base border border-slate-300 dark:border-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-md"
                        />
                      </FormControl>
                      <FormMessage className="text-red-600 text-sm" />
                    </FormItem>
                  )}
                />
                
                <div className="pt-2">
                  <Button 
                    type="submit" 
                    disabled={changePasswordMutation.isPending}
                    className="w-full h-11 text-base font-medium bg-green-600 hover:bg-green-700 text-white rounded-md"
                  >
                    {changePasswordMutation.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Key className="h-4 w-4 mr-2" />
                        Update Password
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}