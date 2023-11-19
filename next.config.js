module.exports = () => {
  const rewrites = () => {
    return [
      {
        source: '/data/desh-tv/:path*',
        destination: 'https://desh.tv/:path*',
      },
      {
        source: '/data/translate/:path*',
        destination: 'https://desh.tv/:path*',
      },
      // {
      //   source: '/api/:path*',
      //   destination: `${process.env.NEXT_PUBLIC_HOST_URL}/:path*`
      // }
    ];
  };
  return {
    rewrites,
  };
};
