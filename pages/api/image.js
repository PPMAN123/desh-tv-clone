var cloudscraper = require('cloudscraper').defaults({ encoding: null });
export default function handler(req, res) {
  cloudscraper.get(req.body.url).then((response) => {
    const data = "data:image/jpeg" + ";base64," + Buffer.from(response).toString('base64');
    res.status(200).json({data})
  })
}