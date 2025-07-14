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
      return apiRequest(`/api/get-result`, {
        method: "POST",
        body: searchData,
        headers: { "Content-Type": "application/json" },
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
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">
          <div className="space-y-4 sm:space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Full Name
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <Input 
                        {...field} 
                        placeholder="Enter your complete name"
                        className="pl-10 h-11 sm:h-12 text-base border border-slate-300 dark:border-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-md bg-white dark:bg-slate-800 transition-colors"
                      />
                    </div>
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
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <Input 
                        {...field} 
                        placeholder="Enter your T.U. registration number"
                        className="pl-10 h-11 sm:h-12 text-base border border-slate-300 dark:border-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-md bg-white dark:bg-slate-800 font-mono"
                      />
                    </div>
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
              className="w-full h-12 sm:h-14 text-base sm:text-lg font-semibold bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 hover:from-cyan-700 hover:via-blue-700 hover:to-purple-700 text-white rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              {searchMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="h-5 w-5 mr-2" />
                  Find My Result
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