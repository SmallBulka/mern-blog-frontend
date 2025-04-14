import React, { useEffect, useMemo, useState } from "react";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import TagIcon from "@mui/icons-material/Tag";
import ListItemText from "@mui/material/ListItemText";
import Skeleton from "@mui/material/Skeleton";

import { SideBlock } from "./SideBlock";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { fetchPosts, fetchPostsByTag, fetchPostsByTags, setCurrentTag } from "../redux/slices/posts";
import { useDispatch, useSelector } from "react-redux";
import { Box, Button, Card, CardContent, Chip, Paper, Typography } from "@mui/material";
import { useTheme } from "@emotion/react";
import axios from "axios";




export const TagsBlock = ({ items = [], isLoading = true }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const { filterTag, tagError } = useSelector(state => state.posts);

  const handleTagClick = (tag) => {
    if (!tag || typeof tag !== 'string') return;
    
    // Если кликаем по уже активному тегу - сбрасываем фильтр
    if (filterTag === tag) {

      dispatch(fetchPosts()); // Загружаем все посты
      navigate('/posts');
      return;
    }

    dispatch(fetchPostsByTag(tag));
    navigate(`/tag/${encodeURIComponent(tag)}`);
  };

  const uniqueTags = useMemo(() => {
    return [...new Set(items
      .filter(tag => typeof tag === 'string' && tag.trim() !== '')
      .map(tag => tag.trim().toLowerCase())
    )];
  }, [items]);

  if (isLoading) {
    return (
      <SideBlock title="Тэги">
        <Paper sx={{ p: 2, mb: 2 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: theme.spacing(1) }}>
            {Array(5).fill(0).map((_, i) => (
              <Skeleton key={i} width={80} height={32} sx={{ borderRadius: 16 }} />
            ))}
          </div>
        </Paper>
      </SideBlock>
    );
  }

  if (tagError) {
    return (
      <SideBlock title="Тэги">
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography color="error">{tagError.message}</Typography>
          {tagError.suggestions?.length > 0 && (
            <>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Попробуйте:
              </Typography>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: theme.spacing(1), marginTop: 8 }}>
                {tagError.suggestions.map(suggestion => (
                  <Chip
                    key={suggestion}
                    label={`#${suggestion}`}
                    clickable
                    onClick={() => handleTagClick(suggestion)}
                  />
                ))}
              </div>
            </>
          )}
        </Paper>
      </SideBlock>
    );
  }

  return (
    <SideBlock title={filterTag ? `Тег: #${filterTag}` : 'Популярные теги'}>
      <Paper sx={{ p: 2, mb: 2 }}>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: theme.spacing(1) }}>
          {uniqueTags.slice(0, 20).map(tag => (
            <Chip
              key={tag}
              label={`#${tag}`}
              clickable
              color={filterTag === tag ? 'primary' : 'default'}
              onClick={() => handleTagClick(tag)}
              sx={{
                '&:hover': { transform: 'scale(1.05)' },
                transition: 'all 0.2s ease'
              }}
            />
          ))}
        </div>
        {filterTag && (
          <Button
            size="small"
            sx={{ mt: 1 }}
            onClick={() => {

              dispatch(fetchPosts());
              navigate('/posts');
            }}
          >
            Сбросить фильтр
          </Button>
        )}
      </Paper>
    </SideBlock>
  );
};