import { Routes, Route } from 'react-router-dom'
import Container from "@mui/material/Container";

import { Header } from "./components";
import { Home, FullPost, Registration, AddPost, Login } from "./pages";
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { fetchAuthMe, selectIsAuth } from './redux/slices/auth';
import PostsByTag from './pages/PostsByTag';




function App() {
  const dispatch = useDispatch()
  const isAuth = useSelector(selectIsAuth)

  useEffect(() =>{
    dispatch(fetchAuthMe())

  }, [dispatch])

  

  return (
    <>
      <Header />
      <Container maxWidth="lg">
       <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/views" element={<Home />}/>
        <Route path="/posts/:id" element={<FullPost />}/>
        <Route path="/posts/tags" element={<Home />}/>
        <Route path="/tag/:tag" element={<PostsByTag />} />



        {/* <Route path='/posts/comments/:id' element={<FullPost />}/>
        <Route path="/comments" element={<FullPost />}/> */}
        <Route path="/posts/:id/edit" element={<AddPost />}/>
        <Route path="/add-post" element={<AddPost />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/register" element={<Registration />}/>
       </Routes>
      </Container>
    </>
  );
}

export default App;

