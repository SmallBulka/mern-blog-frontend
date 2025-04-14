import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../axios";

export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async ({ tag, sort }, { rejectWithValue }) => {
    try {
      const params = {};
      if (tag) params.tag = tag;
      if (sort) params.sort = sort;
      
      const response = await axios.get('http://localhost:4444/posts', { params });
      
      // Гарантируем правильную структуру ответа
      if (Array.isArray(response.data)) {
        return response.data;
      } else if (Array.isArray(response.data.posts)) {
        return response.data.posts;
      } else {
        throw new Error('Неправильный формат данных от сервера');
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
export const fetchTags = createAsyncThunk(
  "posts/fetchTags",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get('http://localhost:4444/posts/tags');
      return data 
    } catch (err) {
      console.error('Ошибка запроса тегов:', err); // Добавьте лог
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchRemovePost = createAsyncThunk(
  "posts/fetchRemovePost",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`http://localhost:4444/posts/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
export const fetchViews = createAsyncThunk(
  "posts/fetchViews",
  async (sortBy = 'viewsCount') => {
    try {
      const { data } = await axios.get(`http://localhost:4444/views`, {
        params: { sortBy },
        timeout: 5000 // Таймаут 5 секунд
      });
      return data;
    } catch (error) {
      console.error('Ошибка запроса тегов:', error); // Добавьте лог
    }
  }
);

// Для фильтрации по тегу
export const fetchPostsByTag = createAsyncThunk(
  'posts/fetchByTag',
  async (tag, { rejectWithValue }) => {
    try {
      const response = await axios.get(`http://localhost:4444/tag/${encodeURIComponent(tag)}`);
      return {
        posts: response.data.posts,
        tag: response.data.tag,
        count: response.data.count
      };
    } catch (error) {
      if (error.response?.status === 404) {
        return rejectWithValue({
          message: error.response.data.message,
          suggestions: error.response.data.suggestions,
          isTagNotFound: true
        });
      }
      return rejectWithValue(error.response?.data || 'Ошибка сервера');
    }
  }
);
const initialState = {
  posts: {
    items: [],
    status: 'loading',
    error: null, // Добавляем поле для ошибок
    filterTag: null,
  },
  tags: {
    items: [],
    status: 'loading',
    error: null, // Добавляем поле для ошибок
  },
};
const postsSlise = createSlice({
name: "posts",
initialState,
reducers: {
},
extraReducers: (builder) => {
  builder
  .addCase(fetchPostsByTag.pending, (state) => {
    state.posts.status = "loading";
    state.posts.tagError = null;
  })
  .addCase(fetchPostsByTag.fulfilled, (state, action) => {
    state.posts.items = action.payload.posts;
    state.posts.filterTag = action.payload.tag;
    state.posts.status = "loaded";
  })
  .addCase(fetchPostsByTag.rejected, (state, action) => {
    if (action.payload?.isTagNotFound) {
      state.posts.tagError = action.payload;
    } else {
      state.posts.status = "error";
    }
  });
  // Получение статей
  builder.addCase(fetchPosts.pending, (state) => {
    state.posts.items = [];
    state.posts.status = "loading";
  });
  // builder.addCase(fetchPosts.fulfilled, (state, action) => {
  //   state.posts.items = action.payload;
  //   state.posts.status = "loaded";
  // });
  builder.addCase(fetchPosts.rejected, (state) => {
    state.posts.items = [];
    state.posts.status = "error";
  });
  builder.addCase(fetchPosts.fulfilled, (state, action) => {
    state.posts.items = action.payload.map(post => ({
      ...post,
      user: post.user || null // Гарантируем наличие поля user
    }));
    state.posts.status = 'loaded';
  })
  // Получение популярных статей
  builder.addCase(fetchViews.pending, (state) => {
    state.posts.items = [];
    state.posts.status = "loading";
  });
  builder.addCase(fetchViews.fulfilled, (state, action) => {
    state.posts.items = action.payload;
    state.posts.status = "loaded";
  });
  builder.addCase(fetchViews.rejected, (state) => {
    state.posts.items = [];
    state.posts.status = "error";
  });
  // Получение тегов
  builder.addCase(fetchTags.pending, (state) => {
    state.tags.items = [];
    state.tags.status = "loading";
  });
  builder.addCase(fetchTags.fulfilled, (state, action) => {
    state.tags.items = action.payload;
    state.tags.status = "loaded";
  });
  builder.addCase(fetchTags.rejected, (state) => {
    state.tags.items = [];
    state.tags.status = "error";
  });

  // Удаление статей
  builder.addCase(fetchRemovePost.pending, (state, action) => {
    state.posts.items = state.posts.items.filter(
      (obj) => obj._id !== action.meta.arg
    );
  });
  builder.addCase(fetchRemovePost.rejected, (state) => {
    state.posts.status = "error";
  });
},
});

export const { resetPostsState, resetTagsState } = postsSlise.actions;
export const postsReducer = postsSlise.reducer;






