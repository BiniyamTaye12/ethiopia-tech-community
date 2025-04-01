import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { User, updateUserSchema } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import MainLayout from "@/components/layouts/main-layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

export default function ProfilePage() {
  const { toast } = useToast();
  const { user, logoutMutation } = useAuth();
  const [activeTab, setActiveTab] = useState("profile-info");

  // We'll create a form schema based on the updateUserSchema
  const formSchema = updateUserSchema;
  type FormValues = z.infer<typeof formSchema>;

  // Create form with react-hook-form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      bio: user?.bio || "",
      location: user?.location || "",
      website: user?.website || "",
      avatarUrl: user?.avatarUrl || "",
    },
  });

  // Get user's blog posts for stats
  const { data: userPosts } = useQuery({
    queryKey: ["/api/user/posts"],
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const res = await apiRequest("PUT", "/api/user/profile", data);
      return await res.json();
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["/api/user"], updatedUser);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormValues) => {
    updateProfileMutation.mutate(data);
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  // Stats calculations
  const totalPosts = userPosts?.length || 0;
  const totalViews = userPosts?.reduce((total, post) => total + post.views, 0) || 0;
  const memberSince = user ? new Date(user.id > 0 ? "2022-01-01" : new Date()).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : "";

  return (
    <MainLayout>
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
          <p className="text-lg text-gray-600">Manage your account and preferences</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <div className="mb-4 relative">
                    <img 
                      className="h-32 w-32 rounded-full object-cover border-4 border-white shadow" 
                      src={user?.avatarUrl || `https://ui-avatars.com/api/?name=${user?.username || ''}&size=128`}
                      alt="Profile picture" 
                    />
                    <Button 
                      variant="default" 
                      size="icon" 
                      className="absolute bottom-0 right-0 rounded-full"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">
                    {user?.firstName} {user?.lastName}
                  </h2>
                  <p className="text-gray-600 mb-3">
                    {user?.bio ? user.bio.split(' ').slice(0, 3).join(' ') + '...' : 'Full Stack Developer'}
                  </p>
                  <div className="flex space-x-2 mb-6">
                    <a href="#" className="text-gray-600 hover:text-primary">
                      <i className="fab fa-twitter"></i>
                    </a>
                    <a href="#" className="text-gray-600 hover:text-primary">
                      <i className="fab fa-linkedin"></i>
                    </a>
                    <a href="#" className="text-gray-600 hover:text-primary">
                      <i className="fab fa-github"></i>
                    </a>
                  </div>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Member since:</span>
                    <span className="font-medium">{memberSince}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Blog posts:</span>
                    <span className="font-medium">{totalPosts}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total views:</span>
                    <span className="font-medium">{totalViews}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 px-6 py-4">
                <Button 
                  variant="ghost" 
                  className="text-error hover:text-red-700 font-medium flex items-center w-full justify-start p-0"
                  onClick={handleLogout}
                >
                  <i className="fas fa-sign-out-alt mr-2"></i> Sign out
                </Button>
              </CardFooter>
            </Card>
            
            {/* Navigation Sidebar */}
            <Card className="mt-6">
              <CardContent className="p-1">
                <Button 
                  variant={activeTab === "profile-info" ? "secondary" : "ghost"}
                  className={`flex items-center justify-start w-full ${activeTab === "profile-info" ? "bg-primary bg-opacity-10 text-primary" : ""}`}
                  onClick={() => setActiveTab("profile-info")}
                >
                  <i className="fas fa-user mr-3"></i>
                  <span>Personal Information</span>
                </Button>
                <Button 
                  variant={activeTab === "account-settings" ? "secondary" : "ghost"}
                  className="flex items-center justify-start w-full"
                  onClick={() => setActiveTab("account-settings")}
                >
                  <i className="fas fa-cog mr-3"></i>
                  <span>Account Settings</span>
                </Button>
                <Button 
                  variant={activeTab === "notification-settings" ? "secondary" : "ghost"}
                  className="flex items-center justify-start w-full"
                  onClick={() => setActiveTab("notification-settings")}
                >
                  <i className="fas fa-bell mr-3"></i>
                  <span>Notifications</span>
                </Button>
                <Button 
                  variant={activeTab === "privacy-settings" ? "secondary" : "ghost"}
                  className="flex items-center justify-start w-full"
                  onClick={() => setActiveTab("privacy-settings")}
                >
                  <i className="fas fa-shield-alt mr-3"></i>
                  <span>Privacy</span>
                </Button>
              </CardContent>
            </Card>
          </div>
          
          {/* Main Profile Content */}
          <div className="lg:col-span-2">
            {activeTab === "profile-info" && (
              <Card>
                <CardHeader className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                </CardHeader>
                <CardContent className="p-6">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name</FormLabel>
                              <FormControl>
                                <Input placeholder="First name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Last Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Last name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Address</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="Email address" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="avatarUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Profile Picture URL</FormLabel>
                              <FormControl>
                                <Input placeholder="URL to your profile picture" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="bio"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bio</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Tell the community about yourself" 
                                rows={4}
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Location</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. Addis Ababa, Ethiopia" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="website"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Website</FormLabel>
                              <FormControl>
                                <Input 
                                  type="url" 
                                  placeholder="e.g. https://yourwebsite.com" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="flex justify-end">
                        <Button 
                          type="submit"
                          disabled={updateProfileMutation.isPending}
                          className="bg-primary text-white font-semibold hover:bg-indigo-700 transition duration-300"
                        >
                          {updateProfileMutation.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            "Save Changes"
                          )}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            )}
            
            {activeTab === "account-settings" && (
              <Card>
                <CardHeader className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Account Settings</h3>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-gray-600 mb-4">
                    Manage your account settings and preferences.
                  </p>
                  <p className="text-gray-600">
                    This section is under development. Please check back later.
                  </p>
                </CardContent>
              </Card>
            )}
            
            {activeTab === "notification-settings" && (
              <Card>
                <CardHeader className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Notification Settings</h3>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-gray-600 mb-4">
                    Configure your notification preferences.
                  </p>
                  <p className="text-gray-600">
                    This section is under development. Please check back later.
                  </p>
                </CardContent>
              </Card>
            )}
            
            {activeTab === "privacy-settings" && (
              <Card>
                <CardHeader className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Privacy Settings</h3>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-gray-600 mb-4">
                    Manage your privacy settings and data.
                  </p>
                  <p className="text-gray-600">
                    This section is under development. Please check back later.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
