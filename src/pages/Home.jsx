import React, { useCallback, useEffect, useMemo, useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Grid from "@mui/material/Grid";

import { Post } from "../components/Post";
import { TagsBlock } from "../components/TagsBlock";


import { useDispatch, useSelector } from "react-redux";
import { SearchBlock } from "../components/SearchBlock";
import { useSearchParams } from "react-router-dom";
import { fetchPopularPosts, fetchPopularTags, fetchPosts, fetchPostsByTag, fetchTags, fetchViews, selectCurrentTag, selectIsLoading, selectPosts, selectSortBy, selectTags, setCurrentTag, setSort, setSortBy } from "../redux/slices/posts";
import { Box, Typography } from "@mui/material";
import { PostSkeleton } from "../components/Post/Skeleton";

export const Home = ({ commentsCount, initialLikes}) => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.data);
  const { posts, tags } = useSelector((state) => state.posts);
  const [activeTab, setActiveTab] = useState('createdAt');
  // const [activeTag, setActiveTag] = useState(null);
  // const [activeSort, setActiveSort] = useState('new');
  const [activeTag, setActiveTag] = useState(null);

  const isPostsLoading = posts.status === "loading";
  const isTagsLoading = tags.status === "loading";


  useEffect(() => {
    if (activeTag) {
      // Если выбран тег - загружаем статьи по тегу с текущей сортировкой
      dispatch(fetchPostsByTag({ 
        tag: activeTag, 
        sortBy: activeTab === 'viewsCount' ? 'viewsCount' : 'createdAt' 
      }));
    } else {
      // Если тег не выбран - обычная загрузка
      if (activeTab === 'createdAt') {
        dispatch(fetchViews('createdAt'));
      } else {
        dispatch(fetchViews());
      }
    }
    dispatch(fetchTags());
  }, [activeTab, activeTag, dispatch]);

// Home.js
const handleTagClick = useCallback((tag) => {
  if (typeof tag !== 'string') {
    console.error('Получен некорректный тег:', tag);
    return;
  }
  setActiveTag(tag);
}, []);

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
  };


  return (
    <>
    <Grid sx={{ display: { lg: 'none', md: 'block' } }} style={{ display: { xs: 'block', md: 'none' }, marginBottom: 20 }}>
    <SearchBlock />
    <TagsBlock 
      items={tags.items} 
      isLoading={isTagsLoading}
      activeTag={activeTag}
      onTagClick={handleTagClick}
    />
  </Grid>

      <Tabs
        style={{ marginBottom: 15 }}
        value={activeTab === 'createdAt' ? 0 : 1}
        aria-label="basic tabs example"
      >
        <Tab label="Новые" onClick={() => handleTabChange('createdAt')}  />
        <Tab label="Популярные" onClick={() => handleTabChange('viewsCount')}  />
      </Tabs>

      {activeTag && (
        <div style={{ marginBottom: 15 }}>
          Фильтр по тегу: <strong>{activeTag}</strong>
          <button 
            onClick={() => setActiveTag(null)}
            style={{ 
              marginLeft: 10,
              background: 'transparent',
              border: 'none',
              color: '#666',
              cursor: 'pointer'
            }}
          >
            × Очистить
          </button>
        </div>
      )}

      <Grid container spacing={4}>
              <Grid xs={12} md={8} item>
          {(isPostsLoading ? [...Array(5)] : posts.items).map((obj, index) =>
            isPostsLoading ? (
              <Post key={index} isLoading={true} />
            ) : (
              <Post
                key={obj._id}
                id={obj._id}
                title={obj.title}
                imageUrl={obj.imageUrl ? `http://localhost:4444${obj.imageUrl}` : ""}
                user={obj.user}
                createdAt={obj.createdAt}
                viewsCount={obj.viewsCount}
                commentsCount={commentsCount}
                tags={obj.tags}
                isEditable={userData?._id === obj.user._id}


              />
            )
          )}
          
        </Grid>
        <Grid item md={4} sx={{ display: { xs: 'none', md: 'block' } }}>
      <SearchBlock />
      <TagsBlock 
        items={tags.items} 
        isLoading={isTagsLoading}
        activeTag={activeTag}
        onTagClick={handleTagClick}
      />
    </Grid>
      </Grid>
    </>
  );
};