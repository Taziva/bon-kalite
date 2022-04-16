import axios from "axios";

export default async (req, res) => {
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const { data, ...rest } = await axios.get(
          `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${req.query.photo_reference}&key=${process.env.GOOGLE_API_KEY}`,
          { params: req.query }
        );

        res.send({ url: rest.request.res.responseUrl });
      } catch (err) {
        const statusCode = err.response ? err.response.status : 500;
        const message = err.response ? err.response.data.errors : err.message;

        res.status(statusCode).json({ type: err.type, errors: message });
      }
      break;
  }
};
