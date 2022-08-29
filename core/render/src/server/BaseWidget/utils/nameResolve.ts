import semver from "semver";

export const parseWidgetName = (name: string) => {
  const nameArray = name.split("@");
  const widgetName = nameArray[0];
  const widgetVersion = semver.parse(nameArray[1]);

  const isDev = widgetVersion?.prerelease[0] === "dev";
  return {
    widgetName,
    isDev,
  };
};
