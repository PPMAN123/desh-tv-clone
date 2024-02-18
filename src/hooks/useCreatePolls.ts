import React from 'react';
import request from '../utils/request';

export default function useCreatePolls(
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

  const createPoll = (pageUrlEnding) => {
    request
      .post(
        `/api/createAllPolls`,
        {
          pageUrl: `${pageUrl}?page=${pageUrlEnding}`,
        },
        {
          signal,
          headers: { 'Access-Control-Allow-Origin': '*' },
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
        createPoll(pageUrlEndings[pagesFetched]);
      }
    }
  }, [pagesFetched, startFetching]);
}
