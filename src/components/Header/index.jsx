import React from 'react';
import Button from '@mui/material/Button';

import styles from './Header.module.scss';
import Container from '@mui/material/Container';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectIsAuth } from '../../redux/slices/auth';

export const Header = () => {
  const dispatch = useDispatch()
  const isAuth = useSelector(selectIsAuth)

  const onClickLogout = () => {
    if (window.confirm('Вы действительно хотите выйти?')){
      dispatch(logout())
      window.localStorage.removeItem('token')
    }
  };

  return (
    <div className={styles.root}>
      <Container maxWidth="lg">
        <div className={styles.inner}>
          <Link className={styles.logo} to="/">
            <div>BLOG</div>
          </Link>
          
          <div className={styles.buttons}>
            {isAuth ? (
              <>
                <Link to="/add-post" className={styles.buttonLink}>
                  <Button variant="contained" className={styles.button}>
                    Написать статью
                  </Button>
                </Link>
                <Button 
                  onClick={onClickLogout} 
                  variant="contained" 
                  color="error"
                  className={styles.button}
                >
                  Выйти
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" className={styles.buttonLink}>
                  <Button variant="outlined" className={styles.button}>
                    Войти
                  </Button>
                </Link>
                <Link to="/register" className={styles.buttonLink}>
                  <Button variant="contained" className={styles.button}>
                    Создать аккаунт
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};
