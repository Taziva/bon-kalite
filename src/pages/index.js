import { ExternalLinkIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  Button,
  ButtonGroup,
  Flex,
  Image,
  Link,
  Text,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { MdStar } from "react-icons/md";
import Select from "react-select";
import { NavBar } from "src/components/NavBar";
import { PlacesGrid } from "src/components/PlacesGrid";
import ProtectRoute from "src/components/ProtectRoute";
const typeOptions = [
  { value: "restaurant", label: "Restaurants" },
  { value: "bar", label: "Bars" },
  { value: "cafe", label: "Cafes" },
];

const ratingOptions = [
  { value: 4.5, label: 4.5 },
  { value: 4.6, label: 4.6 },
  { value: 4.7, label: 4.7 },
  { value: 4.8, label: 4.8 },
  { value: 4.9, label: 4.9 },
  { value: 5, label: 5 },
];

function Home() {
  const toast = useToast();

  const [places, setPlaces] = useState([]);
  const [location, setLocation] = useState();
  const [type, setType] = useState(typeOptions[0]);
  const [rating, setRating] = useState(ratingOptions[0]);
  const [pageToken, setPageToken] = useState();
  const [loading, setLoading] = useState();
  const getPhoto = async ({ photo_reference }) => {
    try {
      const { data } = await axios.get(`/api/photos`, {
        params: { photo_reference },
      });
      return data.url;
    } catch (error) {
      console.error(error);
      toast({
        title: "Error!",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const getPlaces = async (params) => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/places", {
        params,
      });

      const highRatedPlaces = data.results.filter(
        (place) => place.rating >= rating.value
      );
      const decoratedPlaces = [];

      for (const place of highRatedPlaces) {
        let photo_url = place.photos?.[0]?.photo_reference
          ? await getPhoto({
              photo_reference: place.photos?.[0]?.photo_reference,
            })
          : null;
        decoratedPlaces.push({ ...place, photo_url });
      }
      !decoratedPlaces.length &&
        data.next_page_token &&
        toast({
          title: "Error!",
          description: "No good quality places found. Try the next page",
          duration: 3000,
          isClosable: true,
        });

      setPlaces([...places, ...decoratedPlaces]);
      setPageToken(data.next_page_token);
    } catch (error) {
      console.error(error);

      toast({
        title: "Error!",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  function getLocation() {
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function (position) {
          setLocation(
            `${position.coords.latitude} ${position.coords.longitude}`
          );
        },
        function () {
          console.log("calling handleLocationError(true)");
          handleLocationError(true);
        }
      );
    } else {
      // Browser doesn't support Geolocation
      console.log("calling handleLocationError(false)");
      handleLocationError(false);
    }
  }

  function handleLocationError(browserHasGeolocation) {
    const message = browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation.";

    toast({
      title: "Error!",
      description: message,
      status: "error",
      duration: 3000,
      isClosable: true,
    });
  }
  useEffect(() => {
    getLocation();
  }, []);

  useEffect(() => {
    setPlaces([]);
    setPageToken(null);
  }, [type]);

  return (
    <>
      <NavBar />
      <Box
        maxW="7xl"
        mx="auto"
        px={{
          base: "4",
          md: "8",
          lg: "12",
        }}
        py={{
          base: "6",
          md: "8",
          lg: "12",
        }}
      >
        <Box marginBottom={5}>
          <ButtonGroup marginBottom={5}>
            <Button
              onClick={() =>
                getPlaces({
                  location,
                  radius: 2000,
                  type: type.value,
                })
              }
              isLoading={loading}
            >
              Find Restaurants
            </Button>
          </ButtonGroup>
          <Text>Type</Text>
          <Select
            options={typeOptions}
            onChange={setType}
            defaultValue={type}
          />
          <Text>Minimum Rating</Text>
          <Select
            options={ratingOptions}
            onChange={setRating}
            defaultValue={rating}
          />
        </Box>

        <PlacesGrid>
          {places.map((place) => (
            <Box p="5" maxW="320px" borderWidth="1px" key={place.place_id}>
              <Image borderRadius="md" src={place.photo_url} />
              <Flex align="baseline" mt={2}>
                <Badge bg={place.icon_background_color} padding={1}>
                  <Image borderRadius="md" src={place.icon} width={4} />
                </Badge>
                <Text
                  ml={2}
                  textTransform="uppercase"
                  fontSize="sm"
                  fontWeight="bold"
                  color="pink.800"
                >
                  {place.vicinty}
                </Text>
              </Flex>
              <Text
                mt={2}
                fontSize="xl"
                fontWeight="semibold"
                lineHeight="short"
              >
                {place.name}
              </Text>

              <Link
                href={`https://www.google.com/maps/place/?q=place_id:${place.place_id}`}
                isExternal
              >
                Map <ExternalLinkIcon mx="2px" />
              </Link>
              <Text mt={2}>{"£".repeat(place.price_level)}</Text>
              <Flex mt={2} align="center">
                <Box as={MdStar} color="orange.400" />
                <Text ml={1} fontSize="sm">
                  <b>{place.rating}</b> ({place.user_ratings_total})
                </Text>
              </Flex>
            </Box>
          ))}
        </PlacesGrid>
        {pageToken && (
          <ButtonGroup marginTop={5}>
            <Button
              onClick={() => getPlaces({ pagetoken: pageToken })}
              isLoading={loading}
            >
              Next Page
            </Button>
          </ButtonGroup>
        )}
      </Box>
    </>
  );
}

export default ProtectRoute(Home);
