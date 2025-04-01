import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { BlogPost, InsertBlogPost } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import MainLayout from "@/components/layouts/main-layout";
import { BlogForm } from "@/components/ui/blog-form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Search, FileEdit, Trash2, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function MyBlogPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("latest");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentBlog, setCurrentBlog] = useState<BlogPost | null>(null);

  // Fetch user's blog posts
  const { data: posts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/user/posts"],
  });

  // Create blog post mutation
  const createMutation = useMutation({
    mutationFn: async (data: InsertBlogPost) => {
      const res = await apiRequest("POST", "/api/posts", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/posts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      setIsFormOpen(false);
      toast({
        title: "Success",
        description: "Blog post created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create blog post",
        variant: "destructive",
      });
    },
  });

  // Update blog post mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: InsertBlogPost }) => {
      const res = await apiRequest("PUT", `/api/posts/${id}`, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/posts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      setIsFormOpen(false);
      toast({
        title: "Success",
        description: "Blog post updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update blog post",
        variant: "destructive",
      });
    },
  });

  // Delete blog post mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/posts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/posts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
      setIsDeleteDialogOpen(false);
      toast({
        title: "Success",
        description: "Blog post deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete blog post",
        variant: "destructive",
      });
    },
  });

  // Filter and sort posts
  const filteredPosts = posts ? 
    posts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" ? true : post.status === statusFilter;
      return matchesSearch && matchesStatus;
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

  const handleCreateBlog = () => {
    setCurrentBlog(null);
    setIsFormOpen(true);
  };

  const handleEditBlog = (blog: BlogPost) => {
    setCurrentBlog(blog);
    setIsFormOpen(true);
  };

  const handleDeleteBlog = (blog: BlogPost) => {
    setCurrentBlog(blog);
    setIsDeleteDialogOpen(true);
  };

  const handleFormSubmit = (data: InsertBlogPost) => {
    if (currentBlog) {
      updateMutation.mutate({ id: currentBlog.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const confirmDelete = () => {
    if (currentBlog) {
      deleteMutation.mutate(currentBlog.id);
    }
  };

  const totalPosts = posts?.length || 0;
  const totalViews = posts?.reduce((sum, post) => sum + post.views, 0) || 0;
  const publishedPosts = posts?.filter(post => post.status === "published").length || 0;

  return (
    <MainLayout>
      <div>
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Blog Posts</h1>
            <p className="text-lg text-gray-600">Manage your contributions to Ethiopia's Tech Community</p>
          </div>
          <Button 
            onClick={handleCreateBlog}
            className="bg-primary text-white font-semibold hover:bg-indigo-700 transition duration-300 flex items-center"
          >
            <i className="fas fa-plus mr-2"></i> New Blog Post
          </Button>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="bg-primary bg-opacity-10 p-3 rounded-full mr-4">
                <i className="fas fa-file-alt text-primary text-xl"></i>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Posts</p>
                <p className="text-2xl font-bold text-gray-900">{totalPosts}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="bg-secondary bg-opacity-10 p-3 rounded-full mr-4">
                <i className="fas fa-eye text-secondary text-xl"></i>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Views</p>
                <p className="text-2xl font-bold text-gray-900">{totalViews}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="bg-accent bg-opacity-10 p-3 rounded-full mr-4">
                <i className="fas fa-file-alt text-accent text-xl"></i>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Published</p>
                <p className="text-2xl font-bold text-gray-900">{publishedPosts}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 bg-white p-4 rounded-lg shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="text-gray-400" size={16} />
              </div>
              <Input 
                type="text" 
                placeholder="Search my posts..." 
                className="pl-10" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Select 
                value={statusFilter} 
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Status: All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Status: All</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
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

        {/* My Blog Posts Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : sortedPosts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Views
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedPosts.map((post) => (
                    <tr key={post.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 mr-3">
                            <img 
                              className="h-10 w-10 rounded object-cover" 
                              src={post.imageUrl || `https://source.unsplash.com/random/100x100?${post.category.toLowerCase().replace(/ /g, ',')}`} 
                              alt={post.title} 
                            />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{post.title}</div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {post.content.length > 60 ? post.content.substring(0, 60) + '...' : post.content}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-xs font-medium bg-indigo-50 text-primary px-2 py-1 rounded-full">
                          {post.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          post.status === 'published' 
                            ? 'bg-green-50 text-green-800' 
                            : 'bg-yellow-50 text-yellow-800'
                        }`}>
                          {post.status === 'published' ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {post.views}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-primary hover:text-indigo-700 mr-2"
                          onClick={() => handleEditBlog(post)}
                        >
                          <FileEdit size={16} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-gray-600 hover:text-gray-900 mr-2"
                        >
                          <Eye size={16} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-error hover:text-red-700"
                          onClick={() => handleDeleteBlog(post)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-600 mb-4">You haven't created any blog posts yet.</p>
              <Button onClick={handleCreateBlog}>Create Your First Blog Post</Button>
            </div>
          )}
        </div>
      </div>

      {/* Blog Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[900px]">
          <DialogHeader>
            <DialogTitle>{currentBlog ? 'Edit Blog Post' : 'Create New Blog Post'}</DialogTitle>
          </DialogHeader>
          <BlogForm 
            onSubmit={handleFormSubmit} 
            initialData={currentBlog || undefined} 
            isSubmitting={createMutation.isPending || updateMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the blog post "{currentBlog?.title}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
}
