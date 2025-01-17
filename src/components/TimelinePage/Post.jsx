import styled from "styled-components";
import { RiPencilFill } from "react-icons/ri";
import { BsFillTrashFill } from "react-icons/bs";
import { useState, useRef, useEffect, useContext } from "react";
import { getComments, updatePost } from "../../services/LinkrAPI";
import { DeletionModal } from "./DeletionModal";
import { LikeButton } from "./LikeButton";
import UserContext from "../../contexts/UserContext";
import { Link, useNavigate } from "react-router-dom";
import RepostButton from "./RepostButton";
import { BiRepost } from "react-icons/bi";
import { CommentForm, CommentIcon, CommentWrapper } from "./Comments";

function PostDescription({ postText, hashtagsList }) {
  const arrayWords = postText.split(" ");
  const findHashtagName = (word, hashtagsList = []) => {
    let hashtag = undefined;
    hashtagsList.forEach((e) => {
      if (e.name === word || e.name === word.toLowerCase()) {
        hashtag = e;
      }
    });
    return hashtag;
  };
  return (
    <>
      <PostDescriptionWrapper>
        {arrayWords.map((word, index) => {
          if (word[0] === "#") {
            const hashtag = findHashtagName(word.slice(1), hashtagsList);
            if (hashtag) {
              return (
                <Link
                  to={`/hashtag/${hashtag.name}`}
                  state={hashtag}
                  key={index}
                >
                  <span>{`#${word.slice(1)} `}</span>
                </Link>
              );
            }
          }
          return `${word} `;
        })}
      </PostDescriptionWrapper>
    </>
  );
}

function LinkPreview({ url, metadata }) {
  return (
    <>
      <a href={url} target="_blank">
        <LinkPreviewWrapper>
          <div className="info-container">
            <div className="title">{metadata.title}</div>
            <div className="description">{metadata.description}</div>
            <div className="link">{url}</div>
          </div>
          <img src={metadata.image} alt="post preview" />
        </LinkPreviewWrapper>
      </a>
    </>
  );
}

export default function Post({
  user,
  postUrl,
  id,
  postDescriptionText,
  urlMetadata,
  setStatus,
  status,
  usersWhoLiked,
  hashtagsList,
  repostedBy,
  nameRepostedBy,
  reRender,
  setReRender,
}) {
  const [editing, setEditing] = useState(false);
  const [descriptionEdition, setDescriptionEdition] = useState("");
  const [waiting, setWaiting] = useState(false);
  const [postDescriptionSave, setPostDescriptionSave] =
    useState(postDescriptionText);
  const [isOpen, setIsOpen] = useState(false);
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [commentStatus, setCommentStatus] = useState("iddle");
  const [comments, setComments] = useState([]);
  const inputRef = useRef(null);
  const [reposting, setReposting] = useState(false);
  const [isRepost, setIsrepost] = useState(Boolean);

  const obj = useContext(UserContext);
  const userLogged = obj.user;

  const navigate = useNavigate();

  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
    if (repostedBy === null) {
      setIsrepost(false);
    } else {
      setIsrepost(true);
    }
  }, [editing, status]);

  useEffect(() => {
    getComments(id).then(
      (response) => setComments(response.data),
      (error) => console.log(error)
    );
  }, [commentStatus, status]);

  function editingText() {
    setEditing(true);
    setDescriptionEdition(postDescriptionSave);
  }

  function closeEditingText() {
    setEditing(false);
  }
  return (
    <FullWrapper repost={isRepost}>
      {isRepost ? (
        <TopPost>
          <BiRepost className="icon" />
          <p>
            Re-posted by{" "}
            <span>
              {nameRepostedBy === userLogged.name ? "you" : nameRepostedBy}
            </span>
          </p>
        </TopPost>
      ) : (
        ""
      )}

      <Wrapper isCommentOpen={isCommentOpen}>
        <ProfilePicAndLikeButton>
          <img
            onClick={() => window.location.assign(`/user/${user.id}`)}
            src={user.profilePic}
            alt="profilePic"
          />
          <LikeButton likes={usersWhoLiked} postId={id} isRepost={isRepost} />
          <RepostButton
            reposting={reposting}
            setReposting={setReposting}
            postId={id}
            status={status}
            isRepost={isRepost}
            reRender={reRender}
            setReRender={setReRender}
          />
          <CommentIcon
            comments={comments}
            isOpen={isCommentOpen}
            setIsOpen={setIsCommentOpen}
          />
        </ProfilePicAndLikeButton>
        <PostContent>
          <div className="conteiner">
            <div
              onClick={() => window.location.assign(`/user/${user.id}`)}
              className="profile-name"
            >
              {user.name}
            </div>
            <EditingDelete
              display={userLogged.email === user.email ? "true" : "false"}
            >
              <RiPencilFill
                className="icon"
                onClick={editing ? closeEditingText : editingText}
              />
              <BsFillTrashFill
                className="icon"
                onClick={() => setIsOpen(true)}
              />
            </EditingDelete>

            <DeletionModal
              setStatus={setStatus}
              status={status}
              id={id}
              isOpen={isOpen}
              setIsOpen={setIsOpen}
            />
          </div>
          <div className="post-description-container">
            {editing ? (
              <input
                disabled={waiting}
                ref={inputRef}
                type="text"
                value={descriptionEdition}
                onChange={(e) => {
                  setDescriptionEdition(e.target.value);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Escape") {
                    setEditing(false);
                    return;
                  }
                  if (event.key === "Enter") {
                    setStatus("working");
                    const body = { postId: id, content: descriptionEdition };
                    updatePost(body)
                      .then((response) => {
                        setWaiting(true);
                        setPostDescriptionSave(descriptionEdition);
                      })
                      .catch((error) => {
                        alert("Não foi possivel salvar as alterações");
                        console.log(error);
                        setEditing(true);
                        setWaiting(false);
                        setDescriptionEdition(postDescriptionSave);
                      })
                      .finally(() => {
                        setWaiting(false);
                        setEditing(false);
                        setStatus("sucess");
                      });
                  }
                }}
              ></input>
            ) : (
              <PostDescription
                postText={postDescriptionSave}
                hashtagsList={hashtagsList}
              />
            )}
          </div>
          <LinkPreview url={postUrl} metadata={urlMetadata} />
        </PostContent>
      </Wrapper>
      {isCommentOpen && (
        <CommentWrapper>
          {comments.map((value, index) => {
            return (
              <div className="user-comment-container" key={index}>
                <img
                  onClick={() =>
                    window.location.assign(`/user/${value.userId}`)
                  }
                  src={value.profilePic}
                />
                <div className="comment-content-container">
                  <div className="comment-header">
                    <h2
                      onClick={() =>
                        window.location.assign(`/user/${value.userId}`)
                      }
                    >
                      {value.name}
                    </h2>
                    <h3>
                      {user.id === value.userId
                        ? "• post’s author"
                        : value.followerId === null
                        ? null
                        : "• following"}
                    </h3>
                  </div>
                  <p>{value.content}</p>
                </div>
              </div>
            );
          })}
          <CommentForm
            status={commentStatus}
            setStatus={setCommentStatus}
            id={id}
            user={user}
            isRepost={isRepost}
          />
        </CommentWrapper>
      )}
    </FullWrapper>
  );
}
const FullWrapper = styled.div`
  width: 100%;
  position: relative;
  margin-top: ${(props) => (props.repost ? "40px" : "0")};
`;

