import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/api';

interface Comment {
  id: number;
  author: string;
  authorId?: number;
  content: string;
  createdAt: string;
  likes: number;
}

const PostDetail: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const { user, isAuthenticated } = useAuth();
  const [newComment, setNewComment] = useState('');
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!postId) return;
      
      try {
        setLoading(true);
        
        // 포스트 정보 가져오기
        const postData = await apiService.getPost(parseInt(postId));
        setPost({
          id: postData.id,
          title: postData.title,
          author: postData.author,
          content: postData.content,
          imageUrl: postData.imageUrl || "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
          createdAt: postData.createdAt ? new Date(postData.createdAt).toLocaleDateString() : "2024-01-15",
          likes: postData.likesCount || 0,
          tags: postData.tags || ["#야경", "#서울", "#사진"]
        });
        setLikes(postData.likesCount || 0);

        // 사용자가 로그인되어 있다면 좋아요 상태 확인
        if (isAuthenticated && user?.id) {
          try {
            const likeStatus = await apiService.getLikeStatus(parseInt(postId), user.id);
            setLiked(likeStatus);
          } catch (err) {
            console.error('Error fetching like status:', err);
          }
        }

        // 댓글 가져오기
        const commentsData = await apiService.getCommentsByPostId(parseInt(postId));
        const commentsList: Comment[] = commentsData.map((comment: any) => ({
          id: comment.id,
          author: comment.author,
          authorId: comment.authorId,
          content: comment.content,
          createdAt: comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : "2024-01-15",
          likes: comment.likesCount || 0
        }));
        setComments(commentsList);

      } catch (err) {
        setError('데이터를 불러오는데 실패했습니다.');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [postId, isAuthenticated, user]);

  const handleLike = async () => {
    if (!postId || !isAuthenticated || !user?.id) {
      alert('좋아요를 누르려면 로그인이 필요합니다.');
      return;
    }
    
    try {
      const updatedPost = await apiService.likePost(parseInt(postId), user.id);
      setLikes(updatedPost.likesCount || 0);
      setLiked(!liked);
    } catch (err) {
      console.error('Error liking post:', err);
      alert('좋아요 처리에 실패했습니다.');
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      alert('댓글을 작성하려면 로그인이 필요합니다.');
      return;
    }
    
    if (!newComment.trim() || !postId) return;
    
    try {
      const commentData = {
        content: newComment,
        author: user?.nickname || "사용자",
        authorId: user?.id,
        postId: parseInt(postId)
      };
      
      console.log('Creating comment with data:', commentData);
      const newCommentData = await apiService.createComment(commentData);
      console.log('Created comment response:', newCommentData);
      
      // 댓글 목록을 다시 불러오기
      const commentsData = await apiService.getCommentsByPostId(parseInt(postId));
      console.log('Fetched comments after creation:', commentsData);
      const commentsList: Comment[] = commentsData.map((comment: any) => ({
        id: comment.id,
        author: comment.author,
        authorId: comment.authorId,
        content: comment.content,
        createdAt: comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : "2024-01-15",
        likes: comment.likesCount || 0
      }));
      setComments(commentsList);
      
      setNewComment('');
    } catch (err) {
      console.error('Error creating comment:', err);
      alert('댓글 작성에 실패했습니다.');
    }
  };

  const handleDeleteComment = async (commentId: number, commentAuthorId?: number) => {
    console.log('Delete comment called:', { commentId, commentAuthorId, user, isAuthenticated });
    
    if (!isAuthenticated || !user?.id) {
      console.log('User not authenticated or no user ID');
      alert('댓글을 삭제하려면 로그인이 필요합니다.');
      return;
    }

    if (commentAuthorId !== user.id) {
      console.log('User ID mismatch:', { commentAuthorId, userId: user.id });
      alert('자신이 작성한 댓글만 삭제할 수 있습니다.');
      return;
    }

    if (!confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
      return;
    }

    try {
      console.log('Attempting to delete comment:', { commentId, userId: user.id });
      const deleteResponse = await apiService.deleteComment(commentId, user.id);
      console.log('Delete response:', deleteResponse);
      
      // 댓글 목록을 다시 불러오기
      const commentsData = await apiService.getCommentsByPostId(parseInt(postId!));
      console.log('Fetched comments after deletion:', commentsData);
      const commentsList: Comment[] = commentsData.map((comment: any) => ({
        id: comment.id,
        author: comment.author,
        authorId: comment.authorId,
        content: comment.content,
        createdAt: comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : "2024-01-15",
        likes: comment.likesCount || 0
      }));
      setComments(commentsList);
      
      alert('댓글이 삭제되었습니다.');
    } catch (err) {
      console.error('Error deleting comment:', err);
      alert('댓글 삭제에 실패했습니다.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">데이터를 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <p className="text-red-600">{error || '포스트를 찾을 수 없습니다.'}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              다시 시도
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {post.title}
              </h1>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>👤 {post.author}</span>
                <span>📅 {post.createdAt}</span>
                <span>📍 남산타워</span>
              </div>
            </div>
            <Link
              to="/spots"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              ← 목록으로
            </Link>
          </div>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          {/* 사진 */}
          <div className="relative">
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-96 object-cover"
            />
            <div className="absolute top-4 right-4">
              <button
                onClick={handleLike}
                className={`p-3 rounded-full transition-colors ${
                  liked
                    ? 'bg-red-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-red-50'
                }`}
              >
                <svg
                  className="w-6 h-6"
                  fill={liked ? "currentColor" : "none"}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* 글 내용 */}
          <div className="p-6">
            {/* 좋아요 수 */}
            <div className="flex items-center space-x-2 mb-4">
              <svg
                className="w-5 h-5 text-red-500"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              <span className="text-gray-600">{likes}명이 좋아합니다</span>
            </div>

            {/* 태그 */}
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag: string, index: number) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* 글 내용 */}
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {post.content}
              </p>
            </div>
          </div>
        </div>

        {/* 댓글 섹션 */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            댓글 ({comments.length})
          </h3>

          {/* 댓글 작성 */}
          <form onSubmit={handleCommentSubmit} className="mb-6">
            <div className="flex space-x-4">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={isAuthenticated ? "댓글을 작성하세요..." : "댓글을 작성하려면 로그인이 필요합니다."}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={!isAuthenticated}
              />
              <button
                type="submit"
                disabled={!isAuthenticated || !newComment.trim()}
                className={`px-6 py-2 rounded-lg transition-colors ${
                  isAuthenticated && newComment.trim()
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                댓글 작성
              </button>
            </div>
            {!isAuthenticated && (
              <p className="text-sm text-gray-500 mt-2">
                댓글을 작성하려면 <Link to="/login" className="text-blue-500 hover:underline">로그인</Link>이 필요합니다.
              </p>
            )}
          </form>

          {/* 댓글 목록 */}
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="border-b border-gray-200 pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-medium text-gray-900">
                        {comment.author}
                      </span>
                      <span className="text-sm text-gray-500">
                        {comment.createdAt}
                      </span>
                    </div>
                    <p className="text-gray-700">{comment.content}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="flex items-center space-x-1 text-gray-500 hover:text-red-500">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                      <span className="text-sm">{comment.likes}</span>
                    </button>
                    {isAuthenticated && user?.id === comment.authorId && (
                      <button
                        onClick={() => handleDeleteComment(comment.id, comment.authorId)}
                        className="text-red-500 hover:text-red-700 text-sm font-medium"
                      >
                        삭제
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail; 