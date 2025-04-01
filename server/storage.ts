import { 
  User, 
  InsertUser, 
  BlogPost, 
  InsertBlogPost, 
  UpdateBlogPost,
  UpdateUser
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<UpdateUser>): Promise<User>;
  
  // Blog post methods
  getAllBlogPosts(): Promise<BlogPost[]>;
  getBlogPost(id: number): Promise<BlogPost | undefined>;
  getBlogPostsByAuthor(authorId: number): Promise<BlogPost[]>;
  createBlogPost(post: InsertBlogPost & { authorId: number }): Promise<BlogPost>;
  updateBlogPost(id: number, post: Partial<UpdateBlogPost>): Promise<BlogPost>;
  deleteBlogPost(id: number): Promise<void>;
  incrementPostViews(id: number): Promise<void>;
  
  // Session store
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private blogPosts: Map<number, BlogPost>;
  sessionStore: session.Store;
  private userIdCounter: number;
  private blogPostIdCounter: number;

  constructor() {
    this.users = new Map();
    this.blogPosts = new Map();
    this.userIdCounter = 1;
    this.blogPostIdCounter = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
  }

  async createUser(userData: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    
    const user: User = {
      id,
      ...userData,
      firstName: userData.firstName || null,
      lastName: userData.lastName || null,
      bio: null,
      location: null,
      website: null,
      avatarUrl: null
    };
    
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, userData: Partial<UpdateUser>): Promise<User> {
    const user = await this.getUser(id);
    if (!user) {
      throw new Error("User not found");
    }
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Blog post methods
  async getAllBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values())
      .filter(post => post.status === "published")
      .sort((a, b) => {
        // Sort by createdAt descending (most recent first)
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }

  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    return this.blogPosts.get(id);
  }

  async getBlogPostsByAuthor(authorId: number): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values())
      .filter(post => post.authorId === authorId)
      .sort((a, b) => {
        // Sort by createdAt descending (most recent first)
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }

  async createBlogPost(postData: InsertBlogPost & { authorId: number }): Promise<BlogPost> {
    const id = this.blogPostIdCounter++;
    const now = new Date();
    
    const post: BlogPost = {
      id,
      ...postData,
      createdAt: now,
      updatedAt: now,
      views: 0,
      imageUrl: postData.imageUrl || null
    };
    
    this.blogPosts.set(id, post);
    return post;
  }

  async updateBlogPost(id: number, postData: Partial<UpdateBlogPost>): Promise<BlogPost> {
    const post = await this.getBlogPost(id);
    if (!post) {
      throw new Error("Blog post not found");
    }
    
    const updatedPost: BlogPost = {
      ...post,
      ...postData,
      updatedAt: new Date()
    };
    
    this.blogPosts.set(id, updatedPost);
    return updatedPost;
  }

  async deleteBlogPost(id: number): Promise<void> {
    if (!this.blogPosts.has(id)) {
      throw new Error("Blog post not found");
    }
    
    this.blogPosts.delete(id);
  }

  async incrementPostViews(id: number): Promise<void> {
    const post = await this.getBlogPost(id);
    if (!post) {
      throw new Error("Blog post not found");
    }
    
    post.views += 1;
    this.blogPosts.set(id, post);
  }
}

export const storage = new MemStorage();
