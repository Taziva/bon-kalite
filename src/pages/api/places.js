import axios from "axios";

export default async (req, res) => {
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const { data } = await axios.get(
          `https://maps.googleapis.com/maps/api/place/nearbysearch/json?opennow=true&key=${process.env.GOOGLE_API_KEY}`,
          { params: req.query }
        );

        res.json(data);
      } catch (err) {
        const statusCode = err.response ? err.response.status : 500;
        const message = err.response ? err.response.data.errors : err.message;

        res.status(statusCode).json({ type: err.type, errors: message });
      }
      break;
  }
};
