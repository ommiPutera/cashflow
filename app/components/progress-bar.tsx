import React from "react";
import { useNavigation } from "react-router";
import LoadingBar from "react-top-loading-bar";

export default function ProgerssBar() {
  const navigation = useNavigation();
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    if (navigation.state !== "idle" && progress < 100) {
      setTimeout(() => {
        setProgress((prev) => prev + 10);
      }, 200);
    }

    if (navigation.state === "idle") {
      setProgress(0);
    }
  }, [navigation.state, progress]);

  if (navigation.state === "idle") return <></>;
  return <LoadingBar color="#276ef1" progress={progress} />;
}
