import React, { useState } from "react";

import { SideBlock } from "./SideBlock";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import Skeleton from "@mui/material/Skeleton";
import { Index } from "./AddComment";









export const CommentsBlock = ({ comments=[], children, isLoading = true }) => {
  return (
<>
</>
  );
};



// export const CommentsBlock = ({ children, isLoading = true, postId }) => {
//   const [comments, setComments] = useState([]);

//   useEffect(() => {
//     const fetchComments = async () => {
//       try {
//         const response = await axios.get(`http://localhost:4444/comments/${postId}`);
//         setComments(response.data);
//       } catch (error) {
//         console.error('Ошибка при загрузке комментариев:', error);
//       }
//     };

//     fetchComments();
//   }, [postId]);

//   if (isLoading) {
//     return <div>Загрузка комментариев...</div>;
//   }
//   return (
//     <SideBlock title="Комментарии">
//       <List>
//         {(isLoading ? [...Array(5)] : comments).map((comment, index) => (
//           <React.Fragment key={index}>
//             <ListItem alignItems="flex-start">
//               <ListItemAvatar>
//                 {isLoading ? (
//                   <Skeleton variant="circular" width={40} height={40} />
//                 ) : (
//                   <Avatar alt={comment.user.fullName} src={comment.user.avatarUrl} />
//                 )}
//               </ListItemAvatar>
//               {isLoading ? (
//                 <div style={{ display: "flex", flexDirection: "column" }}>
//                   <Skeleton variant="text" height={25} width={120} />
//                   <Skeleton variant="text" height={18} width={230} />
//                 </div>
//               ) : (
//                 <ListItemText
//                   primary={comment.user.fullName}
//                   secondary={comment.text}
//                 />
//               )}
//             </ListItem>
//             <Divider variant="inset" component="li" />
//           </React.Fragment>
//         ))}
//       </List>
//       {children}
//     </SideBlock>
//   );
// };