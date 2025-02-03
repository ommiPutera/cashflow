import React from "react";

import { Link, LinkProps } from "react-router";

type AnchorProps = React.DetailedHTMLProps<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
>;
const AnchorOrLink = React.forwardRef<
  HTMLAnchorElement,
  AnchorProps & {
    reload?: boolean;
    to?: LinkProps["to"];
    prefetch?: LinkProps["prefetch"];
    href?: string;
    download?: boolean;
  }
>(function AnchorOrLink(props, ref) {
  const {
    to,
    href,
    download,
    reload = false,
    prefetch,
    children,
    ...rest
  } = props;
  let toUrl = "";
  let shouldUserRegularAnchor = reload || download;

  if (!shouldUserRegularAnchor && typeof href === "string") {
    shouldUserRegularAnchor = href.includes(":") || href.startsWith("#");
  }

  if (!shouldUserRegularAnchor && typeof to === "string") {
    toUrl = to;
    shouldUserRegularAnchor = to.includes(":");
  }

  if (!shouldUserRegularAnchor && typeof to === "object") {
    toUrl = `${to.pathname ?? ""}${to.hash ? `#${to.hash}` : ""}${
      to.search ? `?${to.search}` : ""
    }`;
    shouldUserRegularAnchor = to.pathname?.includes(":");
  }

  if (shouldUserRegularAnchor || href) {
    return (
      <a {...rest} download={download} href={href ?? toUrl} ref={ref}>
        {children}
      </a>
    );
  } else {
    return (
      <Link prefetch={prefetch} to={to ?? href ?? ""} {...rest} ref={ref}>
        {children}
      </Link>
    );
  }
});

function getRequiredEnvVarFromObj(
  obj: Record<string, string | undefined>,
  key: string,
  devValue: string = `${key}-dev-value`,
) {
  let value = devValue;
  const envVal = obj[key];
  if (envVal) {
    value = envVal;
  } else if (obj.NODE_ENV === "production") {
    throw new Error(`${key} is a required env variable`);
  }
  return value;
}

function getRequiredServerEnvVar(key: string, devValue?: string) {
  return getRequiredEnvVarFromObj(process.env, key, devValue);
}

function debounce(callback: (...args: unknown[]) => void, wait: number) {
  let timeoutId: number | null = null;
  return (...args: unknown[]) => {
    if (timeoutId) {
      window.clearTimeout(timeoutId);
    }
    timeoutId = window.setTimeout(() => {
      callback(...args);
    }, wait);
  };
}

function range(start: number, end: number, step: number = 1) {
  return Array.from(
    { length: (end - start + 1) / step },
    (_, i) => start + i * step,
  );
}

function capitalizeFirstLetter(str: string | undefined) {
  if (str === undefined) return str;
  return str[0].toUpperCase() + str.slice(1);
}

function humanFileSize(bytes: number, si = true, dp = 1) {
  const thresh = si ? 1000 : 1024;
  const r = 10 ** dp;
  const units = si
    ? ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
    : ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];

  if (Math.abs(bytes) < thresh) {
    return bytes + " B";
  }
  let u = -1;
  do {
    bytes /= thresh;
    ++u;
  } while (
    Math.round(Math.abs(bytes) * r) / r >= thresh &&
    u < units.length - 1
  );
  return bytes.toFixed(dp) + " " + units[u];
}

export {
  AnchorOrLink,
  capitalizeFirstLetter,
  humanFileSize,
  debounce,
  getRequiredServerEnvVar,
  range,
};