const Wrapper = styled.div`
  background-color: #171717;
  width: 100%;
  padding: 20px;
  border-radius: ${({ isCommentOpen }) =>
    isCommentOpen ? "16px 16px 0 0" : "16px"};

  display: flex;
  gap: 18px;
  margin-bottom: ${({ isCommentOpen }) => (isCommentOpen ? "0" : "16px")};

  @media screen and (max-width: 614px) {
    border-radius: 0;
  }
`;

const ProfilePicAndLikeButton = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 19px;
  > img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
    cursor: pointer;
  }
`;

const PostContent = styled.div`
  width: 90%;

  .conteiner {
    display: flex;
    color: white;
    justify-content: space-between;
    font-size: 19px;
    .icon {
      margin-right: 10px;
    }
  }
  .profile-name {
    font-family: "Lato";
    font-style: normal;
    font-weight: 400;
    line-height: 23px;
    color: #ffffff;
    margin-bottom: 7px;
    cursor: pointer;
  }
  .post-description-container {
    font-family: "Lato";
    font-style: normal;
    font-weight: 400;
    font-size: 17px;
    line-height: 20px;
    color: #b7b7b7;
    margin-bottom: 12px;
    input {
      width: 100%;
      height: 30px;
      border-radius: 7px;
      line-break: auto;
    }
    textarea:focus,
    input:focus {
      box-shadow: 0 0 0 0;
      outline: 0;
    }
  }
  .post-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .trash {
    cursor: pointer;
  }
  a {
    text-decoration: none;
  }
`;

const LinkPreviewWrapper = styled.div`
  width: 100%;
  height: 70%;
  border: 1px solid #4d4d4d;
  border-radius: 11px;
  font-family: "Lato";
  font-style: normal;
  font-weight: 400;
  display: flex;
  justify-content: space-between;
  gap: 18px;
  overflow: hidden;
  .info-container {
    width: 69.38%;
    height: 100%;
    padding-top: 24px;
    padding-left: 19.31px;
    margin-bottom: 15px;
    .title {
      font-size: 16px;
      line-height: 19px;
      color: #cecece;
      margin-bottom: 5px;
    }
    .description {
      font-size: 11px;
      line-height: 13px;
      color: #9b9595;
      margin-bottom: 13px;
    }
    .link {
      font-size: 11px;
      line-height: 13px;
      color: #cecece;
    }
  }
  img {
    width: 30.62%;
    height: 100%;
    object-fit: cover;
  }
  &:hover {
    background-color: #2c2c2c;
    border: 1px solid #bebebe;
  }
  @media (max-width: 500px) {
    .info-container {
      width: 50%;
    }
    .description {
      max-height: 30px;
      overflow: hidden;
    }
    img {
      width: 50%;
    }
  }
`;

const EditingDelete = styled.div`
  display: flex;
  color: white;
  padding-right: 5px;
  justify-content: space-between;
  font-size: 19px;
  gap: 10px;
  .icon {
    margin: 0;
    cursor: pointer;
    &:hover {
      color: #a6a6a6;
    }
  }
  display: ${(props) => (props.display === "true" ? "initial" : "none")};
`;

const PostDescriptionWrapper = styled.div`
  a,
  a:visited {
    text-decoration: none;
    color: #b7b7b7;
  }
  span {
    font-weight: 700;
  }
`;

const TopPost = styled.div`
  position: absolute;
  top: -25px;
  width: 100%;
  height: 50px;
  background-color: #1e1e1e;
  margin-bottom: 10px;
  z-index: -1;
  border-radius: 11px;
  color: white;
  display: flex;
  align-items: flex-start;
  padding-left: 15px;
  font-size: 16px;
  .icon {
    font-size: 25px;
  }
  p {
    padding-top: 5px;
  }
  span {
    font-weight: bold;
  }
`;
