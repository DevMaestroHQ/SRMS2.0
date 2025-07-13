import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { LogIn, Shield, Mail, Lock, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { authManager } from "@/lib/auth";
import { loginSchema, type LoginCredentials } from "@shared/schema";
import universityLogo from "@/assets/university-logo.png";

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

export default function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const { toast } = useToast();
  
  const form = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => authManager.login(credentials),
    onSuccess: () => {
      toast({
        title: "Login Successful",
        description: "Welcome to the admin dashboard.",
      });
      onLoginSuccess();
    },
    onError: (error: any) => {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: LoginCredentials) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="max-w-lg mx-auto animate-slide-up">
      <div className="text-center mb-12">
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-vibrant floating-animation">
              <img 
                src={universityLogo} 
                alt="Tribhuvan University Logo" 
                className="h-12 w-12 object-contain"
              />
            </div>
            <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center pulse-animation">
              <Key className="h-5 w-5 text-white" />
            </div>
          </div>
        </div>
        <h2 className="responsive-text-3xl font-bold mb-4">
          <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent">
            Tribhuvan University
          </span>
        </h2>
        <h3 className="responsive-text-xl font-bold text-foreground mb-3">Admin Access Portal</h3>
        <p className="text-muted-foreground responsive-text-lg leading-relaxed">
          Secure authentication for result management system
        </p>
      </div>

      <div className="modern-card hover-lift p-8 md:p-10 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-500/20 via-blue-500/20 to-pink-500/20"></div>
          <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-gradient-radial from-purple-500/10 to-transparent rounded-full"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-radial from-blue-500/10 to-transparent rounded-full"></div>
        </div>

        {/* Header */}
        <div className="text-center mb-8 relative z-10">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center shadow-lg">
              <Shield className="h-8 w-8 text-white" />
            </div>
          </div>
          <h4 className="responsive-text-2xl font-bold text-foreground mb-2">Administrator Login</h4>
          <p className="text-muted-foreground text-lg">Enter your credentials to access the dashboard</p>
        </div>
        
        <div className="relative z-10">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-bold text-foreground flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                        <Mail className="h-4 w-4 text-white" />
                      </div>
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type="email"
                          placeholder="admin@university.edu"
                          className="h-14 text-lg px-6 rounded-2xl border-2 border-transparent bg-white/80 dark:bg-card/80 backdrop-blur-sm focus:bg-white dark:focus:bg-card focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 shadow-lg transition-all duration-300 placeholder:text-muted-foreground/60"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-bold text-foreground flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                        <Lock className="h-4 w-4 text-white" />
                      </div>
                      Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type="password"
                          placeholder="••••••••"
                          className="h-14 text-lg px-6 rounded-2xl border-2 border-transparent bg-white/80 dark:bg-card/80 backdrop-blur-sm focus:bg-white dark:focus:bg-card focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 shadow-lg transition-all duration-300 placeholder:text-muted-foreground/60"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={loginMutation.isPending}
                  className="w-full h-14 text-lg font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 hover:from-purple-700 hover:via-blue-700 hover:to-pink-700 text-white rounded-2xl shadow-vibrant hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loginMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-3 border-white border-t-transparent mr-3"></div>
                      Authenticating...
                    </>
                  ) : (
                    <>
                      <LogIn className="h-6 w-6 mr-3" />
                      Access Dashboard
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
          
          <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl border-2 border-blue-200 dark:border-blue-500/20">
            <p className="text-muted-foreground text-center font-medium">
              Default credentials: admin@university.edu / admin123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
