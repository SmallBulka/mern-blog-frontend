import React, { memo} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { likePost, selectIsLiked, selectLikeCount, unlikePost } from '../../redux/slices/likes';
import { ButtonBase} from '@mui/material';
import { Favorite, FavoriteBorder } from '@mui/icons-material';




const LikeButton = memo(({ postId, initialLikes = 0 }) => {
  const dispatch = useDispatch();
  const likeCount = useSelector(selectLikeCount(postId)) || initialLikes; // Получаем количество лайков для поста
  const isLiked = useSelector(selectIsLiked(postId)); // Получаем информацию о том, лайкнул ли пользователь пост  
  // Проверка, что postId определен
  // if (postId === undefined) {
  //   console.error('postId не определен');
  //   return null;
  // }
  const handleLike = async () => {
    console.log("Отправка лайка для postId:", postId); // Добавьте эту строку
    try {
      if (isLiked) {
        await dispatch(unlikePost(postId)).unwrap(); // Удаляем лайк
      } else {
        await dispatch(likePost(postId)).unwrap(); // Добавляем лайк
      }
    } catch (error) {
      console.error('Ошибка при обновлении лайка:', error);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px'}}>
      <ButtonBase onClick={handleLike} color={isLiked ? 'error' : 'default'}>
      {isLiked ? <Favorite /> : <FavoriteBorder />}
      </ButtonBase>
      <span>{likeCount}</span>
    </div>
  );
});

export default LikeButton;