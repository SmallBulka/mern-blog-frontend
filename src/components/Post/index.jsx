import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import EyeIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import { Link, useNavigate } from 'react-router-dom';

import styles from './Post.module.scss';
import { UserInfo } from '../UserInfo';
import { PostSkeleton } from './Skeleton';
import { useDispatch} from 'react-redux';
import { fetchPostsByTag, fetchRemovePost } from '../../redux/slices/posts';
import LikeButton from './LikeButton';
import { Chat } from '@mui/icons-material';
import axios from 'axios';

export const Post = ({
  id,
  title,
  createdAt,
  imageUrl,
  user = { _id: '', username: 'Аноним', avatar: '' },
  viewsCount,
  tags = [], // Добавляем значение по умолчанию
  children,
  isFullPost,
  isLoading,
  isEditable,
  likes: initialLikes,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [commentsCount, setCommentsCount] = useState(0);
  useEffect(() => {
    const abortController = new AbortController();
    
    const fetchCommentsCount = async () => {
      try {
        const response = await axios.get(`http://localhost:4444/posts/${id}/comments/count`, {
          signal: abortController.signal
        });
        setCommentsCount(response.data.count);
      } catch (error) {
        if (!abortController.signal.aborted) {
         
          setCommentsCount(0);
        }
      }
    };
    
    fetchCommentsCount();
    
    return () => abortController.abort(); // Отмена запроса при размонтировании
  }, [id]); // Зависимость только id
  const avatarUrl = user.avatar 
  ? user.avatar.startsWith('http') 
    ? user.avatar 
    : `http://localhost:4444${user.avatar}`
  : '/default-avatar.png';
  if (isLoading) {
    return <PostSkeleton />;
  }
  

  const onClickRemove = () => {
    if (window.confirm('Вы действительно хотите удалить статью?')) {
      dispatch(fetchRemovePost(id));
    }
  };

  // Обработчик клика по тегу
  const handleTagClick = (tag) => {
    if (!tag) return;
    navigate(`/tag/${encodeURIComponent(tag)}`);
    dispatch(fetchPostsByTag(tag));
  };

  return (
    <div className={clsx(styles.root, { [styles.rootFull]: isFullPost })}>
      {isEditable && (
        <div className={styles.editButtons}>
          <Link to={`/posts/${id}/edit`}>
            <IconButton color="primary">
              <EditIcon />
            </IconButton>
          </Link>
          <IconButton onClick={onClickRemove} color="secondary">
            <DeleteIcon />
          </IconButton>
        </div>
      )}
      {imageUrl && (
        <img
          className={clsx(styles.image, { [styles.imageFull]: isFullPost })}
          src={imageUrl}
          alt={title}
        />
      )}
      <div className={styles.wrapper}>

      <UserInfo 
        {...user} 
        avatar={avatarUrl}
        additionalText={createdAt}
        formatDate={(date) => new Date(date).toLocaleDateString()}
      />
        <div className={styles.indention}>
          <h2 className={clsx(styles.title, { [styles.titleFull]: isFullPost })}>
            {isFullPost ? title : <Link to={`/posts/${id}`}>{title}</Link>}
          </h2>
          {tags.length > 0 && (
            <ul className={styles.tags}>
              {tags.map((tag) => (
                <li key={tag}>

                  <Link  to={`/tag/${encodeURIComponent(tag)}`} onClick={(e) => {
                      e.preventDefault();
                      handleTagClick(tag);
                    }}
                    >
                    #{tag}
                  </Link>
                </li>
              ))}
            </ul>
          )}
          {children && <div className={styles.content}>{children}</div>}
          <ul className={styles.postDetails}>
            <li>
              <EyeIcon />
              <span>{viewsCount}</span>
            </li>
            <li>
              <Chat />
              <span> {commentsCount}</span>
            </li>
            <li style={{ cursor: 'pointer' }}>
              <LikeButton postId={id} initialLikes={initialLikes} />
            </li>
           
            
          </ul>
        </div>
      </div>
    </div>
  );
};


// Добавление лайка
// const handleLike = async () => {
//   try {
//     const response = await axios.post(`/posts/${id}/like`);
//     setLikeCount(response.data.likeCount); // Обновляем количество лайков
//     setIsLiked(true); // Устанавливаем состояние лайка
//   } catch (error) {
//     console.error('Ошибка при добавлении лайка:', error);
//   }
// };
// // Удаление лайка
// const handleUnlike = async () => {
//   try {
//     const response = await axios.delete(`/posts/${id}/like`);
//     setLikeCount(response.data.likeCount); // Обновляем количество лайков
//     setIsLiked(false); // Устанавливаем состояние лайка
//   } catch (error) {
//     console.error('Ошибка при удалении лайка:', error);
//   }
// };
  // Обработка лайка
  // const handleLike = () => {
  //   if (isLiked) {
  //     dispatch(unlikePost(id)); // Отправляем действие unlikePost
  //   } else {
  //     dispatch(likePost(id)); // Отправляем действие likePost
  //   }
  //   setIsLiked(!isLiked); // Оптимистичное обновление
  // };

  // // Отображение количества лайков
  // const likeCount = likes[id] || initialLikes || 0;