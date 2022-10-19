import { useState } from 'react';
import { publishPost } from '../../services/LinkrAPI';
import { PublishForm } from './PublishForm';
import { PostsContainer } from './PostsContainer';
import styled from 'styled-components';

const TimelinePage = () => {
  const [status, setStatus] = useState('idle');
  const formHandler = (e) => {
    e.preventDefault();
    const { url, content } = e.target.elements;
    setStatus('loading');
    // Token hardcoded
    publishPost({ url: url.value, content: content.value }, 25).then(
      () => {
        setStatus('sucess');
        url.value = null;
        content.value = null;
      },
      (error) => {
        setStatus('error');
        console.log(error);
      }
    );
    console.log({ url: url.value, content: content.value });
  };

  return (
    <Wrapper>
      <header>timeline</header>
      <PublishForm status={status} handleForm={formHandler} />
      <PostsContainer />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  margin-top: 150px;
  width: 50%;
  header {
    font-family: 'Oswald';
    font-style: normal;
    font-weight: 700;
    font-size: 43px;
    line-height: 64px;
    color: #ffffff;
  }
`;

export default TimelinePage;
