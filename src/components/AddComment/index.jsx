import React, { useState, useEffect } from "react";
import {
  Avatar,
  Button,
  TextField,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  List,
} from "@mui/material";
import styles from "./AddComment.module.scss";
import { useSelector } from "react-redux";
import axios from "axios";

export const Index = ({ postId}) => {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const userData = useSelector((state) => state.auth.data);

  // Загрузка комментариев при монтировании и при изменении postId
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(`http://localhost:4444/posts/${postId}/comments`);
        setComments(res.data);
      } catch (err) {
        console.error("Ошибка загрузки:", err);
      }
    };
    fetchComments();
  }, [postId]);

  // Отправка нового комментария
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `http://localhost:4444/posts/${postId}/comments`,
        { text,  userId: userData?._id }, // userId должен быть из авторизации
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setText("");
      setComments([res.data, ...comments]); // Оптимистичное обновление
    } catch (err) {
      console.error("Ошибка:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className={styles.root}>
      <div className={styles.commentFormContainer}>
        <div className={styles.userInfo}>
          <Avatar 
            classes={{ root: styles.avatar }} 
            src={userData?.avatarUrl} 
          />
        </div>
        
        <form className={styles.form} onSubmit={handleSubmit}>
          <TextField
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={loading}
            label="Написать комментарий"
            variant="outlined"
            multiline
            fullWidth
            className={styles.textField}
          />
          <div className={styles.buttonContainer}>
            <Button 
              type="submit" 
              variant="contained" 
              disabled={loading}
              className={styles.submitButton}
            >
              {loading ? "Отправка..." : "Отправить"}
            </Button>
          </div>
        </form>
      </div>
  
      <div className={styles.commentsSection}>
        <List className={styles.commentsList}>
          {comments.map((comment) => (
            <React.Fragment key={comment.id}>
              <ListItem alignItems="flex-start" className={styles.commentItem}>
                <ListItemAvatar>
                  <Avatar
                    src={comment.user?.avatarUrl || userData?.avatarUrl}
                    className={styles.commentAvatar}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <div className={styles.commentHeader}>
                      <span className={styles.commentAuthor}>
                      {userData?.fullName || 'Аноним'}
                      </span>
                      <span className={styles.commentDate}>
                        {new Date(comment.createdAt).toLocaleString()}
                      </span>
                    </div>
                  }
                  secondary={
                    <div className={styles.commentText}>
                      {comment.text}
                    </div>
                  }
                  className={styles.commentContent}
                />
              </ListItem>
              <Divider variant="inset" component="li" className={styles.commentDivider} />
            </React.Fragment>
          ))}
        </List>
      </div>
    </div>
  );
};

// const handleSubmit = () => {
//   try {
//     const postId = params.id;
//     dispatch(createComment({ postId, comment }));
//     setComment("");
//   } catch (error) {
//     console.log(error);
//   }
// };
// // Загрузка комментариев
// useEffect(() => {
//   const fetchComments = async () => {
//     try {
//       setLoading(true);
//       dispatch(getPostComments(params.id));
//     } catch (error) {
//       console.log(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchComments();
// }, [params.id, dispatch]);
// const fetchComments = async () => {
//   try {
//     dispatch(getPostComments(params.id));
//   } catch (error) {
//     console.log(error);
//   }
// };

// useEffect(() => {
//   fetchComments();
// }, []);
// Загрузка данных пользователя при монтировании компонента
// Загрузка данных пользователя при монтировании компонента
// Функция для получения данных текущего пользователя
//  const fetchCurrentUser = async () => {
//   const token = localStorage.getItem('token'); // Получаем токен из localStorage

//   if (!token) {
//     throw new Error('Пользователь не авторизован');
//   }

//   try {
//     const response = await fetch('/auth/me', {
//       method: 'GET',
//       headers: {
//         'Authorization': `Bearer ${token}`,
//       },
//     });

//     if (!response.ok) {
//       throw new Error('Failed to fetch user data');
//     }

//     const data = await response.json();
//     console.log('User data:', data);
//     return data; // Возвращаем данные пользователя
//   } catch (error) {
//     console.error('Error fetching user data:', error);
//     throw error; // Пробрасываем ошибку для обработки в компоненте
//   }
// };

// useEffect(() => {
//   const fetchUser = async () => {
//     try {
//       const user = await fetchCurrentUser();
//       setCurrentUser(user); // Обновляем состояние currentUser
//     } catch (error) {
//       console.error("Ошибка при получении данных пользователя:", error);
//       // Перенаправление на страницу входа или вывод сообщения
//     }
//   };

//   fetchUser();
// }, []);

// export const Index = ({
//   children,
//   postId,
// }) => {
//   const [comments, setComments] = useState([]);
//   const [newComment, setNewComment] = useState("");
//   const userData = useSelector((state) => state.auth.data);
//   // Загрузка комментариев из localStorage при монтировании компонента
//   useEffect(() => {
//     const savedComments = localStorage.getItem("comments");
//     if (savedComments) {
//       setComments(JSON.parse(savedComments));
//     }
//   }, []);

//   // Сохранение комментариев в localStorage при их изменении
//   useEffect(() => {
//     localStorage.setItem("comments", JSON.stringify(comments));
//   }, [comments]);

//   const handleAddComment = () => {
//     if (newComment.trim()) {
//       const comment = {
//         id: Date.now(),// Уникальный ID для комментария
//         text: newComment,
//         postId: postId,
//         user: {
//           fullName: userData.fullName,
//           avatarUrl: userData.avatarUrl,
//         },
//       };
//       setComments([...comments, comment]);
//       setNewComment("");
//     }
//   };

//   const postComments = comments.filter((comment) => comment.postId === postId);

//   return (
//     <>
//       <div className={styles.root}>
//         {/* Форма для ввода комментария */}
//         <Avatar
//           classes={{ root: styles.avatar }}
//           src={userData.avatarUrl}
//         />
//         <div className={styles.form}>
//           <TextField
//             value={newComment}
//             onChange={(e) => setNewComment(e.target.value)}
//             label="Написать комментарий"
//             variant="outlined"
//             maxRows={10}
//             multiline
//             fullWidth
//           />
//           <Button variant="contained" onClick={handleAddComment}>
//             Отправить
//           </Button>
//         </div>
//       </div>

//       {/* Список комментариев (отображается снизу от формы ввода) */}
//       <div>
//       <List>
//         {postComments.map((comment) => (
//           <React.Fragment key={comment.id}>
//             <ListItem alignItems="flex-start">
//               <ListItemAvatar>
//                   <Avatar src={comment.user.avatarUrl} />
//               </ListItemAvatar>

//                 <ListItemText
//                   primary={comment.user.fullName}
//                   secondary={comment.text}
//                 />

//             </ListItem>
//             <Divider variant="inset" component="li" />
//           </React.Fragment>
//         ))}
//      </List>
//         {children}
//       </div>
//     </>
//   );
// };
