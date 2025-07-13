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
    <div className="space-y-8">
      {/* Search Card */}
      <Card className="max-w-2xl mx-auto shadow-educational border-0 bg-white/80 dark:bg-card/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="gradient-primary p-4 rounded-2xl shadow-material-3">
                <Search className="h-8 w-8 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-success rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">✓</span>
              </div>
            </div>
          </div>
          <CardTitle className="responsive-text-2xl font-bold text-foreground">
            Student Result Search
          </CardTitle>
          <p className="text-muted-foreground responsive-text-base max-w-md mx-auto">
            Enter your details below to access your academic results securely
          </p>
        </CardHeader>
        
        <CardContent className="p-6 lg:p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-5">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-foreground flex items-center">
                        <User className="h-4 w-4 mr-2 text-primary" />
                        Student Name
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            placeholder="Enter your full name"
                            className="pl-12 py-3 text-base border-2 border-border focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl transition-all duration-200"
                          />
                          <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
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
                      <FormLabel className="text-sm font-semibold text-foreground flex items-center">
                        <CreditCard className="h-4 w-4 mr-2 text-primary" />
                        T.U. Registration Number
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            placeholder="Enter your T.U. Regd. No."
                            className="pl-12 py-3 text-base border-2 border-border focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl transition-all duration-200"
                          />
                          <CreditCard className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <Button
                type="submit"
                className="w-full py-4 text-base font-semibold gradient-primary hover:opacity-90 rounded-xl shadow-material-2 hover:shadow-educational transition-all duration-300 transform hover:scale-[1.02]"
                disabled={searchMutation.isPending}
              >
                {searchMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 mr-2 border-b-2 border-white"></div>
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="h-5 w-5 mr-2" />
                    Search My Results
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-8">
        <div className="text-center p-6 bg-white/60 dark:bg-card/60 backdrop-blur-sm rounded-2xl border border-border/50 card-hover">
          <div className="gradient-secondary p-3 rounded-xl w-fit mx-auto mb-4">
            <Search className="h-6 w-6 text-white" />
          </div>
          <h4 className="font-semibold text-foreground mb-2">Quick Search</h4>
          <p className="text-sm text-muted-foreground">
            Find results instantly using your name and registration number
          </p>
        </div>
        
        <div className="text-center p-6 bg-white/60 dark:bg-card/60 backdrop-blur-sm rounded-2xl border border-border/50 card-hover">
          <div className="gradient-accent p-3 rounded-xl w-fit mx-auto mb-4">
            <User className="h-6 w-6 text-white" />
          </div>
          <h4 className="font-semibold text-foreground mb-2">Secure Access</h4>
          <p className="text-sm text-muted-foreground">
            Your data is protected with enterprise-grade security
          </p>
        </div>
        
        <div className="text-center p-6 bg-white/60 dark:bg-card/60 backdrop-blur-sm rounded-2xl border border-border/50 card-hover">
          <div className="bg-gradient-to-r from-success to-educational-green p-3 rounded-xl w-fit mx-auto mb-4">
            <CreditCard className="h-6 w-6 text-white" />
          </div>
          <h4 className="font-semibold text-foreground mb-2">Instant Results</h4>
          <p className="text-sm text-muted-foreground">
            Get your academic results and download PDFs immediately
          </p>
        </div>
      </div>
    </div>
  );
}