import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Search, User, Hash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { StudentSearch } from "@shared/schema";
import { studentSearchSchema } from "@shared/schema";

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
      return apiRequest(`/api/search`, {
        method: "POST",
        body: JSON.stringify(searchData),
      });
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
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-slate-900 dark:text-slate-100 font-semibold flex items-center text-sm">
                    <User className="h-4 w-4 mr-2 text-university-blue" />
                    Student Full Name
                  </FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="Enter your complete name"
                      className="h-12 text-base bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 focus:border-university-blue dark:focus:border-university-blue transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-600 rounded-lg"
                    />
                  </FormControl>
                  <FormMessage className="text-academic-red" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="tuRegd"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-slate-900 dark:text-slate-100 font-semibold flex items-center text-sm">
                    <Hash className="h-4 w-4 mr-2 text-university-blue" />
                    T.U. Registration Number
                  </FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="Enter your registration number"
                      className="h-12 text-base bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 focus:border-university-blue dark:focus:border-university-blue transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-600 rounded-lg font-mono"
                    />
                  </FormControl>
                  <FormMessage className="text-academic-red" />
                </FormItem>
              )}
            />
          </div>
          
          <div className="text-center pt-6">
            <Button 
              type="submit" 
              disabled={searchMutation.isPending}
              className="px-8 py-3 text-base font-semibold bg-university-blue hover:bg-university-navy text-white border-0 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 rounded-lg min-w-[200px]"
            >
              {searchMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3" />
                  Searching Records...
                </>
              ) : (
                <>
                  <Search className="h-5 w-5 mr-3" />
                  Search My Results
                </>
              )}
            </Button>
          </div>
          
          <div className="text-center text-sm text-university-gray dark:text-slate-400">
            <p>Need help? Contact the university administration office.</p>
          </div>
        </form>
      </Form>
    </div>
  );
}