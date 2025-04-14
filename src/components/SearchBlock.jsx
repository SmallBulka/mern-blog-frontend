import React, {  useState } from "react";
import { SideBlock } from "./SideBlock";
import { Input, IconButton, List, ListItem, ListItemText, CircularProgress } from "@mui/material";
import { Search } from "@mui/icons-material";
import {  useNavigate } from "react-router-dom";
import axios from "axios";

export const SearchBlock = () => {
  const [searchQuery, setSearchQuery] = useState(""); // Состояние для поискового запроса
  const [results, setResults] = useState([]); // Состояние для результатов поиска
  const [isLoading, setIsLoading] = useState(false); // Состояние для загрузки
  const navigate = useNavigate(); // Хук для навигации
 

  // Обработчик изменения поискового запроса
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Обработчик отправки поискового запроса
  const handleSearchSubmit = async (e) => {
    e.preventDefault(); // Предотвращаем перезагрузку страницы

    if (searchQuery.trim() === "") {
      alert("Введите поисковый запрос");
      return;
    }

    setIsLoading(true); // Начинаем загрузку

    try {
      // Отправляем запрос на бэкенд
      const response = await axios.get(`http://localhost:4444/api/search?query=${encodeURIComponent(searchQuery)}`);
      setResults(response.data); // Обновляем результаты
      if (response.data.length === 1) {
        const articleId = response.data[0]._id;
        navigate(`/posts/${articleId}`);
      } else {
        setResults(response.data); // Обновляем результаты, если их больше одного
      }
    } catch (error) {
      console.error("Ошибка при поиске:", error);
      alert("Ошибка при поиске. Попробуйте позже.");
    } finally {
      setIsLoading(false); // Завершаем загрузку
    }
  };

  return (
    <SideBlock title="Поиск">
      {/* Форма поиска */}
      <form onSubmit={handleSearchSubmit} style={{ display: "flex", alignItems: "center", padding: "20px" }}>
        <Input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Введите запрос..."
          fullWidth
          style={{ marginRight: "10px" }}
        />
        <IconButton type="submit" disabled={isLoading}>
          {isLoading ? <CircularProgress size={24} /> : <Search />}
        </IconButton>
      </form>

      {/* Результаты поиска */}
      {results.length > 0 && (
        <List>

        {results.map((result) => (
          <ListItem key={result._id} disablePadding onClick={() => navigate(`/posts/${result._id}`)} style={{ cursor: "pointer",  padding: " 5px 20px"}}>
            <ListItemText primary={result.title} secondary={result.description} />
          </ListItem>
        ))}
      </List>
      )}

      {/* Сообщение, если ничего не найдено */}
      {!isLoading && results.length === 0 && searchQuery.trim() !== "" && (
        <p style={{ textAlign: "center", color: "#666" }}>Ничего не найдено.</p>
      )}
    </SideBlock>
  );
};
