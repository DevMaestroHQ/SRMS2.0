import { useState } from "react";
import Navigation from "@/components/navigation";
import StudentSearch from "@/components/student-search";
import StudentResults from "@/components/student-results";

export default function Home() {
  const [currentView, setCurrentView] = useState<"student" | "admin">("student");
  const [searchResult, setSearchResult] = useState(null);

  const handleResultFound = (result: any) => {
    setSearchResult(result);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation currentView={currentView} onViewChange={setCurrentView} />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {currentView === "student" && (
          <div className="space-y-8">
            <StudentSearch onResultFound={handleResultFound} />
            {searchResult && <StudentResults result={searchResult} />}
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 University Result Management System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
