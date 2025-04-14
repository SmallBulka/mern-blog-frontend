import { configureStore } from "@reduxjs/toolkit";
import { postsReducer } from "./slices/posts";
import { authReducer } from "./slices/auth";
import { commentReducer } from "./slices/comment";
import { likesReducer } from "./slices/likes";


const store = configureStore({
    reducer: {
        posts: postsReducer,
        auth: authReducer,
        comments : commentReducer,
        likes : likesReducer
    }
})

export default store