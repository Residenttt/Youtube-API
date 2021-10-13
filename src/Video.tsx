import { useEffect, useState } from "react";
import { Button, Embed, Grid, GridColumn, Segment } from "semantic-ui-react";
import { IYoutubeFavoriteVideo } from "./inc/IYoutubeFavoriteVideo";
import { Items } from "./inc/IYoutubeVideo";

export function formatDate(string: any) {
  let options: any = { year: "numeric", month: "long", day: "numeric" };
  return new Date(string).toLocaleDateString([], options);
}

export default function Video(props: any) {
  // eslint-disable-next-line
  const id = props.match.params.id;
  const [videoDetails, setVideoDetails] = useState<Items>();
  const [popularVideoDetails, setPopularVideoDetails] =
    useState<IYoutubeFavoriteVideo>();
  const [favItems, setFavItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      /* Video popular ya da normalden geldiyse */
      const data: any = await localStorage.getItem("currentVideo");
      const jsonData = JSON.parse(data);
      setVideoDetails(jsonData);
      /* Video popularden geldiyse */
      const dataPopular: any = await localStorage.getItem("popularVideos");
      const jsonPopularData = JSON.parse(dataPopular);
      setPopularVideoDetails(jsonPopularData);
      let lastVisited: any = await localStorage.getItem("LastVisited");
      let jsonLastVisited = JSON.parse(lastVisited) || [];
      let lastVisitedLastItem = jsonLastVisited.length
        ? jsonLastVisited[jsonLastVisited.length - 1]
        : null;
      lastVisitedLastItem &&
      jsonData.id.videoId === lastVisitedLastItem.id.videoId ? (
        <></>
      ) : (
        localStorage.setItem(
          "LastVisited",
          JSON.stringify([...jsonLastVisited, jsonData])
        )
      );
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const data: any = await localStorage.getItem("FavItems");
      const jsonData = JSON.parse(data || []);
      setFavItems(jsonData);
    };
    fetchData();
  }, []);

  const isLiked =
    videoDetails && favItems.find((x: any) => x.id === videoDetails?.id); /// burada arrayda var mi diye kontrol ettiriyoruz
  async function fncLike() {
    let newArr: any = [];
    if (!isLiked) {
      newArr = [...favItems, videoDetails]; // arrayde yok ise [...mevcutArray, yeniEleman] seklinde arraye ekletiyoruz...
    } else {
      newArr = favItems.filter((x: any) => x.id !== videoDetails?.id); // filter ile olan veri haric digerlerini yalniz birakitrioyuiruz.
    }
    localStorage.setItem("FavItems", JSON.stringify(newArr));
    setFavItems(newArr);
  }

  return (
    <div>
      <Button
        as="a"
        href="/"
        style={{ marginTop: 5, marginBottom: 5, marginLeft: 5 }}
      >
        Ana Sayfa
      </Button>
      <Grid columns={2}>
        <GridColumn tablet={16} computer={6}>
          <Segment>
            <Embed
              /* videonun populardan veya normalden geldiğini kontrol ediyorum normalse .id.videoId si dolu olacak ama populardan geliyorsa .id olacak */
              id={
                videoDetails?.id.videoId
                  ? videoDetails?.id.videoId
                  : popularVideoDetails?.id
              }
              placeholder={videoDetails?.snippet.thumbnails.high.url}
              aspectRatio="16:9"
              source="youtube"
              frameBorder="0"
              allowFullScreen
              autoplay={true}
              style={{ marginTop: 16 }}
            />
            <Button
              style={{ marginTop: 20 }}
              color="red"
              content={isLiked ? "Liked" : "Like"}
              icon="heart"
              floated="right"
              label={{
                basic: true,
                color: "red",
                pointing: "left",
                content: isLiked ? "Liked" : "Like",
              }}
              onClick={() => {
                fncLike();
              }}
              active={isLiked}
            />
          </Segment>
        </GridColumn>

        <GridColumn tablet={16} computer={10} style={{ paddingRight: 50 }}>
          <Segment>
            <h1>{videoDetails?.snippet.title}</h1>
            <h4>{videoDetails?.snippet.description}</h4>
            <h3 style={{ display: "inline" }}>Channel Title:</h3>{" "}
            <h4 style={{ display: "inline" }}>
              {videoDetails?.snippet.channelTitle}
            </h4>
            <p>{formatDate(videoDetails?.snippet.publishedAt)}</p>
          </Segment>
        </GridColumn>
      </Grid>
    </div>
  );
}
