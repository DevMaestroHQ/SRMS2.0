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
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Check Your Results</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Enter your details below to view and download your marksheet
        </p>
      </div>

      <div className="max-w-md mx-auto">
        <Card className="shadow-material-2">
          <CardContent className="p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          Student Name
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              placeholder="Enter your full name"
                              className="pl-12 py-3 focus:ring-2 focus:ring-primary"
                            />
                            <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
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
                        <FormLabel className="text-sm font-medium text-gray-700">
                          T.U. Registration Number
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              placeholder="Enter your T.U. Regd. No."
                              className="pl-12 py-3 focus:ring-2 focus:ring-primary"
                            />
                            <CreditCard className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <Button
                  type="submit"
                  className="w-full py-3 bg-primary hover:bg-primary/90"
                  disabled={searchMutation.isPending}
                >
                  <Search className="h-5 w-5 mr-2" />
                  {searchMutation.isPending ? "Searching..." : "Search Results"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
