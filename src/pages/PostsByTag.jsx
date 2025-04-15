// components/PostsByTag.js
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Post, TagsBlock } from '../components';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts, fetchTags } from '../redux/slices/posts';
import { PostSkeleton } from '../components/Post/Skeleton';







const PostsByTag = () => {
  const { tag } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const posts = useSelector((state) => state.posts.posts);
  const tags = useSelector((state) => state.posts.tags);
  const userData = useSelector((state) => state.auth.data);
  
  const [activeTab, setActiveTab] = useState('newest');
  const decodedTag = tag ? decodeURIComponent(tag) : '';

  useEffect(() => {
    if (decodedTag) {
      dispatch(fetchPosts({ tag: decodedTag, sort: activeTab }));
      dispatch(fetchTags());
    }
  }, [decodedTag, activeTab, dispatch]);

  const handleTabChange = useCallback((newTab) => {
    setActiveTab(newTab);
  }, []);

  const handleBack = useCallback(() => {
    navigate(-1);
    handleTabChange('newest');
  }, [navigate]);

  if (!decodedTag) {
    return (
      <div className="tag-posts-page error">
        <h1>Тег не указан</h1>
        <button onClick={handleBack} className="back-button">
          Вернуться назад
        </button>
      </div>
    );
  }

  return (
    <div className="tag-posts-page">
      <div className="tag-header">
        <h1>Статьи с тегом: <span className="tag-name">#{decodedTag}</span></h1> 
      </div>
      <div className="right-sidebar">
        <TagsBlock 
          items={tags.items} 
          isLoading={tags.status === 'loading'} 
        />
      </div>
      <PostsList 
        posts={posts}
        decodedTag={decodedTag}
        currentUserId={userData?._id}
      />
    </div>
  );
};

const PostsList = ({ posts, decodedTag, currentUserId }) => {
  const getImageUrl = (path) => {
    if (!path) return null;
    
    // Если это уже полный URL
    if (/^https?:\/\/|^data:/.test(path)) {
      return path;
    }
    
    // Для относительных путей
    const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:4444';
    return `${baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;
  };

  const getAvatarUrl = (user) => {
    const avatarPath = user?.avatarUrl || user?.avatar;
    return avatarPath ? getImageUrl(avatarPath) || '/default-avatar.png' : '/default-avatar.png';
  };

  if (!posts || posts.status === 'loading') {
    return <div className="posts-container">{[...Array(5)].map((_, i) => <PostSkeleton key={i} />)}</div>;
  }

  if (posts.status === 'failed') {
    return <div className="error">Ошибка загрузки: {posts.error}</div>;
  }

  if (!Array.isArray(posts.items)) {
    return <div className="error">Некорректный формат данных</div>;
  }

  if (posts.items.length === 0) {
    return <div className="no-posts">Нет статей с тегом #{decodedTag}</div>;
  }

  return (
    <div className="posts-container">
      {posts.items.map((post) => {
        const author = post.user || {};
        const avatarUrl = getAvatarUrl(author);
        const postImageUrl = getImageUrl(post.imageUrl);

        return (
          <Post
            key={post._id}
            id={post._id}
            title={post.title}
            user={{
              _id: author._id || '',
              fullName: author.fullName || 'Аноним',
              avatar: avatarUrl
            }}
            createdAt={post.createdAt}
            viewsCount={post.viewsCount}
            tags={Array.isArray(post.tags) ? post.tags : []}
            imageUrl={postImageUrl}
            isEditable={currentUserId === author._id}
            isFullPost={false}
            isLoading={false}
            likesCount={post.likesCount || 0}
            highlightTag={decodedTag}
            commentsCount={post.commentsCount || 0}
          />
        );
      })}
    </div>
  );
};

export default PostsByTag;