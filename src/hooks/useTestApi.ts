import request from '../utils/request';

export default function useTestApi() {
  const testApi = () => {
    request
      .post(`/api/apiTest`, {
        headers: { 'Access-Control-Allow-Origin': '*' },
      })
      .then((data) => {
        console.log('API HAS BEEN TESTED', data);
      });
  };

  testApi();
}
