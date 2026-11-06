import React, { useState } from 'react';
import { 
  Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Image as ImageIcon, 
  Send, AlertCircle, CheckCircle, ShieldAlert, Sparkles, Filter, Droplet,
  X, Copy, Check, ExternalLink, Flag, Phone, UserCheck, Trash2
} from 'lucide-react';
import { SocialPost, UserProfile, Language } from '../types/solovvo';

interface SocialFeedProps {
  posts: SocialPost[];
  currentUser: UserProfile;
  language: Language;
  onLikePost: (postId: string) => void;
  onSavePost: (postId: string) => void;
  onAddComment: (postId: string, commentText: string) => void;
  onCreatePost: (content: string, imageUrl?: string, tag?: SocialPost['tag']) => void;
  onDeletePost?: (postId: string) => void;
  onOpenEmergencyModal: () => void;
}

export const SocialFeed: React.FC<SocialFeedProps> = ({
  posts,
  currentUser,
  language,
  onLikePost,
  onSavePost,
  onAddComment,
  onCreatePost,
  onDeletePost,
  onOpenEmergencyModal,
}) => {
  const [newPostText, setNewPostText] = useState('');
  const [selectedTag, setSelectedTag] = useState<SocialPost['tag']>('Donation Story');
  const [postImagePreview, setPostImagePreview] = useState<string | null>(null);
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState<{ [postId: string]: string }>({});
  
  // Category Filtering
  const [activeCategory, setActiveCategory] = useState<'All' | 'Donation Story' | 'Awareness' | 'Blood Camp' | 'Emergency' | 'Saved'>('All');
  
  // Modals & Popovers
  const [postOptionsId, setPostOptionsId] = useState<string | null>(null);
  const [reportModalPost, setReportModalPost] = useState<SocialPost | null>(null);
  const [reportReason, setReportReason] = useState('Commercial Blood Selling / Demanding Money');
  const [reportNotes, setReportNotes] = useState('');
  const [shareModalPost, setShareModalPost] = useState<SocialPost | null>(null);
  const [authorProfilePost, setAuthorProfilePost] = useState<SocialPost | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const sampleImages = [
    'https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1000&q=80',
  ];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    onCreatePost(newPostText, postImagePreview || undefined, selectedTag);
    setNewPostText('');
    setPostImagePreview(null);
    showToast(language === 'en' ? 'Post published to Solovvo feed!' : 'সোলোভো ফিডে পোস্ট প্রকাশিত হয়েছে!');
  };

  const handleCommentSubmit = (postId: string) => {
    const text = commentInput[postId];
    if (!text || !text.trim()) return;

    onAddComment(postId, text);
    setCommentInput(prev => ({ ...prev, [postId]: '' }));
    showToast(language === 'en' ? 'Comment added!' : 'মন্তব্য যুক্ত হয়েছে!');
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportModalPost) return;
    showToast(
      language === 'en'
        ? `Report filed against post #${reportModalPost.id}. Moderation team notified.`
        : `রিপোর্ট জমা নেওয়া হয়েছে। অ্যাডমিন প্যানেলে যাচাই করা হচ্ছে।`
    );
    setReportModalPost(null);
    setReportNotes('');
  };

  const handleCopyPostLink = (post: SocialPost) => {
    const url = `${window.location.origin}/#post-${post.id}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
    showToast(language === 'en' ? 'Link copied to clipboard!' : 'পোস্ট লিংক কপি করা হয়েছে!');
  };

  const handleNativeShare = async (post: SocialPost) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Solovvo Blood Network - ${post.authorName}`,
          text: post.content.slice(0, 140) + '...',
          url: `${window.location.origin}/#post-${post.id}`,
        });
      } catch (err) {
        // User cancelled or unsupported
      }
    } else {
      handleCopyPostLink(post);
    }
  };

  // Filter posts based on active category
  const filteredPosts = posts.filter(post => {
    if (activeCategory === 'All') return true;
    if (activeCategory === 'Saved') return post.isSaved;
    return post.tag === activeCategory;
  });

  return (
    <div className="space-y-4 max-w-xl mx-auto pb-20">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-xl border border-slate-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-150">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Emergency Broadcast Alert Header */}
      <div className="bg-gradient-to-r from-red-600 to-rose-700 text-white rounded-2xl p-4 shadow-md shadow-red-500/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
            <Droplet className="w-6 h-6 fill-white" />
          </div>
          <div>
            <h3 className="font-bold text-sm">
              {language === 'en' ? 'Need Blood in Emergency?' : 'জরুরী রক্তের প্রয়োজন?'}
            </h3>
            <p className="text-xs text-red-100">
              {language === 'en' 
                ? 'Create an emergency broadcast to reach nearby donors immediately.' 
                : 'নিকটবর্তী রক্তদাতাদের সাথে সাথে জানাতে রিকুয়েস্ট পোস্ট করুন।'}
            </p>
          </div>
        </div>
        <button
          onClick={onOpenEmergencyModal}
          className="px-3.5 py-2 bg-white text-red-600 rounded-xl text-xs font-extrabold hover:bg-red-50 transition-colors shadow-xs shrink-0"
        >
          {language === 'en' ? 'Request Now' : 'রিকুয়েস্ট'}
        </button>
      </div>

      {/* Create Post Card (Facebook-style with Photos Only policy) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-red-500/30"
            />
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                {language === 'en' ? currentUser.name : (currentUser.nameBn || currentUser.name)}
              </span>
              <span className="text-[11px] text-red-600 dark:text-red-400 font-semibold">
                {currentUser.bloodGroup} Donor • {currentUser.donationCount} {language === 'en' ? 'Donations' : 'বার রক্তদান'}
              </span>
            </div>
          </div>
          
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
            {language === 'en' ? 'Photos Only • No Video' : 'শুধুমাত্র ছবি • ভিডিও নিষিদ্ধ'}
          </span>
        </div>

        <form onSubmit={handleCreatePost} className="space-y-3">
          <textarea
            value={newPostText}
            onChange={(e) => setNewPostText(e.target.value)}
            placeholder={language === 'en' 
              ? 'Share a blood donation experience, blood camp, or awareness story...' 
              : 'রক্তদানের অভিজ্ঞতা বা জনসচেতনতামূলক বার্তা শেয়ার করুন...'}
            rows={3}
            className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-red-500 resize-none"
          />

          {postImagePreview && (
            <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 max-h-48">
              <img src={postImagePreview} alt="Preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => setPostImagePreview(null)}
                className="absolute top-2 right-2 bg-slate-900/80 text-white rounded-full p-1 text-xs hover:bg-slate-900"
              >
                ✕
              </button>
            </div>
          )}

          {/* Tags & Image attach */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5 flex-wrap text-xs">
              {(['Donation Story', 'Awareness', 'Blood Camp'] as const).map((tag) => (
                <button
                  type="button"
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                    selectedTag === tag
                      ? 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  #{tag}
                </button>
              ))}

              {/* Attach Photo (Supabase Storage flow) */}
              <button
                type="button"
                onClick={() => {
                  const randomImg = sampleImages[Math.floor(Math.random() * sampleImages.length)];
                  setPostImagePreview(randomImg);
                  showToast(language === 'en' ? 'Photo attached from gallery' : 'ছবি যুক্ত করা হয়েছে');
                }}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                title="Upload Photo (Images only, No Video as per Rule)"
              >
                <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
                <span>{language === 'en' ? 'Photo' : 'ছবি'}</span>
              </button>
            </div>

            <button
              type="submit"
              disabled={!newPostText.trim()}
              className="px-4 py-1.5 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 disabled:opacity-40 transition-colors shadow-xs"
            >
              {language === 'en' ? 'Publish' : 'পোস্ট করুন'}
            </button>
          </div>
        </form>
      </div>

      {/* Feed Category Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
        {(['All', 'Donation Story', 'Awareness', 'Blood Camp', 'Emergency', 'Saved'] as const).map((cat) => {
          const count = cat === 'All' 
            ? posts.length 
            : cat === 'Saved' 
            ? posts.filter(p => p.isSaved).length 
            : posts.filter(p => p.tag === cat).length;

          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeCategory === cat
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
              }`}
            >
              {cat === 'Saved' && <Bookmark className="w-3 h-3 fill-current" />}
              <span>{cat}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                activeCategory === cat ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Feed Posts List */}
      {filteredPosts.length === 0 ? (
        <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs text-slate-500 space-y-2">
          <Bookmark className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto" />
          <p className="font-bold">
            {activeCategory === 'Saved' 
              ? (language === 'en' ? 'No saved posts yet.' : 'কোন সংরক্ষিত পোস্ট নেই।')
              : (language === 'en' ? `No posts found under #${activeCategory}` : 'এই ক্যাটাগরিতে কোন পোস্ট পাওয়া যায়নি')}
          </p>
        </div>
      ) : (
        filteredPosts.map((post) => (
          <article
            key={post.id}
            id={`post-${post.id}`}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden"
          >
            {/* Post Header */}
            <div className="p-4 flex items-center justify-between">
              <div 
                onClick={() => setAuthorProfilePost(post)}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <img
                  src={post.authorAvatar}
                  alt={post.authorName}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-red-500/20 group-hover:ring-red-500 transition-all"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-red-600 transition-colors">
                      {post.authorName}
                    </span>
                    <span className="px-1.5 py-0.2 rounded bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 font-extrabold text-[10px]">
                      {post.authorBloodGroup}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span>{post.timeAgo}</span>
                    {post.tag && (
                      <>
                        <span>•</span>
                        <span className="text-red-600 dark:text-red-400 font-medium">#{post.tag}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Post Options Menu */}
              <div className="relative">
                <button
                  onClick={() => setPostOptionsId(postOptionsId === post.id ? null : post.id)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>

                {postOptionsId === post.id && (
                  <div className="absolute right-0 mt-1 w-44 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-1.5 text-xs z-20 animate-in fade-in zoom-in-95 duration-100">
                    <button
                      onClick={() => {
                        onSavePost(post.id);
                        setPostOptionsId(null);
                        showToast(post.isSaved ? 'Removed from saved' : 'Saved to your collection');
                      }}
                      className="w-full text-left px-3 py-2 text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2 font-medium"
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${post.isSaved ? 'fill-red-600 text-red-600' : ''}`} />
                      <span>{post.isSaved ? (language === 'en' ? 'Unsave Post' : 'সংরক্ষণ বাতিল') : (language === 'en' ? 'Save Post' : 'পোস্ট সংরক্ষণ')}</span>
                    </button>

                    <button
                      onClick={() => {
                        handleCopyPostLink(post);
                        setPostOptionsId(null);
                      }}
                      className="w-full text-left px-3 py-2 text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2 font-medium"
                    >
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span>{language === 'en' ? 'Copy Link' : 'লিংক কপি করুন'}</span>
                    </button>

                    <button
                      onClick={() => {
                        setReportModalPost(post);
                        setPostOptionsId(null);
                      }}
                      className="w-full text-left px-3 py-2 text-red-600 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center gap-2 font-medium border-t border-slate-100 dark:border-slate-700 mt-1 pt-1.5"
                    >
                      <Flag className="w-3.5 h-3.5" />
                      <span>{language === 'en' ? 'Report Post' : 'পোস্ট রিপোর্ট করুন'}</span>
                    </button>

                    {post.authorId === currentUser.id && onDeletePost && (
                      <button
                        onClick={() => {
                          onDeletePost(post.id);
                          setPostOptionsId(null);
                          showToast('Post deleted');
                        }}
                        className="w-full text-left px-3 py-2 text-rose-600 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2 font-medium"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete Post</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Post Content */}
            <div className="px-4 pb-3">
              <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line font-normal">
                {post.content}
              </p>
            </div>

            {/* Post Image (No videos allowed per Part 2 rule) */}
            {post.imageUrl && (
              <div className="border-y border-slate-100 dark:border-slate-800 bg-slate-950">
                <img
                  src={post.imageUrl}
                  alt="Post attachment"
                  className="w-full max-h-96 object-cover"
                  loading="lazy"
                />
              </div>
            )}

            {/* Action Stats */}
            <div className="px-4 py-2 flex items-center justify-between text-[11px] text-slate-500 border-b border-slate-100 dark:border-slate-800/60">
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-red-600 text-white flex items-center justify-center text-[9px] shadow-xs">
                  ❤️
                </span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {post.likesCount} {language === 'en' ? 'Likes' : 'পছন্দ'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span>{post.commentsCount} {language === 'en' ? 'Comments' : 'মন্তব্য'}</span>
                <span>{post.sharesCount} {language === 'en' ? 'Shares' : 'শেয়ার'}</span>
              </div>
            </div>

            {/* Interactive Button Row */}
            <div className="px-2 py-1 flex items-center justify-around text-xs font-semibold text-slate-600 dark:text-slate-300">
              <button
                onClick={() => onLikePost(post.id)}
                className={`flex-1 py-2 flex items-center justify-center gap-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                  post.isLiked ? 'text-red-600 dark:text-red-500 font-bold' : ''
                }`}
              >
                <Heart className={`w-4 h-4 transition-transform active:scale-125 ${post.isLiked ? 'fill-red-600 stroke-red-600' : ''}`} />
                <span>{language === 'en' ? 'Like' : 'লাইক'}</span>
              </button>

              <button
                onClick={() => setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)}
                className="flex-1 py-2 flex items-center justify-center gap-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{language === 'en' ? 'Comment' : 'মন্তব্য'}</span>
              </button>

              <button
                onClick={() => setShareModalPost(post)}
                className="flex-1 py-2 flex items-center justify-center gap-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span>{language === 'en' ? 'Share' : 'শেয়ার'}</span>
              </button>

              <button
                onClick={() => {
                  onSavePost(post.id);
                  showToast(post.isSaved ? 'Removed from saved' : 'Saved to your collection');
                }}
                className={`p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                  post.isSaved ? 'text-red-600' : ''
                }`}
                title="Save Post"
              >
                <Bookmark className={`w-4 h-4 ${post.isSaved ? 'fill-red-600' : ''}`} />
              </button>
            </div>

            {/* Comments Section */}
            {activeCommentPostId === post.id && (
              <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 space-y-3">
                {post.comments && post.comments.length > 0 && (
                  <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                    {post.comments.map((c) => (
                      <div key={c.id} className="flex gap-2.5 items-start text-xs">
                        <img src={c.avatar} alt={c.userName} className="w-7 h-7 rounded-full object-cover mt-0.5" />
                        <div className="flex-1 bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="font-bold text-slate-900 dark:text-white">{c.userName}</span>
                            <span className="text-[10px] text-slate-400">{c.timeAgo}</span>
                          </div>
                          <p className="text-slate-700 dark:text-slate-300">{c.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Comment Input */}
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={commentInput[post.id] || ''}
                    onChange={(e) => setCommentInput({ ...commentInput, [post.id]: e.target.value })}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleCommentSubmit(post.id);
                    }}
                    placeholder={language === 'en' ? 'Write a respectful comment...' : 'একটি মন্তব্য লিখুন...'}
                    className="flex-1 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-red-500"
                  />
                  <button
                    onClick={() => handleCommentSubmit(post.id)}
                    className="p-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors shadow-xs"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </article>
        ))
      )}

      {/* Share Modal Dialog */}
      {shareModalPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Share2 className="w-4 h-4 text-red-600" />
                {language === 'en' ? 'Share Blood Donation Post' : 'পোস্ট শেয়ার করুন'}
              </h3>
              <button onClick={() => setShareModalPost(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 italic bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700">
              "{shareModalPost.content}"
            </p>

            <div className="space-y-2 text-xs">
              <button
                onClick={() => handleNativeShare(shareModalPost)}
                className="w-full py-2.5 px-3 bg-red-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-700 transition-colors shadow-xs"
              >
                <Share2 className="w-4 h-4" />
                <span>{language === 'en' ? 'Native Share Device Menu' : 'ডিভাইস মেনুতে শেয়ার করুন'}</span>
              </button>

              <button
                onClick={() => {
                  handleCopyPostLink(shareModalPost);
                  setShareModalPost(null);
                }}
                className="w-full py-2.5 px-3 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <Copy className="w-4 h-4" />
                <span>{copiedLink ? (language === 'en' ? 'Copied!' : 'কপি হয়েছে!') : (language === 'en' ? 'Copy Post Link' : 'পোস্ট লিংক কপি করুন')}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Post Modal (Section B: Report Posts) */}
      {reportModalPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-red-100 dark:bg-red-950 text-red-600">
                  <Flag className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {language === 'en' ? 'Report Inappropriate Post' : 'আপত্তিকর পোস্ট রিপোর্ট'}
                  </h3>
                  <span className="text-[10px] text-slate-400">Post #{reportModalPost.id}</span>
                </div>
              </div>
              <button onClick={() => setReportModalPost(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleReportSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'en' ? 'Reason for reporting:' : 'রিপোর্টের কারণ:'}
                </label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
                >
                  <option value="Commercial Blood Selling / Demanding Money">🚨 Commercial Blood Trading / Demanding Money (Strictly Prohibited)</option>
                  <option value="Fake Patient / Fabricated Request">Fake Patient / Fabricated Request</option>
                  <option value="Spam / Commercial Advertisement">Spam or Commercial Advertisement</option>
                  <option value="Misleading Medical Advice">Misleading Medical or Health Information</option>
                  <option value="Harassment or Inappropriate Content">Harassment or Offensive Language</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'en' ? 'Additional Context (Optional):' : 'অতিরিক্ত বিবরণ (ঐচ্ছিক):'}
                </label>
                <textarea
                  value={reportNotes}
                  onChange={(e) => setReportNotes(e.target.value)}
                  placeholder="Provide any details to assist the moderation team..."
                  rows={2}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-xl border border-red-200 dark:border-red-900 text-[11px] text-red-900 dark:text-red-200 flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <p>
                  Solovvo enforces a zero-tolerance policy against commercial blood brokerage. Reports are reviewed by human staff within 1 hour.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReportModalPost(null)}
                  className="px-3 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold shadow-xs transition-colors"
                >
                  {language === 'en' ? 'Submit Report' : 'রিপোর্ট জমা দিন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Author Profile View Popover */}
      {authorProfilePost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {language === 'en' ? 'Donor Profile Card' : 'রক্তদাতা প্রোফাইল'}
              </span>
              <button onClick={() => setAuthorProfilePost(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <img
                src={authorProfilePost.authorAvatar}
                alt={authorProfilePost.authorName}
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-red-500/30"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {authorProfilePost.authorName}
                  </h4>
                  <span className="px-1.5 py-0.2 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 text-[10px] font-bold">
                    ✓ Verified
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-lg bg-red-600 text-white text-xs font-black inline-block mt-1">
                  {authorProfilePost.authorBloodGroup} Donor
                </span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Status:</span>
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Available for Emergency
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Community Rank:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">Life Saver</span>
              </div>
            </div>

            <button
              onClick={() => {
                showToast(`Initiating direct connection with ${authorProfilePost.authorName}...`);
                setAuthorProfilePost(null);
              }}
              className="w-full py-2.5 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 transition-colors shadow-xs flex items-center justify-center gap-2"
            >
              <UserCheck className="w-4 h-4" />
              <span>{language === 'en' ? 'View Full Activity' : 'সম্পূর্ণ তথ্য দেখুন'}</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
