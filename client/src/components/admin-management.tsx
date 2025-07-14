import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  UserPlus, Settings, Lock, User, Mail, Eye, EyeOff, Shield, Users, 
  CheckCircle, Crown, KeyRound, UserCog, Sparkles, ChevronRight,
  Edit3, Save, X, Plus, ArrowRight, Zap, Star
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { authManager } from "@/lib/auth";
import { apiRequest } from "@/lib/queryClient";
import type { AdminRegistration, ChangePassword, UpdateProfile } from "@shared/schema";
import { adminRegistrationSchema, changePasswordSchema, updateProfileSchema } from "@shared/schema";

export default function AdminManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [isProfileEditing, setIsProfileEditing] = useState(false);

  const togglePassword = (field: string) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  // Form configurations
  const registerForm = useForm<AdminRegistration>({
    resolver: zodResolver(adminRegistrationSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
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
      setActiveSection(null);
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
      setActiveSection(null);
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
  const onRegisterSubmit = (data: AdminRegistration) => registerMutation.mutate(data);
  const onPasswordSubmit = (data: ChangePassword) => changePasswordMutation.mutate(data);
  const onProfileSubmit = (data: UpdateProfile) => updateProfileMutation.mutate(data);

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30 dark:from-slate-900 dark:via-indigo-900/20 dark:to-purple-900/20 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Hero Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 text-white">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                    <Crown className="h-8 w-8" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold">Admin Control Center</h1>
                    <p className="text-xl text-white/80">Manage your administrative privileges</p>
                  </div>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-white/30 rounded-full animate-pulse"></div>
                  <div className="w-3 h-3 bg-white/30 rounded-full animate-pulse delay-75"></div>
                  <div className="w-3 h-3 bg-white/30 rounded-full animate-pulse delay-150"></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Floating Elements */}
          <div className="absolute top-4 right-4 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-4 left-4 w-16 h-16 bg-white/10 rounded-full blur-lg"></div>
        </div>

        {/* Management Cards Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Management Card */}
          <div className="space-y-4">
            <Card className="group hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/30 border-0 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-blue-500 rounded-xl text-white shadow-lg">
                      <User className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
                        Profile Settings
                      </CardTitle>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Update your personal information
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                    <Star className="h-3 w-3 mr-1" />
                    Essential
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="relative z-10 space-y-4">
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
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
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
                            <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">FULL NAME</FormLabel>
                            <FormControl>
                              <Input {...field} className="border-2 focus:border-blue-500" placeholder="Enter your full name" />
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
                            <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">EMAIL ADDRESS</FormLabel>
                            <FormControl>
                              <Input {...field} type="email" className="border-2 focus:border-blue-500" placeholder="Enter your email" />
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
                            <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">CURRENT PASSWORD</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input 
                                  {...field} 
                                  type={showPasswords.profileCurrent ? "text" : "password"} 
                                  className="border-2 focus:border-blue-500 pr-10" 
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
                          className="px-4"
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

          {/* Security Management Card */}
          <div className="space-y-4">
            <Card className="group hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-emerald-50 to-green-100 dark:from-emerald-900/20 dark:to-green-900/30 border-0 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/5 to-green-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-emerald-500 rounded-xl text-white shadow-lg">
                      <KeyRound className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
                        Security Center
                      </CardTitle>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Manage passwords & security
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                    <Shield className="h-3 w-3 mr-1" />
                    Secure
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="relative z-10 space-y-4">
                {activeSection !== 'security' ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-slate-500 dark:text-slate-400">Last Updated</span>
                        <p className="font-medium text-slate-900 dark:text-white">Recently</p>
                      </div>
                      <div>
                        <span className="text-slate-500 dark:text-slate-400">Strength</span>
                        <p className="font-medium text-emerald-600 dark:text-emerald-400">Strong</p>
                      </div>
                    </div>
                    <Button 
                      onClick={() => toggleSection('security')}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
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
                            <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">CURRENT PASSWORD</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input 
                                  {...field} 
                                  type={showPasswords.changeOld ? "text" : "password"} 
                                  className="border-2 focus:border-emerald-500 pr-10" 
                                  placeholder="Enter current password" 
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
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={passwordForm.control}
                        name="newPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">NEW PASSWORD</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input 
                                  {...field} 
                                  type={showPasswords.changeNew ? "text" : "password"} 
                                  className="border-2 focus:border-emerald-500 pr-10" 
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
                            <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">CONFIRM PASSWORD</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input 
                                  {...field} 
                                  type={showPasswords.changeConfirm ? "text" : "password"} 
                                  className="border-2 focus:border-emerald-500 pr-10" 
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
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700"
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
                            toggleSection('security');
                            passwordForm.reset();
                          }}
                          className="px-4"
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

          {/* User Management Card */}
          <div className="space-y-4">
            <Card className="group hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-900/20 dark:to-violet-900/30 border-0 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-violet-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardHeader className="relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-purple-500 rounded-xl text-white shadow-lg">
                      <UserCog className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
                        User Management
                      </CardTitle>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Create new administrators
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                    <Zap className="h-3 w-3 mr-1" />
                    Power
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="relative z-10 space-y-4">
                {activeSection !== 'users' ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-slate-500 dark:text-slate-400">Total Admins</span>
                        <p className="font-medium text-slate-900 dark:text-white">1 Active</p>
                      </div>
                      <div>
                        <span className="text-slate-500 dark:text-slate-400">Permissions</span>
                        <p className="font-medium text-slate-900 dark:text-white">Full Access</p>
                      </div>
                    </div>
                    <Button 
                      onClick={() => toggleSection('users')}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Admin
                    </Button>
                  </div>
                ) : (
                  <Form {...registerForm}>
                    <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                      <FormField
                        control={registerForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">FULL NAME</FormLabel>
                            <FormControl>
                              <Input {...field} className="border-2 focus:border-purple-500" placeholder="Enter full name" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">EMAIL ADDRESS</FormLabel>
                            <FormControl>
                              <Input {...field} type="email" className="border-2 focus:border-purple-500" placeholder="Enter email address" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">PASSWORD</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input 
                                  {...field} 
                                  type={showPasswords.register ? "text" : "password"} 
                                  className="border-2 focus:border-purple-500 pr-10" 
                                  placeholder="Enter password" 
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
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-semibold text-slate-700 dark:text-slate-300">CONFIRM PASSWORD</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input 
                                  {...field} 
                                  type={showPasswords.registerConfirm ? "text" : "password"} 
                                  className="border-2 focus:border-purple-500 pr-10" 
                                  placeholder="Confirm password" 
                                />
                                <button
                                  type="button"
                                  onClick={() => togglePassword('registerConfirm')}
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                  {showPasswords.registerConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
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
                          disabled={registerMutation.isPending}
                          className="flex-1 bg-purple-600 hover:bg-purple-700"
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
                        <Button 
                          type="button"
                          variant="outline"
                          onClick={() => {
                            toggleSection('users');
                            registerForm.reset();
                          }}
                          className="px-4"
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

        {/* Quick Actions Footer */}
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">Admin Control Center</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Manage all administrative functions from this dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>System Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}