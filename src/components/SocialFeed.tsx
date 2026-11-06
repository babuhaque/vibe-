import React, { useState } from 'react';
import { 
  Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Image as ImageIcon, 
  Send, AlertCircle, CheckCircle, ShieldAlert, Sparkles, Filter, Droplet
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
  onOpenEmergencyModal,
}) => {
  const [newPostText, setNewPostText] = useState('');
  const [selectedTag, setSelectedTag] = useState<SocialPost['tag']>('Donation Story');
  const [postImagePreview, setPostImagePreview] = useState<string | null>(null);
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState<{ [postId: string]: string }>({});
  const [reportedPostId, setReportedPostId] = useState<string | null>(null);

  const sampleImages = [
    'https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1000&q=80',
  ];

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    onCreatePost(newPostText, postImagePreview || undefined, selectedTag);
    setNewPostText('');
    setPostImagePreview(null);
  };

  const handleCommentSubmit = (postId: string) => {
    const text = commentInput[postId];
    if (!text || !text.trim()) return;

    onAddComment(postId, text);
    setCommentInput(prev => ({ ...prev, [postId]: '' }));
  };

  return (
    <div className="space-y-4 max-w-xl mx-auto pb-20">
      
      {/* Emergency Banner Alert */}
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

      {/* Create Post Card (Facebook-style) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex items-center gap-3">
          <img
            src={currentUser.avatarUrl}
            alt={currentUser.name}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-red-500/30"
          />
          <div className="flex-1">
            <span className="text-xs font-bold text-slate-900 dark:text-white block">
              {language === 'en' ? currentUser.name : (currentUser.nameBn || currentUser.name)}
            </span>
            <span className="text-[11px] text-red-600 dark:text-red-400 font-semibold">
              {currentUser.bloodGroup} Donor • {currentUser.donationCount} {language === 'en' ? 'Donations' : 'বার রক্তদান'}
            </span>
          </div>
        </div>

        <form onSubmit={handleCreatePost} className="space-y-3">
          <textarea
            value={newPostText}
            onChange={(e) => setNewPostText(e.target.value)}
            placeholder={language === 'en' 
              ? 'Share a blood donation experience, camp announcement, or awareness message...' 
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
                }}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                title="Upload Photo (Images only, No Video as per Rule)"
              >
                <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
                <span>{language === 'en' ? 'Add Photo' : 'ছবি যুক্ত'}</span>
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

      {/* Feed Posts List */}
      {posts.map((post) => (
        <article
          key={post.id}
          className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden"
        >
          {/* Post Header */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={post.authorAvatar}
                alt={post.authorName}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-red-500/20"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
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
                onClick={() => setReportedPostId(reportedPostId === post.id ? null : post.id)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>

              {reportedPostId === post.id && (
                <div className="absolute right-0 mt-1 w-36 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-1.5 text-xs z-10">
                  <button
                    onClick={() => {
                      alert('Post reported to Solovvo moderation team.');
                      setReportedPostId(null);
                    }}
                    className="w-full text-left px-2.5 py-1.5 text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center gap-1.5 font-medium"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    Report Post
                  </button>
                  <button
                    onClick={() => {
                      onSavePost(post.id);
                      setReportedPostId(null);
                    }}
                    className="w-full text-left px-2.5 py-1.5 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-1.5"
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    {post.isSaved ? 'Unsave' : 'Save Post'}
                  </button>
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
            <div className="flex items-center gap-1">
              <span className="w-4 h-4 rounded-full bg-red-600 text-white flex items-center justify-center text-[9px]">
                ❤️
              </span>
              <span>{post.likesCount} {language === 'en' ? 'Likes' : 'পছন্দ'}</span>
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
              className={`flex-1 py-2 flex items-center justify-center gap-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                post.isLiked ? 'text-red-600 dark:text-red-500 font-bold' : ''
              }`}
            >
              <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-red-600 stroke-red-600' : ''}`} />
              <span>{language === 'en' ? 'Like' : 'লাইক'}</span>
            </button>

            <button
              onClick={() => setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)}
              className="flex-1 py-2 flex items-center justify-center gap-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{language === 'en' ? 'Comment' : 'মন্তব্য'}</span>
            </button>

            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: 'Solovvo Blood Network', text: post.content });
                } else {
                  alert('Post link copied to clipboard!');
                }
              }}
              className="flex-1 py-2 flex items-center justify-center gap-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>{language === 'en' ? 'Share' : 'শেয়ার'}</span>
            </button>

            <button
              onClick={() => onSavePost(post.id)}
              className={`p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                post.isSaved ? 'text-red-600' : ''
              }`}
            >
              <Bookmark className={`w-4 h-4 ${post.isSaved ? 'fill-red-600' : ''}`} />
            </button>
          </div>

          {/* Comments Section */}
          {activeCommentPostId === post.id && (
            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 space-y-3">
              {post.comments && post.comments.length > 0 && (
                <div className="space-y-2.5 max-h-48 overflow-y-auto">
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
                  className="p-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </article>
      ))}

    </div>
  );
};
