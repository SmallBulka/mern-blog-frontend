import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  comments: [],
  loading: false,
  error: null,
};

// Асинхронные действия с помощью createAsyncThunk
export const fetchComments = createAsyncThunk(
  'comments/fetchComments',
  async (postId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`http://localhost:4444/posts/${postId}/comments`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const addComment = createAsyncThunk(
  'comments/addComment',
  async ({ postId, text, token }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `http://localhost:4444/posts/${postId}/comments`,
        { text },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const removeComment = createAsyncThunk(
  'comments/removeComment',
  async ({ commentId, token }, { rejectWithValue }) => {
    try {
      await axios.delete(`http://localhost:4444/posts/${commentId}/comments`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return commentId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Создаем слайс
const commentSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    // Синхронные редюсеры (если нужны)
    clearComments: (state) => {
      state.comments = [];
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Обработка fetchComments
      .addCase(fetchComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Обработка addComment
      .addCase(addComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.loading = false;
        state.comments.unshift(action.payload); // Добавляем в начало
      })
      .addCase(addComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Обработка removeComment
      .addCase(removeComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeComment.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = state.comments.filter(
          comment => comment._id !== action.payload
        );
      })
      .addCase(removeComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

// Экспортируем экшены и редюсер
export const { clearComments } = commentSlice.actions;
export const commentReducer = commentSlice.reducer;
// export const createComment = createAsyncThunk(
//   "comment/createComment",
//   async ({ postId, comment }, { rejectWithValue, dispatch }) => {
//     try {
//       const { data } = await axios.post(`/posts/${postId}/comments`, {
//         postId,
//         comment,
//       });
    
//       dispatch(getPostComments(postId)); // Повторно загружаем комментарии
//       return data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || error.message);
//     }
//   }
// );

// export const getPostComments = createAsyncThunk(
//   "comment/getPostComments",
//   async (postId, { rejectWithValue }) => {
//     try {
      
//       const { data } = await axios.get(`/posts/${postId}/comments`);
//       return data;

//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || error.message);
//     }
//   }
// );

// export const commentSlice = createSlice({
//   name: "comment",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       // Создание комментария
//       .addCase(createComment.pending, (state) => {
//         state.loading = true;
//         state.error = null; // Сбрасываем ошибку при начале запроса
//       })
//       .addCase(createComment.fulfilled, (state, action) => {
//         state.loading = false;
//         if (action.payload) {
//           state.comments.push(action.payload); // Добавляем новый комментарий
//         }
//       })
//       .addCase(createComment.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload; // Сохраняем ошибку
//       })
//       // Получение комментариев
//       .addCase(getPostComments.pending, (state) => {
//         state.loading = true;
//         state.error = null; // Сбрасываем ошибку при начале запроса
//       })
//       .addCase(getPostComments.fulfilled, (state, action) => {
//         state.loading = false;
//         state.comments = action.payload; // Обновляем список комментариев
//       })
//       .addCase(getPostComments.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload; // Сохраняем ошибку
//       });
//   },
// });