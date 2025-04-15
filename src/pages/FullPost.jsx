import React, { useEffect, useState } from "react";

import { Post } from "../components/Post";

import { useNavigate, useParams } from "react-router-dom";
import axios from "../axios";
import ReactMarkdown from "react-markdown";

import { Index} from "../components/AddComment";
import { SideBlock } from "../components/SideBlock";






export const FullPost = () => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [comments, setComments] = useState([]); // Состояние для комментариев
  const { id } = useParams();
  const navigate = useNavigate(); // Хук для навигации
 
  // Загрузка данных поста
  useEffect(() => {
    if (!id) {
      console.error("ID статьи отсутствует");
      return;
    }
  
    if (isNaN(id)) {
      console.error("ID статьи не является числом");
      return;
    }
  
    setLoading(true);
  
    axios
      .get(`http://localhost:4444/posts/${id}`)
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Ошибка при получении статьи:", err);
        alert("Не удалось загрузить статью. Попробуйте позже.");
        navigate("/");
        setLoading(false);
        setComments([]);
      });
  }, [id, navigate]);

  // Загрузка комментариев
  // useEffect(() => {
  //   if (id) {
  //     axios
  //       .get(`/posts/${id}/comments`)
  //       .then((res) => {
  //         setComments(res.data);
  //       })
  //       .catch((err) => {
  //         console.error("Ошибка при получении комментариев:", err);
          
  //       });
  //   }
  // }, [data, id]);
  // Обработчик добавления комментария
  // const handleAddComment = (text) => {
  //   axios
  //     .post(`/posts/comments/${id}`, { text })
  //     .then((res) => {
  //       setComments([...comments, res.data]); // Добавляем новый комментарий
  //     })
  //     .catch((err) => {
  //       console.error("Ошибка при добавлении комментария:", err);
  //       alert(" добавить комментарий. Попробуйте позже.");
  //     });
  // };

  if (isLoading) {
    return <Post isLoading={isLoading} isFullPost />;
  }

  if (!data) {
    return <div>Статья не найдена.</div>;
  }

  return (
    <>
    
      <Post
        id={data._id}
        title={data.title}
        imageUrl={data.imageUrl ? `http://localhost:4444${data.imageUrl}` : ""}
        user={data.user}
        createdAt={data.createdAt}
        viewsCount={data.viewsCount}
        commentsCount={comments.length} // Используем реальное количество комментариев
        tags={data.tags}
        isFullPost
        isLoading={isLoading}
        isEditable
        likes={data.likesCount || 0}  // Передаём начальное количество лайков

        >
          {/* <LikeButton postId={data._id} initialLikes={data.likesCount} /> */}
        <p>
          <ReactMarkdown children={data.text} />
        </p>
        
      </Post>

      <SideBlock title="Комментарии">
            <Index postId={id}/>
          </SideBlock>

    </>
  );
};
