import { useEffect, useState } from "react";
import {
  Card,
  Container,
  Form,
  Grid,
  GridColumn,
  Input,
  Segment,
  Image,
} from "semantic-ui-react";
import { Items, IYoutubeVideo } from "./inc/IYoutubeVideo";
import { getPopular, getYoutube } from "./Services";
import { useHistory } from "react-router-dom";
import { formatDate } from "./Video";

function App() {
  const [search, setSearch] = useState("");
  const [searchSearch, setSearchSearch] = useState("");
  const [status, setStatus] = useState(false);
  const [wholeValues, setWholeValues] = useState<IYoutubeVideo>();
  const [popular, setPopular] = useState<Items[]>([]);

  useEffect(() => {
    if (searchSearch === "") {
      console.log("Video Adini Giriniz");
      setStatus(false);
    } else {
      getYoutube(searchSearch).then((res) => {
        setWholeValues(res.data);
      });
      setStatus(true);
    }
  }, [searchSearch]);

  const date = new Date().toLocaleString("tr-TR", { day: "2-digit" });
  useEffect(() => {
    const init = async () => {
      const savedDate: any = await localStorage.getItem("savedDate");
      if (savedDate !== date) {
        localStorage.setItem("savedDate", date);
        getPopular().then((res) => {
          setPopular(res.data.items);
          localStorage.setItem("mostPopular", JSON.stringify(res.data.items));
        });
      } else {
        const mostPopular: any = localStorage.getItem("mostPopular");
        const mostPopularJSON: any = JSON.parse(mostPopular);
        setPopular(mostPopularJSON);
      }
    };
    init();
    // eslint-disable-next-line
  }, []);

  let history = useHistory();
  function getVideoDetail(data: Items, index: any) {
    const stringData = JSON.stringify(data);
    localStorage.setItem("currentVideo", stringData);
    history.push("/video/" + index);
  }

  const [favVideos, setFavVideos] = useState<Items[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const data: any = await localStorage.getItem("FavItems");
      const jsonData = JSON.parse(data) || [];
      const slicedData = jsonData.slice(-6);
      setFavVideos(slicedData.reverse());
    };
    fetchData();
  }, []);

  const [lastVisited, setLastVisited] = useState<Items[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const data: any = await localStorage.getItem("LastVisited");
      const jsonData = JSON.parse(data) || [];
      const reversedData = jsonData.reverse();
      const slicedData = reversedData.slice(0, 6);
      setLastVisited(slicedData);
    };
    fetchData();
  }, []);

  function fncPopularVideos(e: any) {
    localStorage.setItem("popularVideos", JSON.stringify(e));
  }
  
  return (
    <>
      <Container centered="true">
        <Grid columns="3" centered style={{ marginTop: 15 }}>
          <GridColumn width="5">
            <Form onSubmit={() => setSearchSearch(search)}>
              <Input
                action={{
                  color: "violet",
                  icon: "search",
                }}
                style={{ marginRight: 5 }}
                placeholder="Video Adını Girin!"
                onChange={(e) => setSearch(e.target.value)}
              />
            </Form>
          </GridColumn>
        </Grid>

        {status ? (
          <>
            {wholeValues?.items.map((e, index) => {
              return (
                <Segment
                  key={index}
                  onClick={() => {
                    console.log(e);
                    getVideoDetail(e, e.id.videoId);
                  }}
                >
                  <Grid columns={2}>
                    <GridColumn mobile={16} tablet={16} computer={6}>
                      <img
                        width={300}
                        src={e.snippet.thumbnails.medium.url}
                        alt={e.snippet.title}
                        style={{ cursor: "pointer" }}
                      />
                    </GridColumn>
                    <GridColumn mobile={16} tablet={16} computer={10}>
                      <h2 style={{ cursor: "pointer" }}>{e.snippet.title}</h2>
                      <p>{e.snippet.description}</p>
                    </GridColumn>
                  </Grid>
                </Segment>
              );
            })}
          </>
        ) : (
          <div></div>
        )}
        <Segment>
          <h1>Son Ziyaret Edilenler</h1>
          <Grid columns="6">
            {lastVisited.length === 0 ? (
              <h2 style={{ marginTop: 5 }}>Burada hic video yoktur</h2>
            ) : (
              lastVisited.map((e, index) => {
                return (
                  <GridColumn stretched key={index}>
                    <Card
                      fluid
                      centered
                      onClick={() => {
                        console.log(e);
                        getVideoDetail(e, e.id.videoId || e.id);
                      }}
                    >
                      <Image
                        fluid
                        src={e.snippet.thumbnails.medium.url}
                        wrapped
                        ui={false}
                      />
                      <Card.Content>
                        <Card.Header>{e.snippet.title}</Card.Header>
                        <Card.Meta>
                          <span className="date">
                            {formatDate(e.snippet.publishedAt)}
                          </span>
                        </Card.Meta>
                        <Card.Description>
                          <span style={{ fontWeight: "bold" }}>
                            Channel Name:
                          </span>{" "}
                          {e.snippet.channelTitle}
                        </Card.Description>
                      </Card.Content>
                    </Card>
                  </GridColumn>
                );
              })
            )}
          </Grid>
        </Segment>
        <Segment>
          <h1>Son 6 Favorim</h1>
          <Grid columns="6">
            {favVideos.length === 0 ? (
              <h2 style={{ marginTop: 5 }}>Burada hic video yoktur</h2>
            ) : (
              favVideos.map((e, index) => {
                return (
                  <GridColumn stretched key={index}>
                    <Card
                      onClick={() => {
                        console.log(e);
                        getVideoDetail(e, e.id.videoId || e.id);
                      }}
                    >
                      <Image
                        src={e.snippet.thumbnails.medium.url}
                        wrapped
                        ui={false}
                      />
                      <Card.Content>
                        <Card.Header>{e.snippet.title}</Card.Header>
                        <Card.Meta>
                          <span className="date">
                            {formatDate(e.snippet.publishedAt)}
                          </span>
                        </Card.Meta>
                        <Card.Description>
                          <span style={{ fontWeight: "bold" }}>
                            Channel Name:
                          </span>{" "}
                          {e.snippet.channelTitle}
                        </Card.Description>
                      </Card.Content>
                    </Card>
                  </GridColumn>
                );
              })
            )}
          </Grid>
        </Segment>
        <Segment>
          <h1>Türkiyede Popüler</h1>
          <Grid columns="6">
            {popular.map((e, index) => {
              return (
                <GridColumn stretched key={index}>
                  <Card
                    onClick={() => {
                      getVideoDetail(e, e.id);
                      fncPopularVideos(e);
                    }}
                  >
                    <Image
                      src={e.snippet.thumbnails.medium.url}
                      wrapped
                      ui={false}
                    />
                    <Card.Content>
                      <Card.Header>{e.snippet.title}</Card.Header>
                      <Card.Meta>
                        <span className="date">
                          {formatDate(e.snippet.publishedAt)}
                        </span>
                      </Card.Meta>
                      <Card.Description>
                        <span style={{ fontWeight: "bold" }}>
                          Channel Name:
                        </span>{" "}
                        {e.snippet.channelTitle}
                      </Card.Description>
                    </Card.Content>
                  </Card>
                </GridColumn>
              );
            })}
          </Grid>
        </Segment>
      </Container>
    </>
  );
}

export default App;
