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
      }
    ];
  };
  return {
    rewrites,
  };
};
