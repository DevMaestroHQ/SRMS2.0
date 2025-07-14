import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Users, 
  UserPlus, 
  Shield, 
  Trash2, 
  Eye, 
  EyeOff, 
  Lock, 
  Mail, 
  User,
  AlertTriangle,
  Key,
  Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { authManager } from "@/lib/auth";
import { apiRequest } from "@/lib/queryClient";
import { 
  adminRegistrationSchema, 
  changePasswordSchema,
  type Admin, 
  type AdminRegistration, 
  type ChangePassword 
} from "@shared/schema";

export default function AdminManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showPasswords, setShowPasswords] = useState<{[key: string]: boolean}>({});

  const { data: admins = [], isLoading } = useQuery({
    queryKey: ["/api/admin/users"],
    queryFn: async () => {
      const response = await fetch("/api/admin/users", {
        headers: authManager.getAuthHeaders(),
      });
      if (!response.ok) throw new Error("Failed to fetch admins");
      return response.json() as Promise<Admin[]>;
    },
  });

  const addAdminForm = useForm<AdminRegistration>({
    resolver: zodResolver(adminRegistrationSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const changePasswordForm = useForm<ChangePassword>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const addAdminMutation = useMutation({
    mutationFn: (data: AdminRegistration) => 
      apiRequest("/api/admin/users", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          ...authManager.getAuthHeaders(),
        },
      }),
    onSuccess: () => {
      toast({
        title: "Admin Added",
        description: "New administrator has been created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      addAdminForm.reset();
      setShowAddAdmin(false);
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Add Admin",
        description: error.message || "An error occurred while adding the admin.",
        variant: "destructive",
      });
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: (data: ChangePassword) => 
      apiRequest("/api/admin/change-password", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          ...authManager.getAuthHeaders(),
        },
      }),
    onSuccess: () => {
      toast({
        title: "Password Changed",
        description: "Your password has been updated successfully.",
      });
      changePasswordForm.reset();
      setShowChangePassword(false);
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Change Password",
        description: error.message || "An error occurred while changing the password.",
        variant: "destructive",
      });
    },
  });

  const deleteAdminMutation = useMutation({
    mutationFn: (adminId: number) => 
      apiRequest(`/api/admin/users/${adminId}`, {
        method: "DELETE",
        headers: authManager.getAuthHeaders(),
      }),
    onSuccess: () => {
      toast({
        title: "Admin Deleted",
        description: "Administrator has been removed successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Delete Admin",
        description: error.message || "An error occurred while deleting the admin.",
        variant: "destructive",
      });
    },
  });

  const handleDeleteAdmin = (adminId: number, adminName: string) => {
    if (confirm(`Are you sure you want to delete the admin "${adminName}"? This action cannot be undone.`)) {
      deleteAdminMutation.mutate(adminId);
    }
  };

  const togglePasswordVisibility = (adminId: number) => {
    setShowPasswords(prev => ({
      ...prev,
      [adminId]: !prev[adminId]
    }));
  };

  const currentAdmin = authManager.getAuthState().admin;

  return (
    <div className="space-y-6">
      <Card className="bg-white/90 dark:bg-card/90 backdrop-blur-sm border-0 shadow-material-3">
        <CardHeader className="bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-indigo-500/10 border-b border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-3 rounded-xl">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl text-foreground">Admin Management</CardTitle>
                <p className="text-muted-foreground text-sm">Manage administrator accounts and permissions</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="bg-background/50">
                {admins.length} Admins
              </Badge>
              <Dialog open={showAddAdmin} onOpenChange={setShowAddAdmin}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-0">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Admin
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle className="flex items-center">
                      <UserPlus className="h-5 w-5 mr-2" />
                      Add New Administrator
                    </DialogTitle>
                  </DialogHeader>
                  <Form {...addAdminForm}>
                    <form onSubmit={addAdminForm.handleSubmit((data) => addAdminMutation.mutate(data))} className="space-y-4">
                      <FormField
                        control={addAdminForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Enter full name" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={addAdminForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input {...field} type="email" placeholder="admin@university.edu" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={addAdminForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input {...field} type="password" placeholder="Minimum 8 characters" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={addAdminForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                              <Input {...field} type="password" placeholder="Re-enter password" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-end space-x-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => setShowAddAdmin(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" disabled={addAdminMutation.isPending}>
                          {addAdminMutation.isPending ? "Creating..." : "Create Admin"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Tabs defaultValue="admins" className="w-full">
            <TabsList className="grid w-full grid-cols-2 m-6 mb-0">
              <TabsTrigger value="admins" className="flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Administrator List
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center">
                <Settings className="h-4 w-4 mr-2" />
                Account Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="admins" className="p-6 pt-4">
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading administrators...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {admins.map((admin) => (
                    <Card key={admin.id} className="bg-white/60 dark:bg-card/60 backdrop-blur-sm border">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-xl">
                              <User className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <h4 className="font-semibold text-foreground">{admin.name}</h4>
                                {admin.id === currentAdmin?.id && (
                                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                                    You
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <Mail className="h-3 w-3" />
                                <span>{admin.email}</span>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Created: {new Date(admin.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                              <Shield className="h-3 w-3 mr-1" />
                              Admin
                            </Badge>
                            {admins.length > 1 && admin.id !== currentAdmin?.id && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteAdmin(admin.id, admin.name)}
                                className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                                disabled={deleteAdminMutation.isPending}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="settings" className="p-6 pt-4">
              <div className="space-y-6">
                <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-500/20">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="bg-blue-500 p-3 rounded-xl">
                          <Lock className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground">Change Password</h4>
                          <p className="text-sm text-muted-foreground">Update your login password</p>
                        </div>
                      </div>
                      <Dialog open={showChangePassword} onOpenChange={setShowChangePassword}>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="bg-white/80 dark:bg-card/80">
                            <Key className="h-4 w-4 mr-2" />
                            Change Password
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle className="flex items-center">
                              <Lock className="h-5 w-5 mr-2" />
                              Change Password
                            </DialogTitle>
                          </DialogHeader>
                          <Form {...changePasswordForm}>
                            <form onSubmit={changePasswordForm.handleSubmit((data) => changePasswordMutation.mutate(data))} className="space-y-4">
                              <FormField
                                control={changePasswordForm.control}
                                name="currentPassword"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Current Password</FormLabel>
                                    <FormControl>
                                      <Input {...field} type="password" placeholder="Enter current password" />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={changePasswordForm.control}
                                name="newPassword"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>New Password</FormLabel>
                                    <FormControl>
                                      <Input {...field} type="password" placeholder="Minimum 8 characters" />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={changePasswordForm.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Confirm New Password</FormLabel>
                                    <FormControl>
                                      <Input {...field} type="password" placeholder="Re-enter new password" />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <div className="flex justify-end space-x-2 pt-4">
                                <Button type="button" variant="outline" onClick={() => setShowChangePassword(false)}>
                                  Cancel
                                </Button>
                                <Button type="submit" disabled={changePasswordMutation.isPending}>
                                  {changePasswordMutation.isPending ? "Updating..." : "Update Password"}
                                </Button>
                              </div>
                            </form>
                          </Form>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-red-200 dark:border-red-500/20">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3">
                      <div className="bg-red-500 p-3 rounded-xl">
                        <AlertTriangle className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">Security Information</h4>
                        <p className="text-sm text-muted-foreground">
                          Your account has administrator privileges. Always use strong passwords and log out from shared devices.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}