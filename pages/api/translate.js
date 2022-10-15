import { getTranslationText } from 'lingva-scraper';

export default function handler(req, res) {
  // console.log(req.body)
  getTranslationText(req.body.from, req.body.to, req.body.text).then((data) => {
    res.status(200).json({data})
  })
}