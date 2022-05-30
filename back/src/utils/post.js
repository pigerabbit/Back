export function getRequiredInfoFromPostData(data) {
  return {
    postId: data.postId,
    type: data.type,
    authorizedUsers: data.authorizedUsers,
    writer: data.writer,
    receiver: data.receiver,
    title: data.title,
    content: data.content,
    postImg: data.postImg,
    answer: data.answer,
    removed: data.removed,
    createdAt: data.createdAt,
  };
}
