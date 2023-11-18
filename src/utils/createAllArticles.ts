import request from './request';

export const createAllArticles = async (
  pageUrl,
  startingPage,
  endingPage = 10,
  setPagesFetched,
  signal,
  statuses,
  setStatuses
) => {
  const pageUrlEndings = Array.from(
    { length: endingPage - startingPage + 1 },
    (_, index) => startingPage + index
  );
  console.log(startingPage, endingPage, pageUrlEndings);
  const starterPromise = Promise.resolve(
    request
      .post(
        `/api/createAllArticles`,
        {
          pageUrl: `${pageUrl}?page=-1`,
          statuses,
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
        setStatuses(data.statuses);
      })
  );

  const log = (result) => console.log(result);
  await pageUrlEndings.reduce(
    (p, spec) =>
      p
        .then(() =>
          request.post(
            `/api/createAllArticles`,
            {
              //https://www.desh.tv/templates/desh-web/all_news_page/more_news_ajax.php?page=6
              pageUrl: `${pageUrl}?page=${spec}`,
              statuses,
            },
            {
              signal,
            }
          )
        )
        .then(({ data }) => {
          console.log('Completed Articles:', data.statuses.completed);
          console.log(
            'Incomplete Articles:',
            Object.keys(data.statuses.errors).length
          );
          setPagesFetched((prevPagesFetched) => prevPagesFetched + 1);
          setStatuses(data.statuses);
        }),
    starterPromise
  );

  return null;
};
