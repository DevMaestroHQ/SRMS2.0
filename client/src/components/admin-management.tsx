import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserPlus, Settings, Lock, User, Mail, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { authManager } from "@/lib/auth";
import { apiRequest } from "@/lib/queryClient";
import type { AdminRegistration, ChangePassword, UpdateProfile } from "@shared/schema";
import { adminRegistrationSchema, changePasswordSchema, updateProfileSchema } from "@shared/schema";

export default function AdminManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showPasswords, setShowPasswords] = useState({
    register: false,
    changeOld: false,
    changeNew: false,
    changeConfirm: false,
    profileCurrent: false,
  });

  const togglePassword = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  // Form configurations
  const registerForm = useForm<AdminRegistration>({
    resolver: zodResolver(adminRegistrationSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const passwordForm = useForm<ChangePassword>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  const profileForm = useForm<UpdateProfile>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: { name: "", email: "", currentPassword: "" },
  });

  // Mutations
  const registerMutation = useMutation({
    mutationFn: (data: AdminRegistration) => 
      apiRequest("/api/admin/register", { method: "POST", body: data }),
    onSuccess: () => {
      toast({ title: "Admin Created", description: "New admin user has been created successfully." });
      registerForm.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
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
      apiRequest("/api/admin/change-password", { method: "POST", body: data }),
    onSuccess: () => {
      toast({ title: "Password Changed", description: "Your password has been updated successfully." });
      passwordForm.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Password Change Failed",
        description: error.message || "Failed to change password.",
        variant: "destructive",
      });
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data: UpdateProfile) => 
      apiRequest("/api/admin/update-profile", { method: "POST", body: data }),
    onSuccess: () => {
      toast({ title: "Profile Updated", description: "Your profile has been updated successfully." });
      profileForm.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Profile Update Failed",
        description: error.message || "Failed to update profile.",
        variant: "destructive",
      });
    },
  });

  // Form handlers
  const onRegisterSubmit = (data: AdminRegistration) => registerMutation.mutate(data);
  const onPasswordSubmit = (data: ChangePassword) => changePasswordMutation.mutate(data);
  const onProfileSubmit = (data: UpdateProfile) => updateProfileMutation.mutate(data);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Management</h2>
        <p className="text-slate-600 dark:text-slate-400">Manage admin users and security settings</p>
      </div>

      {/* Management Cards */}
      <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Create New Admin */}
        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
              <UserPlus className="h-5 w-5 mr-2 text-blue-600" />
              Create New Admin
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...registerForm}>
              <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                <FormField
                  control={registerForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Full Name
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <Input
                            {...field}
                            placeholder="Enter full name"
                            className="pl-9 h-10 border-slate-300 dark:border-slate-600 bg-white/50 dark:bg-slate-700/50 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={registerForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <Input
                            {...field}
                            type="email"
                            placeholder="Enter email address"
                            className="pl-9 h-10 border-slate-300 dark:border-slate-600 bg-white/50 dark:bg-slate-700/50 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={registerForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <Input
                            {...field}
                            type={showPasswords.register ? "text" : "password"}
                            placeholder="Enter password"
                            className="pl-9 pr-9 h-10 border-slate-300 dark:border-slate-600 bg-white/50 dark:bg-slate-700/50 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
                          />
                          <button
                            type="button"
                            onClick={() => togglePassword('register')}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                          >
                            {showPasswords.register ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm" />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  disabled={registerMutation.isPending}
                  className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  {registerMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Create Admin
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
              <Lock className="h-5 w-5 mr-2 text-green-600" />
              Change Password
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...passwordForm}>
              <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                <FormField
                  control={passwordForm.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Current Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <Input
                            {...field}
                            type={showPasswords.changeOld ? "text" : "password"}
                            placeholder="Enter current password"
                            className="pl-9 pr-9 h-10 border-slate-300 dark:border-slate-600 bg-white/50 dark:bg-slate-700/50 focus:border-green-500 focus:ring-1 focus:ring-green-500/20"
                          />
                          <button
                            type="button"
                            onClick={() => togglePassword('changeOld')}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                          >
                            {showPasswords.changeOld ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={passwordForm.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        New Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <Input
                            {...field}
                            type={showPasswords.changeNew ? "text" : "password"}
                            placeholder="Enter new password"
                            className="pl-9 pr-9 h-10 border-slate-300 dark:border-slate-600 bg-white/50 dark:bg-slate-700/50 focus:border-green-500 focus:ring-1 focus:ring-green-500/20"
                          />
                          <button
                            type="button"
                            onClick={() => togglePassword('changeNew')}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                          >
                            {showPasswords.changeNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={passwordForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Confirm New Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <Input
                            {...field}
                            type={showPasswords.changeConfirm ? "text" : "password"}
                            placeholder="Confirm new password"
                            className="pl-9 pr-9 h-10 border-slate-300 dark:border-slate-600 bg-white/50 dark:bg-slate-700/50 focus:border-green-500 focus:ring-1 focus:ring-green-500/20"
                          />
                          <button
                            type="button"
                            onClick={() => togglePassword('changeConfirm')}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                          >
                            {showPasswords.changeConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm" />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  disabled={changePasswordMutation.isPending}
                  className="w-full h-10 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  {changePasswordMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4 mr-2" />
                      Update Password
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Update Profile */}
        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
              <Settings className="h-5 w-5 mr-2 text-purple-600" />
              Update Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...profileForm}>
              <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                <FormField
                  control={profileForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Full Name
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <Input
                            {...field}
                            placeholder="Enter your full name"
                            className="pl-9 h-10 border-slate-300 dark:border-slate-600 bg-white/50 dark:bg-slate-700/50 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20"
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={profileForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <Input
                            {...field}
                            type="email"
                            placeholder="Enter your email"
                            className="pl-9 h-10 border-slate-300 dark:border-slate-600 bg-white/50 dark:bg-slate-700/50 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20"
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={profileForm.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Current Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <Input
                            {...field}
                            type={showPasswords.profileCurrent ? "text" : "password"}
                            placeholder="Enter current password"
                            className="pl-9 pr-9 h-10 border-slate-300 dark:border-slate-600 bg-white/50 dark:bg-slate-700/50 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20"
                          />
                          <button
                            type="button"
                            onClick={() => togglePassword('profileCurrent')}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                          >
                            {showPasswords.profileCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm" />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  disabled={updateProfileMutation.isPending}
                  className="w-full h-10 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  {updateProfileMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Settings className="h-4 w-4 mr-2" />
                      Update Profile
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}