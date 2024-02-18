import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import CreateArticlesSummary from './CreateArticlesSummary';
import useCreateArticles from '../hooks/useCreateArticles';
import _, { create } from 'lodash';
import ProgressBar from './ProgressBar';
import useCreatePolls from '../hooks/useCreatePolls';

const FetchAllArticlesForm = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 30%;
  height: 100%;
  background: #b5dec8;
  border-radius: 20px;
  margin: 120px;
  padding: 20px;
`;

const StyledInputFields = styled.input`
  width: 80%;
  padding: 12px 20px;
  box-sizing: border-box;
  font-family: Teko;
  font-size: 28px;
  border-radius: 10px;
  border: 3px solid #b5dec8;
  transition: 0.5s ease-out;
  outline: none;
  &:focus {
    border: 3px solid #008c75;
  }
`;

const StyledButton = styled.button`
  font-family: Teko;
  font-size: 28px;
  width: 30%;
  cursor: pointer;
  outline: none;
  border-radius: 10px;
  border: 3px solid #b5dec8;
  transition: 0.5s ease-out;
  &:hover {
    background: #008c75;
    color: #fff;
  }
`;

const StyledStopButton = styled.button`
  font-family: Teko;
  font-size: 24px;
  margin: 10px 0;
  padding: 0;
  height: 50px;
  width: 50px;
  border-radius: 25px;
  background-color: rgb(255, 0, 0);
  cursor: pointer;
  border: 2px solid #fff;
  color: #fff;
  outline: none;
  transition: 0.2s linear;
  &:hover {
    background-color: rgb(139, 0, 0);
  }
`;

const Text = styled.div`
  font-family: Teko;
  font-size: 48px;
`;

const FetchForm = ({ creationObject }) => {
  const [pagesFetched, setPagesFetched] = useState(0);
  const [startingNumber, setStartingNumber] = useState(0);
  const [endingNumber, setEndingNumber] = useState(0);
  const [showBar, setShowBar] = useState(false);
  const [statuses, setStatuses] = useState({
    completed: 0,
    attempts: 0,
    fetchingErrors: 0,
    creationErrors: 0,
    errors: {
      // Reason: count
    },
  });
  const [startFetching, setStartFetching] = useState(false);
  const [element, setElement] = useState<React.SyntheticEvent>();
  const [controller] = useState(new AbortController());

  if (creationObject == 'articles') {
    const pageUrl =
      'https://www.desh.tv/templates/desh-web/all_news_page/more_news_ajax.php';

    useCreateArticles(
      pageUrl,
      startingNumber,
      endingNumber,
      setPagesFetched,
      controller.signal,
      setStatuses,
      pagesFetched,
      startFetching
    );
  } else if (creationObject == 'polls') {
    const pageUrl =
      'https://www.desh.tv/templates/desh-web/opinion_poll/parent_content_list_ajax_new.php';

    useCreatePolls(
      pageUrl,
      startingNumber,
      endingNumber,
      setPagesFetched,
      controller.signal,
      setStatuses,
      pagesFetched,
      startFetching
    );
  }

  useEffect(() => {
    if (element) {
      const target = element.target as HTMLFormElement;
      const formData = new FormData(target);
      if (startingNumber == _.toInteger(formData.get('starting-number'))) {
        if (
          endingNumber ==
          (formData.get('ending-number')
            ? _.toInteger(formData.get('ending-number'))
            : 500000)
        ) {
          if (confirm('Are you sure you want to create all articles')) {
            setStartFetching(true);
            setShowBar(true);
          } else {
            setStartFetching(false);
            setShowBar(false);
          }
        }
      }
    }
  }, [startingNumber, endingNumber, element]);

  const handleFetchAllArticles = (e) => {
    e.preventDefault();
    setElement(e);
    const formData = new FormData(e.target);
    setStartingNumber(_.toInteger(formData.get('starting-number')));
    setEndingNumber(
      formData.get('ending-number')
        ? _.toInteger(formData.get('ending-number'))
        : 500000
    );
  };

  const handleStopFetchAllArticles = (e) => {
    e.preventDefault();
    controller.abort();
    alert('ALL API CALLS HAVE BEEN ABORTED');
    setShowBar(false);
  };

  return (
    <FetchAllArticlesForm onSubmit={handleFetchAllArticles}>
      <Text>Fetch All {creationObject}:</Text>
      <StyledStopButton type="button" onClick={handleStopFetchAllArticles}>
        STOP
      </StyledStopButton>
      <br />
      <StyledInputFields
        type="number"
        name="starting-number"
        placeholder="Starting Page Number"
        required
      />
      <br />
      <StyledInputFields
        type="number"
        name="ending-number"
        placeholder="Ending Page Number"
      />
      <br />
      <StyledButton type="submit">Fetch</StyledButton>
      <ProgressBar
        bgcolor="#008c75"
        completed={(pagesFetched * 100) / (endingNumber - startingNumber + 1)}
        showBar={showBar}
      />
      <CreateArticlesSummary statuses={statuses} />
    </FetchAllArticlesForm>
  );
};

export default FetchForm;
