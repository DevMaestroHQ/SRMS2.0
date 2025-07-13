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
    <div className="max-w-md mx-auto animate-slide-up">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="p-3 rounded-2xl shadow-educational bg-white/90 dark:bg-card/90 backdrop-blur-sm animate-bounce-in">
              <img 
                src={universityLogo} 
                alt="Tribhuvan University Logo" 
                className="h-12 w-12 object-contain"
              />
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-warning rounded-full flex items-center justify-center">
              <Key className="h-3 w-3 text-white" />
            </div>
          </div>
        </div>
        <h2 className="responsive-text-2xl font-bold text-foreground">
          <span className="bg-gradient-to-r from-primary via-educational-purple to-educational-green bg-clip-text text-transparent">
            Tribhuvan University
          </span>
        </h2>
        <h3 className="responsive-text-lg font-semibold text-foreground mt-2">Admin Access Portal</h3>
        <p className="text-muted-foreground responsive-text-base mt-2">
          Secure authentication for result management system
        </p>
      </div>
      
      <Card className="shadow-educational border-0 bg-white/90 dark:bg-card/90 backdrop-blur-sm">
        <CardHeader className="text-center pb-2">
          <CardTitle className="responsive-text-lg text-foreground">Administrator Login</CardTitle>
          <p className="text-muted-foreground text-sm">Enter your credentials to access the dashboard</p>
        </CardHeader>
        
        <CardContent className="p-6 lg:p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-foreground flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-primary" />
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type="email"
                          placeholder="admin@university.edu"
                          className="pl-12 py-3 text-base border-2 border-border focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl transition-all duration-200"
                        />
                        <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
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
                    <FormLabel className="text-sm font-semibold text-foreground flex items-center">
                      <Lock className="h-4 w-4 mr-2 text-primary" />
                      Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type="password"
                          placeholder="••••••••"
                          className="pl-12 py-3 text-base border-2 border-border focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl transition-all duration-200"
                        />
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button
                type="submit"
                className="w-full py-4 text-base font-semibold gradient-primary hover:opacity-90 rounded-xl shadow-material-2 hover:shadow-educational transition-all duration-300 transform hover:scale-[1.02]"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 mr-2 border-b-2 border-white"></div>
                    Authenticating...
                  </>
                ) : (
                  <>
                    <LogIn className="h-5 w-5 mr-2" />
                    Access Dashboard
                  </>
                )}
              </Button>
            </form>
          </Form>
          
          <div className="mt-6 p-4 bg-muted/50 rounded-xl">
            <p className="text-xs text-muted-foreground text-center">
              Default credentials: admin@university.edu / admin123
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
