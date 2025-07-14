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
    <div className="max-w-2xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Full Name
                  </FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="Enter your complete name"
                      className="h-11 px-4 text-base border border-slate-300 dark:border-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-md bg-white dark:bg-slate-800"
                    />
                  </FormControl>
                  <FormMessage className="text-red-600 text-sm" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="tuRegd"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    T.U. Registration Number
                  </FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="Enter your registration number"
                      className="h-11 px-4 text-base border border-slate-300 dark:border-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-md bg-white dark:bg-slate-800 font-mono"
                    />
                  </FormControl>
                  <FormMessage className="text-red-600 text-sm" />
                </FormItem>
              )}
            />
          </div>
          
          <div className="pt-4">
            <Button 
              type="submit" 
              disabled={searchMutation.isPending}
              className="w-full h-12 text-base font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-md"
            >
              {searchMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="h-5 w-5 mr-2" />
                  Search Results
                </>
              )}
            </Button>
          </div>
          
          <div className="text-center text-sm text-slate-600 dark:text-slate-400 pt-2">
            <p>Contact university administration for assistance</p>
          </div>
        </form>
      </Form>
    </div>
  );
}