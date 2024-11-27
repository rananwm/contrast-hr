import WebView from "react-native-webview";
import { COLORS } from "../constants";
import { ActivityIndicator } from "react-native";

const getYouTubeHTML = ({ uri, height, width, title, bg }) => `
<!DOCTYPE html>
<html>
    <head>
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
        <style>
        html, body {
            padding: 0;
            margin: 0;
            display: block;
            height: ${typeof height === "string" ? height : `${height}px`};
            background: ${bg || COLORS.PRIMARY};
        }
        * {
        box-sizing: border-box;
        padding: 0;
        margin: 0;
       
        }
        iframe {
            display: block;
            border-radius: 20px;
        }
        </style>
    </head>
    <body>
    <iframe
    height="100%"
    width="100%"
    src="${uri}"
    title="${title}"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share;"
    allowFullScreen
  >
    </body>
</html>
`;

function YoutubeVideoPlayer({
  uri,
  title,
  height = "100%",
  width = "100%",
  style,
}) {
  return (
    <WebView
      style={style}
      height={height}
      width={width}
      bounces={false}
      originWhitelist={["*"]}
      source={{
        html: getYouTubeHTML({
          uri,
          title,
          width,
          height,
          bg: style?.backgroundColor || "white",
        }),
      }}
      setBuiltInZoomControls={false}
      renderLoading={() => <ActivityIndicator color={COLORS.SECONDARY} />}
    />
  );
}

export default YoutubeVideoPlayer;
