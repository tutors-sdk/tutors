import log from "loglevel";

log.setDefaultLevel(import.meta.env.DEV ? "debug" : "warn");

export default log;
