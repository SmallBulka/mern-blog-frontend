import React from 'react';
import styles from './UserInfo.module.scss';
export const FormatDate = ({ dateString }) => {
  const date = new Date(dateString);
  
  // Проверка на валидность даты
  if (isNaN(date.getTime())) {
    console.error('Invalid date:', dateString);
    return <span>Неверная дата</span>;
  }

  const formatted = date.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  return <span>{formatted}</span>;
}

export const UserInfo = ({ avatarUrl, fullName, additionalText }) => {
  return (
    <div className={styles.root}>
      <img className={styles.avatar} src={avatarUrl || '/noavatar.png'} alt={fullName} />
      <div className={styles.userDetails}>
        <span className={styles.userName}>{fullName}</span>
        <span className={styles.additional}>
          <FormatDate dateString={additionalText} />
        </span>
      </div>
    </div>
  );
};
