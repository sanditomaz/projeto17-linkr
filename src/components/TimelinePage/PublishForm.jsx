import styled from "styled-components";
import logo from "../../assets/yoda.jpeg";

const PublishForm = ({ handleForm, status }) => {
  const isLoading = status === "loading";
  const isError = status === "error";

  return (
    <Container>
      <ContainerHeader>
        <img src={logo} />
        <h3>What are you going to share today?</h3>
      </ContainerHeader>
      <Form onSubmit={handleForm}>
        <input
          id="url"
          placeholder="http://..."
          required
          disabled={isLoading}
        />
        <input
          id="content"
          placeholder="Awesome article about #javascript"
          disabled={isLoading}
        />
        <ButtonContainer>
          <Button disabled={isLoading} type="submit">
            {isLoading ? "Publishing..." : "Publish"}
          </Button>
        </ButtonContainer>
      </Form>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  padding: 10px 14px 10px 10px;
  display: flex;
  background: #ffffff;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 16px;
  row-gap: 5px;
  flex-direction: column;
  height: 225px;
  @media screen and (max-width: 614px) {
    border-radius: 0;
  }
`;

const ContainerHeader = styled.div`
  display: flex;
  column-gap: 10px;
  align-items: center;

  img {
    border-radius: 50%;
    width: 50px;
    height: 50px;
  }
  h3 {
    width: 100%;
    font-family: "Lato";
    font-style: normal;
    font-weight: 300;
    font-size: 20px;
    line-height: 24px;
    color: #707070;
  }
  @media screen and (max-width: 614px) {
    h3 {
      text-align: center;
    }
    img {
      display: none;
    }
  }
`;

const Form = styled.form`
  display: flex;
  padding-left: 45px;
  width: 90%;
  flex-direction: column;
  row-gap: 8px;

  input {
    background: #efefef;
    border-radius: 5px;
    padding: 10px;
  }
  input#id {
    height: 30px;
  }
  input#content {
    text-align: left;
    vertical-align: top;
    height: 66px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const Button = styled.button`
  width: 112px;
  color: #ffffff;
  height: 31px;
  cursor: pointer;
  background: #1877f2;
  border-radius: 5px;
`;
export { PublishForm };
