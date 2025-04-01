import { Link } from "wouter";
import { 
  Card, 
  CardContent
} from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";

export function BlogCard({ 
  blog, 
  author, 
  showActions = false,
  onEdit,
  onDelete
}) {
  const formattedDate = formatDistanceToNow(new Date(blog.createdAt), { addSuffix: true });
  
  const getCategoryStyle = (category) => {
    const categories = {
      "Web Dev": { bg: "bg-green-50", text: "text-secondary" },
      "Mobile Dev": { bg: "bg-indigo-50", text: "text-primary" },
      "AI": { bg: "bg-amber-50", text: "text-accent" },
      "Fintech": { bg: "bg-indigo-50", text: "text-primary" },
      "Cloud": { bg: "bg-green-50", text: "text-secondary" },
      "Security": { bg: "bg-red-50", text: "text-error" },
      "E-commerce": { bg: "bg-amber-50", text: "text-accent" },
      "Education": { bg: "bg-amber-50", text: "text-accent" },
      "DevOps": { bg: "bg-green-50", text: "text-secondary" },
      "UX/UI": { bg: "bg-amber-50", text: "text-accent" },
      "Remote Work": { bg: "bg-green-50", text: "text-secondary" },
      "Startup": { bg: "bg-indigo-50", text: "text-primary" },
      "Backend": { bg: "bg-indigo-50", text: "text-primary" }
    };
    
    return categories[category] || { bg: "bg-gray-50", text: "text-gray-700" };
  };
  
  const { bg, text } = getCategoryStyle(blog.category);
  
  return (
    <Card className="h-full overflow-hidden transition-shadow duration-300 hover:shadow-lg">
      <div className="h-48 overflow-hidden">
        <img 
          src={blog.imageUrl || `https://source.unsplash.com/random/800x600?${blog.category.toLowerCase().replace(/ /g, ',')}`} 
          alt={blog.title}
          className="w-full h-full object-cover"
        />
      </div>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-2">
          <span className={`text-xs font-medium ${text} ${bg} px-2 py-1 rounded-full`}>
            {blog.category}
          </span>
          <span className="text-xs text-gray-500">{formattedDate}</span>
        </div>
        <h3 className="text-xl font-semibold mb-2">{blog.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-3">
          {blog.content}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img 
              src={author?.avatarUrl || `https://ui-avatars.com/api/?name=${author?.username || 'Anonymous'}`} 
              className="w-8 h-8 rounded-full mr-3" 
              alt={author?.username || 'Anonymous'} 
            />
            <span className="text-sm font-medium text-gray-900">{author?.username || 'Anonymous'}</span>
          </div>
          {showActions ? (
            <div className="flex space-x-2">
              {onEdit && (
                <button 
                  onClick={() => onEdit(blog.id)} 
                  className="text-primary hover:text-indigo-700"
                >
                  <i className="fas fa-edit"></i>
                </button>
              )}
              {onDelete && (
                <button 
                  onClick={() => onDelete(blog.id)} 
                  className="text-error hover:text-red-700"
                >
                  <i className="fas fa-trash-alt"></i>
                </button>
              )}
            </div>
          ) : (
            <Link href={`/blog/${blog.id}`}>
              <a className="text-primary hover:text-indigo-700 font-medium text-sm">Read more</a>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}