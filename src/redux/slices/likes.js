import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Загрузка лайков из localStorage
const loadLikesFromLocalStorage = () => {
  const likes = localStorage.getItem('likes');
  return likes ? JSON.parse(likes) : {};
};

// Сохранение лайков в localStorage
const saveLikesToLocalStorage = (likes) => {
  localStorage.setItem('likes', JSON.stringify(likes));
};

// Загрузка информации о лайкнутых постах из localStorage
const loadLikedPostsFromLocalStorage = () => {
  const likedPosts = localStorage.getItem('likedPosts');
  return likedPosts ? JSON.parse(likedPosts) : {};
};

// Сохранение информации о лайкнутых постах в localStorage
const saveLikedPostsToLocalStorage = (likedPosts) => {
  localStorage.setItem('likedPosts', JSON.stringify(likedPosts));
};

// Асинхронные действия (thunks)
export const likePost = createAsyncThunk(
  'likes/likePost',
  async (postId, { rejectWithValue }) => {
    try {
      const response = await axios.post(`http://localhost:4444/${postId}/like`);
      return { postId, likeCount: response.data.likeCount }; // Возвращаем ID поста и новое количество лайков
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Ошибка при добавлении лайка');
    }
  }
);

export const unlikePost = createAsyncThunk(
  'likes/unlikePost',
  async (postId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`http://localhost:4444/${postId}/like`);
      return { postId, likeCount: response.data.likeCount }; // Возвращаем ID поста и новое количество лайков
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Ошибка при удалении лайка');
    }
  }
);

// Начальное состояние
const initialState = {
  likes: loadLikesFromLocalStorage(), // Загружаем лайки из localStorage
  likedPosts: loadLikedPostsFromLocalStorage(), // Загружаем информацию о лайкнутых постах из localStorage
  loading: false,
  error: null,
};

// Создание slice
const likesSlice = createSlice({
  name: 'likes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Обработка likePost
      .addCase(likePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(likePost.fulfilled, (state, action) => {
        state.loading = false;
        state.likes[action.payload.postId] = action.payload.likeCount; // Обновляем количество лайков для поста
        state.likedPosts[action.payload.postId] = true; // Отмечаем пост как лайкнутый
        saveLikesToLocalStorage(state.likes); // Сохраняем лайки в localStorage
        saveLikedPostsToLocalStorage(state.likedPosts); // Сохраняем информацию о лайкнутых постах в localStorage
      })
      .addCase(likePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Обработка unlikePost
      .addCase(unlikePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(unlikePost.fulfilled, (state, action) => {
        state.loading = false;
        state.likes[action.payload.postId] = action.payload.likeCount; // Обновляем количество лайков для поста
        delete state.likedPosts[action.payload.postId]; // Убираем пост из лайкнутых
        saveLikesToLocalStorage(state.likes); // Сохраняем лайки в localStorage
        saveLikedPostsToLocalStorage(state.likedPosts); // Сохраняем информацию о лайкнутых постах в localStorage
      })
      .addCase(unlikePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Селекторы
export const selectLikes = (state) => state.likes.likes;
export const selectLikeCount = (postId) => (state) => state.likes.likes[postId] || 0;
export const selectIsLiked = (postId) => (state) => !!state.likes.likedPosts[postId]; // Проверяем, лайкнул ли пользователь пост

export const likesReducer = likesSlice.reducer;