import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Search, User, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { studentSearchSchema, type StudentSearch } from "@shared/schema";

interface StudentSearchProps {
  onResultFound: (result: any) => void;
}

export default function StudentSearch({ onResultFound }: StudentSearchProps) {
  const { toast } = useToast();
  
  const form = useForm<StudentSearch>({
    resolver: zodResolver(studentSearchSchema),
    defaultValues: {
      name: "",
      tuRegd: "",
    },
  });

  const searchMutation = useMutation({
    mutationFn: async (searchData: StudentSearch) => {
      const response = await apiRequest("POST", "/api/get-result", searchData);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Result Found",
        description: "Student record found successfully.",
      });
      onResultFound(data);
    },
    onError: (error: any) => {
      toast({
        title: "No Result Found",
        description: error.message || "No matching record found for the provided details.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: StudentSearch) => {
    searchMutation.mutate(data);
  };

  return (
    <div className="space-y-12">
      {/* Search Card */}
      <div className="max-w-2xl mx-auto">
        <div className="modern-card hover-lift p-8 md:p-12 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-500/20 via-blue-500/20 to-pink-500/20"></div>
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-radial from-purple-500/10 to-transparent rounded-full"></div>
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-radial from-blue-500/10 to-transparent rounded-full"></div>
          </div>
          
          {/* Header */}
          <div className="text-center mb-10 relative z-10">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-vibrant floating-animation">
                  <Search className="h-12 w-12 text-white" />
                </div>
                <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center pulse-animation">
                  <span className="text-white text-sm font-bold">✓</span>
                </div>
              </div>
            </div>
            
            <h1 className="responsive-text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent mb-6">
              Student Result Search
            </h1>
            <p className="text-muted-foreground responsive-text-lg max-w-lg mx-auto leading-relaxed">
              Enter your details below to access your academic results securely and instantly
            </p>
          </div>
          
          {/* Form */}
          <div className="relative z-10">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid gap-8">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xl font-bold text-foreground flex items-center gap-4 mb-4">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center shadow-lg">
                            <User className="h-5 w-5 text-white" />
                          </div>
                          Student Name
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              placeholder="Enter your full name"
                              className="h-16 text-lg px-8 rounded-2xl border-3 border-transparent bg-white/80 dark:bg-card/80 backdrop-blur-sm focus:bg-white dark:focus:bg-card focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 shadow-lg transition-all duration-300 placeholder:text-muted-foreground/60"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="tuRegd"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xl font-bold text-foreground flex items-center gap-4 mb-4">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
                            <CreditCard className="h-5 w-5 text-white" />
                          </div>
                          T.U. Registration Number
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              placeholder="Enter your T.U. registration number"
                              className="h-16 text-lg px-8 rounded-2xl border-3 border-transparent bg-white/80 dark:bg-card/80 backdrop-blur-sm focus:bg-white dark:focus:bg-card focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 shadow-lg transition-all duration-300 placeholder:text-muted-foreground/60"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="pt-6">
                  <Button
                    type="submit"
                    disabled={searchMutation.isPending}
                    className="w-full h-16 text-xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 hover:from-purple-700 hover:via-blue-700 hover:to-pink-700 text-white rounded-2xl shadow-vibrant hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {searchMutation.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-7 w-7 border-3 border-white border-t-transparent mr-4" />
                        Searching Results...
                      </>
                    ) : (
                      <>
                        <Search className="h-7 w-7 mr-4" />
                        Search My Results
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <div className="text-center p-8 modern-card hover-lift">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center shadow-lg">
              <Search className="h-8 w-8 text-white" />
            </div>
          </div>
          <h4 className="text-xl font-bold text-foreground mb-4">Quick Search</h4>
          <p className="text-muted-foreground leading-relaxed">
            Find results instantly using your name and registration number with advanced search algorithms
          </p>
        </div>
        
        <div className="text-center p-8 modern-card hover-lift">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center shadow-lg">
              <User className="h-8 w-8 text-white" />
            </div>
          </div>
          <h4 className="text-xl font-bold text-foreground mb-4">Secure Access</h4>
          <p className="text-muted-foreground leading-relaxed">
            Your data is protected with enterprise-grade security and encryption protocols
          </p>
        </div>
        
        <div className="text-center p-8 modern-card hover-lift">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-green-500 to-purple-500 flex items-center justify-center shadow-lg">
              <CreditCard className="h-8 w-8 text-white" />
            </div>
          </div>
          <h4 className="text-xl font-bold text-foreground mb-4">Instant Results</h4>
          <p className="text-muted-foreground leading-relaxed">
            Get your academic results and download PDFs immediately with lightning-fast processing
          </p>
        </div>
      </div>
    </div>
  );
}