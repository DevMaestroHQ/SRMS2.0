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
    <div className="space-y-16">
      {/* Main Search Container */}
      <div className="max-w-3xl mx-auto">
        <div className="modern-card hover-lift p-10 md:p-12 relative overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-cyan-400/30 via-blue-500/30 to-purple-600/30"></div>
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-radial from-cyan-400/20 to-transparent rounded-full animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-radial from-purple-500/20 to-transparent rounded-full animate-pulse"></div>
          </div>
          
          {/* Header Section */}
          <div className="text-center mb-12 relative z-10">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 flex items-center justify-center shadow-2xl floating-animation">
                  <Search className="h-14 w-14 text-white" />
                </div>
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center pulse-animation shadow-lg">
                  <span className="text-white text-lg font-bold">✓</span>
                </div>
              </div>
            </div>
            
            <h1 className="responsive-text-4xl font-black bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
              Find Your Results
            </h1>
            <p className="text-muted-foreground responsive-text-xl max-w-2xl mx-auto leading-relaxed font-medium">
              Enter your student information below to instantly access your academic results
            </p>
          </div>
          
          {/* Search Form */}
          <div className="relative z-10">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
                
                {/* Student Name Field */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-2xl font-black text-foreground flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center shadow-xl">
                          <User className="h-6 w-6 text-white" />
                        </div>
                        Student Name
                      </FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <Input
                            {...field}
                            placeholder="Enter your full name as per records"
                            className="h-20 text-xl px-10 rounded-3xl border-4 border-transparent bg-gradient-to-r from-white to-gray-50 dark:from-card dark:to-card/80 focus:from-white focus:to-white dark:focus:from-card dark:focus:to-card focus:border-cyan-400 focus:ring-6 focus:ring-cyan-400/20 shadow-xl transition-all duration-500 placeholder:text-muted-foreground/70 font-medium group-hover:shadow-2xl"
                          />
                          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-cyan-400/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Registration Number Field */}
                <FormField
                  control={form.control}
                  name="tuRegd"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-2xl font-black text-foreground flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-xl">
                          <CreditCard className="h-6 w-6 text-white" />
                        </div>
                        T.U. Registration Number
                      </FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <Input
                            {...field}
                            placeholder="Enter your T.U. registration number"
                            className="h-20 text-xl px-10 rounded-3xl border-4 border-transparent bg-gradient-to-r from-white to-gray-50 dark:from-card dark:to-card/80 focus:from-white focus:to-white dark:focus:from-card dark:focus:to-card focus:border-blue-400 focus:ring-6 focus:ring-blue-400/20 shadow-xl transition-all duration-500 placeholder:text-muted-foreground/70 font-medium group-hover:shadow-2xl"
                          />
                          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-400/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Search Button */}
                <div className="pt-8">
                  <Button
                    type="submit"
                    disabled={searchMutation.isPending}
                    className="w-full h-20 text-2xl font-black bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 hover:from-cyan-600 hover:via-blue-600 hover:to-purple-600 text-white rounded-3xl shadow-2xl hover:shadow-3xl transform hover:scale-[1.02] transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative z-10 flex items-center justify-center">
                      {searchMutation.isPending ? (
                        <>
                          <div className="animate-spin rounded-full h-8 w-8 border-4 border-white border-t-transparent mr-4" />
                          Searching Results...
                        </>
                      ) : (
                        <>
                          <Search className="h-8 w-8 mr-4" />
                          Search My Results
                        </>
                      )}
                    </div>
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        <div className="text-center p-10 modern-card hover-lift group">
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
              <Search className="h-10 w-10 text-white" />
            </div>
          </div>
          <h4 className="text-2xl font-black text-foreground mb-4">Instant Search</h4>
          <p className="text-muted-foreground leading-relaxed text-lg">
            Lightning-fast result retrieval with advanced search algorithms and real-time processing
          </p>
        </div>
        
        <div className="text-center p-10 modern-card hover-lift group">
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
              <User className="h-10 w-10 text-white" />
            </div>
          </div>
          <h4 className="text-2xl font-black text-foreground mb-4">Secure Platform</h4>
          <p className="text-muted-foreground leading-relaxed text-lg">
            Bank-level security with encrypted connections and verified access protocols
          </p>
        </div>
        
        <div className="text-center p-10 modern-card hover-lift group">
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
              <CreditCard className="h-10 w-10 text-white" />
            </div>
          </div>
          <h4 className="text-2xl font-black text-foreground mb-4">Official Results</h4>
          <p className="text-muted-foreground leading-relaxed text-lg">
            Authentic academic records with downloadable certificates and verification
          </p>
        </div>
      </div>
    </div>
  );
}