import React from 'react';
import request from '../utils/request';

export default function useCreateArticles(
  pageUrl,
  startingPage,
  endingPage,
  setPagesFetched,
  signal,
  setStatuses,
  pagesFetched,
  startFetching
) {
  const updateStatuses = (newStatus) => {
    setStatuses((prevStatuses) => {
      return {
        completed: prevStatuses.completed + newStatus.completed,
        attempts: prevStatuses.attempts + newStatus.attempts,
        fetchingErrors: prevStatuses.fetchingErrors + newStatus.fetchingErrors,
        creationErrors: prevStatuses.creationErrors + newStatus.creationErrors,
        errors: {
          ...prevStatuses.errors,
          ...newStatus.errors,
        },
      };
    });
  };

  const createArticle = (pageUrlEnding) => {
    request
      .post(
        `/api/createAllArticles`,
        {
          pageUrl: `${pageUrl}?page=${pageUrlEnding}`,
        },
        {
          signal,
        }
      )
      .then(({ data }) => {
        console.log('Completed Articles:', data.statuses.completed);
        console.log(
          'Incomplete Articles:',
          Object.keys(data.statuses.errors).length
        );
        setPagesFetched((prevPagesFetched) => prevPagesFetched + 1);
        updateStatuses(data.statuses);
      });
  };

  const pageUrlEndings = Array.from(
    { length: endingPage - startingPage + 1 },
    (_, index) => startingPage + index
  );

  React.useEffect(() => {
    if (startFetching) {
      if (pagesFetched < pageUrlEndings.length) {
        createArticle(pageUrlEndings[pagesFetched]);
      }
    }
  }, [pagesFetched, startFetching]);
}
