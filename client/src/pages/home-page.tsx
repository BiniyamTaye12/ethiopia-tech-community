import { useQuery } from "@tanstack/react-query";
import { BlogPost, User } from "@shared/schema";
import { Link } from "wouter";
import MainLayout from "@/components/layouts/main-layout";
import { BlogCard } from "@/components/ui/blog-card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function HomePage() {
  // Fetch recent blog posts
  const { data: posts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/posts"],
  });

  return (
    <MainLayout>
      <div className="flex flex-col space-y-12">
        {/* Hero Section */}
        <section className="bg-primary rounded-2xl overflow-hidden shadow-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 text-center md:text-left mb-8 md:mb-0">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ethiopia's Tech Community
              </h1>
              <p className="text-indigo-100 text-lg md:text-xl mb-8 max-w-2xl">
                Connect with Ethiopia's brightest tech minds. Share knowledge, discover opportunities, and grow together.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center md:justify-start">
                <Link href="/blog">
                  <Button variant="secondary" className="bg-white text-primary hover:bg-gray-100">
                    Explore Blogs
                  </Button>
                </Link>
                <Link href="/auth">
                  <Button variant="outline" className="bg-indigo-800 text-white hover:bg-indigo-700 border-0">
                    Join the Community
                  </Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center md:justify-end">
              <img 
                src="https://images.unsplash.com/photo-1603201667141-5a2d4c673378?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=700&q=80"
                className="rounded-xl shadow-md max-w-full h-auto" 
                alt="Tech community meeting" 
                width="500" 
                height="300"
              />
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-lg text-gray-600 mb-8">
              To foster innovation, collaboration, and knowledge sharing among Ethiopia's growing tech community, 
              empowering the next generation of developers, entrepreneurs, and tech enthusiasts.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-primary text-4xl mb-4">
                  <i className="fas fa-lightbulb"></i>
                </div>
                <h3 className="text-xl font-semibold mb-2">Innovation</h3>
                <p className="text-gray-600">Driving technological advancement through creative problem-solving.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-secondary text-4xl mb-4">
                  <i className="fas fa-users"></i>
                </div>
                <h3 className="text-xl font-semibold mb-2">Community</h3>
                <p className="text-gray-600">Building a supportive network of tech professionals and enthusiasts.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-accent text-4xl mb-4">
                  <i className="fas fa-graduation-cap"></i>
                </div>
                <h3 className="text-xl font-semibold mb-2">Education</h3>
                <p className="text-gray-600">Sharing knowledge and resources to empower continuous learning.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Blogs Section */}
        <section className="py-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Recent Blog Posts</h2>
              <Link href="/blog">
                <a className="text-primary hover:text-indigo-700 font-medium flex items-center">
                  View all <i className="fas fa-arrow-right ml-2"></i>
                </a>
              </Link>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : posts && posts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.slice(0, 3).map((post) => (
                  <BlogCard key={post.id} blog={post} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-md">
                <p className="text-gray-600">No blog posts available yet. Be the first to contribute!</p>
                <Link href="/auth">
                  <Button className="mt-4">Join and Start Writing</Button>
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Community Stats Section */}
        <section className="bg-white py-12 rounded-lg shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-12">Our Growing Community</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <p className="text-4xl font-bold text-primary mb-2">5,000+</p>
                <p className="text-gray-600">Members</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-primary mb-2">1,200+</p>
                <p className="text-gray-600">Blog Posts</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-primary mb-2">35+</p>
                <p className="text-gray-600">Tech Events</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-primary mb-2">120+</p>
                <p className="text-gray-600">Companies</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gray-900 text-white rounded-2xl overflow-hidden shadow-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to join Ethiopia's tech revolution?</h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Whether you're a seasoned developer, a tech enthusiast, or just starting your journey,
              there's a place for you in our community.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
              <Link href="/auth">
                <Button className="bg-primary text-white hover:bg-indigo-700">
                  Sign Up Now
                </Button>
              </Link>
              <Link href="/blog">
                <Button variant="outline" className="bg-transparent border border-white text-white hover:bg-white hover:text-gray-900">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
