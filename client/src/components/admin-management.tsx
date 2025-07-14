import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  User, Mail, Eye, EyeOff, Lock, Settings, Save, X, Edit3
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { authManager } from "@/lib/auth";
import type { ChangePassword, UpdateProfile } from "@shared/schema";
import { changePasswordSchema, updateProfileSchema } from "@shared/schema";

export default function AdminManagement() {
  const { toast } = useToast();
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [isProfileEditing, setIsProfileEditing] = useState(false);
  const [isPasswordEditing, setIsPasswordEditing] = useState(false);

  const togglePassword = (field: string) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  // Get current admin info
  const currentAdmin = authManager.getAuthState().admin;

  // Form configurations
  const passwordForm = useForm<ChangePassword>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  const profileForm = useForm<UpdateProfile>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: { 
      name: currentAdmin?.name || "", 
      email: currentAdmin?.email || "", 
      currentPassword: "" 
    },
  });

  // Mutations
  const changePasswordMutation = useMutation({
    mutationFn: (data: ChangePassword) => 
      apiRequest("/api/admin/change-password", { 
        method: "POST", 
        body: data, 
        headers: authManager.getAuthHeaders() 
      }),
    onSuccess: () => {
      toast({ title: "Password Changed", description: "Your password has been updated successfully." });
      passwordForm.reset();
      setIsPasswordEditing(false);
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
      apiRequest("/api/admin/update-profile", { 
        method: "POST", 
        body: data, 
        headers: authManager.getAuthHeaders() 
      }),
    onSuccess: () => {
      toast({ title: "Profile Updated", description: "Your profile has been updated successfully." });
      profileForm.reset();
      setIsProfileEditing(false);
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
  const onPasswordSubmit = (data: ChangePassword) => changePasswordMutation.mutate(data);
  const onProfileSubmit = (data: UpdateProfile) => updateProfileMutation.mutate(data);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Simple Header */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
            <Settings className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Admin Settings</h1>
            <p className="text-slate-600 dark:text-slate-400">Manage your account and administrative privileges</p>
          </div>
        </div>
      </div>

      {/* Management Sections */}
      <div className="space-y-6">
        {/* Profile Management */}
        <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <CardHeader className="border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-lg font-medium text-slate-900 dark:text-white">
                    Profile Settings
                  </CardTitle>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Update your personal information
                  </p>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {!isProfileEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400">Status</span>
                    <p className="font-medium text-slate-900 dark:text-white">Active Admin</p>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400">Access Level</span>
                    <p className="font-medium text-slate-900 dark:text-white">Full Control</p>
                  </div>
                </div>
                <Button 
                  onClick={() => setIsProfileEditing(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            ) : (
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                  <FormField
                    control={profileForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter your full name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" placeholder="Enter your email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              {...field} 
                              type={showPasswords.profileCurrent ? "text" : "password"} 
                              placeholder="Enter current password" 
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex space-x-2">
                    <Button 
                      type="submit" 
                      disabled={updateProfileMutation.isPending}
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                    >
                      {updateProfileMutation.isPending ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsProfileEditing(false);
                        profileForm.reset();
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>

        {/* Security Management */}
        <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <CardHeader className="border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <Lock className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <CardTitle className="text-lg font-medium text-slate-900 dark:text-white">
                    Security Settings
                  </CardTitle>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Manage your password and security
                  </p>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {!isPasswordEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400">Last Updated</span>
                    <p className="font-medium text-slate-900 dark:text-white">Recently</p>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400">Strength</span>
                    <p className="font-medium text-green-600 dark:text-green-400">Strong</p>
                  </div>
                </div>
                <Button 
                  onClick={() => setIsPasswordEditing(true)}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Change Password
                </Button>
              </div>
            ) : (
              <Form {...passwordForm}>
                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                  <FormField
                    control={passwordForm.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              {...field} 
                              type={showPasswords.changeCurrent ? "text" : "password"} 
                              placeholder="Enter current password" 
                            />
                            <button
                              type="button"
                              onClick={() => togglePassword('changeCurrent')}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                              {showPasswords.changeCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={passwordForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              {...field} 
                              type={showPasswords.changeNew ? "text" : "password"} 
                              placeholder="Enter new password" 
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={passwordForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              {...field} 
                              type={showPasswords.changeConfirm ? "text" : "password"} 
                              placeholder="Confirm new password" 
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex space-x-2">
                    <Button 
                      type="submit" 
                      disabled={changePasswordMutation.isPending}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      {changePasswordMutation.isPending ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Update Password
                        </>
                      )}
                    </Button>
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsPasswordEditing(false);
                        passwordForm.reset();
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>


      </div>
    </div>
  );
}