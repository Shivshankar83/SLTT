import React,{ useState, useEffect } from 'react';
import { Search, Calendar, User, Clock, Tag, ChevronRight, ChevronLeft, Filter } from 'lucide-react';
import Footer from './Footer';
import CommonNavbar from './CommonNavbar';
const Blogs = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const postsPerPage = 6;

  // Sample blog data
  const blogPosts = [
    {
      id: 1,
      title: "How to Build a Responsive Website That Converts",
      excerpt: "Learn the essential elements of responsive web design that not only look great but also drive conversions and improve user experience.",
      category: "web-design",
      categoryLabel: "Web Design",
      author: "Alex Johnson",
      date: "April 24, 2025",
      readTime: "8 min read",
      image: "/api/placeholder/800/500",
      featured: true,
      tags: ["Responsive Design", "UX", "Conversion"]
    },
    {
      id: 2,
      title: "The Future of E-commerce: Trends to Watch in 2025",
      excerpt: "Discover the emerging technologies and strategies shaping the future of online retail and how businesses can stay ahead of the curve.",
      category: "e-commerce",
      categoryLabel: "E-commerce",
      author: "Sarah Miller",
      date: "April 18, 2025",
      readTime: "12 min read",
      image: "/api/placeholder/800/500",
      featured: true,
      tags: ["E-commerce", "Trends", "Retail Tech"]
    },
    {
      id: 3,
      title: "SEO Strategies That Actually Work in Today's Algorithm",
      excerpt: "Cut through the noise with proven SEO techniques that align with current search engine algorithms and deliver sustainable results.",
      category: "digital-marketing",
      categoryLabel: "Digital Marketing",
      author: "Michael Chen",
      date: "April 15, 2025",
      readTime: "10 min read",
      image: "/api/placeholder/800/500",
      featured: false,
      tags: ["SEO", "Digital Marketing", "Content Strategy"]
    },
    {
      id: 4,
      title: "Mobile App Development: Native vs Cross-Platform in 2025",
      excerpt: "An in-depth analysis of the pros and cons of native and cross-platform development approaches for modern mobile applications.",
      category: "app-development",
      categoryLabel: "App Development",
      author: "Jessica Torres",
      date: "April 10, 2025",
      readTime: "15 min read",
      image: "/api/placeholder/800/500",
      featured: false,
      tags: ["Mobile Apps", "Cross-Platform", "Development"]
    },
    {
      id: 5,
      title: "How AI is Transforming Web Development",
      excerpt: "Explore the revolutionary impact of artificial intelligence on web development practices and what it means for developers and businesses.",
      category: "technology",
      categoryLabel: "Technology",
      author: "David Kumar",
      date: "April 5, 2025",
      readTime: "9 min read",
      image: "/api/placeholder/800/500",
      featured: false,
      tags: ["AI", "Web Development", "Innovation"]
    },
    {
      id: 6,
      title: "Creating Accessible Websites: A Comprehensive Guide",
      excerpt: "Learn best practices for developing websites that are accessible to all users, including those with disabilities.",
      category: "web-design",
      categoryLabel: "Web Design",
      author: "Emily Washington",
      date: "March 29, 2025",
      readTime: "11 min read",
      image: "/api/placeholder/800/500",
      featured: false,
      tags: ["Accessibility", "Inclusive Design", "Web Standards"]
    },
    {
      id: 7,
      title: "The Psychology of Color in Web Design",
      excerpt: "Understand how color choices impact user perception and behavior on your website, and how to use this knowledge strategically.",
      category: "web-design",
      categoryLabel: "Web Design",
      author: "Ryan Park",
      date: "March 25, 2025",
      readTime: "7 min read",
      image: "/api/placeholder/800/500",
      featured: false,
      tags: ["Color Theory", "Psychology", "Design"]
    },
    {
      id: 8,
      title: "Building a Successful Content Marketing Strategy",
      excerpt: "A step-by-step approach to developing a content marketing strategy that attracts, engages, and converts your target audience.",
      category: "digital-marketing",
      categoryLabel: "Digital Marketing",
      author: "Olivia Martinez",
      date: "March 20, 2025",
      readTime: "14 min read",
      image: "/api/placeholder/800/500",
      featured: false,
      tags: ["Content Marketing", "Strategy", "Audience Engagement"]
    },
    {
      id: 9,
      title: "Cybersecurity Best Practices for Small Businesses",
      excerpt: "Essential security measures that small businesses should implement to protect their digital assets and customer data.",
      category: "technology",
      categoryLabel: "Technology",
      author: "Thomas Wilson",
      date: "March 15, 2025",
      readTime: "10 min read",
      image: "/api/placeholder/800/500",
      featured: false,
      tags: ["Cybersecurity", "Small Business", "Data Protection"]
    },
    {
      id: 10,
      title: "Optimizing Website Performance for Core Web Vitals",
      excerpt: "Practical tips for improving your site's Core Web Vitals scores and delivering a better user experience.",
      category: "web-development",
      categoryLabel: "Web Development",
      author: "Lisa Johnson",
      date: "March 10, 2025",
      readTime: "13 min read",
      image: "/api/placeholder/800/500",
      featured: false,
      tags: ["Performance", "Core Web Vitals", "User Experience"]
    }
  ];

  // Get unique categories for filter options
  const categories = [
    { id: 'all', label: 'All Posts' },
    ...Array.from(new Set(blogPosts.map(post => post.category)))
      .map(category => ({
        id: category,
        label: blogPosts.find(post => post.category === category).categoryLabel
      }))
  ];

  // Filter blogs based on category and search query
  const filteredBlogs = blogPosts.filter(post => {
    const matchesCategory = activeCategory === 'all' || post.category === activeCategory;
    const matchesSearch = searchQuery === '' || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  // Featured posts (for hero section)
  const featuredPosts = blogPosts.filter(post => post.featured);

  // Pagination logic
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredBlogs.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredBlogs.length / postsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, searchQuery]);

  return (
    <>
    <div className="bg-gray-50">
      <CommonNavbar />  
      {/* Hero Section with Featured Posts */}
      <div className="relative bg-gradient-to-r from-blue-800 to-indigo-900 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-blue-900 opacity-70"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-transparent opacity-20"></div>
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black opacity-40"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Blog</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Insights, strategies, and industry expertise to help your business thrive in the digital landscape
            </p>
          </div>
          
          {featuredPosts.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {featuredPosts.slice(0, 2).map((post) => (
                <div key={post.id} className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 group">
                  <div className="relative h-56 overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                        Featured
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <span className="inline-block bg-blue-100 bg-opacity-20 text-blue-100 text-sm font-medium px-3 py-1 rounded-full mb-3">
                      {post.categoryLabel}
                    </span>
                    <h2 className="text-xl font-bold mb-3 group-hover:text-blue-300 transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-blue-100 mb-4">{post.excerpt}</p>
                    <div className="flex items-center text-sm text-blue-200">
                      <User className="h-4 w-4 mr-1" />
                      <span className="mr-4">{post.author}</span>
                      <Calendar className="h-4 w-4 mr-1" />
                      <span className="mr-4">{post.date}</span>
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{post.readTime}</span>
                    </div>
                    <div className="mt-6">
                      <a href={`/blog/${post.id}`} className="inline-flex items-center text-blue-200 hover:text-white font-medium">
                        Read Article
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Search and Filter */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-10">
          <div className="relative w-full lg:max-w-lg mb-6 lg:mb-0">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search articles..."
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="lg:ml-4">
            <button
              className="flex items-center text-gray-700 hover:text-blue-600 lg:hidden mb-4"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-5 w-5 mr-2" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
            
            <div className={`bg-white p-3 rounded-lg shadow-sm flex flex-wrap gap-2 ${showFilters ? 'block' : 'hidden lg:flex'}`}>
              {categories.map((category) => (
                <button
                  key={category.id}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                    activeCategory === category.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => setActiveCategory(category.id)}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Blog Posts Grid */}
        {currentPosts.length === 0 ? (
          <div className="text-center py-16">
            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No articles found</h3>
            <p className="mt-2 text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
            <div className="mt-6">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Clear all filters
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentPosts.map((post) => (
                <div key={post.id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                        {post.categoryLabel}
                      </span>
                    </div>
                  </div>
                  <div className="p-6 flex-grow flex flex-col">
                    <h2 className="text-xl font-bold mb-3 text-gray-900 hover:text-blue-600 transition-colors">
                      <a href={`/blog/${post.id}`}>{post.title}</a>
                    </h2>
                    <p className="text-gray-600 mb-4 flex-grow">{post.excerpt}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag, index) => (
                        <span 
                          key={index} 
                          className="inline-flex items-center text-xs font-medium text-gray-600 bg-gray-100 px-2.5 py-0.5 rounded-full"
                        >
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center text-sm text-gray-500 justify-between">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                  </div>
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">{post.date}</span>
                      <a 
                        href={`/blog/${post.id}`}
                        className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
                      >
                        Read More
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center">
                <nav className="inline-flex rounded-md shadow">
                  <button
                    onClick={() => paginate(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${
                      currentPage === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <ChevronLeft className="h-5 w-5" />
                    <span className="sr-only">Previous</span>
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                    <button
                      key={number}
                      onClick={() => paginate(number)}
                      className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium ${
                        currentPage === number
                          ? 'z-10 bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {number}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${
                      currentPage === totalPages
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">Next</span>
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
        
        {/* Newsletter Subscription */}
        <div className="mt-20 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-12 md:p-12 md:flex md:items-center md:justify-between">
            <div className="max-w-2xl">
              <h3 className="text-2xl font-bold text-white">Subscribe to our newsletter</h3>
              <p className="mt-3 text-blue-100">
                Get the latest articles, resources, and insights delivered to your inbox.
              </p>
            </div>
            <div className="mt-8 md:mt-0 md:ml-6 w-full max-w-md">
              <form className="sm:flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-5 py-3 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-700 focus:ring-white rounded-md"
                  required
                />
                <button
                  type="submit"
                  className="mt-3 sm:mt-0 sm:ml-3 w-full sm:w-auto flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-white"
                >
                  Subscribe
                </button>
              </form>
              <p className="mt-3 text-sm text-blue-200">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
};

export default Blogs;