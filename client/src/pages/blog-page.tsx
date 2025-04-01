import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BlogPost } from "@shared/schema";
import MainLayout from "@/components/layouts/main-layout";
import { BlogCard } from "@/components/ui/blog-card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Search } from "lucide-react";

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("latest");

  // Fetch all blog posts
  const { data: posts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/posts"],
  });

  // Filter and sort posts
  const filteredPosts = posts ? 
    posts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory ? post.category === selectedCategory : true;
      return matchesSearch && matchesCategory;
    }) : [];

  // Sort the filtered posts
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortBy === "latest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortBy === "oldest") {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    } else if (sortBy === "popular") {
      return b.views - a.views;
    }
    return 0;
  });

  // Get unique categories from posts
  const categories = posts 
    ? Array.from(new Set(posts.map(post => post.category)))
    : [];

  return (
    <MainLayout>
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Tech Blog</h1>
          <p className="text-lg text-gray-600">
            Latest tech insights, tutorials, and news from Ethiopia's tech community
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 bg-white p-4 rounded-lg shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="text-gray-400" size={16} />
              </div>
              <Input 
                type="text" 
                placeholder="Search blog posts..." 
                className="pl-10" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Select 
                value={selectedCategory} 
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select 
                value={sortBy} 
                onValueChange={setSortBy}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">Sort By: Latest</SelectItem>
                  <SelectItem value="popular">Sort By: Popular</SelectItem>
                  <SelectItem value="oldest">Sort By: Oldest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Featured Post */}
        {isLoading ? (
          <div className="mb-12 flex justify-center py-16 bg-white rounded-lg shadow-md">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : sortedPosts.length > 0 ? (
          <div className="mb-12">
            <article className="bg-white rounded-lg shadow-md overflow-hidden transition duration-300 hover:shadow-lg">
              <div className="md:flex">
                <div className="md:w-2/5">
                  <img 
                    src={sortedPosts[0].imageUrl || `https://source.unsplash.com/random/800x600?${sortedPosts[0].category.toLowerCase().replace(/ /g, ',')}`}
                    className="w-full h-64 md:h-full object-cover" 
                    alt={sortedPosts[0].title} 
                  />
                </div>
                <div className="p-6 md:w-3/5">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-medium text-primary bg-indigo-50 px-2 py-1 rounded-full">
                      {sortedPosts[0].category}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(sortedPosts[0].createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{sortedPosts[0].title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-4">
                    {sortedPosts[0].content}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <img 
                        src={`https://ui-avatars.com/api/?name=Author`}
                        className="w-8 h-8 rounded-full mr-3" 
                        alt="Author" 
                      />
                      <span className="text-sm font-medium text-gray-900">Author</span>
                    </div>
                    <a href={`/blog/${sortedPosts[0].id}`} className="text-primary hover:text-indigo-700 font-medium text-sm">
                      Read more
                    </a>
                  </div>
                </div>
              </div>
            </article>
          </div>
        ) : null}

        {/* Blog Grid */}
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : sortedPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {sortedPosts.slice(1).map((post) => (
              <BlogCard key={post.id} blog={post} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-600 mb-4">No blog posts found matching your criteria.</p>
            {searchTerm || selectedCategory ? (
              <p>
                Try adjusting your search or filters to see more results.
              </p>
            ) : (
              <p>
                Be the first to contribute a blog post to Ethiopia's Tech Community!
              </p>
            )}
          </div>
        )}

        {/* Pagination - can be implemented with actual pagination logic */}
        {sortedPosts.length > 9 && (
          <div className="flex justify-center">
            <nav className="inline-flex rounded-md shadow">
              <a href="#" className="inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                <i className="fas fa-chevron-left mr-2"></i>
                Previous
              </a>
              <a href="#" className="inline-flex items-center px-4 py-2 border-t border-b border-gray-300 bg-white text-sm font-medium text-primary">
                1
              </a>
              <a href="#" className="inline-flex items-center px-4 py-2 border-t border-b border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                2
              </a>
              <a href="#" className="inline-flex items-center px-4 py-2 border-t border-b border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                3
              </a>
              <a href="#" className="inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                Next
                <i className="fas fa-chevron-right ml-2"></i>
              </a>
            </nav>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
